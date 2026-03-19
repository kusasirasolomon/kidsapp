/*
  # Kids Learning Platform Schema

  1. New Tables
    - `lessons`
      - `id` (uuid, primary key)
      - `title` (text) - Lesson title
      - `video_url` (text) - YouTube video URL
      - `story_text` (text) - Reading story
      - `vocabulary` (jsonb) - Array of vocabulary words
      - `order_number` (integer) - Lesson order
      - `created_at` (timestamp)
    
    - `quiz_results`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `lesson_id` (uuid, references lessons)
      - `score` (integer) - Quiz score
      - `total_questions` (integer)
      - `answers` (jsonb) - User answers and correct answers
      - `created_at` (timestamp)
    
    - `user_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `lesson_id` (uuid, references lessons)
      - `completed` (boolean)
      - `completed_at` (timestamp)
    
    - `pronunciation_practice`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `word` (text)
      - `success` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  video_url text NOT NULL,
  story_text text NOT NULL,
  vocabulary jsonb NOT NULL DEFAULT '[]',
  order_number integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create quiz_results table
CREATE TABLE IF NOT EXISTS quiz_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  lesson_id uuid REFERENCES lessons(id) NOT NULL,
  score integer NOT NULL DEFAULT 0,
  total_questions integer NOT NULL,
  answers jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

-- Create user_progress table
CREATE TABLE IF NOT EXISTS user_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  lesson_id uuid REFERENCES lessons(id) NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  UNIQUE(user_id, lesson_id)
);

-- Create pronunciation_practice table
CREATE TABLE IF NOT EXISTS pronunciation_practice (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  word text NOT NULL,
  success boolean NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE pronunciation_practice ENABLE ROW LEVEL SECURITY;

-- Policies for lessons (everyone can read)
CREATE POLICY "Anyone can view lessons"
  ON lessons FOR SELECT
  TO authenticated
  USING (true);

-- Policies for quiz_results
CREATE POLICY "Users can view own quiz results"
  ON quiz_results FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz results"
  ON quiz_results FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policies for user_progress
CREATE POLICY "Users can view own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for pronunciation_practice
CREATE POLICY "Users can view own pronunciation practice"
  ON pronunciation_practice FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pronunciation practice"
  ON pronunciation_practice FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert sample lessons
INSERT INTO lessons (title, video_url, story_text, vocabulary, order_number) VALUES
(
  'Animals and Their Sounds',
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  'Once upon a time, there was a friendly dog named Max. Max loved to bark and play in the garden. One day, he met a cat who said "Meow!" They became best friends and played together every day.',
  '[
    {"word": "dog", "definition": "A friendly animal that barks"},
    {"word": "cat", "definition": "A furry animal that says meow"},
    {"word": "bark", "definition": "The sound a dog makes"},
    {"word": "meow", "definition": "The sound a cat makes"},
    {"word": "friend", "definition": "Someone you like to play with"},
    {"word": "garden", "definition": "A place with flowers and grass"}
  ]'::jsonb,
  1
),
(
  'Colors and Shapes',
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  'In a magical land, there lived colorful shapes. Red circles rolled around, blue squares danced, and yellow triangles jumped high. Each shape was special and unique.',
  '[
    {"word": "red", "definition": "The color of an apple"},
    {"word": "blue", "definition": "The color of the sky"},
    {"word": "yellow", "definition": "The color of the sun"},
    {"word": "circle", "definition": "A round shape"},
    {"word": "square", "definition": "A shape with four equal sides"},
    {"word": "triangle", "definition": "A shape with three sides"}
  ]'::jsonb,
  2
),
(
  'Numbers and Counting',
  'https://www.youtube.com/embed/dQw4w9WgXcQ',
  'Little Emma loved to count. She counted one apple, two oranges, three bananas. Every day she counted something new and learned more numbers.',
  '[
    {"word": "one", "definition": "The first number"},
    {"word": "two", "definition": "One plus one"},
    {"word": "three", "definition": "Two plus one"},
    {"word": "count", "definition": "To say numbers in order"},
    {"word": "number", "definition": "A symbol for counting"},
    {"word": "apple", "definition": "A round red fruit"}
  ]'::jsonb,
  3
);