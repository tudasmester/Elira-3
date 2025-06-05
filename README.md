# Elira - Hungarian Online Education Platform

## 🎯 Project Overview

Elira is a sophisticated Hungarian online education platform that delivers personalized, modular learning experiences through advanced course and exam management technologies. The platform provides comprehensive administrative tools with enhanced quiz and exam creation capabilities, featuring a robust system that supports complex question management, exam configuration, and detailed validation processes.

## 🏗️ Technical Architecture

### Tech Stack
- **Frontend**: React.js with TypeScript, Tailwind CSS
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based authentication system
- **State Management**: React Query (@tanstack/react-query)
- **UI Components**: shadcn/ui components
- **Routing**: Wouter for client-side routing
- **Build Tool**: Vite

### Project Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── services/      # API service layer
├── server/                # Backend Express application
│   ├── auth-working.ts    # Authentication system
│   ├── admin-routes.ts    # Admin panel routes
│   ├── quiz-routes.ts     # Quiz management routes
│   ├── storage.ts         # Database operations
│   └── routes.ts          # Main API routes
├── shared/                # Shared types and schemas
│   └── schema.ts          # Database schema definitions
└── public/                # Static assets
```

## 🔐 Authentication System

The platform uses a comprehensive JWT-based authentication system with the following features:

### Core Authentication Functions
- User registration and login
- Password hashing with bcrypt
- JWT token generation and verification
- Session management
- Admin role verification

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/user` - Get current user
- `POST /api/auth/logout` - User logout
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

### Admin System
- Admin role verification through `isAdmin` middleware
- Admin setup endpoint with secret key protection
- Comprehensive admin panel for course management

## 📚 Course Management System

### Course Structure
The platform follows a hierarchical structure:
1. **Courses** - Top-level educational content
2. **Modules** - Sections within courses
3. **Lessons** - Individual learning units
4. **Quizzes** - Integrated assessment tools

### Course Features
- Course creation and editing
- Module and lesson management
- Content highlighting and publishing
- Course analytics and statistics
- Enrollment tracking

### Admin Course Management
- Full CRUD operations for courses
- Module and lesson management
- Quiz integration within lessons
- Content publishing controls
- Course highlighting for trending content

## 🎯 Quiz System Architecture

### Integrated Quiz Approach
Unlike standalone quiz builders, Elira integrates quiz functionality directly into the course content workflow:

- **Embedded in Lessons**: Quizzes are created and managed within the lesson editor
- **Course-Centric**: All quiz content flows through the course building process
- **Contextual Creation**: Quizzes are created as part of lesson content, not separate features

### Quiz Components
1. **QuizManager**: Integrated component within lesson editor for quiz management
2. **Question Types**: Multiple choice, true/false, short text, assignments, matching, ordering
3. **Quiz Configuration**: Time limits, passing scores, attempt limits, settings
4. **Question Options**: Flexible option management for multiple choice questions

### Quiz Database Schema
```typescript
// Quizzes table
quizzes: {
  id: number
  lessonId: number
  title: string
  description: string
  instructions: string
  timeLimit: number
  passingScore: number
  maxAttempts: number
  status: string
  isActive: boolean
  showCorrectAnswers: boolean
  shuffleQuestions: boolean
}

// Quiz questions
quizQuestions: {
  id: number
  quizId: number
  questionText: string
  questionType: string
  points: number
  orderIndex: number
  settings: Json
}

// Question options
questionOptions: {
  id: number
  questionId: number
  optionText: string
  isCorrect: boolean
  order: number
}
```

## 🗄️ Database Schema

### Core Tables

#### Users Table
```sql
users (
  id VARCHAR PRIMARY KEY,
  email VARCHAR UNIQUE,
  password VARCHAR,
  phone VARCHAR,
  firstName VARCHAR,
  lastName VARCHAR,
  profileImageUrl VARCHAR,
  isEmailVerified INTEGER DEFAULT 0,
  isPhoneVerified INTEGER DEFAULT 0,
  subscriptionType VARCHAR DEFAULT 'free',
  subscriptionStatus VARCHAR DEFAULT 'inactive',
  isAdmin INTEGER DEFAULT 0,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
)
```

#### Courses Table
```sql
courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  shortDescription VARCHAR,
  imageUrl VARCHAR,
  trailerVideoUrl VARCHAR,
  universityId INTEGER,
  level VARCHAR,
  category VARCHAR,
  duration VARCHAR,
  price DECIMAL,
  originalPrice DECIMAL,
  isHighlighted INTEGER DEFAULT 0,
  isPublished INTEGER DEFAULT 0,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
)
```

#### Modules Table
```sql
modules (
  id SERIAL PRIMARY KEY,
  courseId INTEGER REFERENCES courses(id),
  title VARCHAR NOT NULL,
  description TEXT,
  orderIndex INTEGER DEFAULT 0,
  status VARCHAR DEFAULT 'piszkozat',
  createdAt TIMESTAMP DEFAULT NOW()
)
```

