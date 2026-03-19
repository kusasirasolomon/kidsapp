import { useState } from 'react';
import { Lesson, QuizAnswer } from '../lib/supabase';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type QuizProps = {
  lesson: Lesson;
  onComplete: () => void;
};

type Question = {
  question: string;
  options: string[];
  correctAnswer: string;
};

export default function Quiz({ lesson, onComplete }: QuizProps) {
  const { user } = useAuth();
  const [questions] = useState<Question[]>(generateQuestions(lesson));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [saving, setSaving] = useState(false);

  function generateQuestions(lesson: Lesson): Question[] {
    const questions: Question[] = [];
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

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

    const newAnswer: QuizAnswer = {
      question: currentQuestion.question,
      userAnswer: selectedAnswer,
      correctAnswer: currentQuestion.correctAnswer,
      correct: isCorrect,
    };

    const newAnswers = [...answers, newAnswer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer('');
    } else {
      saveResults(newAnswers);
    }
  };

  const saveResults = async (finalAnswers: QuizAnswer[]) => {
    setSaving(true);
    const score = finalAnswers.filter((a) => a.correct).length;

    if (user) {
      await supabase.from('quiz_results').insert({
        user_id: user.id,
        lesson_id: lesson.id,
        score,
        total_questions: questions.length,
        answers: finalAnswers,
      });

      const { data: existingProgress } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', lesson.id)
        .maybeSingle();

      if (!existingProgress) {
        await supabase.from('user_progress').insert({
          user_id: user.id,
          lesson_id: lesson.id,
          completed: true,
          completed_at: new Date().toISOString(),
        });
      } else {
        await supabase
          .from('user_progress')
          .update({
            completed: true,
            completed_at: new Date().toISOString(),
          })
          .eq('id', existingProgress.id);
      }
    }

    setSaving(false);
    setShowResults(true);
  };

  const score = answers.filter((a) => a.correct).length;
  const percentage = Math.round((score / questions.length) * 100);

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-300 via-blue-300 to-purple-300 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full">
          <div className="text-center mb-8">
            <div className="text-8xl mb-4">
              {percentage >= 80 ? '🌟' : percentage >= 60 ? '👍' : '💪'}
            </div>
            <h2 className="text-5xl font-bold text-purple-600 mb-4">
              Quiz Complete!
            </h2>
            <div className="text-6xl font-bold text-green-600 mb-2">
              {score} / {questions.length}
            </div>
            <div className="text-3xl text-gray-700">
              {percentage >= 80 && 'Excellent work! You\'re a star! ⭐'}
              {percentage >= 60 && percentage < 80 && 'Good job! Keep practicing! 👏'}
              {percentage < 60 && 'Keep trying! You can do it! 💪'}
            </div>
          </div>

          <div className="space-y-4 mb-8">
            {answers.map((answer, index) => (
              <div
                key={index}
                className={`p-4 rounded-2xl border-2 ${
                  answer.correct
                    ? 'bg-green-100 border-green-400'
                    : 'bg-red-100 border-red-400'
                }`}
              >
                <div className="font-bold text-lg mb-2">{answer.question}</div>
                <div className="text-gray-700">
                  Your answer: <span className={answer.correct ? 'text-green-700' : 'text-red-700'}>{answer.userAnswer}</span>
                </div>
                {!answer.correct && (
                  <div className="text-green-700">
                    Correct answer: {answer.correctAnswer}
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={onComplete}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold py-4 rounded-2xl hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-green-300 to-blue-300 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl w-full">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-2xl font-bold text-purple-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <div className="flex gap-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full ${
                    index < currentQuestionIndex
                      ? 'bg-green-500'
                      : index === currentQuestionIndex
                      ? 'bg-purple-500'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all"
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-800 mb-8">{currentQuestion.question}</h2>

        <div className="space-y-4 mb-8">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`w-full text-left p-6 rounded-2xl border-2 text-lg transition-all transform hover:scale-105 ${
                selectedAnswer === option
                  ? 'border-purple-500 bg-purple-100'
                  : 'border-gray-300 bg-gray-50 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswer === option
                      ? 'border-purple-500 bg-purple-500 text-white'
                      : 'border-gray-400'
                  }`}
                >
                  {selectedAnswer === option && '✓'}
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!selectedAnswer || saving}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white text-2xl font-bold py-4 rounded-2xl hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </button>
      </div>
    </div>
  );
}
