import { useEffect, useState } from 'react';
import { supabase, Lesson } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, CheckCircle, Circle } from 'lucide-react';

type LessonListProps = {
  onSelectLesson: (lesson: Lesson) => void;
  onBack: () => void;
};

export default function LessonList({ onSelectLesson, onBack }: LessonListProps) {
  const { user } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLessons();
  }, [user]);

  const loadLessons = async () => {
    const { data: lessonsData } = await supabase
      .from('lessons')
      .select('*')
      .order('order_number');

    if (lessonsData) {
      setLessons(lessonsData);
    }

    if (user) {
      const { data: progressData } = await supabase
        .from('user_progress')
        .select('lesson_id')
        .eq('user_id', user.id)
        .eq('completed', true);

      if (progressData) {
        setCompletedLessons(new Set(progressData.map((p) => p.lesson_id)));
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300">
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center gap-4">
          <button
            onClick={onBack}
            className="bg-gray-200 hover:bg-gray-300 p-2 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-bold text-purple-600">📚 Choose a Lesson</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-2xl text-gray-700">Loading lessons...</div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => {
              const isCompleted = completedLessons.has(lesson.id);
              return (
                <button
                  key={lesson.id}
                  onClick={() => onSelectLesson(lesson)}
                  className="bg-white rounded-3xl shadow-2xl p-6 hover:shadow-3xl transition-all transform hover:scale-105 text-left relative overflow-hidden"
                >
                  {isCompleted && (
                    <div className="absolute top-4 right-4 bg-green-500 rounded-full p-2">
                      <CheckCircle size={32} className="text-white" />
                    </div>
                  )}
                  {!isCompleted && (
                    <div className="absolute top-4 right-4 bg-gray-300 rounded-full p-2">
                      <Circle size={32} className="text-gray-500" />
                    </div>
                  )}
                  <div className="text-6xl mb-4">
                    {lesson.order_number === 1 && '🐶'}
                    {lesson.order_number === 2 && '🎨'}
                    {lesson.order_number === 3 && '🔢'}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    Lesson {lesson.order_number}
                  </h3>
                  <h4 className="text-xl font-semibold text-purple-600 mb-3">{lesson.title}</h4>
                  <p className="text-gray-600 text-lg">
                    {lesson.vocabulary.length} vocabulary words
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
