import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import LessonList from './components/LessonList';
import LessonDetail from './components/LessonDetail';
import Quiz from './components/Quiz';
import Profile from './components/Profile';
import { Lesson } from './lib/supabase';

type Page =
  | 'login'
  | 'signup'
  | 'dashboard'
  | 'lessons'
  | 'lesson-detail'
  | 'quiz'
  | 'profile';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 flex items-center justify-center">
        <div className="text-4xl font-bold text-white">Loading... 🚀</div>
      </div>
    );
  }

  if (!user) {
    if (currentPage === 'signup') {
      return <Signup onSwitchToLogin={() => setCurrentPage('login')} />;
    }
    return <Login onSwitchToSignup={() => setCurrentPage('signup')} />;
  }

  if (currentPage === 'dashboard') {
    return (
      <Dashboard
        onNavigateToLessons={() => setCurrentPage('lessons')}
        onNavigateToProfile={() => setCurrentPage('profile')}
      />
    );
  }

  if (currentPage === 'lessons') {
    return (
      <LessonList
        onSelectLesson={(lesson) => {
          setSelectedLesson(lesson);
          setCurrentPage('lesson-detail');
        }}
        onBack={() => setCurrentPage('dashboard')}
      />
    );
  }

  if (currentPage === 'lesson-detail' && selectedLesson) {
    return (
      <LessonDetail
        lesson={selectedLesson}
        onBack={() => setCurrentPage('lessons')}
        onStartQuiz={() => setCurrentPage('quiz')}
      />
    );
  }

  if (currentPage === 'quiz' && selectedLesson) {
    return (
      <Quiz
        lesson={selectedLesson}
        onComplete={() => {
          setSelectedLesson(null);
          setCurrentPage('dashboard');
        }}
      />
    );
  }

  if (currentPage === 'profile') {
    return <Profile onBack={() => setCurrentPage('dashboard')} />;
  }

  return (
    <Dashboard
      onNavigateToLessons={() => setCurrentPage('lessons')}
      onNavigateToProfile={() => setCurrentPage('profile')}
    />
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
