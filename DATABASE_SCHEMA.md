# Database Schema - Elira Platform

## Schema Overview

The Elira platform uses PostgreSQL with Drizzle ORM for type-safe database operations. The schema is designed to support a comprehensive online education platform with course management, user authentication, quiz systems, and learning progress tracking.

## Core Tables

### Users Table
Primary user authentication and profile management.

```sql
CREATE TABLE users (
  id VARCHAR PRIMARY KEY,
  email VARCHAR UNIQUE,
  password VARCHAR,
  phone VARCHAR,
  firstName VARCHAR,
  lastName VARCHAR,
  profileImageUrl VARCHAR,
  isEmailVerified INTEGER DEFAULT 0,
  isPhoneVerified INTEGER DEFAULT 0,
  emailVerificationToken VARCHAR,
  phoneVerificationCode VARCHAR,
  phoneVerificationExpiry TIMESTAMP,
  passwordResetToken VARCHAR,
  passwordResetExpiry TIMESTAMP,
  googleId VARCHAR,
  facebookId VARCHAR,
  appleId VARCHAR,
  subscriptionType VARCHAR DEFAULT 'free',
  subscriptionStatus VARCHAR DEFAULT 'inactive',
  stripeCustomerId VARCHAR,
  stripeSubscriptionId VARCHAR,
  subscriptionEndDate TIMESTAMP,
  interests TEXT,
  goals TEXT,
  experienceLevel VARCHAR,
  preferredLearningStyle VARCHAR,
  isOnboardingComplete INTEGER DEFAULT 0,
  isAdmin INTEGER DEFAULT 0,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

**Key Fields:**
- `id`: UUID string as primary key
- `isAdmin`: Admin role flag (0 = user, 1 = admin)
- `subscriptionType`: 'free', 'premium', 'enterprise'
- `subscriptionStatus`: 'active', 'inactive', 'expired'

### Universities Table
Educational institutions for course categorization.

```sql
CREATE TABLE universities (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  logoUrl VARCHAR,
  website VARCHAR,
  location VARCHAR,
  isActive INTEGER DEFAULT 1,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

### Courses Table
Main course content and metadata.

```sql
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  shortDescription VARCHAR,
  imageUrl VARCHAR,
  trailerVideoUrl VARCHAR,
  universityId INTEGER REFERENCES universities(id),
  level VARCHAR, -- 'kezdő', 'haladó', 'expert'
  category VARCHAR, -- 'programozás', 'marketing', 'üzlet', 'design'
  duration VARCHAR,
  price DECIMAL(10,2),
  originalPrice DECIMAL(10,2),
  tags TEXT[], -- Array of tags
  prerequisites TEXT,
  learningOutcomes TEXT[],
  targetAudience TEXT,
  language VARCHAR DEFAULT 'hu',
  difficulty INTEGER, -- 1-5 scale
  estimatedHours INTEGER,
  certificateAvailable INTEGER DEFAULT 0,
  isHighlighted INTEGER DEFAULT 0, -- Featured/trending courses
  isPublished INTEGER DEFAULT 0, -- Published status
  publishedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

**Key Fields:**
- `isHighlighted`: Controls trending/featured status
- `isPublished`: Controls public visibility
- `tags`: PostgreSQL array for flexible tagging
- `learningOutcomes`: Array of expected learning outcomes

### Modules Table
Course sections and organization.

```sql
CREATE TABLE modules (
  id SERIAL PRIMARY KEY,
  courseId INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  orderIndex INTEGER DEFAULT 0,
  status VARCHAR DEFAULT 'piszkozat', -- 'piszkozat', 'aktív', 'hamarosan', 'ingyenes', 'fizetos'
  createdAt TIMESTAMP DEFAULT NOW()
);
```

**Status Values:**
- `piszkozat`: Draft/unpublished
- `aktív`: Active and available
- `hamarosan`: Coming soon
- `ingyenes`: Free access
- `fizetos`: Paid access required

### Lessons Table
Individual learning units within modules.

```sql
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  moduleId INTEGER REFERENCES modules(id) ON DELETE CASCADE,
  title VARCHAR NOT NULL,
  description TEXT,
  content TEXT,
  type VARCHAR DEFAULT 'szöveg', -- 'szöveg', 'videó', 'kvíz', 'fájl'
  duration INTEGER DEFAULT 0, -- Duration in minutes
  orderIndex INTEGER DEFAULT 0,
  videoUrl VARCHAR,
  fileUrl VARCHAR,
  isPreview INTEGER DEFAULT 0, -- Free preview lesson
  createdAt TIMESTAMP DEFAULT NOW()
);
```

**Lesson Types:**
- `szöveg`: Text-based content
- `videó`: Video lessons
- `kvíz`: Quiz/assessment
- `fájl`: File/document downloads

## Quiz System Tables

### Quizzes Table
Quiz configuration and settings.

```sql
CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY,
  lessonId INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  courseId INTEGER REFERENCES courses(id),
  title VARCHAR NOT NULL,
  description TEXT,
  instructions TEXT,
  timeLimit INTEGER, -- Time limit in seconds
  passingScore INTEGER DEFAULT 70, -- Passing percentage
  maxAttempts INTEGER DEFAULT 3,
  status VARCHAR DEFAULT 'active',
  isActive INTEGER DEFAULT 1,
  showCorrectAnswers INTEGER DEFAULT 1,
  shuffleQuestions INTEGER DEFAULT 0,
  allowReview INTEGER DEFAULT 1,
  showResults INTEGER DEFAULT 1,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Quiz Questions Table
