import { pgTable, text, serial, integer, timestamp, varchar, jsonb, index, boolean } from "drizzle-orm/pg-core";
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
  instructions: text("instructions"), // Course instructions and guidelines
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
  status: text("status").notNull().default("piszkozat"), // 'piszkozat', 'hamarosan', 'ingyenes', 'fizetos'
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
  description: text("description"),
  content: text("content").notNull(),
  videoUrl: text("video_url"),
  videoEmbedCode: text("video_embed_code"),
  estimatedDuration: integer("estimated_duration").notNull(), // in minutes
  order: integer("order").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Lesson attachments
export const lessonAttachments = pgTable("lesson_attachments", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  fileType: text("file_type").notNull(),
  fileSize: integer("file_size").notNull(), // in bytes
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Lesson quizzes
export const lessonQuizzes = pgTable("lesson_quizzes", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  question: text("question").notNull(),
  type: text("type").notNull(), // 'multiple_choice', 'true_false', 'short_answer'
  options: text("options"), // JSON string for multiple choice options
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation"),
  points: integer("points").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertLessonSchema = createInsertSchema(lessons).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLessonAttachmentSchema = createInsertSchema(lessonAttachments).omit({
  id: true,
  createdAt: true,
});

export const insertLessonQuizSchema = createInsertSchema(lessonQuizzes).omit({
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

// Comprehensive Quiz System - LearnWorlds Style
// 1. Quizzes/Exams Table
export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").references(() => courses.id, { onDelete: "cascade" }),
  lessonId: integer("lesson_id").references(() => lessons.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  examType: varchar("exam_type", { length: 50 }).notNull().default("quiz"), // quiz, exam, assessment
  status: varchar("status", { length: 20 }).notNull().default("draft"), // draft, published
  settings: jsonb("settings").default({}), // time_limit, shuffle_questions, attempts_allowed, etc.
  timeLimit: integer("time_limit"), // in minutes
  shuffleQuestions: boolean("shuffle_questions").default(false),
  attemptsAllowed: integer("attempts_allowed").default(1),
  passingScore: integer("passing_score").default(70), // percentage
  showResults: boolean("show_results").default(true),
  showCorrectAnswers: boolean("show_correct_answers").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// 2. Questions Table
export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").references(() => quizzes.id, { onDelete: "cascade" }),
  questionText: text("question_text").notNull(),
  questionType: varchar("question_type", { length: 50 }).notNull(), // multiple_choice, true_false, short_text, text_assignment, file_assignment, match_ordering, video_recording, audio_recording
  orderIndex: integer("order_index").notNull().default(0),
  points: integer("points").default(1),
  settings: jsonb("settings").default({}), // required, hide_from_viewer, etc.
  isRequired: boolean("is_required").default(true),
  hideFromViewer: boolean("hide_from_viewer").default(false),
  imageUrl: varchar("image_url"),
  videoUrl: varchar("video_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// 3. Answer Options Table
export const quizQuestionOptions = pgTable("quiz_question_options", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").references(() => quizQuestions.id, { onDelete: "cascade" }),
  optionText: text("option_text"),
  optionType: varchar("option_type", { length: 20 }).default("text"), // text, image, video
  isCorrect: boolean("is_correct").default(false),
  orderIndex: integer("order_index").notNull().default(0),
  imageUrl: varchar("image_url"),
  videoUrl: varchar("video_url"),
});

// 4. Quiz Attempts Table
export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id").references(() => quizzes.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull(),
  attemptNumber: integer("attempt_number").default(1),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  score: integer("score").default(0),
  maxScore: integer("max_score").default(0),
  percentage: integer("percentage").default(0),
  status: varchar("status", { length: 20 }).default("in_progress"), // in_progress, completed, abandoned
  timeSpent: integer("time_spent"), // in seconds
});

// 5. Quiz Answers Table (User Responses)
export const quizAnswers = pgTable("quiz_answers", {
  id: serial("id").primaryKey(),
  attemptId: integer("attempt_id").references(() => quizAttempts.id, { onDelete: "cascade" }),
  questionId: integer("question_id").references(() => quizQuestions.id, { onDelete: "cascade" }),
  answerData: jsonb("answer_data"), // flexible storage for different answer types
  selectedOptionIds: jsonb("selected_option_ids"), // for multiple choice
  textAnswer: text("text_answer"), // for text-based answers
  fileUrl: varchar("file_url"), // for file uploads
  isCorrect: boolean("is_correct").default(false),
  pointsEarned: integer("points_earned").default(0),
  submittedAt: timestamp("submitted_at").defaultNow(),
});

// 6. Quiz Results Table (Summary)
export const quizResults = pgTable("quiz_results", {
  id: serial("id").primaryKey(),
  attemptId: integer("attempt_id").references(() => quizAttempts.id, { onDelete: "cascade" }),
  userId: varchar("user_id").notNull(),
  quizId: integer("quiz_id").references(() => quizzes.id, { onDelete: "cascade" }),
  totalQuestions: integer("total_questions"),
  correctAnswers: integer("correct_answers"),
  incorrectAnswers: integer("incorrect_answers"),
  skippedAnswers: integer("skipped_answers"),
  totalScore: integer("total_score"),
  maxPossibleScore: integer("max_possible_score"),
  percentage: integer("percentage"),
  passed: boolean("passed").default(false),
  feedback: text("feedback"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Quiz Insert Schemas for New System
export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({
  id: true,
  createdAt: true,
});

export const insertQuizQuestionOptionSchema = createInsertSchema(quizQuestionOptions).omit({
  id: true,
});

export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).omit({
  id: true,
  startedAt: true,
});

export const insertQuizAnswerSchema = createInsertSchema(quizAnswers).omit({
  id: true,
  submittedAt: true,
});

export const insertQuizResultSchema = createInsertSchema(quizResults).omit({
  id: true,
  createdAt: true,
});

// Quiz Types for New System
export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof insertQuizSchema>;

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;

export type QuizQuestionOption = typeof quizQuestionOptions.$inferSelect;
export type InsertQuizQuestionOption = z.infer<typeof insertQuizQuestionOptionSchema>;

export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;

export type QuizAnswer = typeof quizAnswers.$inferSelect;
export type InsertQuizAnswer = z.infer<typeof insertQuizAnswerSchema>;

export type QuizResult = typeof quizResults.$inferSelect;
export type InsertQuizResult = z.infer<typeof insertQuizResultSchema>;

// Question types enum
export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  TRUE_FALSE: 'true_false',
  SHORT_TEXT: 'short_text',
  TEXT_ASSIGNMENT: 'text_assignment',
  FILE_ASSIGNMENT: 'file_assignment',
  MATCH_ORDERING: 'match_ordering',
  VIDEO_RECORDING: 'video_recording',
  AUDIO_RECORDING: 'audio_recording',
} as const;

export type QuestionType = typeof QUESTION_TYPES[keyof typeof QUESTION_TYPES];

// Quiz Relations
export const quizzesRelations = relations(quizzes, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [quizzes.lessonId],
    references: [lessons.id],
  }),
  questions: many(quizQuestions),
  attempts: many(quizAttempts),
}));

