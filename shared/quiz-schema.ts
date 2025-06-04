import { pgTable, varchar, text, integer, boolean, timestamp, jsonb, decimal } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// 1. Courses Table (already exists in main schema)
// 2. Exams/Quizzes Table
export const quizzes = pgTable('quizzes', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  courseId: integer('course_id').references(() => courses.id, { onDelete: 'cascade' }),
  lessonId: integer('lesson_id').references(() => lessons.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  examType: varchar('exam_type', { length: 50 }).notNull().default('quiz'), // quiz, exam, assessment
  status: varchar('status', { length: 20 }).notNull().default('draft'), // draft, published
  settings: jsonb('settings').default({}), // time_limit, shuffle_questions, attempts_allowed, etc.
  timeLimit: integer('time_limit'), // in minutes
  shuffleQuestions: boolean('shuffle_questions').default(false),
  attemptsAllowed: integer('attempts_allowed').default(1),
  passingScore: decimal('passing_score', { precision: 5, scale: 2 }).default('70.00'), // percentage
  showResults: boolean('show_results').default(true),
  showCorrectAnswers: boolean('show_correct_answers').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// 3. Questions Table
export const quizQuestions = pgTable('quiz_questions', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  quizId: integer('quiz_id').references(() => quizzes.id, { onDelete: 'cascade' }),
  questionText: text('question_text').notNull(),
  questionType: varchar('question_type', { length: 50 }).notNull(), // multiple_choice, true_false, short_text, text_assignment, file_assignment, match_ordering, video_recording, audio_recording
  orderIndex: integer('order_index').notNull().default(0),
  points: decimal('points', { precision: 5, scale: 2 }).default('1.00'),
  settings: jsonb('settings').default({}), // required, hide_from_viewer, etc.
  isRequired: boolean('is_required').default(true),
  hideFromViewer: boolean('hide_from_viewer').default(false),
  imageUrl: varchar('image_url'),
  videoUrl: varchar('video_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// 4. Answer Options Table
export const quizQuestionOptions = pgTable('quiz_question_options', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  questionId: integer('question_id').references(() => quizQuestions.id, { onDelete: 'cascade' }),
  optionText: text('option_text'),
  optionType: varchar('option_type', { length: 20 }).default('text'), // text, image, video
  isCorrect: boolean('is_correct').default(false),
  orderIndex: integer('order_index').notNull().default(0),
  imageUrl: varchar('image_url'),
  videoUrl: varchar('video_url'),
});

// 5. Quiz Attempts Table
export const quizAttempts = pgTable('quiz_attempts', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  quizId: integer('quiz_id').references(() => quizzes.id, { onDelete: 'cascade' }),
  userId: varchar('user_id').notNull(),
  attemptNumber: integer('attempt_number').default(1),
  startedAt: timestamp('started_at').defaultNow(),
  completedAt: timestamp('completed_at'),
  score: decimal('score', { precision: 5, scale: 2 }),
  maxScore: decimal('max_score', { precision: 5, scale: 2 }),
  percentage: decimal('percentage', { precision: 5, scale: 2 }),
  status: varchar('status', { length: 20 }).default('in_progress'), // in_progress, completed, abandoned
  timeSpent: integer('time_spent'), // in seconds
});

// 6. Quiz Answers Table (User Responses)
export const quizAnswers = pgTable('quiz_answers', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  attemptId: integer('attempt_id').references(() => quizAttempts.id, { onDelete: 'cascade' }),
  questionId: integer('question_id').references(() => quizQuestions.id, { onDelete: 'cascade' }),
  answerData: jsonb('answer_data'), // flexible storage for different answer types
  selectedOptionIds: jsonb('selected_option_ids'), // for multiple choice
  textAnswer: text('text_answer'), // for text-based answers
  fileUrl: varchar('file_url'), // for file uploads
  isCorrect: boolean('is_correct'),
  pointsEarned: decimal('points_earned', { precision: 5, scale: 2 }).default('0.00'),
  submittedAt: timestamp('submitted_at').defaultNow(),
});

// 7. Quiz Results Table (Summary)
export const quizResults = pgTable('quiz_results', {
  id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
  attemptId: integer('attempt_id').references(() => quizAttempts.id, { onDelete: 'cascade' }),
  userId: varchar('user_id').notNull(),
  quizId: integer('quiz_id').references(() => quizzes.id, { onDelete: 'cascade' }),
  totalQuestions: integer('total_questions'),
  correctAnswers: integer('correct_answers'),
  incorrectAnswers: integer('incorrect_answers'),
  skippedAnswers: integer('skipped_answers'),
  totalScore: decimal('total_score', { precision: 5, scale: 2 }),
  maxPossibleScore: decimal('max_possible_score', { precision: 5, scale: 2 }),
  percentage: decimal('percentage', { precision: 5, scale: 2 }),
  passed: boolean('passed').default(false),
  feedback: text('feedback'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Import references from main schema
import { courses, lessons } from './schema';

// Zod schemas for validation
export const createQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const createQuestionSchema = createInsertSchema(quizQuestions).omit({
  id: true,
  createdAt: true,
});

export const createQuestionOptionSchema = createInsertSchema(quizQuestionOptions).omit({
  id: true,
});

export const createQuizAttemptSchema = createInsertSchema(quizAttempts).omit({
  id: true,
  startedAt: true,
});

export const createQuizAnswerSchema = createInsertSchema(quizAnswers).omit({
  id: true,
  submittedAt: true,
});

// Types
export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = z.infer<typeof createQuizSchema>;

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = z.infer<typeof createQuestionSchema>;

export type QuizQuestionOption = typeof quizQuestionOptions.$inferSelect;
export type InsertQuizQuestionOption = z.infer<typeof createQuestionOptionSchema>;

export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type InsertQuizAttempt = z.infer<typeof createQuizAttemptSchema>;

export type QuizAnswer = typeof quizAnswers.$inferSelect;
export type InsertQuizAnswer = z.infer<typeof createQuizAnswerSchema>;

export type QuizResult = typeof quizResults.$inferSelect;

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