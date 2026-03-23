import { supabaseClient } from './supabase.js';

export async function loadLessons(onSelectLesson) {
  const { data: lessons, error } = await supabaseClient
    .from('lessons')
    .select('*')
    .order('order_number');

  if (error) {
    console.error('Error loading lessons:', error);
    return;
  }

  const container = document.getElementById('lessonsContainer');
  if (!container) return;

  const icons = ['🐶', '🎨', '🔢', '📚', '🌍', '🚀'];

  container.innerHTML = lessons.map((lesson, index) => `
    <div class="lesson-card" onclick="handleSelectLesson(${index})">
      <div class="lesson-icon">${icons[index % icons.length]}</div>
      <h3 class="lesson-title">Lesson ${lesson.order_number}</h3>
      <h4 class="lesson-subtitle">${lesson.title}</h4>
      <p class="text-gray-600 text-lg">${lesson.vocabulary.length} vocabulary words</p>
    </div>
  `).join('');

  window.lessonsData = lessons;
  window.handleSelectLesson = function(index) {
    const { showLessonDetail } = require('./app.js');
    showLessonDetail(lessons[index]);
  };
}

export function setupVocabularyInteraction(lesson) {
  const container = document.getElementById('vocabularyContainer');
  if (!container) return;

  container.innerHTML = lesson.vocabulary.map((vocab, index) => `
    <div class="vocab-word">
      <div class="vocab-header">
        <h3 class="vocab-word-title">${vocab.word}</h3>
        <div class="vocab-button-group">
          <button class="btn-icon" onclick="speakWord('${vocab.word}')" title="Listen">
            🔊
          </button>
          <button class="btn-icon" onclick="startListening('${vocab.word}')" title="Practice pronunciation">
            🎤
          </button>
        </div>
      </div>
      <p class="vocab-definition">${vocab.definition}</p>
      <div id="feedback-${index}" class="pronunciation-feedback hidden"></div>
    </div>
  `).join('');

  window.speakWord = function(word) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  window.startListening = function(word) {
    const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      // Listening...
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      const targetWord = word.toLowerCase().trim();

      const feedbackDiv = document.querySelector(`.pronunciation-feedback`);
      if (feedbackDiv) {
        if (transcript === targetWord || transcript.includes(targetWord)) {
          feedbackDiv.textContent = '🎉 Perfect! You said it correctly!';
          feedbackDiv.className = 'pronunciation-feedback pronunciation-correct';
        } else {
          feedbackDiv.textContent = `You said "${transcript}". Try saying "${word}" again!`;
          feedbackDiv.className = 'pronunciation-feedback pronunciation-incorrect';
        }
        feedbackDiv.classList.remove('hidden');
      }
    };

    recognition.onerror = () => {
      const feedbackDiv = document.querySelector(`.pronunciation-feedback`);
      if (feedbackDiv) {
        feedbackDiv.textContent = 'Could not hear you. Please try again!';
        feedbackDiv.className = 'pronunciation-feedback pronunciation-incorrect';
        feedbackDiv.classList.remove('hidden');
      }
    };

    recognition.start();
  };
}

export async function getUserStats(user) {
  if (!user) {
    return {
      totalLessons: 0,
      completedLessons: 0,
      averageScore: 0,
      totalQuizzes: 0,
    };
  }

  const { data: lessons } = await supabaseClient
    .from('lessons')
    .select('id')
    .order('order_number');

  const { data: progress } = await supabaseClient
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('completed', true);

  const { data: quizResults } = await supabaseClient
    .from('quiz_results')
    .select('score, total_questions')
    .eq('user_id', user.id);

  const totalLessons = lessons?.length || 0;
  const completedLessons = progress?.length || 0;
  const totalQuizzes = quizResults?.length || 0;

  let averageScore = 0;
  if (quizResults && quizResults.length > 0) {
    const totalScore = quizResults.reduce(
      (sum, result) => sum + (result.score / result.total_questions) * 100,
      0
    );
    averageScore = Math.round(totalScore / quizResults.length);
  }

  return {
    totalLessons,
    completedLessons,
    averageScore,
    totalQuizzes,
  };
}
