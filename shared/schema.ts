import { pgTable, text, serial, integer, timestamp, varchar, jsonb, index, boolean, smallint, decimal, check } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Enhanced user schema with comprehensive authentication support
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  password: varchar("password"), // For email/password auth
  phone: varchar("phone").unique(), // For phone auth
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  
  // Email and phone verification
  isEmailVerified: integer("is_email_verified").default(0),
  isPhoneVerified: integer("is_phone_verified").default(0),
  emailVerificationToken: varchar("email_verification_token"),
  phoneVerificationCode: varchar("phone_verification_code"),
  phoneVerificationExpiry: timestamp("phone_verification_expiry"),
  
  // Password reset
  passwordResetToken: varchar("password_reset_token"),
  passwordResetExpiry: timestamp("password_reset_expiry"),
  
  // OAuth provider info
  googleId: varchar("google_id").unique(),
  facebookId: varchar("facebook_id").unique(),
  appleId: varchar("apple_id").unique(),
  
  // Subscription fields
  subscriptionType: varchar("subscription_type").default("free"),
  subscriptionStatus: varchar("subscription_status").default("inactive"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  
  // Onboarding preferences - store as JSON text
  interests: text("interests"), // JSON array of selected interests
  goals: text("goals"), // JSON array of selected goals
  experienceLevel: text("experience_level"), // beginner, intermediate, advanced
  preferredLearningStyle: text("preferred_learning_style"), // visual, auditory, hands-on
  isOnboardingComplete: integer("is_onboarding_complete").default(0),
  
  // Admin fields
  isAdmin: integer("is_admin").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const upsertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

// Enhanced Course schema with additional fields
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description"), // Brief summary for listings
  imageUrl: text("image_url").notNull(),
  trailerVideoUrl: text("trailer_video_url"), // Course preview video
  universityId: integer("university_id").notNull(),
  isFree: integer("is_free").default(0).notNull(),
  level: text("level").notNull(),
  category: text("category").notNull(),
  duration: text("duration"), // e.g., "6 weeks", "3 months"
  language: text("language").default("Hungarian").notNull(),
  prerequisites: text("prerequisites"), // Required background knowledge
  learningOutcomes: text("learning_outcomes"), // What students will learn
  instructorName: text("instructor_name"),
  instructorBio: text("instructor_bio"),
  instructorImageUrl: text("instructor_image_url"),
  price: integer("price").default(0), // Price in Hungarian Forints
  enrollmentCount: integer("enrollment_count").default(0),
  rating: integer("rating").default(0), // Average rating (1-5 scale * 100 for precision)
  isPublished: integer("is_published").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// University schema
export const universities = pgTable("universities", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  logoUrl: text("logo_url").notNull(),
  country: text("country").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUniversitySchema = createInsertSchema(universities).omit({
  id: true,
  createdAt: true,
});

// Degree schema
export const degrees = pgTable("degrees", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url").notNull(),
  universityId: integer("university_id").notNull(),
  level: text("level").notNull(),
  duration: text("duration").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDegreeSchema = createInsertSchema(degrees).omit({
  id: true,
  createdAt: true,
});

// Newsletter subscribers
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSubscriberSchema = createInsertSchema(subscribers).omit({
  id: true,
  createdAt: true,
});

// Course enrollments
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  enrolledAt: timestamp("enrolled_at").defaultNow().notNull(),
  progress: integer("progress").default(0).notNull(),
  status: text("status").default("active").notNull(),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  enrolledAt: true,
  progress: true,
  status: true,
  lastAccessedAt: true,
  completedAt: true,
});

// Course modules
export const courseModules = pgTable("course_modules", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  orderIndex: integer("order_index").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCourseModuleSchema = createInsertSchema(courseModules).omit({
  id: true,
  createdAt: true,
});

// Course lessons
export const lessons = pgTable("lessons", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").notNull().references(() => courseModules.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  videoUrl: text("video_url"),
  duration: integer("duration").notNull(), // in minutes
  orderIndex: integer("order_index").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
});

// Lesson completion
export const lessonCompletions = pgTable("lesson_completions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

export const insertLessonCompletionSchema = createInsertSchema(lessonCompletions).omit({
  id: true,
  completedAt: true,
});

// Course resources (e.g., PDFs, supplemental materials)
export const courseResources = pgTable("course_resources", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => courses.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // e.g., "pdf", "video", "link"
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCourseResourceSchema = createInsertSchema(courseResources).omit({
  id: true,
  createdAt: true,
});

// Course quizzes
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  passingScore: integer("passing_score").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  createdAt: true,
});

// Quiz questions
export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").notNull().references(() => quizzes.id),
  question: text("question").notNull(),
  orderIndex: integer("order_index").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({
  id: true,
  createdAt: true,
});

// Quiz answers
export const quizAnswers = pgTable("quiz_answers", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").notNull().references(() => quizQuestions.id),
  answerText: text("answer_text").notNull(),
  isCorrect: integer("is_correct").default(0).notNull(),
  orderIndex: integer("order_index").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQuizAnswerSchema = createInsertSchema(quizAnswers).omit({
  id: true,
  createdAt: true,
});

// User quiz attempts
export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  quizId: integer("quiz_id").notNull().references(() => quizzes.id),
  score: integer("score").notNull(),
  passed: integer("passed").default(0).notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).omit({
  id: true,
  completedAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = z.infer<typeof upsertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

export type InsertUniversity = z.infer<typeof insertUniversitySchema>;
export type University = typeof universities.$inferSelect;

export type InsertDegree = z.infer<typeof insertDegreeSchema>;
export type Degree = typeof degrees.$inferSelect;

export type InsertSubscriber = z.infer<typeof insertSubscriberSchema>;
export type Subscriber = typeof subscribers.$inferSelect;

export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = typeof enrollments.$inferSelect;

export type InsertCourseModule = z.infer<typeof insertCourseModuleSchema>;
export type CourseModule = typeof courseModules.$inferSelect;

export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessons.$inferSelect;

export type InsertLessonCompletion = z.infer<typeof insertLessonCompletionSchema>;
export type LessonCompletion = typeof lessonCompletions.$inferSelect;

export type InsertCourseResource = z.infer<typeof insertCourseResourceSchema>;
export type CourseResource = typeof courseResources.$inferSelect;

export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzes.$inferSelect;

export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type QuizQuestion = typeof quizQuestions.$inferSelect;

export type InsertQuizAnswer = z.infer<typeof insertQuizAnswerSchema>;
export type QuizAnswer = typeof quizAnswers.$inferSelect;

export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;
export type QuizAttempt = typeof quizAttempts.$inferSelect;

// Learning Path tables
export const learningPaths = pgTable("learning_paths", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  userId: varchar("user_id").notNull(),
  difficulty: varchar("difficulty", { length: 50 }).notNull().default("beginner"),
  tags: text("tags").array().default([]),
  isPublic: boolean("is_public").notNull().default(false),
  totalDuration: varchar("total_duration", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const learningPathSteps = pgTable("learning_path_steps", {
  id: serial("id").primaryKey(),
  learningPathId: integer("learning_path_id").notNull(),
  courseId: integer("course_id").notNull(),
  orderIndex: integer("order_index").notNull(),
  isCompleted: boolean("is_completed").notNull().default(false),
  estimatedDuration: varchar("estimated_duration", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLearningPathSchema = createInsertSchema(learningPaths).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLearningPathStepSchema = createInsertSchema(learningPathSteps).omit({
  id: true,
  createdAt: true,
});

// Learning Path relations
export const learningPathsRelations = relations(learningPaths, ({ one, many }) => ({
  user: one(users, {
    fields: [learningPaths.userId],
    references: [users.id],
  }),
  steps: many(learningPathSteps),
}));

export const learningPathStepsRelations = relations(learningPathSteps, ({ one }) => ({
  learningPath: one(learningPaths, {
    fields: [learningPathSteps.learningPathId],
    references: [learningPaths.id],
  }),
  course: one(courses, {
    fields: [learningPathSteps.courseId],
    references: [courses.id],
  }),
}));

// Learning Path types
export type InsertLearningPath = z.infer<typeof insertLearningPathSchema>;
export type LearningPath = typeof learningPaths.$inferSelect;
export type InsertLearningPathStep = z.infer<typeof insertLearningPathStepSchema>;
export type LearningPathStep = typeof learningPathSteps.$inferSelect;

// ============================================
// COMPLETE RELATIONSHIP DEFINITIONS
// ============================================

// User Relations - Central entity connecting to most other tables
export const usersRelations = relations(users, ({ many }) => ({
  enrollments: many(enrollments),
  quizAttempts: many(quizAttempts),
  lessonCompletions: many(lessonCompletions),
  learningPaths: many(learningPaths),
}));

// University Relations - One-to-Many with courses and degrees
export const universitiesRelations = relations(universities, ({ many }) => ({
  courses: many(courses),
  degrees: many(degrees),
}));

// Course Relations - Complex entity with multiple relationships
export const coursesRelations = relations(courses, ({ one, many }) => ({
  university: one(universities, {
    fields: [courses.universityId],
    references: [universities.id],
  }),
  enrollments: many(enrollments),
  modules: many(courseModules),
  resources: many(courseResources),
  learningPathSteps: many(learningPathSteps),
}));

// Degree Relations - Belongs to university
export const degreesRelations = relations(degrees, ({ one }) => ({
  university: one(universities, {
    fields: [degrees.universityId],
    references: [universities.id],
  }),
}));

// Enrollment Relations - Many-to-Many bridge between users and courses
export const enrollmentsRelations = relations(enrollments, ({ one }) => ({
  user: one(users, {
    fields: [enrollments.userId],
    references: [users.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
}));

// Course Module Relations - Part of course hierarchy
export const courseModulesRelations = relations(courseModules, ({ one, many }) => ({
  course: one(courses, {
    fields: [courseModules.courseId],
    references: [courses.id],
  }),
  lessons: many(lessons),
}));

// Lesson Relations - Part of module, has quizzes and completions
export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  module: one(courseModules, {
    fields: [lessons.moduleId],
    references: [courseModules.id],
  }),
  quizzes: many(quizzes),
  completions: many(lessonCompletions),
}));

// Lesson Completion Relations - Tracks individual lesson progress
export const lessonCompletionsRelations = relations(lessonCompletions, ({ one }) => ({
  user: one(users, {
    fields: [lessonCompletions.userId],
    references: [users.id],
  }),
  lesson: one(lessons, {
    fields: [lessonCompletions.lessonId],
    references: [lessons.id],
  }),
}));

// Course Resource Relations - Supplementary materials for courses
export const courseResourcesRelations = relations(courseResources, ({ one }) => ({
  course: one(courses, {
    fields: [courseResources.courseId],
    references: [courses.id],
  }),
}));

// Quiz Relations - Assessment component of lessons
export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [quizzes.lessonId],
    references: [lessons.id],
  }),
  questions: many(quizQuestions),
  attempts: many(quizAttempts),
}));

// Quiz Question Relations - Individual questions within quizzes
export const quizQuestionsRelations = relations(quizQuestions, ({ one, many }) => ({
  quiz: one(quizzes, {
    fields: [quizQuestions.quizId],
    references: [quizzes.id],
  }),
  answers: many(quizAnswers),
}));

// Quiz Answer Relations - Multiple choice options for questions
export const quizAnswersRelations = relations(quizAnswers, ({ one }) => ({
  question: one(quizQuestions, {
    fields: [quizAnswers.questionId],
    references: [quizQuestions.id],
  }),
}));

// Quiz Attempt Relations - Student assessment submissions
export const quizAttemptsRelations = relations(quizAttempts, ({ one }) => ({
  user: one(users, {
    fields: [quizAttempts.userId],
    references: [users.id],
  }),
  quiz: one(quizzes, {
    fields: [quizAttempts.quizId],
    references: [quizzes.id],
  }),
}));
