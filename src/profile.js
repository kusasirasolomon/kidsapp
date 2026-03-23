import { supabaseClient } from './supabase.js';

export async function loadProfileData(user) {
  if (!user) return;

  const { data: quizResults } = await supabaseClient
    .from('quiz_results')
    .select('id, lesson_id, score, total_questions, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const { data: lessons } = await supabaseClient
    .from('lessons')
    .select('id, title');

  const lessonsMap = new Map(lessons?.map((l) => [l.id, l.title]) || []);

  const { data: progress } = await supabaseClient
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('completed', true);

  const quizHistory = quizResults?.map((result) => ({
    id: result.id,
    lesson_title: lessonsMap.get(result.lesson_id) || 'Unknown Lesson',
    score: result.score,
    total_questions: result.total_questions,
    created_at: result.created_at,
  })) || [];

  const totalQuizzes = quizResults?.length || 0;
  const completedLessons = progress?.length || 0;

  let averageScore = 0;
  if (quizResults && quizResults.length > 0) {
    const totalScore = quizResults.reduce(
      (sum, r) => sum + (r.score / r.total_questions) * 100,
      0
    );
    averageScore = Math.round(totalScore / quizResults.length);
  }

  let bestScore = 0;
  if (quizResults && quizResults.length > 0) {
    bestScore = Math.max(
      ...quizResults.map((r) => Math.round((r.score / r.total_questions) * 100))
    );
  }

  const badge = getBadge(completedLessons);

  const badgeContainer = document.getElementById('badgeContainer');
  if (badgeContainer) {
    badgeContainer.innerHTML = `
      <div class="badge">
        <span class="text-3xl">${badge.emoji}</span>
        <span>${badge.title}</span>
      </div>
    `;
  }

  const statsContainer = document.getElementById('statsContainer');
  if (statsContainer) {
    statsContainer.innerHTML = `
      <div class="stat-card">
        <div class="flex items-center gap-3">
          <div class="bg-blue-100 p-3 rounded-full text-3xl">📚</div>
          <div>
            <div class="stat-value">${completedLessons}</div>
            <div class="stat-label">Lessons Done</div>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center gap-3">
          <div class="bg-green-100 p-3 rounded-full text-3xl">🎯</div>
          <div>
            <div class="stat-value">${totalQuizzes}</div>
            <div class="stat-label">Quizzes Taken</div>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center gap-3">
          <div class="bg-purple-100 p-3 rounded-full text-3xl">📈</div>
          <div>
            <div class="stat-value">${averageScore}%</div>
            <div class="stat-label">Average Score</div>
          </div>
        </div>
      </div>

      <div class="stat-card">
        <div class="flex items-center gap-3">
          <div class="bg-yellow-100 p-3 rounded-full text-3xl">🏆</div>
          <div>
            <div class="stat-value">${bestScore}%</div>
            <div class="stat-label">Best Score</div>
          </div>
        </div>
      </div>
    `;
  }

  const quizHistoryContainer = document.getElementById('quizHistoryContainer');
  if (quizHistoryContainer) {
    if (quizHistory.length === 0) {
      quizHistoryContainer.innerHTML = `
        <div class="text-center py-8 text-gray-500 text-xl">
          No quizzes taken yet. Start learning to see your progress!
        </div>
      `;
    } else {
      quizHistoryContainer.innerHTML = quizHistory.map((quiz) => {
        const percentage = Math.round((quiz.score / quiz.total_questions) * 100);
        const date = new Date(quiz.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

        return `
          <div class="quiz-history-item">
            <div>
              <h4 class="text-xl font-bold text-gray-800">${quiz.lesson_title}</h4>
              <p class="text-gray-600">${date}</p>
            </div>
            <div class="flex items-center gap-4">
              <div class="text-center">
                <div class="text-3xl font-bold text-purple-600">
                  ${quiz.score}/${quiz.total_questions}
                </div>
                <div class="text-gray-600">Score</div>
              </div>
              <div class="px-6 py-3 rounded-full text-white font-bold text-xl ${
                percentage >= 80
                  ? 'bg-green-500'
                  : percentage >= 60
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }">
                ${percentage}%
              </div>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

function getBadge(completedLessons) {
  if (completedLessons >= 3) {
    return { emoji: '🏆', title: 'Super Learner' };
  }
  if (completedLessons >= 2) {
    return { emoji: '🌟', title: 'Star Student' };
  }
  if (completedLessons >= 1) {
    return { emoji: '⭐', title: 'Rising Star' };
  }
  return { emoji: '🎯', title: 'Beginner' };
}
