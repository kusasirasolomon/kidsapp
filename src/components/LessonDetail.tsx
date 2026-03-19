import { useState } from 'react';
import { Lesson, VocabularyWord } from '../lib/supabase';
import { ArrowLeft, Volume2, Mic, BookOpen } from 'lucide-react';

type LessonDetailProps = {
  lesson: Lesson;
  onBack: () => void;
  onStartQuiz: () => void;
};

export default function LessonDetail({ lesson, onBack, onStartQuiz }: LessonDetailProps) {
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [pronunciationResult, setPronunciationResult] = useState<string>('');

  const speakWord = (word: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = (word: string) => {
    setSelectedWord(word);
    setPronunciationResult('');

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setPronunciationResult('Speech recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setListening(true);
      setPronunciationResult('Listening... Say the word now!');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      const targetWord = word.toLowerCase().trim();

      if (transcript === targetWord || transcript.includes(targetWord)) {
        setPronunciationResult('🎉 Perfect! You said it correctly!');
      } else {
        setPronunciationResult(`You said "${transcript}". Try saying "${word}" again!`);
      }
      setListening(false);
    };

    recognition.onerror = () => {
      setPronunciationResult('Could not hear you. Please try again!');
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

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
          <div>
            <h1 className="text-3xl font-bold text-purple-600">{lesson.title}</h1>
            <p className="text-gray-600">Lesson {lesson.order_number}</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            📺 Watch the Video
          </h2>
          <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src={lesson.video_url}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <BookOpen size={32} className="text-blue-500" />
            Story Time
          </h2>
          <p className="text-xl leading-relaxed text-gray-700">{lesson.story_text}</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">📝 Vocabulary Words</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {lesson.vocabulary.map((vocab: VocabularyWord, index: number) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-6 border-2 border-blue-300"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-2xl font-bold text-purple-700">{vocab.word}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => speakWord(vocab.word)}
                      className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                      title="Listen"
                    >
                      <Volume2 size={24} />
                    </button>
                    <button
                      onClick={() => startListening(vocab.word)}
                      disabled={listening && selectedWord === vocab.word}
                      className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                      title="Practice pronunciation"
                    >
                      <Mic size={24} />
                    </button>
                  </div>
                </div>
                <p className="text-lg text-gray-700">{vocab.definition}</p>
                {selectedWord === vocab.word && pronunciationResult && (
                  <div
                    className={`mt-4 p-3 rounded-lg ${
                      pronunciationResult.includes('Perfect')
                        ? 'bg-green-200 text-green-800'
                        : pronunciationResult.includes('Listening')
                        ? 'bg-blue-200 text-blue-800'
                        : 'bg-yellow-200 text-yellow-800'
                    }`}
                  >
                    {pronunciationResult}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={onStartQuiz}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white text-2xl font-bold px-12 py-6 rounded-2xl hover:from-green-600 hover:to-blue-600 transition-all transform hover:scale-105 shadow-2xl"
          >
            🎯 Take the Quiz!
          </button>
        </div>
      </main>
    </div>
  );
}
