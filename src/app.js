import { supabaseClient } from './supabase.js';
import * as ui from './ui.js';
import * as auth from './auth.js';
import * as lessons from './lessons.js';
import * as quiz from './quiz.js';
import * as profile from './profile.js';

let currentUser = null;
let currentPage = 'login';
let selectedLesson = null;

export async function initApp() {
  const root = document.getElementById('root');

  // Check if user is logged in
  const { data: { session } } = await supabaseClient.auth.getSession();
  currentUser = session?.user || null;

  // Listen for auth changes
  supabaseClient.auth.onAuthStateChange((event, session) => {
    currentUser = session?.user || null;
    if (currentUser && currentPage === 'login') {
      showDashboard();
    } else if (!currentUser && currentPage !== 'login' && currentPage !== 'signup') {
      showLogin();
    }
  });

  if (currentUser) {
    showDashboard();
  } else {
    showLogin();
  }
}

export function showLogin() {
  currentPage = 'login';
  const html = ui.createLoginPage(handleLogin, showSignup);
  renderPage(html);
}

export function showSignup() {
  currentPage = 'signup';
  const html = ui.createSignupPage(handleSignup, showLogin);
  renderPage(html);
}

export function showDashboard() {
  currentPage = 'dashboard';
  const html = ui.createDashboardPage(currentUser, showLessons, showProfile);
  renderPage(html);

  setTimeout(() => {
    loadDashboardData();
  }, 0);
}

export function showLessons() {
  currentPage = 'lessons';
  const html = ui.createLessonListPage(showDashboard);
  renderPage(html);

  setTimeout(() => {
    lessons.loadLessons(showLessonDetail);
  }, 0);
}

export function showLessonDetail(lesson) {
  currentPage = 'lesson-detail';
  selectedLesson = lesson;
  const html = ui.createLessonDetailPage(lesson, showLessons, () => showQuiz());
  renderPage(html);

  setTimeout(() => {
    lessons.setupVocabularyInteraction(lesson);
  }, 0);
}

export function showQuiz() {
  currentPage = 'quiz';
  if (!selectedLesson) {
    showDashboard();
    return;
  }

  const html = ui.createQuizPage(selectedLesson, handleQuizComplete);
  renderPage(html);

  setTimeout(() => {
    quiz.initializeQuiz(selectedLesson, handleQuizSubmit);
  }, 0);
}

export function showProfile() {
  currentPage = 'profile';
  const html = ui.createProfilePage(currentUser, showDashboard);
  renderPage(html);

  setTimeout(() => {
    profile.loadProfileData(currentUser);
  }, 0);
}

async function handleLogin(email, password) {
  const result = await auth.login(email, password);
  if (result.error) {
    ui.showError(result.error);
  } else {
    currentUser = result.user;
    showDashboard();
  }
}

async function handleSignup(name, email, password) {
  const result = await auth.signup(name, email, password);
  if (result.error) {
    ui.showError(result.error);
  } else {
    ui.showSuccess('Account created! Please log in.');
    setTimeout(() => showLogin(), 2000);
  }
}

async function handleQuizSubmit(answers) {
  const result = await quiz.saveQuizResults(currentUser, selectedLesson, answers);
  if (result.error) {
    ui.showError(result.error);
  }
}

async function handleQuizComplete() {
  selectedLesson = null;
  showDashboard();
}

async function loadDashboardData() {
  const stats = await lessons.getUserStats(currentUser);
  ui.updateDashboardStats(stats);
}

function renderPage(html) {
  const root = document.getElementById('root');
  root.innerHTML = html;
}

export { currentUser, currentPage, selectedLesson };
