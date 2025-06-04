import { apiRequest } from '@/lib/queryClient';
import { Quiz, QuizQuestion, QuizQuestionOption } from '@shared/schema';

export interface ExamCreationData {
  title: string;
  description: string;
  timeLimit?: number;
  shuffleQuestions?: boolean;
  attemptsAllowed?: number;
  passingScore?: number;
  showResults?: boolean;
  showCorrectAnswers?: boolean;
  examType?: 'quiz' | 'exam' | 'assessment';
}

export interface ExamSettings {
  timeLimit?: number;
  shuffleQuestions?: boolean;
  attemptsAllowed?: number;
  passingScore?: number;
  showResults?: boolean;
  showCorrectAnswers?: boolean;
  allowBackTracking?: boolean;
  randomizeOptions?: boolean;
  immediateCorrection?: boolean;
  examType?: 'quiz' | 'exam' | 'assessment';
}

export interface QuestionTemplate {
  questionType: string;
  questionText: string;
  imageUrl?: string;
  videoUrl?: string;
  points?: number;
  isRequired?: boolean;
  settings?: any;
  options?: Partial<QuizQuestionOption>[];
}

export interface ExamValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  questionCount: number;
  totalPoints: number;
}

export interface ExamPreview {
  exam: Quiz;
  questions: (QuizQuestion & { options?: QuizQuestionOption[] })[];
  totalQuestions: number;
  totalPoints: number;
  estimatedDuration: number;
  settings: ExamSettings;
}

export class ExamBuilderAPIService {
  
  /**
   * Create a new exam using ExamBuilderService
   */
  static async createExam(courseId: number, examData: ExamCreationData): Promise<Quiz> {
    const response = await apiRequest('POST', `/api/courses/${courseId}/exams/builder`, examData);
    return response.json();
  }

  /**
   * Add a question to an exam using ExamBuilderService
   */
  static async addQuestion(examId: number, questionData: any): Promise<QuizQuestion> {
    const response = await apiRequest('POST', `/api/exams/${examId}/questions/builder`, questionData);
    return response.json();
  }

  /**
   * Bulk import questions to an exam
   */
  static async bulkImportQuestions(examId: number, questions: QuestionTemplate[]): Promise<QuizQuestion[]> {
    const response = await apiRequest('POST', `/api/exams/${examId}/questions/bulk`, { questions });
    return response.json();
  }

  /**
   * Duplicate a question
   */
  static async duplicateQuestion(questionId: number): Promise<QuizQuestion> {
    const response = await apiRequest('POST', `/api/questions/${questionId}/duplicate`);
    return response.json();
  }

  /**
   * Reorder questions in an exam
   */
  static async reorderQuestions(examId: number, questionOrder: number[]): Promise<void> {
    await apiRequest('PUT', `/api/exams/${examId}/questions/reorder`, { questionOrder });
  }

  /**
   * Update exam settings
   */
  static async updateExamSettings(examId: number, settings: ExamSettings): Promise<Quiz> {
    const response = await apiRequest('PUT', `/api/exams/${examId}/settings`, settings);
    return response.json();
  }

  /**
   * Validate exam completeness
   */
  static async validateExam(examId: number): Promise<ExamValidationResult> {
    const response = await apiRequest('GET', `/api/exams/${examId}/validation`);
    return response.json();
  }

  /**
   * Publish an exam
   */
  static async publishExam(examId: number): Promise<Quiz> {
    const response = await apiRequest('POST', `/api/exams/${examId}/publish`);
    return response.json();
  }

  /**
   * Generate exam preview
   */
  static async generateExamPreview(examId: number): Promise<ExamPreview> {
    const response = await apiRequest('GET', `/api/exams/${examId}/preview`);
    return response.json();
  }

  /**
   * Get question templates
   */
  static async getQuestionTemplates(): Promise<{ [key: string]: QuestionTemplate }> {
    const response = await apiRequest('GET', '/api/exam-builder/question-templates');
    return response.json();
  }

  /**
   * Get supported question types
   */
  static async getSupportedQuestionTypes(): Promise<{ supportedTypes: string[] }> {
    const response = await apiRequest('GET', '/api/exam-builder/supported-types');
    return response.json();
  }

  /**
   * Get exam details with questions
   */
  static async getExamDetails(examId: number): Promise<ExamPreview> {
    const response = await apiRequest('GET', `/api/exams/${examId}/preview`);
    return response.json();
  }

  // Standard quiz/exam CRUD operations
  
  /**
   * Get all exams for a course
   */
  static async getCourseExams(courseId: number): Promise<Quiz[]> {
    const response = await apiRequest('GET', `/api/courses/${courseId}/exams`);
    return response.json();
  }

  /**
   * Get exam by ID
   */
  static async getExam(examId: number): Promise<Quiz> {
    const response = await apiRequest('GET', `/api/exams/${examId}`);
    return response.json();
  }

  /**
   * Update exam
   */
  static async updateExam(examId: number, examData: Partial<Quiz>): Promise<Quiz> {
    const response = await apiRequest('PUT', `/api/exams/${examId}`, examData);
    return response.json();
  }

  /**
   * Delete exam
   */
  static async deleteExam(examId: number): Promise<void> {
    await apiRequest('DELETE', `/api/exams/${examId}`);
  }

  /**
   * Get questions for an exam
   */
  static async getExamQuestions(examId: number): Promise<QuizQuestion[]> {
    const response = await apiRequest('GET', `/api/exams/${examId}/questions`);
    return response.json();
  }

  /**
   * Update question
   */
  static async updateQuestion(questionId: number, questionData: Partial<QuizQuestion>): Promise<QuizQuestion> {
    const response = await apiRequest('PUT', `/api/questions/${questionId}`, questionData);
    return response.json();
  }

  /**
   * Delete question
   */
  static async deleteQuestion(questionId: number): Promise<void> {
    await apiRequest('DELETE', `/api/questions/${questionId}`);
  }

  /**
   * Add option to question
   */
  static async addQuestionOption(questionId: number, optionData: Partial<QuizQuestionOption>): Promise<QuizQuestionOption> {
    const response = await apiRequest('POST', `/api/questions/${questionId}/options`, optionData);
    return response.json();
  }

  /**
   * Update question option
   */
  static async updateQuestionOption(optionId: number, optionData: Partial<QuizQuestionOption>): Promise<QuizQuestionOption> {
    const response = await apiRequest('PUT', `/api/options/${optionId}`, optionData);
    return response.json();
  }

  /**
   * Delete question option
   */
  static async deleteQuestionOption(optionId: number): Promise<void> {
    await apiRequest('DELETE', `/api/options/${optionId}`);
  }
}