import { supabaseClient } from './supabase.js';

let questions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let selectedAnswer = null;

export function generateQuestions(lesson) {
  const questions = [];
  const vocab = lesson.vocabulary;

  vocab.forEach((word) => {
    const otherWords = vocab.filter((w) => w.word !== word.word);
    const wrongAnswers = otherWords
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((w) => w.definition);

    const options = [...wrongAnswers, word.definition].sort(() => Math.random() - 0.5);

    questions.push({
      question: `What is the definition of "${word.word}"?`,
      options,
      correctAnswer: word.definition,
    });
  });

  return questions.sort(() => Math.random() - 0.5).slice(0, 5);
}

export function initializeQuiz(lesson, onSubmit) {
  questions = generateQuestions(lesson);
  currentQuestionIndex = 0;
  userAnswers = [];
  selectedAnswer = null;

  document.getElementById('totalQuestions').textContent = questions.length;

  renderQuestion();
  updateProgress();
}

function renderQuestion() {
  if (currentQuestionIndex >= questions.length) {
    showResults();
    return;
  }

  const question = questions[currentQuestionIndex];

  document.getElementById('questionText').textContent = question.question;
  document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;

  const optionsContainer = document.getElementById('optionsContainer');
  optionsContainer.innerHTML = question.options.map((option, index) => `
    <div class="quiz-option" onclick="selectOption('${option.replace(/'/g, "\\'")}', this)">
      <div class="quiz-option-radio"></div>
      <span>${option}</span>
    </div>
  `).join('');

  window.selectOption = function(option, element) {
    selectedAnswer = option;
    document.querySelectorAll('.quiz-option').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
  };

  const nextBtn = document.getElementById('nextBtn');
  nextBtn.disabled = true;
  nextBtn.textContent = currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz';

  nextBtn.onclick = handleNextQuestion;
}

function handleNextQuestion() {
  if (!selectedAnswer) return;

  const question = questions[currentQuestionIndex];
  const isCorrect = selectedAnswer === question.correctAnswer;

  userAnswers.push({
    question: question.question,
    userAnswer: selectedAnswer,
    correctAnswer: question.correctAnswer,
    correct: isCorrect,
  });

  currentQuestionIndex++;
  selectedAnswer = null;

  if (currentQuestionIndex < questions.length) {
    updateProgress();
    renderQuestion();
  } else {
    showResults();
  }
}

function updateProgress() {
  const progress = ((currentQuestionIndex) / questions.length) * 100;
  document.getElementById('progressBar').style.width = progress + '%';

  const dotsContainer = document.getElementById('progressDots');
  dotsContainer.innerHTML = questions.map((_, index) => `
    <div class="w-1 h-1 rounded-full ${
      index < currentQuestionIndex
        ? 'bg-green-500'
        : index === currentQuestionIndex
        ? 'bg-purple-500'
        : 'bg-gray-300'
    }"></div>
  `).join('');
}

function showResults() {
  const score = userAnswers.filter((a) => a.correct).length;
  const percentage = Math.round((score / questions.length) * 100);

  const resultsContainer = document.getElementById('resultsContainer');
  const quizContainer = document.querySelector('.card');

  quizContainer.innerHTML = `
    <div class="text-center">
      <div class="text-8xl mb-4">
        ${percentage >= 80 ? '🌟' : percentage >= 60 ? '👍' : '💪'}
      </div>
      <h2 class="text-5xl font-bold text-purple-600 mb-4">
        Quiz Complete!
      </h2>
      <div class="text-6xl font-bold text-green-600 mb-2">
        ${score} / ${questions.length}
      </div>
      <div class="text-3xl text-gray-700 mb-8">
        ${percentage >= 80 ? "Excellent work! You're a star! ⭐" : ''}
        ${percentage >= 60 && percentage < 80 ? "Good job! Keep practicing! 👏" : ''}
        ${percentage < 60 ? "Keep trying! You can do it! 💪" : ''}
      </div>

      <div class="space-y-4 mb-8">
        ${userAnswers.map((answer) => `
          <div class="${answer.correct ? 'quiz-result-correct' : 'quiz-result-wrong'}">
            <div class="quiz-result-text">${answer.question}</div>
            <div class="text-gray-700">
              Your answer: <span class="${answer.correct ? 'text-green-700' : 'text-red-700'}">${answer.userAnswer}</span>
            </div>
            ${!answer.correct ? `
              <div class="text-green-700">
                Correct answer: ${answer.correctAnswer}
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>

      <button onclick="handleBackToDashboard()" class="btn btn-primary w-full text-2xl">
        Back to Dashboard
      </button>
    </div>
  `;

  window.handleBackToDashboard = function() {
    const { showDashboard } = require('./app.js');
    showDashboard();
  };
}

export async function saveQuizResults(user, lesson, answers) {
  if (!user || !lesson) {
    return { error: 'User or lesson not found' };
  }

  try {
    const score = answers.filter((a) => a.correct).length;

    const { error: insertError } = await supabaseClient
      .from('quiz_results')
      .insert({
        user_id: user.id,
        lesson_id: lesson.id,
        score,
        total_questions: answers.length,
        answers: answers,
      });

    if (insertError) {
      return { error: insertError.message };
    }

    const { data: existingProgress, error: selectError } = await supabaseClient
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('lesson_id', lesson.id)
      .maybeSingle();

    if (selectError) {
      return { error: selectError.message };
    }

    if (!existingProgress) {
      const { error: createError } = await supabaseClient
        .from('user_progress')
        .insert({
          user_id: user.id,
          lesson_id: lesson.id,
          completed: true,
          completed_at: new Date().toISOString(),
        });

      if (createError) {
        return { error: createError.message };
      }
    } else {
      const { error: updateError } = await supabaseClient
        .from('user_progress')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq('id', existingProgress.id);

      if (updateError) {
        return { error: updateError.message };
      }
    }

    return { error: null };
  } catch (err) {
    return { error: err.message };
  }
}
