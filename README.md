# Kids Learning AI Platform

A fully functional, kid-friendly educational platform built with **vanilla JavaScript, HTML, and CSS** (no React/TypeScript). Features interactive lessons, pronunciation practice, quizzes, and progress tracking using Supabase.

## Features at a Glance

✅ **User Authentication** - Email/password signup and login
✅ **Interactive Lessons** - Videos, stories, and vocabulary
✅ **Text-to-Speech** - Listen to word pronunciations
✅ **Speech Recognition** - Practice saying words aloud
✅ **Auto-Graded Quizzes** - Multiple choice questions with instant feedback
✅ **Progress Tracking** - Dashboard with statistics and achievements
✅ **Responsive Design** - Works on mobile and desktop
✅ **Zero Framework Overhead** - Pure vanilla JS, small bundle size

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Vanilla JavaScript, HTML5, Pure CSS |
| **Build Tool** | Vite (no build step for JS/CSS) |
| **Database** | Supabase PostgreSQL |
| **Authentication** | Supabase Auth (email/password) |
| **APIs** | Web Speech API, Fetch API |

## Quick Start

### Prerequisites
- Node.js 18+
- npm
- Supabase account (free tier works)

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
# http://localhost:5173
```

### Environment Setup

Create `.env` file:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Get these from your Supabase project settings.

## Project Structure

```
src/
├── app.js              # Main app logic and routing
├── auth.js             # Authentication (login, signup, logout)
├── lessons.js          # Lesson loading and vocabulary interaction
├── quiz.js             # Quiz generation and grading
├── profile.js          # User stats and history
├── supabase.js         # Supabase client
├── ui.js               # UI templates and rendering
└── index.css           # All styling (pure CSS, no Tailwind)
```

**Why no TypeScript?** Vanilla JS is faster to develop, smaller bundle (~9KB gzipped), and no compilation step needed!

## How It Works

### 1. User Logs In
- Enter email and password
- Supabase authenticates and creates session

### 2. Dashboard Shows Progress
- Stats: lessons completed, quizzes taken, average score
- Achievement badges unlock at milestones

### 3. Choose a Lesson
- 3 sample lessons available (Animals, Colors, Numbers)
- Click to view lesson details

### 4. Learn with Multiple Methods
- **Watch video** - Embedded YouTube player
- **Read story** - Engaging narrative with vocabulary
- **Listen to words** - Click speaker icon for pronunciation
- **Practice speaking** - Click mic icon to practice (Web Speech API)

### 5. Take a Quiz
- 5 random multiple choice questions from vocabulary
- Click option to select, click "Next" to continue
- Auto-graded with visual feedback
- Results saved to Supabase

### 6. View Profile
- See quiz history and scores
- Track progress over time
- Unlock badges and achievements

## Code Structure

### app.js - Main Controller
Handles page routing and state:
```javascript
showLogin()              // Show login page
showSignup()             // Show signup page
showDashboard()          // Show main dashboard
showLessons()            // Show all lessons
showLessonDetail(lesson) // Show lesson content
showQuiz()               // Show quiz
showProfile()            // Show user profile
```

### ui.js - UI Templates
Pure HTML string templates:
```javascript
createLoginPage()        // Returns HTML for login
createDashboardPage()    // Returns HTML for dashboard
// ... etc
```

### auth.js - Authentication
Simple async functions:
```javascript
login(email, password)        // Login user
signup(name, email, password) // Create account
logout()                      // Logout user
```

### lessons.js - Content
Loads lessons and handles interactions:
```javascript
loadLessons(callback)        // Fetch from Supabase
setupVocabularyInteraction() // Add speak/listen buttons
speakWord(word)              // Text-to-speech
startListening(word)         // Speech recognition
```

### quiz.js - Quiz Logic
Generates questions and saves results:
```javascript
generateQuestions(lesson)   // Create multiple choice questions
initializeQuiz(lesson)      // Setup quiz UI
saveQuizResults(user, lesson, answers) // Save to Supabase
```

## Database

### Tables
1. **lessons** - Lesson content with video, story, vocabulary
2. **quiz_results** - Quiz scores and user answers
3. **user_progress** - Tracks completed lessons
4. All tables have **Row Level Security (RLS)** - users only see their own data

### Sample Data
3 lessons pre-loaded:
- Lesson 1: Animals and Their Sounds
- Lesson 2: Colors and Shapes
- Lesson 3: Numbers and Counting

### Add More Lessons
In Supabase SQL Editor:
```sql
INSERT INTO lessons (title, video_url, story_text, vocabulary, order_number)
VALUES (
  'New Lesson',
  'https://www.youtube.com/embed/VIDEO_ID',
  'Your story text...',
  '[
    {"word": "hello", "definition": "A greeting"},
    {"word": "world", "definition": "The planet we live on"}
  ]'::jsonb,
  4
);
```

## CSS Classes

Pure CSS with utility classes:

```css
/* Buttons */
.btn              /* Base button */
.btn-primary      /* Purple/pink gradient */
.btn-secondary    /* Green/blue gradient */
.btn-small        /* Smaller buttons */
.btn-icon         /* Icon buttons */

