// Base Activity System - Moodle-inspired modular architecture
import { z } from "zod";

// Common activity properties and methods
export interface BaseActivity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  courseId: number;
  moduleId?: number;
  dueDate?: Date;
  weight: number; // For grade calculation
  maxGrade: number;
  visibility: 'visible' | 'hidden' | 'conditional';
  completionTracking: CompletionTracking;
  settings: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CompletionTracking {
  enabled: boolean;
  requireView: boolean;
  requireGrade: boolean;
  requireSubmission: boolean;
  expectedCompletionDate?: Date;
}

// Activity types enum
export type ActivityType = 'quiz' | 'assignment' | 'forum' | 'workshop' | 'resource' | 'scorm';

// Activity interface with standard methods
export interface IActivity {
  // Core data
  data: BaseActivity;
  
  // Standard methods that all activities must implement
  render(): React.ReactElement;
  validate(): ValidationResult;
  calculateGrade(submission: any): number;
  exportData(): ActivityExportData;
  
  // Completion tracking
  checkCompletion(userId: string): Promise<boolean>;
  trackProgress(userId: string, progressData: any): Promise<void>;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ActivityExportData {
  activityData: BaseActivity;
  submissions: any[];
  grades: any[];
  analytics: any;
}

// Specific Activity Interfaces

// Quiz Activity
export interface QuizActivity extends BaseActivity {
  type: 'quiz';
  settings: QuizSettings;
}

export interface QuizSettings {
  timeLimit?: number; // minutes
  attempts: number;
  shuffleQuestions: boolean;
  shuffleAnswers: boolean;
  showCorrectAnswers: 'never' | 'after_submission' | 'after_due_date';
  gradeMethod: 'highest' | 'average' | 'first' | 'last';
  questions: QuizQuestion[];
  // Advanced features
  questionPools?: QuestionPool[];
  passwordProtected?: boolean;
  password?: string;
  ipRestrictions?: string[];
  secureMode?: boolean;
  proctoring?: ProctoringSettings;
  feedback?: FeedbackSettings;
  accessibility?: AccessibilitySettings;
  analytics?: AnalyticsSettings;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'essay' | 'matching' | 'numerical' | 'short_answer' | 
        'calculated' | 'drag_drop_image' | 'cloze' | 'ordering' | 'hotspot';
  text: string;
  points: number;
  category?: string;
  tags?: string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  partialCredit?: boolean;
  options?: QuizOption[];
  correctAnswer?: string | number | string[] | MatchingPair[] | CalculatedAnswer;
  explanation?: string;
  image?: string;
  feedback?: QuestionFeedback;
  // Question-specific settings
  numericalTolerance?: number;
  toleranceType?: 'nominal' | 'relative';
  variables?: CalculatedVariable[];
  matchingItems?: MatchingItem[];
  clozeOptions?: ClozeOption[];
  dragDropZones?: DragDropZone[];
  hotspots?: ImageHotspot[];
  rubric?: EssayRubric;
  timeLimit?: number; // per question time limit
  hints?: QuestionHint[];
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback?: string;
  points?: number; // For partial credit
  weight?: number; // For weighted scoring
}

export interface QuestionPool {
  id: string;
  name: string;
  description?: string;
  questions: string[]; // Question IDs
  selectCount: number; // How many to select from pool
  selectionMethod: 'random' | 'sequential' | 'adaptive';
}

export interface ProctoringSettings {
  enabled: boolean;
  webcamRequired?: boolean;
  screenShareRequired?: boolean;
  lockdownBrowser?: boolean;
  microphoneMonitoring?: boolean;
  keyboardMonitoring?: boolean;
  mouseMonitoring?: boolean;
  tabSwitchingBlocked?: boolean;
  rightClickDisabled?: boolean;
  copyPasteDisabled?: boolean;
}

export interface FeedbackSettings {
  immediate?: boolean;
  afterSubmission?: boolean;
  afterClosing?: boolean;
  showCorrectAnswer?: boolean;
  showExplanation?: boolean;
  showGrade?: boolean;
  showPoints?: boolean;
  customFeedbackRanges?: FeedbackRange[];
}

export interface FeedbackRange {
  minPercentage: number;
  maxPercentage: number;
  message: string;
}

export interface AccessibilitySettings {
  screenReaderCompatible: boolean;
  highContrast?: boolean;
  largeText?: boolean;
  keyboardNavigation?: boolean;
  audioDescriptions?: boolean;
  textToSpeech?: boolean;
}

export interface AnalyticsSettings {
  trackViewTime: boolean;
  trackClickPatterns: boolean;
  trackAnswerChanges: boolean;
  difficultyAdjustment: boolean;
  performanceInsights: boolean;
}

export interface QuestionFeedback {
  correct?: string;
  incorrect?: string;
  partiallyCorrect?: string;
  general?: string;
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface MatchingItem {
  id: string;
  text: string;
  type: 'left' | 'right';
  matchWith?: string; // ID of matching item
  image?: string;
}

export interface CalculatedVariable {
  name: string;
  min: number;
  max: number;
  decimals?: number;
  step?: number;
}

export interface CalculatedAnswer {
  formula: string;
  tolerance: number;
  toleranceType: 'nominal' | 'relative';
  units?: string[];
}

export interface ClozeOption {
  position: number;
  type: 'dropdown' | 'text' | 'numerical' | 'multichoice';
  options?: string[];
  correctAnswer: string | number;
  points: number;
  caseSensitive?: boolean;
}

export interface DragDropZone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  acceptedItems: string[];
  label?: string;
  maxItems?: number;
}

export interface ImageHotspot {
  id: string;
  x: number;
  y: number;
  radius: number;
  shape: 'circle' | 'rectangle' | 'polygon';
  isCorrect: boolean;
  feedback?: string;
  points?: number;
}

export interface EssayRubric {
  id: string;
  name: string;
  description?: string;
  criteria: RubricCriterion[];
  totalPoints: number;
  gradingMethod: 'holistic' | 'analytic';
}

export interface RubricCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  levels: RubricLevel[];
}

