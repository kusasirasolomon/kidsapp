import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Award, BookOpen, Target, TrendingUp } from 'lucide-react';

type ProfileProps = {
  onBack: () => void;
};

type QuizHistory = {
  id: string;
  lesson_title: string;
  score: number;
  total_questions: number;
  created_at: string;
};

export default function Profile({ onBack }: ProfileProps) {
  const { user } = useAuth();
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([]);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    completedLessons: 0,
    bestScore: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, [user]);

  const loadProfileData = async () => {
    if (!user) return;

    const { data: quizResults } = await supabase
      .from('quiz_results')
      .select('id, lesson_id, score, total_questions, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (quizResults) {
      const { data: lessons } = await supabase.from('lessons').select('id, title');

      const lessonsMap = new Map(lessons?.map((l) => [l.id, l.title]) || []);

      const history: QuizHistory[] = quizResults.map((result) => ({
        id: result.id,
        lesson_title: lessonsMap.get(result.lesson_id) || 'Unknown Lesson',
        score: result.score,
        total_questions: result.total_questions,
        created_at: result.created_at,
      }));

      setQuizHistory(history);

      const totalQuizzes = quizResults.length;
      const totalScore = quizResults.reduce(
        (sum, r) => sum + (r.score / r.total_questions) * 100,
        0
      );
      const averageScore = totalQuizzes > 0 ? Math.round(totalScore / totalQuizzes) : 0;
      const bestScore = quizResults.length > 0
        ? Math.max(...quizResults.map((r) => Math.round((r.score / r.total_questions) * 100)))
        : 0;

      const { data: progress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', true);

      setStats({
        totalQuizzes,
        averageScore,
        completedLessons: progress?.length || 0,
        bestScore,
      });
    }

    setLoading(false);
  };

  const userName = user?.user_metadata?.name || 'Student';
  const userEmail = user?.email || '';

  const getBadge = () => {
    if (stats.completedLessons >= 3) return { emoji: '🏆', title: 'Super Learner', color: 'from-yellow-400 to-orange-400' };
    if (stats.completedLessons >= 2) return { emoji: '🌟', title: 'Star Student', color: 'from-blue-400 to-purple-400' };
    if (stats.completedLessons >= 1) return { emoji: '⭐', title: 'Rising Star', color: 'from-green-400 to-blue-400' };
    return { emoji: '🎯', title: 'Beginner', color: 'from-gray-400 to-gray-500' };
  };

  const badge = getBadge();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-300 to-orange-300">
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center gap-4">
          <button
            onClick={onBack}
            className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-purple-600">👤 My Profile</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-2xl text-gray-700">Loading profile...</div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-6xl">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-4xl font-bold text-gray-800 mb-2">{userName}</h2>
                  <p className="text-xl text-gray-600 mb-4">{userEmail}</p>
                  <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${badge.color} text-white px-6 py-3 rounded-full text-xl font-bold`}>
                    <span className="text-3xl">{badge.emoji}</span>
                    <span>{badge.title}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <BookOpen className="text-blue-600" size={28} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-800">{stats.completedLessons}</div>
                    <div className="text-sm text-gray-600">Lessons Done</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Target className="text-green-600" size={28} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-800">{stats.totalQuizzes}</div>
                    <div className="text-sm text-gray-600">Quizzes Taken</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <TrendingUp className="text-purple-600" size={28} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-800">{stats.averageScore}%</div>
                    <div className="text-sm text-gray-600">Average Score</div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <Award className="text-yellow-600" size={28} />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-800">{stats.bestScore}%</div>
                    <div className="text-sm text-gray-600">Best Score</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-2xl p-8">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">📊 Quiz History</h3>
              {quizHistory.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-xl">
                  No quizzes taken yet. Start learning to see your progress!
                </div>
              ) : (
                <div className="space-y-4">
                  {quizHistory.map((quiz) => {
                    const percentage = Math.round((quiz.score / quiz.total_questions) * 100);
                    return (
                      <div
                        key={quiz.id}
                        className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-gray-200"
                      >
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-800">{quiz.lesson_title}</h4>
                          <p className="text-gray-600">
                            {new Date(quiz.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 mt-4 md:mt-0">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-purple-600">
                              {quiz.score}/{quiz.total_questions}
                            </div>
                            <div className="text-gray-600">Score</div>
                          </div>
                          <div
                            className={`px-6 py-3 rounded-full text-white font-bold text-xl ${
                              percentage >= 80
                                ? 'bg-green-500'
                                : percentage >= 60
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                          >
                            {percentage}%
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