/* Cards & Layout */
.card             /* White card with shadow */
.grid-2, .grid-3  /* Responsive grids */
.stat-card        /* Statistics card */

/* Forms */
.form-group       /* Form field with label */
.alert            /* Alert messages */
.alert-error      /* Red alert */
.alert-success    /* Green alert */

/* Text Utilities */
.text-center      /* Center text */
.mb-2, .mb-4      /* Margin bottom */
.mt-2, .mt-4      /* Margin top */
.hidden           /* Display none */
```

## Browser APIs Used

### Web Speech API
- **SpeechSynthesis** - Text-to-speech (all modern browsers)
- **SpeechRecognition** - Voice recognition (Chrome, Edge, Firefox)

### Fetch API
- Used internally by Supabase client

### localStorage (optional)
- Could add offline progress backup

## Browser Support

| Browser | Support |
|---------|---------|
| Chrome | ✅ Full |
| Edge | ✅ Full |
| Firefox | ✅ Full (except Speech Recognition) |
| Safari | ✅ Full (except Speech Recognition) |

## Deployment

### Vercel (Recommended)
```bash
npm run build
vercel
```
Add environment variables in Vercel dashboard.

### GitHub Pages
```bash
npm run build
npx gh-pages -d dist
```

### Traditional Hosting
```bash
npm run build
# Upload 'dist' folder to any web server
```

## Development

### Start Dev Server
```bash
npm run dev
```
Hot Module Replacement (HMR) - changes reload instantly!

### Build for Production
```bash
npm run build
```
Outputs optimized files to `dist/` folder.

### Preview Production Build
```bash
npm run preview
```
Test the production build locally.

## Performance

- **Bundle Size**: ~9KB gzipped (JS + CSS combined)
- **Framework Overhead**: Zero
- **Load Time**: Instant
- **Memory Usage**: Minimal

## File Sizes

| File | Size |
|------|------|
| index-*.js | 9.05 KB |
| index-*.css | 8.94 KB |
| **Total** | **~9 KB** (gzipped) |

## Key Features Explained

### Authentication
- Email/password only (no social logins)
- Passwords hashed by Supabase
- Session persists in browser
- Auto logout on password change

### Quizzes
- 5 random questions per quiz
- Multiple choice answers
- Instant grading and feedback
- Results saved to database

### Text-to-Speech
- Uses browser's native SpeechSynthesis
- Adjustable speed and pitch
- Works offline
- All modern browsers supported

### Speech Recognition
- Records user's voice
- Compares with expected word
- Shows "Correct!" or "Try again"
- Feedback is instant

### Progress Tracking
- Quiz scores saved to Supabase
- Completed lessons tracked
- Average score calculated
- Badges awarded for milestones

## Common Tasks

### Add a New Page
1. Create render function in `ui.js`
2. Add case in `app.js` routing
3. Add global click handler in `ui.js` if needed

### Style Changes
1. Edit `src/index.css`
2. Add or modify CSS classes
3. No build step - refresh browser

### Add Database Call
1. Use Supabase functions in relevant module
2. Example: `supabaseClient.from('table').select()`

### Debug
- Open browser DevTools (F12)
- Check Console for errors
- Network tab shows Supabase API calls
- All code is plain JavaScript - easy to trace!

## Security

- **RLS Enabled** - Users only access their own data
- **Passwords** - Hashed by Supabase Auth
- **API Keys** - Environment variables (not in code)
- **Input Validation** - Forms check data
- **HTTPS** - Required in production

## Advantages of Vanilla JS

✅ No framework learning curve
✅ Smaller bundle size
✅ Faster development
✅ Direct control over DOM
✅ Easy to customize
✅ No compilation step
✅ Plain JavaScript anyone can understand

## Limitations

❌ No TypeScript type safety
❌ More verbose than React
❌ Manual state management
❌ No component reuse patterns

## Future Ideas

- Add more lessons and quizzes
- Parent dashboard for monitoring
- Leaderboards and challenges
- Offline support with Service Workers
- AI-powered learning paths
- Multiplayer quiz battles
- Progress badges and rewards

## License

MIT - Use freely!

## Need Help?

- Check browser console for errors
- Verify Supabase credentials in `.env`
- Test on different browsers
- Read code comments for context
- All code is plain JavaScript - easy to debug!

---

**Built with ❤️ for kids to learn and have fun!**
