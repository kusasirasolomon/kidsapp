# Kids Learning AI Platform - Vanilla JavaScript Version

Complete conversion from React/TypeScript to vanilla JavaScript with HTML, CSS, and Supabase.

## Project Structure

```
src/
├── app.js              # Main app logic and routing
├── auth.js             # Authentication functions
├── lessons.js          # Lesson loading and vocabulary
├── quiz.js             # Quiz generation and submission
├── profile.js          # Profile data loading
├── supabase.js         # Supabase client initialization
├── ui.js               # UI rendering and templates
└── index.css           # Pure CSS (no Tailwind)

index.html             # Single HTML entry point
```

## Technology Stack

### Frontend
- **Pure Vanilla JavaScript** - No frameworks or TypeScript
- **HTML5** - Semantic markup
- **CSS3** - Modern CSS with custom properties
- **Vite** - Fast build tool (no build step needed for development)
- **Supabase JS SDK** - CDN version for client-side

### Database
- **Supabase PostgreSQL** - Database
- **Supabase Auth** - Authentication
- **Row Level Security** - Data protection

## Features

### User Authentication
- Sign up/Login with email and password
- Secure authentication via Supabase
- User metadata stored (name)

### Dashboard
- Welcome message with user name
- Statistics (completed lessons, quizzes, average score)
- Navigation to lessons and profile
- Achievement badges

### Lessons
- Load all available lessons from Supabase
- Display lesson content with:
  - Embedded YouTube video
  - Story text for reading
  - Vocabulary words (6-10 per lesson)
- Text-to-Speech for vocabulary (browser API)
- Speech Recognition for pronunciation practice (Web Speech API)

### Quiz System
- Auto-generated multiple choice questions
- Based on lesson vocabulary
- Real-time grading
- Progress tracking
- Visual feedback and score display

### Profile
- User statistics
- Quiz history with scores
- Achievement badges
- Progress tracking

## File-by-File Breakdown

### app.js
Main application controller that manages:
- Page routing (login, dashboard, lessons, quiz, profile)
- User authentication state
- Page transitions

### auth.js
Authentication functions using Supabase Auth:
- `login(email, password)` - User login
- `signup(name, email, password)` - New user registration
- `logout()` - User logout
- `getCurrentUser()` - Get current authenticated user

### lessons.js
Lesson management:
- `loadLessons(callback)` - Fetch from Supabase and render
- `setupVocabularyInteraction(lesson)` - Add listeners for speak/listen buttons
- `getUserStats(user)` - Get user progress stats
- Text-to-Speech implementation
- Speech Recognition implementation

### quiz.js
Quiz functionality:
- `generateQuestions(lesson)` - Create multiple choice questions from vocabulary
- `initializeQuiz(lesson, callback)` - Setup quiz
- `saveQuizResults(user, lesson, answers)` - Save to Supabase

### profile.js
Profile data loading:
- `loadProfileData(user)` - Load and render user stats and quiz history
- Badge system based on completed lessons

### ui.js
UI rendering functions (pure HTML templates):
- `createLoginPage()` - Login form
- `createSignupPage()` - Signup form
- `createDashboardPage()` - Dashboard with stats
- `createLessonListPage()` - Lesson list
- `createLessonDetailPage(lesson)` - Lesson content
- `createQuizPage(lesson)` - Quiz interface
- `createProfilePage(user)` - User profile

### supabase.js
Supabase client initialization:
- Creates and exports Supabase client
- Uses environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)

### index.css
Pure CSS styling:
- CSS custom properties (--primary, --secondary, etc.)
- Responsive grid layouts
- Card designs
- Button styles
- Animation keyframes
- No preprocessor needed

## CSS Approach

The project uses **pure CSS** instead of Tailwind:
- CSS custom properties for theming
- Utility-like classes (e.g., `.btn`, `.card`, `.grid`)
- Media queries for responsive design
- Flexbox and Grid layouts
- No build step for CSS

## How to Use

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

## Environment Variables

Create `.env` file with:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Database Schema

### lessons
- id (uuid)
- title (text)
- video_url (text)
- story_text (text)
- vocabulary (jsonb array)
- order_number (integer)

### quiz_results
- id (uuid)
- user_id (uuid)
- lesson_id (uuid)
- score (integer)
- total_questions (integer)
- answers (jsonb)

### user_progress
- id (uuid)
- user_id (uuid)
- lesson_id (uuid)
- completed (boolean)
- completed_at (timestamp)

## Key JavaScript Patterns Used

### No Frameworks
- Direct DOM manipulation with `getElementById`, `querySelector`
- Event listeners for clicks and form submission
- Template literals for HTML generation
- Async/await for Supabase calls

### Module-Based Architecture
- ES6 imports/exports
- Each file handles one responsibility
- Global window functions for onclick handlers
- Clean separation of concerns

### Functional Programming
- Pure functions for data transformation
- No class-based components
- Higher-order functions for callbacks

## Browser APIs Used

### Web Speech API
- `SpeechSynthesis` - Text-to-speech
- `SpeechRecognition` - Voice recognition

### Fetch API
- Supabase client uses fetch internally

### localStorage (optional)
- Could be added for offline progress backup

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support (except Speech Recognition)
- Safari: Full support (except Speech Recognition)

## Deployment

### Vercel
```bash
vercel
```

### GitHub Pages
```bash
npm run build
npx gh-pages -d dist
```

### Traditional Hosting
Copy `dist` folder contents to any web server

## No Build Step Required for Development

The beauty of Vite with vanilla JS:
- Import ES6 modules directly
- Hot Module Replacement (HMR) works automatically
- No TypeScript compilation
- Fast development server

## Tips for Development

1. **Adding New Pages**: Create function in `ui.js`, add case in `app.js`
2. **Adding API Calls**: Use functions in `supabase.js`
3. **Styling**: Add to `index.css` following existing patterns
4. **Event Handling**: Use global window functions and event listeners

## Performance

- No framework overhead
- ~9KB gzipped (JS + CSS combined)
- Fast page load and transitions
- Minimal dependencies

## What's Missing from the React Version

- TypeScript safety (but no build step delay)
- JSX syntax (but HTML templates are more readable)
- React hooks (but simpler state management)
- Component reusability (but functions work fine)

## What's Better About Vanilla JS

- Smaller bundle size
- No framework learning curve
- More direct control
- Faster development server
- Less dependencies to manage
- Easier to customize