export interface RubricLevel {
  id: string;
  name: string;
  description: string;
  points: number;
  feedback?: string;
}

export interface QuestionHint {
  id: string;
  text: string;
  penalty: number; // Points deducted for using hint
  showAfter?: number; // Seconds before hint becomes available
}

// Assignment Activity
export interface AssignmentActivity extends BaseActivity {
  type: 'assignment';
  settings: AssignmentSettings;
}

export interface AssignmentSettings {
  submissionTypes: ('file' | 'text' | 'external_tool')[];
  allowedFileTypes: string[];
  maxFileSize: number; // MB
  maxFiles: number;
  wordLimit?: number;
  requireSubmissionStatement: boolean;
  teamSubmission: boolean;
  blindMarking: boolean;
  gradingWorkflow: boolean;
  rubricId?: string;
}

// Forum Activity
export interface ForumActivity extends BaseActivity {
  type: 'forum';
  settings: ForumSettings;
}

export interface ForumSettings {
  forumType: 'general' | 'single_discussion' | 'question_answer';
  allowDiscussions: boolean;
  maxAttachments: number;
  maxAttachmentSize: number;
  subscriptionMode: 'optional' | 'forced' | 'auto' | 'disabled';
  trackingType: 'optional' | 'forced' | 'off';
  gradeCategory?: string;
}

// Workshop Activity
export interface WorkshopActivity extends BaseActivity {
  type: 'workshop';
  settings: WorkshopSettings;
}

export interface WorkshopSettings {
  phases: WorkshopPhase[];
  currentPhase: WorkshopPhase;
  submissionTypes: ('file' | 'text')[];
  maxSubmissionSize: number;
  assessmentInstructions: string;
  examplesMode: 'none' | 'voluntary' | 'required';
  gradeStrategy: 'accumulative' | 'comments' | 'number_of_errors' | 'rubric';
  rubricId?: string;
}

export type WorkshopPhase = 'setup' | 'submission' | 'assessment' | 'grading' | 'closed';

// Resource Activity
export interface ResourceActivity extends BaseActivity {
  type: 'resource';
  settings: ResourceSettings;
}

export interface ResourceSettings {
  resourceType: 'file' | 'url' | 'text' | 'book' | 'folder';
  content?: string;
  url?: string;
  fileId?: string;
  displayOptions: {
    showName: boolean;
    showDescription: boolean;
    showSize: boolean;
    showType: boolean;
    showDate: boolean;
  };
  popupOptions?: {
    width: number;
    height: number;
    resizable: boolean;
    scrollbars: boolean;
  };
}

// SCORM Activity
export interface SCORMActivity extends BaseActivity {
  type: 'scorm';
  settings: SCORMSettings;
}

export interface SCORMSettings {
  packageId: string;
  packageVersion: string;
  launchUrl: string;
  width: number;
  height: number;
  windowOptions: string[];
  skipViewPage: boolean;
  hideBrowse: boolean;
  displayCourseStructure: boolean;
  gradeMethod: 'highest' | 'average' | 'sum' | 'disabled';
  maxAttempts: number;
}

// Zod schemas for validation
export const baseActivitySchema = z.object({
  id: z.string(),
  type: z.enum(['quiz', 'assignment', 'forum', 'workshop', 'resource', 'scorm']),
  title: z.string().min(1).max(255),
  description: z.string(),
  courseId: z.number(),
  moduleId: z.number().optional(),
  dueDate: z.date().optional(),
  weight: z.number().min(0).max(100),
  maxGrade: z.number().min(0),
  visibility: z.enum(['visible', 'hidden', 'conditional']),
  completionTracking: z.object({
    enabled: z.boolean(),
    requireView: z.boolean(),
    requireGrade: z.boolean(),
    requireSubmission: z.boolean(),
    expectedCompletionDate: z.date().optional(),
  }),
  settings: z.record(z.any()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const quizQuestionSchema = z.object({
  id: z.string(),
  type: z.enum(['multiple_choice', 'true_false', 'essay', 'matching', 'numerical', 'short_answer']),
  text: z.string().min(1),
  points: z.number().min(0),
  options: z.array(z.object({
    id: z.string(),
    text: z.string(),
    isCorrect: z.boolean(),
    feedback: z.string().optional(),
  })).optional(),
  correctAnswer: z.union([z.string(), z.number(), z.array(z.string())]).optional(),
  explanation: z.string().optional(),
});

export const insertActivitySchema = baseActivitySchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = z.infer<typeof baseActivitySchema>;