import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Lesson = {
  id: string;
  title: string;
  video_url: string;
  story_text: string;
  vocabulary: VocabularyWord[];
  order_number: number;
  created_at: string;
};

export type VocabularyWord = {
  word: string;
  definition: string;
};

export type QuizResult = {
  id: string;
  user_id: string;
  lesson_id: string;
  score: number;
  total_questions: number;
  answers: QuizAnswer[];
  created_at: string;
};

export type QuizAnswer = {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  correct: boolean;
};

export type UserProgress = {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at: string | null;
};

export type PronunciationPractice = {
  id: string;
  user_id: string;
  word: string;
  success: boolean;
  created_at: string;
};
