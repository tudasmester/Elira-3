import { apiRequest } from '@/lib/queryClient';
import { QuizQuestion, Quiz, QuizQuestionOption } from '@shared/schema';

export interface QuestionTemplate {
  questionText: string;
  questionType: string;
  points?: number;
  options?: Array<{
    optionText: string;
    isCorrect: boolean;
    orderIndex: number;
  }>;
}

export interface ExamSettings {
  title: string;
  description: string;
  timeLimit: number;
  attemptsAllowed: number;
  passingScore: number;
  examType: 'quiz' | 'exam' | 'assessment';
  shuffleQuestions: boolean;
  showResults: boolean;
  showCorrectAnswers: boolean;
  allowBackTracking?: boolean;
  randomizeOptions?: boolean;
  immediateCorrection?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ExamDetails {
  exam: Quiz;
  questions: QuizQuestion[];
}

export class ExamBuilderAPIService {
  // Create a new exam
  static async createExam(courseId: number, examData: Partial<Quiz>): Promise<Quiz> {
    const response = await apiRequest('POST', '/api/quiz-builder/exams', {
      ...examData,
      courseId,
    });
    return response.json();
  }

  // Get exam details with questions
  static async getExamDetails(examId: number): Promise<ExamDetails> {
    const response = await apiRequest('GET', `/api/quiz-builder/exams/${examId}`);
    return response.json();
  }

  // Update exam settings
  static async updateExamSettings(examId: number, settings: ExamSettings): Promise<Quiz> {
    const response = await apiRequest('PUT', `/api/quiz-builder/exams/${examId}`, settings);
    return response.json();
  }

  // Get question templates
  static async getQuestionTemplates(): Promise<{ [key: string]: QuestionTemplate }> {
    const response = await apiRequest('GET', '/api/quiz-builder/templates');
    return response.json();
  }

  // Get supported question types
  static async getSupportedQuestionTypes(): Promise<{ supportedTypes: string[] }> {
    const response = await apiRequest('GET', '/api/quiz-builder/question-types');
    return response.json();
  }

  // Add a new question to an exam
  static async addQuestion(examId: number, questionData: Partial<QuizQuestion>): Promise<QuizQuestion> {
    const response = await apiRequest('POST', `/api/quiz-builder/exams/${examId}/questions`, questionData);
    return response.json();
  }

  // Update an existing question
  static async updateQuestion(questionId: number, questionData: Partial<QuizQuestion>): Promise<QuizQuestion> {
    const response = await apiRequest('PUT', `/api/quiz-builder/questions/${questionId}`, questionData);
    return response.json();
  }

  // Delete a question
  static async deleteQuestion(questionId: number): Promise<void> {
    await apiRequest('DELETE', `/api/quiz-builder/questions/${questionId}`);
  }

  // Duplicate a question
  static async duplicateQuestion(questionId: number): Promise<QuizQuestion> {
    const response = await apiRequest('POST', `/api/quiz-builder/questions/${questionId}/duplicate`);
    return response.json();
  }

  // Reorder questions in an exam
  static async reorderQuestions(examId: number, questionOrder: number[]): Promise<void> {
    await apiRequest('PUT', `/api/quiz-builder/exams/${examId}/reorder`, { questionOrder });
  }

  // Validate an exam
  static async validateExam(examId: number): Promise<ValidationResult> {
    const response = await apiRequest('POST', `/api/quiz-builder/exams/${examId}/validate`);
    return response.json();
  }

  // Publish an exam
  static async publishExam(examId: number): Promise<Quiz> {
    const response = await apiRequest('POST', `/api/quiz-builder/exams/${examId}/publish`);
    return response.json();
  }

  // Bulk import questions
  static async bulkImportQuestions(examId: number, questions: Partial<QuizQuestion>[]): Promise<QuizQuestion[]> {
    const response = await apiRequest('POST', `/api/quiz-builder/exams/${examId}/bulk-import`, { questions });
    return response.json();
  }

  // Get exam analytics
  static async getExamAnalytics(examId: number): Promise<any> {
    const response = await apiRequest('GET', `/api/quiz-builder/exams/${examId}/analytics`);
    return response.json();
  }

  // Preview exam for students
  static async previewExam(examId: number): Promise<any> {
    const response = await apiRequest('GET', `/api/quiz-builder/exams/${examId}/preview`);
    return response.json();
  }

  // Export exam to various formats
  static async exportExam(examId: number, format: 'json' | 'pdf' | 'docx'): Promise<Blob> {
    const response = await apiRequest('GET', `/api/quiz-builder/exams/${examId}/export?format=${format}`);
    return response.blob();
  }

  // Import exam from file
  static async importExam(courseId: number, file: File): Promise<Quiz> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('courseId', courseId.toString());
    
    const response = await fetch('/api/quiz-builder/import', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('Failed to import exam');
    }
    
    return response.json();
  }

  // Get question statistics
  static async getQuestionStats(questionId: number): Promise<any> {
    const response = await apiRequest('GET', `/api/quiz-builder/questions/${questionId}/stats`);
    return response.json();
  }

  // AI-powered question generation
  static async generateQuestions(examId: number, topic: string, count: number, questionType?: string): Promise<QuizQuestion[]> {
    const response = await apiRequest('POST', `/api/quiz-builder/exams/${examId}/generate`, {
      topic,
      count,
      questionType,
    });
    return response.json();
  }

  // Save exam as template
  static async saveAsTemplate(examId: number, templateName: string): Promise<any> {
    const response = await apiRequest('POST', `/api/quiz-builder/exams/${examId}/save-template`, {
      templateName,
    });
    return response.json();
  }

  // Clone exam
  static async cloneExam(examId: number, newTitle?: string): Promise<Quiz> {
    const response = await apiRequest('POST', `/api/quiz-builder/exams/${examId}/clone`, {
      newTitle,
    });
    return response.json();
  }
}