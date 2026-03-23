import * as auth from './auth.js';

export function createLoginPage(onLogin, onSwitchToSignup) {
  return `
    <div class="gradient-bg-1 min-h-screen flex items-center justify-center p-4">
      <div class="card max-w-md w-full">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-purple-600 mb-2">🎓 Kids Learning AI</h1>
          <p class="text-gray-600 text-lg">Welcome back! Let's learn together</p>
        </div>

        <form id="loginForm" class="space-y-6">
          <div id="errorAlert"></div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" id="loginEmail" required>
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" id="loginPassword" required>
          </div>

          <button type="submit" class="btn btn-primary w-full">Login</button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-600 text-lg">
            Don't have an account?
            <button onclick="handleSwitchToSignup()" class="text-purple-600 font-bold hover:text-purple-700">
              Sign up here!
            </button>
          </p>
        </div>
      </div>
    </div>
  `;
}

export function createSignupPage(onSignup, onSwitchToLogin) {
  return `
    <div class="gradient-bg-2 min-h-screen flex items-center justify-center p-4">
      <div class="card max-w-md w-full">
        <div class="text-center mb-8">
          <h1 class="text-4xl font-bold text-green-600 mb-2">🌟 Join Kids Learning AI</h1>
          <p class="text-gray-600 text-lg">Start your learning adventure!</p>
        </div>

        <form id="signupForm" class="space-y-6">
          <div id="errorAlert"></div>

          <div class="form-group">
            <label>Your Name</label>
            <input type="text" id="signupName" required>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" id="signupEmail" required>
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" id="signupPassword" required>
          </div>

          <div class="form-group">
            <label>Confirm Password</label>
            <input type="password" id="signupConfirm" required>
          </div>

          <button type="submit" class="btn btn-secondary w-full">Sign Up</button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-600 text-lg">
            Already have an account?
            <button onclick="handleSwitchToLogin()" class="text-green-600 font-bold hover:text-green-700">
              Login here!
            </button>
          </p>
        </div>
      </div>
    </div>
  `;
}

export function createDashboardPage(user, onLessons, onProfile) {
  const userName = user?.user_metadata?.name || 'Student';

  return `
    <div class="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-300 to-purple-300">
      <header class="header">
        <div class="container header-content">
          <h1>🎓 Kids Learning AI</h1>
          <button id="logoutBtn" class="btn btn-primary">Logout</button>
        </div>
      </header>

      <main class="container">
        <div class="card mb-8">
          <h2 class="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, ${userName}! 👋
          </h2>
          <p class="text-xl text-gray-600">Ready to learn something new today?</p>
        </div>

        <div id="statsContainer"></div>

        <div class="grid grid-2 mb-8">
          <button onclick="handleShowLessons()" class="card text-left hover:shadow-2xl">
            <div class="flex items-center gap-4 mb-4">
              <div class="bg-gradient-to-br from-blue-400 to-purple-500 rounded-full p-4 text-white text-4xl">
                📚
              </div>
              <div>
                <h3 class="text-3xl font-bold text-gray-800">Daily Lessons</h3>
                <p class="text-xl text-gray-600">Learn new things!</p>
              </div>
            </div>
            <div class="text-lg text-gray-700">
              Explore exciting lessons with videos, stories, and vocabulary
            </div>
          </button>

          <button onclick="handleShowProfile()" class="card text-left hover:shadow-2xl">
            <div class="flex items-center gap-4 mb-4">
              <div class="bg-gradient-to-br from-green-400 to-blue-500 rounded-full p-4 text-white text-4xl">
                👤
              </div>
              <div>
                <h3 class="text-3xl font-bold text-gray-800">My Profile</h3>
                <p class="text-xl text-gray-600">View your progress</p>
              </div>
            </div>
            <div class="text-lg text-gray-700">
              Check your achievements and see how well you're doing
            </div>
          </button>
        </div>

        <div id="achievementContainer"></div>
      </main>
    </div>
  `;
}

export function createLessonListPage(onBack) {
  return `
    <div class="min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300">
      <header class="header">
        <div class="container header-content">
          <div>
            <button onclick="handleBack()" class="back-button">← Back to Dashboard</button>
            <h1>📚 Choose a Lesson</h1>
          </div>
        </div>
      </header>

      <main class="container">
        <div id="lessonsContainer" class="grid grid-3"></div>
      </main>
    </div>
  `;
}

export function createLessonDetailPage(lesson, onBack, onStartQuiz) {
  return `
    <div class="min-h-screen bg-gradient-to-br from-purple-300 via-pink-300 to-orange-300">
      <header class="header">
        <div class="container">
          <button onclick="handleBack()" class="back-button">← Back to Lessons</button>
          <h1>${lesson.title}</h1>
          <p class="text-gray-600">Lesson ${lesson.order_number}</p>
        </div>
      </header>

      <main class="container">
        <div class="lesson-detail-content">
          <h2 class="lesson-detail-title">📺 Watch the Video</h2>
          <div class="video-container">
            <iframe src="${lesson.video_url}" allowfullscreen></iframe>
          </div>
        </div>

        <div class="lesson-detail-content">
          <h2 class="lesson-detail-title">📖 Story Time</h2>
          <p class="story-text">${lesson.story_text}</p>
        </div>

        <div class="lesson-detail-content">
          <h2 class="lesson-detail-title">📝 Vocabulary Words</h2>
          <div id="vocabularyContainer" class="grid grid-2"></div>
        </div>

        <div class="text-center">
          <button onclick="handleStartQuiz()" class="btn btn-primary text-2xl">
            🎯 Take the Quiz!
          </button>
        </div>
      </main>
    </div>
  `;
}

