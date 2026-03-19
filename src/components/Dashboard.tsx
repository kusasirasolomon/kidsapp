import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Book, Award, User, LogOut } from 'lucide-react';

type DashboardProps = {
  onNavigateToLessons: () => void;
  onNavigateToProfile: () => void;
};

type UserStats = {
  totalLessons: number;
  completedLessons: number;
  averageScore: number;
  totalQuizzes: number;
};

export default function Dashboard({ onNavigateToLessons, onNavigateToProfile }: DashboardProps) {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    totalLessons: 0,
    completedLessons: 0,
    averageScore: 0,
    totalQuizzes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, [user]);

  const loadStats = async () => {
    if (!user) return;

    const { data: lessons } = await supabase
      .from('lessons')
      .select('id')
      .order('order_number');

    const { data: progress } = await supabase
      .from('user_progress')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', true);

    const { data: quizResults } = await supabase
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

    setStats({
      totalLessons,
      completedLessons,
      averageScore,
      totalQuizzes,
    });
    setLoading(false);
  };

  const userName = user?.user_metadata?.name || 'Student';

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-300 to-purple-300">
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-purple-600">🎓 Kids Learning AI</h1>
          <button
            onClick={signOut}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {userName}! 👋
          </h2>
          <p className="text-xl text-gray-600">Ready to learn something new today?</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-2xl text-gray-600">Loading your progress...</div>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="text-5xl font-bold mb-2">{stats.totalLessons}</div>
                <div className="text-xl">Total Lessons</div>
              </div>
              <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="text-5xl font-bold mb-2">{stats.completedLessons}</div>
                <div className="text-xl">Completed</div>
              </div>
              <div className="bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="text-5xl font-bold mb-2">{stats.averageScore}%</div>
                <div className="text-xl">Average Score</div>
              </div>
              <div className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
                <div className="text-5xl font-bold mb-2">{stats.totalQuizzes}</div>
                <div className="text-xl">Quizzes Taken</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={onNavigateToLessons}
                className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-br from-blue-400 to-purple-500 rounded-full p-4">
                    <Book size={40} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-800">Daily Lessons</h3>
                    <p className="text-xl text-gray-600">Learn new things!</p>
                  </div>
                </div>
                <div className="text-lg text-gray-700">
                  Explore exciting lessons with videos, stories, and vocabulary
                </div>
              </button>

              <button
                onClick={onNavigateToProfile}
                className="bg-white rounded-3xl shadow-2xl p-8 hover:shadow-3xl transition-all transform hover:scale-105 text-left"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-full p-4">
                    <User size={40} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-800">My Profile</h3>
                    <p className="text-xl text-gray-600">View your progress</p>
                  </div>
                </div>
                <div className="text-lg text-gray-700">
                  Check your achievements and see how well you're doing
                </div>
              </button>
            </div>

            {stats.completedLessons > 0 && (
              <div className="mt-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-3xl p-8 text-white shadow-2xl">
                <div className="flex items-center gap-4">
                  <Award size={60} />
                  <div>
                    <h3 className="text-3xl font-bold mb-2">Great Job! 🌟</h3>
                    <p className="text-xl">
                      You've completed {stats.completedLessons} lesson
                      {stats.completedLessons !== 1 ? 's' : ''}! Keep up the amazing work!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