Individual questions within quizzes.

```sql
CREATE TABLE quizQuestions (
  id SERIAL PRIMARY KEY,
  quizId INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
  questionText TEXT NOT NULL,
  questionType VARCHAR NOT NULL, -- 'multiple_choice', 'true_false', 'short_text', 'long_text', 'file_upload'
  points INTEGER DEFAULT 1,
  orderIndex INTEGER DEFAULT 0,
  settings JSON, -- Question-specific settings
  explanation TEXT, -- Explanation for correct answer
  videoUrl VARCHAR,
  imageUrl VARCHAR,
  isRequired INTEGER DEFAULT 1,
  hideFromViewer INTEGER DEFAULT 0,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

**Question Types:**
- `multiple_choice`: Multiple choice with options
- `true_false`: True/false questions
- `short_text`: Short text input
- `long_text`: Essay/long form text
- `file_upload`: File submission

### Question Options Table
Options for multiple choice questions.

```sql
CREATE TABLE questionOptions (
  id SERIAL PRIMARY KEY,
  questionId INTEGER REFERENCES quizQuestions(id) ON DELETE CASCADE,
  optionText TEXT NOT NULL,
  isCorrect INTEGER DEFAULT 0,
  order INTEGER DEFAULT 0,
  explanation TEXT,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

## User Progress Tables

### Enrollments Table
Course enrollment tracking.

```sql
CREATE TABLE enrollments (
  id SERIAL PRIMARY KEY,
  userId VARCHAR REFERENCES users(id) ON DELETE CASCADE,
  courseId INTEGER REFERENCES courses(id) ON DELETE CASCADE,
  enrolledAt TIMESTAMP DEFAULT NOW(),
  completedAt TIMESTAMP,
  status VARCHAR DEFAULT 'active', -- 'active', 'completed', 'dropped', 'suspended'
  progress INTEGER DEFAULT 0, -- Completion percentage 0-100
  certificateIssued INTEGER DEFAULT 0,
  certificateUrl VARCHAR,
  lastAccessedAt TIMESTAMP DEFAULT NOW(),
  UNIQUE(userId, courseId)
);
```

### Lesson Progress Table
Individual lesson completion tracking.

```sql
CREATE TABLE lessonProgress (
  id SERIAL PRIMARY KEY,
  userId VARCHAR REFERENCES users(id) ON DELETE CASCADE,
  lessonId INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
  completedAt TIMESTAMP,
  timeSpent INTEGER DEFAULT 0, -- Time spent in seconds
  isCompleted INTEGER DEFAULT 0,
  lastAccessedAt TIMESTAMP DEFAULT NOW(),
  UNIQUE(userId, lessonId)
);
```

### Quiz Attempts Table
Quiz submission and scoring history.

```sql
CREATE TABLE quizAttempts (
  id SERIAL PRIMARY KEY,
  userId VARCHAR REFERENCES users(id) ON DELETE CASCADE,
  quizId INTEGER REFERENCES quizzes(id) ON DELETE CASCADE,
  attemptNumber INTEGER DEFAULT 1,
  startedAt TIMESTAMP DEFAULT NOW(),
  submittedAt TIMESTAMP,
  score INTEGER, -- Score as percentage
  totalPoints INTEGER,
  earnedPoints INTEGER,
  passed INTEGER DEFAULT 0,
  timeSpent INTEGER, -- Time spent in seconds
  answers JSON, -- User's answers
  isCompleted INTEGER DEFAULT 0,
  reviewedAt TIMESTAMP
);
```

## System Tables

### Subscribers Table
Newsletter and marketing subscriptions.

```sql
CREATE TABLE subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  subscribedAt TIMESTAMP DEFAULT NOW(),
  unsubscribedAt TIMESTAMP,
  isActive INTEGER DEFAULT 1,
  source VARCHAR, -- Source of subscription
  preferences JSON -- Email preferences
);
```

### System Logs Table
Application logging and audit trail.

```sql
CREATE TABLE systemLogs (
  id SERIAL PRIMARY KEY,
  userId VARCHAR REFERENCES users(id),
  action VARCHAR NOT NULL,
  entity VARCHAR, -- 'course', 'quiz', 'user', etc.
  entityId VARCHAR,
  details JSON,
  ipAddress VARCHAR,
  userAgent TEXT,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

## Indexes and Performance

### Primary Indexes
```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_admin ON users(isAdmin);

-- Course queries
CREATE INDEX idx_courses_published ON courses(isPublished);
CREATE INDEX idx_courses_highlighted ON courses(isHighlighted);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_university ON courses(universityId);

-- Module and lesson ordering
CREATE INDEX idx_modules_course_order ON modules(courseId, orderIndex);
CREATE INDEX idx_lessons_module_order ON lessons(moduleId, orderIndex);

-- Quiz relationships
CREATE INDEX idx_quizzes_lesson ON quizzes(lessonId);
CREATE INDEX idx_quiz_questions_quiz_order ON quizQuestions(quizId, orderIndex);
CREATE INDEX idx_question_options_question ON questionOptions(questionId, order);

-- User progress tracking
CREATE INDEX idx_enrollments_user ON enrollments(userId);
CREATE INDEX idx_enrollments_course ON enrollments(courseId);
CREATE INDEX idx_lesson_progress_user ON lessonProgress(userId);
CREATE INDEX idx_quiz_attempts_user_quiz ON quizAttempts(userId, quizId);
```

### Composite Indexes for Performance
```sql
-- Course discovery
CREATE INDEX idx_courses_published_highlighted ON courses(isPublished, isHighlighted);
CREATE INDEX idx_courses_category_level ON courses(category, level) WHERE isPublished = 1;

-- User progress queries
CREATE INDEX idx_enrollments_user_status ON enrollments(userId, status);
CREATE INDEX idx_lesson_progress_user_completed ON lessonProgress(userId, isCompleted);
```

## Foreign Key Constraints

```sql
-- Course hierarchy
ALTER TABLE modules ADD CONSTRAINT fk_modules_course 
  FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE;

ALTER TABLE lessons ADD CONSTRAINT fk_lessons_module 
  FOREIGN KEY (moduleId) REFERENCES modules(id) ON DELETE CASCADE;

-- Quiz relationships
ALTER TABLE quizzes ADD CONSTRAINT fk_quizzes_lesson 
  FOREIGN KEY (lessonId) REFERENCES lessons(id) ON DELETE CASCADE;

ALTER TABLE quizQuestions ADD CONSTRAINT fk_questions_quiz 
  FOREIGN KEY (quizId) REFERENCES quizzes(id) ON DELETE CASCADE;

ALTER TABLE questionOptions ADD CONSTRAINT fk_options_question 
  FOREIGN KEY (questionId) REFERENCES quizQuestions(id) ON DELETE CASCADE;

-- User progress
ALTER TABLE enrollments ADD CONSTRAINT fk_enrollments_user 
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE enrollments ADD CONSTRAINT fk_enrollments_course 
  FOREIGN KEY (courseId) REFERENCES courses(id) ON DELETE CASCADE;
```

## Data Validation Rules

### User Data Validation
```sql
ALTER TABLE users ADD CONSTRAINT chk_email_format 
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE users ADD CONSTRAINT chk_admin_flag 
  CHECK (isAdmin IN (0, 1));

ALTER TABLE users ADD CONSTRAINT chk_subscription_type 
  CHECK (subscriptionType IN ('free', 'premium', 'enterprise'));
```

### Course Data Validation
```sql
ALTER TABLE courses ADD CONSTRAINT chk_price_positive 
  CHECK (price >= 0);

ALTER TABLE courses ADD CONSTRAINT chk_difficulty_range 
  CHECK (difficulty BETWEEN 1 AND 5);

ALTER TABLE courses ADD CONSTRAINT chk_published_flag 
  CHECK (isPublished IN (0, 1));
```

### Quiz Data Validation
```sql
ALTER TABLE quizzes ADD CONSTRAINT chk_passing_score_range 
  CHECK (passingScore BETWEEN 0 AND 100);

ALTER TABLE quizzes ADD CONSTRAINT chk_max_attempts_positive 
  CHECK (maxAttempts > 0);

ALTER TABLE quizAttempts ADD CONSTRAINT chk_score_range 
  CHECK (score BETWEEN 0 AND 100);
```

## Triggers and Procedures

### Automatic Timestamp Updates
```sql
-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedAt = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_users_timestamp 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_courses_timestamp 
  BEFORE UPDATE ON courses 
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
```

### Course Progress Calculation
```sql
-- Calculate course completion percentage
CREATE OR REPLACE FUNCTION calculate_course_progress(user_id VARCHAR, course_id INTEGER)
RETURNS INTEGER AS $$
DECLARE
  total_lessons INTEGER;
  completed_lessons INTEGER;
  progress_percentage INTEGER;
BEGIN
  -- Count total lessons in course
  SELECT COUNT(l.id) INTO total_lessons
  FROM lessons l
  JOIN modules m ON l.moduleId = m.id
  WHERE m.courseId = course_id;
  
  -- Count completed lessons by user
  SELECT COUNT(lp.id) INTO completed_lessons
  FROM lessonProgress lp
  JOIN lessons l ON lp.lessonId = l.id
  JOIN modules m ON l.moduleId = m.id
  WHERE m.courseId = course_id 
    AND lp.userId = user_id 
    AND lp.isCompleted = 1;
  
  -- Calculate percentage
  IF total_lessons > 0 THEN
    progress_percentage := (completed_lessons * 100) / total_lessons;
  ELSE
    progress_percentage := 0;
  END IF;
  
  -- Update enrollment progress
  UPDATE enrollments 
  SET progress = progress_percentage
  WHERE userId = user_id AND courseId = course_id;
  
  RETURN progress_percentage;
END;
$$ LANGUAGE plpgsql;
```

## Sample Data Types

### TypeScript Schema Definitions
```typescript
// Drizzle schema types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = typeof courses.$inferInsert;

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = typeof quizzes.$inferInsert;

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = typeof quizQuestions.$inferInsert;
```

This database schema provides a robust foundation for the Elira platform, supporting complex educational workflows, user progress tracking, and comprehensive quiz systems while maintaining data integrity and performance.