export function createQuizPage(lesson, onSubmit) {
  return `
    <div class="min-h-screen bg-gradient-to-br from-yellow-300 via-green-300 to-blue-300 flex items-center justify-center p-4">
      <div class="card max-w-3xl w-full">
        <div class="mb-8">
          <div class="flex justify-between items-center mb-4">
            <span class="text-2xl font-bold text-purple-600">
              Question <span id="currentQuestion">1</span> of <span id="totalQuestions">5</span>
            </span>
            <div id="progressDots" class="flex gap-2"></div>
          </div>
          <div class="quiz-progress">
            <div id="progressBar" class="quiz-progress-bar" style="width: 0%"></div>
          </div>
        </div>

        <h2 id="questionText" class="quiz-question"></h2>

        <div id="optionsContainer" class="space-y-4 mb-8"></div>

        <button id="nextBtn" class="btn btn-secondary w-full text-2xl" disabled>
          Next Question
        </button>

        <div id="resultsContainer" class="hidden"></div>
      </div>
    </div>
  `;
}

export function createProfilePage(user, onBack) {
  const userName = user?.user_metadata?.name || 'Student';
  const userEmail = user?.email || '';
  const firstLetter = userName.charAt(0).toUpperCase();

  return `
    <div class="min-h-screen bg-gradient-to-br from-purple-300 via-pink-300 to-orange-300">
      <header class="header">
        <div class="container">
          <button onclick="handleBack()" class="back-button">← Back to Dashboard</button>
          <h1>👤 My Profile</h1>
        </div>
      </header>

      <main class="container">
        <div class="card mb-8">
          <div class="profile-header">
            <div class="profile-avatar">${firstLetter}</div>
            <div class="profile-info">
              <h2 class="profile-name">${userName}</h2>
              <p class="profile-email">${userEmail}</p>
              <div id="badgeContainer"></div>
            </div>
          </div>
        </div>

        <div id="statsContainer" class="grid grid-4 mb-8"></div>

        <div class="card">
          <h3 class="text-3xl font-bold text-gray-800 mb-6">📊 Quiz History</h3>
          <div id="quizHistoryContainer"></div>
        </div>
      </main>
    </div>
  `;
}

export function showError(message) {
  const alertDiv = document.getElementById('errorAlert');
  if (alertDiv) {
    alertDiv.innerHTML = `<div class="alert alert-error">${message}</div>`;
  }
}

export function showSuccess(message) {
  const alertDiv = document.getElementById('errorAlert');
  if (alertDiv) {
    alertDiv.innerHTML = `<div class="alert alert-success">${message}</div>`;
  }
}

export function updateDashboardStats(stats) {
  const container = document.getElementById('statsContainer');
  if (container) {
    container.innerHTML = `
      <div class="grid grid-4 gap-6 mb-8">
        <div class="stat-card">
          <div class="stat-value">${stats.totalLessons}</div>
          <div class="stat-label">Total Lessons</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.completedLessons}</div>
          <div class="stat-label">Completed</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.averageScore}%</div>
          <div class="stat-label">Average Score</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${stats.totalQuizzes}</div>
          <div class="stat-label">Quizzes Taken</div>
        </div>
      </div>
      ${stats.completedLessons > 0 ? `
        <div class="achievement-badge">
          <div class="achievement-icon">🌟</div>
          <div class="achievement-content">
            <h3>Great Job!</h3>
            <p>You've completed ${stats.completedLessons} lesson${stats.completedLessons !== 1 ? 's' : ''}! Keep up the amazing work!</p>
          </div>
        </div>
      ` : ''}
    `;
  }
}

// Global functions for onclick handlers
window.handleLogin = async function(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const result = await auth.login(email, password);
  if (result.error) {
    showError(result.error);
  }
};

window.handleSignup = async function(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const confirm = document.getElementById('signupConfirm').value;

  if (password !== confirm) {
    showError('Passwords do not match!');
    return;
  }

  if (password.length < 6) {
    showError('Password must be at least 6 characters long!');
    return;
  }

  const result = await auth.signup(name, email, password);
  if (result.error) {
    showError(result.error);
  } else {
    showSuccess('Account created! Please log in.');
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }
};

window.handleLogout = async function() {
  await auth.logout();
  window.location.reload();
};

window.handleSwitchToLogin = function() {
  const { showLogin } = require('./app.js');
  showLogin();
};

window.handleSwitchToSignup = function() {
  const { showSignup } = require('./app.js');
  showSignup();
};

window.handleShowLessons = function() {
  const { showLessons } = require('./app.js');
  showLessons();
};

window.handleShowProfile = function() {
  const { showProfile } = require('./app.js');
  showProfile();
};

window.handleBack = function() {
  const { showDashboard } = require('./app.js');
  showDashboard();
};

window.handleStartQuiz = function() {
  const { showQuiz } = require('./app.js');
  showQuiz();
};

document.addEventListener('submit', function(e) {
  if (e.target.id === 'loginForm') {
    window.handleLogin(e);
  } else if (e.target.id === 'signupForm') {
    window.handleSignup(e);
  }
});

document.addEventListener('click', function(e) {
  if (e.target.id === 'logoutBtn') {
    window.handleLogout();
  }
});