export const quizQuestionsRelations = relations(quizQuestions, ({ one, many }) => ({
  quiz: one(quizzes, {
    fields: [quizQuestions.quizId],
    references: [quizzes.id],
  }),
  options: many(quizQuestionOptions),
  answers: many(quizAnswers),
}));

export const quizQuestionOptionsRelations = relations(quizQuestionOptions, ({ one, many }) => ({
  question: one(quizQuestions, {
    fields: [quizQuestionOptions.questionId],
    references: [quizQuestions.id],
  }),
  answers: many(quizAnswers),
}));

export const quizAttemptsRelations = relations(quizAttempts, ({ one, many }) => ({
  quiz: one(quizzes, {
    fields: [quizAttempts.quizId],
    references: [quizzes.id],
  }),
  user: one(users, {
    fields: [quizAttempts.userId],
    references: [users.id],
  }),
  answers: many(quizAnswers),
}));

export const quizAnswersRelations = relations(quizAnswers, ({ one }) => ({
  attempt: one(quizAttempts, {
    fields: [quizAnswers.attemptId],
    references: [quizAttempts.id],
  }),
  question: one(quizQuestions, {
    fields: [quizAnswers.questionId],
    references: [quizQuestions.id],
  }),
  selectedOption: one(quizQuestionOptions, {
    fields: [quizAnswers.selectedOptionId],
    references: [quizQuestionOptions.id],
  }),
}));

// Quiz Types
export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestionOption = z.infer<typeof insertQuizQuestionOptionSchema>;
export type QuizQuestionOption = typeof quizQuestionOptions.$inferSelect;
export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;
export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAnswer = z.infer<typeof insertQuizAnswerSchema>;
export type QuizAnswer = typeof quizAnswers.$inferSelect;
