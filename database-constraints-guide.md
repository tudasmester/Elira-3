# Database Data Types and Constraints Guide for Elira E-Learning Platform

## Core Data Type Recommendations

### **User Management Tables**

#### Users Table - Enhanced with Constraints
```sql
users (
  -- Identity & Authentication
  id: varchar(36) PRIMARY KEY,                    -- UUID format
  email: varchar(255) UNIQUE NOT NULL,            -- Email addresses
  password: varchar(255),                         -- Hashed passwords (bcrypt)
  phone: varchar(20) UNIQUE,                      -- International format: +36301234567
  
  -- Personal Information
  firstName: varchar(100) NOT NULL,               -- Required for personalization
  lastName: varchar(100) NOT NULL,                -- Required for certificates
  profileImageUrl: varchar(500),                  -- Full URL paths
  
  -- Verification Status (using smallint for efficiency)
  isEmailVerified: smallint DEFAULT 0 CHECK (isEmailVerified IN (0,1)),
  isPhoneVerified: smallint DEFAULT 0 CHECK (isPhoneVerified IN (0,1)),
  emailVerificationToken: varchar(255),
  phoneVerificationCode: varchar(6) CHECK (phoneVerificationCode ~ '^[0-9]{6}$'),
  phoneVerificationExpiry: timestamp,
  
  -- Password Reset
  passwordResetToken: varchar(255),
  passwordResetExpiry: timestamp,
  
  -- OAuth Integration
  googleId: varchar(100) UNIQUE,
  facebookId: varchar(100) UNIQUE,
  appleId: varchar(100) UNIQUE,
  
  -- Subscription Management
  subscriptionType: varchar(20) DEFAULT 'free' 
    CHECK (subscriptionType IN ('free', 'premium', 'enterprise')),
  subscriptionStatus: varchar(20) DEFAULT 'inactive'
    CHECK (subscriptionStatus IN ('active', 'inactive', 'cancelled', 'expired')),
  stripeCustomerId: varchar(100),
  stripeSubscriptionId: varchar(100),
  subscriptionEndDate: timestamp,
  
  -- Learning Preferences (JSON for flexibility)
  interests: jsonb,                                -- Array of interest categories
  goals: jsonb,                                    -- Array of learning goals
  experienceLevel: varchar(20) 
    CHECK (experienceLevel IN ('beginner', 'intermediate', 'advanced')),
  preferredLearningStyle: varchar(20)
    CHECK (preferredLearningStyle IN ('visual', 'auditory', 'kinesthetic', 'reading')),
  isOnboardingComplete: smallint DEFAULT 0 CHECK (isOnboardingComplete IN (0,1)),
  
  -- Administrative
  isAdmin: smallint DEFAULT 0 CHECK (isAdmin IN (0,1)),
  
  -- Timestamps
  createdAt: timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt: timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

#### Constraints for Users Table
```sql
-- Composite constraints
CONSTRAINT valid_verification_token 
  CHECK (emailVerificationToken IS NULL OR length(emailVerificationToken) >= 32);

CONSTRAINT valid_phone_format 
  CHECK (phone IS NULL OR phone ~ '^\+[1-9]\d{1,14}$');

CONSTRAINT password_reset_expiry_logic
  CHECK (passwordResetToken IS NULL OR passwordResetExpiry > CURRENT_TIMESTAMP);

-- Indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription ON users(subscriptionType, subscriptionStatus);
CREATE INDEX idx_users_verification ON users(isEmailVerified, isPhoneVerified);
```

### **Course Management Tables**

#### Universities Table
```sql
universities (
  id: serial PRIMARY KEY,
  name: varchar(255) NOT NULL UNIQUE,             -- University names must be unique
  description: text NOT NULL,                     -- Detailed description
  logoUrl: varchar(500) NOT NULL,                 -- Logo image URL
  country: varchar(100) NOT NULL,                 -- ISO country names
  websiteUrl: varchar(500),                       -- Official website
  establishedYear: smallint CHECK (establishedYear >= 1000 AND establishedYear <= EXTRACT(YEAR FROM CURRENT_DATE)),
  ranking: smallint CHECK (ranking > 0),          -- World ranking if available
  isActive: smallint DEFAULT 1 CHECK (isActive IN (0,1)),
  createdAt: timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

#### Courses Table - Enhanced
```sql
courses (
  id: serial PRIMARY KEY,
  title: varchar(255) NOT NULL,                   -- Course title
  description: text NOT NULL,                     -- Full description
  shortDescription: varchar(500),                 -- Brief summary for listings
  imageUrl: varchar(500) NOT NULL,                -- Course thumbnail
  trailerVideoUrl: varchar(500),                  -- Preview video
  
  -- Relationships
  universityId: integer NOT NULL REFERENCES universities(id) ON DELETE RESTRICT,
  
  -- Course Properties
  isFree: smallint DEFAULT 0 CHECK (isFree IN (0,1)),
  level: varchar(20) NOT NULL 
    CHECK (level IN ('beginner', 'intermediate', 'advanced', 'expert')),
  category: varchar(50) NOT NULL,                 -- Programming, Design, Business, etc.
  language: varchar(50) DEFAULT 'Hungarian' NOT NULL,
  
  -- Duration and Effort
  duration: varchar(50),                          -- "6 weeks", "3 months"
  estimatedHours: smallint CHECK (estimatedHours > 0),
  difficultyRating: decimal(2,1) CHECK (difficultyRating >= 1.0 AND difficultyRating <= 5.0),
  
  -- Content Information
  prerequisites: text,                            -- What students need to know
  learningOutcomes: text,                         -- What students will learn
  
  -- Instructor Information
  instructorName: varchar(255),
  instructorBio: text,
  instructorImageUrl: varchar(500),
  
  -- Pricing and Metrics
  price: integer DEFAULT 0 CHECK (price >= 0),   -- Price in Hungarian Forints
  enrollmentCount: integer DEFAULT 0 CHECK (enrollmentCount >= 0),
  rating: decimal(3,2) CHECK (rating >= 0.0 AND rating <= 5.0),
  reviewCount: integer DEFAULT 0 CHECK (reviewCount >= 0),
  
  -- Status and Publishing
  isPublished: smallint DEFAULT 0 CHECK (isPublished IN (0,1)),
  publishedAt: timestamp,
  
  -- Timestamps
  createdAt: timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  updatedAt: timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

### **Learning Management Tables**

#### Enrollments Table - Junction Table with Rich Data
```sql
enrollments (
  id: serial PRIMARY KEY,
  userId: varchar(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  courseId: integer NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
  
  -- Enrollment Details
  enrolledAt: timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  progress: smallint DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status: varchar(20) DEFAULT 'active' 
    CHECK (status IN ('active', 'paused', 'completed', 'dropped', 'expired')),
  
  -- Activity Tracking
  lastAccessedAt: timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  totalTimeSpent: integer DEFAULT 0 CHECK (totalTimeSpent >= 0), -- minutes
  completedAt: timestamp,
  certificateIssued: smallint DEFAULT 0 CHECK (certificateIssued IN (0,1)),
  
  -- Payment Information
  paymentMethod: varchar(20) CHECK (paymentMethod IN ('free', 'stripe', 'paypal', 'bank_transfer')),
  amountPaid: integer DEFAULT 0 CHECK (amountPaid >= 0),
  
  -- Unique constraint to prevent duplicate enrollments
  UNIQUE(userId, courseId)
);
```

#### Lessons Table - Content Units
```sql
lessons (
  id: serial PRIMARY KEY,
  moduleId: integer NOT NULL REFERENCES courseModules(id) ON DELETE CASCADE,
  
  -- Content Information
  title: varchar(255) NOT NULL,
  description: text NOT NULL,
  content: text NOT NULL,                         -- Lesson content/transcript
  
  -- Media
  videoUrl: varchar(500),                         -- Video content URL
  duration: integer NOT NULL CHECK (duration > 0), -- Duration in minutes
  
  -- Organization
  orderIndex: smallint NOT NULL CHECK (orderIndex > 0),
  
  -- Content Type
  lessonType: varchar(20) DEFAULT 'video' 
    CHECK (lessonType IN ('video', 'text', 'interactive', 'assignment', 'quiz')),
  
  -- Access Control
  isPreview: smallint DEFAULT 0 CHECK (isPreview IN (0,1)),
  isPremium: smallint DEFAULT 0 CHECK (isPremium IN (0,1)),
  
  createdAt: timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  
  -- Ensure unique ordering within module
  UNIQUE(moduleId, orderIndex)
);
```

### **Assessment Tables**

#### Quizzes Table
```sql
quizzes (
  id: serial PRIMARY KEY,
  lessonId: integer NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  
  -- Quiz Information
  title: varchar(255) NOT NULL,
  description: text,
  instructions: text,                             -- Quiz instructions
  
  -- Scoring
  passingScore: smallint NOT NULL CHECK (passingScore >= 0 AND passingScore <= 100),
  maxAttempts: smallint DEFAULT 3 CHECK (maxAttempts > 0),
  timeLimit: integer CHECK (timeLimit > 0),      -- Time limit in minutes
  
  -- Quiz Settings
  shuffleQuestions: smallint DEFAULT 0 CHECK (shuffleQuestions IN (0,1)),
  shuffleAnswers: smallint DEFAULT 0 CHECK (shuffleAnswers IN (0,1)),
  showCorrectAnswers: smallint DEFAULT 1 CHECK (showCorrectAnswers IN (0,1)),
  
  -- Status
  isActive: smallint DEFAULT 1 CHECK (isActive IN (0,1)),
  
  createdAt: timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

#### Quiz Questions Table
```sql
quizQuestions (
  id: serial PRIMARY KEY,
  quizId: integer NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  
  -- Question Content
  question: text NOT NULL CHECK (length(question) >= 10),
  explanation: text,                              -- Explanation for correct answer
  
  -- Question Type
  questionType: varchar(20) DEFAULT 'multiple_choice'
    CHECK (questionType IN ('multiple_choice', 'true_false', 'short_answer', 'essay')),
  
  -- Scoring
  points: smallint DEFAULT 1 CHECK (points > 0),
  
  -- Organization
  orderIndex: smallint NOT NULL CHECK (orderIndex > 0),
  
  createdAt: timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  
  -- Unique ordering within quiz
  UNIQUE(quizId, orderIndex)
);
```

#### Quiz Answers Table
```sql
quizAnswers (
  id: serial PRIMARY KEY,
  questionId: integer NOT NULL REFERENCES quizQuestions(id) ON DELETE CASCADE,
  
  -- Answer Content
  answerText: text NOT NULL CHECK (length(answerText) >= 1),
  isCorrect: smallint DEFAULT 0 CHECK (isCorrect IN (0,1)),
  
  -- Organization
  orderIndex: smallint NOT NULL CHECK (orderIndex > 0),
  
  createdAt: timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  
  -- Unique ordering within question
  UNIQUE(questionId, orderIndex)
);
```

### **Performance and Analytics Tables**

#### Quiz Attempts Table
```sql
quizAttempts (
  id: serial PRIMARY KEY,
  userId: varchar(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quizId: integer NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  
  -- Attempt Results
  score: smallint NOT NULL CHECK (score >= 0 AND score <= 100),
  totalPoints: smallint NOT NULL CHECK (totalPoints > 0),
  earnedPoints: smallint NOT NULL CHECK (earnedPoints >= 0 AND earnedPoints <= totalPoints),
  passed: smallint DEFAULT 0 CHECK (passed IN (0,1)),
  
  -- Attempt Details
  attemptNumber: smallint NOT NULL CHECK (attemptNumber > 0),
  timeSpent: integer CHECK (timeSpent > 0),       -- Time spent in seconds
  answers: jsonb,                                 -- User's answers as JSON
  
  -- Timestamps
  startedAt: timestamp NOT NULL,
  completedAt: timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
  
  -- Business logic constraint
  CHECK (completedAt >= startedAt)
);
```

## Key Database Constraints Summary

### **Primary Key Constraints**
- All tables have serial or UUID primary keys
- Ensures unique identification of each record

### **Foreign Key Constraints**
- Referential integrity with appropriate CASCADE/RESTRICT rules
- Prevents orphaned records
- Maintains data consistency

### **Unique Constraints**
- Prevent duplicate enrollments: `UNIQUE(userId, courseId)`
- Ensure unique email addresses: `email UNIQUE`
- Maintain proper ordering: `UNIQUE(moduleId, orderIndex)`

### **Check Constraints**
- Data validation at database level
- Percentage values: `CHECK (progress >= 0 AND progress <= 100)`
- Enum-like values: `CHECK (status IN ('active', 'paused', 'completed'))`
- Business logic: `CHECK (completedAt >= startedAt)`

### **NOT NULL Constraints**
- Critical fields that must always have values
- User identification, course titles, timestamps

### **Default Values**
- Sensible defaults for status fields
- Automatic timestamp generation
- Zero defaults for numeric counters

## Performance Indexes

```sql
-- User lookups
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription ON users(subscriptionType, subscriptionStatus);

-- Course searches
CREATE INDEX idx_courses_category ON courses(category, level);
CREATE INDEX idx_courses_university ON courses(universityId, isPublished);
CREATE INDEX idx_courses_price ON courses(price, isFree);

-- Enrollment queries
CREATE INDEX idx_enrollments_user ON enrollments(userId, status);
CREATE INDEX idx_enrollments_course ON enrollments(courseId, status);

-- Learning progress
CREATE INDEX idx_lesson_completions_user ON lessonCompletions(userId);
CREATE INDEX idx_quiz_attempts_user ON quizAttempts(userId, quizId);

-- Analytics
CREATE INDEX idx_enrollments_created ON enrollments(createdAt);
CREATE INDEX idx_quiz_attempts_completed ON quizAttempts(completedAt);
```

This comprehensive constraint system ensures data integrity, improves query performance, and maintains business logic consistency throughout your e-learning platform.