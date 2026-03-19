# Kids Learning AI Platform

A full-stack educational web application designed for children to learn through interactive lessons, quizzes, and pronunciation practice.

## Features

### User Authentication
- Sign up with email/password
- Login/logout functionality
- Secure authentication using Supabase Auth
- User profile with name and progress tracking

### Dashboard
- Welcome message with user name
- Progress statistics (completed lessons, quiz scores, average score)
- Navigation to lessons, practice, and profile
- Achievement badges based on progress

### Daily Lessons
- Interactive lessons with:
  - Embedded video content
  - Story text for reading comprehension
  - Vocabulary words with definitions
  - Text-to-speech for each vocabulary word
  - Speech recognition for pronunciation practice

### Spelling Quiz System
- Multiple choice questions based on lesson vocabulary
- Auto-grading with instant feedback
- Progress tracking and score history
- Visual feedback with color-coded results

### Text-to-Speech
- Listen button for each vocabulary word
- Uses browser's native SpeechSynthesis API
- Adjustable rate and pitch for kid-friendly pronunciation

### Speech Recognition
- Practice pronunciation of vocabulary words
- Real-time feedback on pronunciation accuracy
- Uses Web Speech API for voice recognition
- Comparison between spoken word and expected word

### Profile Page
- User statistics and progress
- Quiz history with scores
- Achievement badges
- Personal best scores

## Technology Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and building
- Tailwind CSS for styling
- Lucide React for icons

### Backend
- Supabase for database and authentication
- PostgreSQL database with Row Level Security (RLS)
- Real-time data synchronization

### APIs
- Web Speech API for text-to-speech
- SpeechRecognition API for pronunciation practice

## Database Schema

### Tables
1. **lessons** - Stores lesson content
   - id, title, video_url, story_text, vocabulary, order_number

2. **quiz_results** - Stores quiz scores and answers
   - id, user_id, lesson_id, score, total_questions, answers

3. **user_progress** - Tracks lesson completion
   - id, user_id, lesson_id, completed, completed_at

4. **pronunciation_practice** - Tracks pronunciation attempts
   - id, user_id, word, success, created_at

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account (free tier works)

### Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd kids-learning-ai-platform
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with your Supabase credentials:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. The database schema is already set up. If you need to recreate it, the migration file contains:
   - All table definitions
   - Row Level Security policies
   - Sample lesson data

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to:
```
http://localhost:5173
```

### Building for Production

Build the application:
```bash
npm run build
```

The built files will be in the `dist` directory.

### Deployment

#### Vercel (Recommended)
1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

3. Add environment variables in Vercel dashboard:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY

## Project Structure

```
kids-learning-ai-platform/
├── src/
│   ├── components/
│   │   ├── Login.tsx           # Login page
│   │   ├── Signup.tsx          # Signup page
│   │   ├── Dashboard.tsx       # Main dashboard
│   │   ├── LessonList.tsx      # List of all lessons
│   │   ├── LessonDetail.tsx    # Lesson content with video and vocabulary
│   │   ├── Quiz.tsx            # Quiz interface with questions
│   │   └── Profile.tsx         # User profile and statistics
│   ├── contexts/
│   │   └── AuthContext.tsx     # Authentication context and hooks
│   ├── lib/
│   │   └── supabase.ts         # Supabase client and types
│   ├── App.tsx                 # Main app with routing logic
│   ├── main.tsx                # App entry point
│   └── index.css               # Global styles with Tailwind
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind configuration
├── vite.config.ts              # Vite configuration
└── README.md                   # This file
```

## Usage Guide

### For Users

1. **Sign Up**: Create a new account with your email and password
2. **Login**: Access your account with your credentials
3. **Dashboard**: View your progress and navigate to lessons
4. **Choose a Lesson**: Select from available lessons
5. **Learn**: Watch the video, read the story, and learn vocabulary
6. **Practice**: Click the speaker icon to hear words pronounced
7. **Pronunciation**: Click the microphone icon to practice saying words
8. **Take Quiz**: Test your knowledge with multiple choice questions
9. **View Profile**: Check your progress, scores, and achievements

### For Developers

#### Adding New Lessons
Insert new lessons directly into the Supabase `lessons` table:

```sql
INSERT INTO lessons (title, video_url, story_text, vocabulary, order_number)
VALUES (
  'Lesson Title',
  'https://www.youtube.com/embed/VIDEO_ID',
  'Story text here...',
  '[
    {"word": "example", "definition": "An example definition"}
  ]'::jsonb,
  4
);
```

#### Customizing the UI
- Modify Tailwind classes in component files
- Update color schemes in `tailwind.config.js`
- Add new icons from Lucide React

## Security Features

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Passwords are hashed and secured by Supabase Auth
- API keys are stored as environment variables
- Input validation on all forms

## Browser Support

- Modern browsers with Web Speech API support:
  - Chrome/Edge (recommended for speech recognition)
  - Firefox (limited speech recognition)
  - Safari (text-to-speech only)

## Future Enhancements

- Progress badges and rewards system
- Parent dashboard for monitoring
- More lesson types (math, science, etc.)
- Multiplayer quiz mode
- Offline support with localStorage fallback
- AI-powered personalized learning paths

## License

MIT License

## Support

For issues or questions, please create an issue in the repository.