#### Lessons Table
```sql
lessons (
  id SERIAL PRIMARY KEY,
  moduleId INTEGER REFERENCES modules(id),
  title VARCHAR NOT NULL,
  description TEXT,
  content TEXT,
  type VARCHAR DEFAULT 'szoveg',
  duration INTEGER DEFAULT 0,
  orderIndex INTEGER DEFAULT 0,
  videoUrl VARCHAR,
  fileUrl VARCHAR
)
```

## 🔧 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/user` - Get current user data
- `POST /api/auth/logout` - User logout
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change user password

### Admin Routes
- `GET /api/admin/courses` - Get all courses for admin
- `POST /api/admin/courses` - Create new course
- `PUT /api/admin/courses/:id` - Update course
- `DELETE /api/admin/courses/:id` - Delete course
- `GET /api/admin/courses/:id/modules` - Get course modules
- `POST /api/courses/:id/modules` - Create new module
- `POST /api/modules/:id/lessons` - Create new lesson

### Quiz Routes
- `GET /api/lessons/:lessonId/quizzes` - Get quizzes for lesson
- `POST /api/quizzes` - Create new quiz
- `PUT /api/quizzes/:id` - Update quiz
- `DELETE /api/quizzes/:id` - Delete quiz
- `GET /api/quizzes/:quizId/questions` - Get quiz questions
- `POST /api/quiz-questions` - Create new question
- `PUT /api/quiz-questions/:id` - Update question
- `DELETE /api/quiz-questions/:id` - Delete question
- `POST /api/questions/:questionId/options` - Create question options
- `GET /api/quizzes/:id/full` - Get complete quiz with questions and options

### Course Routes
- `GET /api/courses` - Get published courses
- `GET /api/courses/trending` - Get highlighted/trending courses
- `GET /api/courses/:id` - Get single course details
- `POST /api/courses/:id/enroll` - Enroll in course

## 🎨 Frontend Architecture

### Component Structure
- **Layout Component**: Main application layout with navigation
- **AdminGuard**: Route protection for admin-only pages
- **CourseOutlineBuilder**: Main course creation and editing interface
- **LessonEditor**: Integrated lesson and quiz management
- **QuizManager**: Quiz creation and management within lessons

### State Management
- React Query for server state management
- Local component state for UI interactions
- Context API for global app state (auth, theme)

### UI/UX Design
- Hungarian language interface
- LearnWorlds-inspired design aesthetic
- Responsive design for all screen sizes
- Tailwind CSS for consistent styling
- shadcn/ui component library

## 🔄 Development Workflow

### Running the Application
```bash
npm run dev  # Starts both frontend and backend
```

### Database Operations
```bash
npm run db:push     # Push schema changes
npm run db:studio   # Open Drizzle Studio
```

### Environment Variables
```env
DATABASE_URL=postgresql://...
SESSION_SECRET=your-session-secret
ADMIN_SETUP_SECRET=your-admin-secret
OPENAI_API_KEY=your-openai-key (optional)
```

## 🛡️ Security Features

### Authentication Security
- Password hashing with bcrypt (12 rounds)
- JWT token authentication
- Token blacklisting for logout
- Admin role verification
- Session management

### API Security
- Request validation with Zod schemas
- Admin middleware protection
- Input sanitization
- Error handling and logging

## 📊 Content Management

### Content Flow
1. **Admin Creates Course**: Basic course information and structure
2. **Module Creation**: Organize content into logical sections
3. **Lesson Creation**: Individual learning units with various content types
4. **Quiz Integration**: Embedded assessment tools within lessons
5. **Publishing**: Content review and publication workflow

### Content Types
- **Text Lessons**: Rich text content with formatting
- **Video Lessons**: Video content with player integration
- **Quiz Lessons**: Assessment and evaluation tools
- **File Lessons**: Downloadable resources and materials

## 🚀 Deployment & Production

### Build Process
- Vite builds optimized production assets
- TypeScript compilation with strict type checking
- Asset optimization and bundling

### Production Considerations
- PostgreSQL database with connection pooling
- JWT token management and refresh
- Error logging and monitoring
- Performance optimization

## 🔮 Future Enhancements

### Planned Features
- Student progress tracking
- Certificate generation
- Payment integration with Stripe
- Video streaming optimization
- Mobile app development
- Advanced analytics dashboard

### Technical Improvements
- Caching layer implementation
- Real-time notifications
- WebSocket integration for live features
- Advanced quiz question types
- Bulk content import/export

## 📝 Development Notes

### Key Design Decisions
1. **Integrated Quiz Approach**: Quizzes are embedded within course content workflow rather than standalone features
2. **Hungarian Language**: All UI text and content in Hungarian
3. **Admin-Centric**: Strong focus on administrative controls and content management
4. **Modular Architecture**: Clean separation between frontend/backend with shared types

### Code Quality
- TypeScript for type safety
- ESLint and Prettier for code formatting
- Comprehensive error handling
- Database query optimization
- Component reusability and maintainability

This documentation provides a complete overview of the Elira platform architecture, functionality, and development approach for comprehensive understanding and future development.