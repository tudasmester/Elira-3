import { db } from "../db";
import { 
  quizzes, 
  quizQuestions, 
  quizQuestionOptions,
  insertQuizSchema,
  insertQuizQuestionSchema,
  insertQuizQuestionOptionSchema,
  type Quiz,
  type QuizQuestion,
  type QuizQuestionOption,
  type InsertQuiz,
  type InsertQuizQuestion,
  type InsertQuizQuestionOption,
  QUESTION_TYPES
} from "@shared/schema";
import { eq, and, asc, desc, sql } from "drizzle-orm";
import { QuestionServiceFactory } from "./QuestionTypeService";

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
  options?: InsertQuizQuestionOption[];
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

export class ExamBuilderService {
  
  /**
   * Create a new blank exam
   */
  async createExam(courseId: number, examData: ExamCreationData, createdBy: string): Promise<Quiz> {
    try {
      const insertData: InsertQuiz = {
        title: examData.title,
        description: examData.description,
        lessonId: null, // Course-level exam
        courseId: courseId,
        timeLimit: examData.timeLimit || 60,
        shuffleQuestions: examData.shuffleQuestions || false,
        attemptsAllowed: examData.attemptsAllowed || 3,
        passingScore: examData.passingScore || 70,
        showResults: examData.showResults !== false,
        showCorrectAnswers: examData.showCorrectAnswers !== false,
        examType: examData.examType || 'quiz',
        createdBy
      };

      const validatedData = insertQuizSchema.parse(insertData);
      const [exam] = await db.insert(quizzes).values(validatedData).returning();
      
      return exam;
    } catch (error) {
      throw new Error(`Failed to create exam: ${error.message}`);
    }
  }

  /**
   * Add a question to an exam using specialized question services
   */
  async addQuestion(examId: number, questionData: any): Promise<QuizQuestion> {
    try {
      // Validate exam exists
      const [exam] = await db.select().from(quizzes).where(eq(quizzes.id, examId));
      if (!exam) {
        throw new Error('Exam not found');
      }

      // Get next order index
      const [{ maxOrder }] = await db
        .select({ maxOrder: sql<number>`COALESCE(MAX(${quizQuestions.orderIndex}), 0)` })
        .from(quizQuestions)
        .where(eq(quizQuestions.quizId, examId));

      // Get specialized service for question type
      const questionService = QuestionServiceFactory.getService(questionData.questionType);
      
      const questionWithOrder = {
        ...questionData,
        quizId: examId,
        orderIndex: maxOrder + 1
      };

      // Use specialized service to save question with type-specific validation
      const savedQuestion = await questionService.saveQuestion(questionWithOrder);
      
      return savedQuestion;
    } catch (error) {
      throw new Error(`Failed to add question: ${error.message}`);
    }
  }

  /**
   * Bulk import questions to an exam
   */
  async bulkImportQuestions(examId: number, questions: QuestionTemplate[]): Promise<QuizQuestion[]> {
    try {
      const savedQuestions: QuizQuestion[] = [];
      
      for (let i = 0; i < questions.length; i++) {
        const questionData = {
          ...questions[i],
          quizId: examId,
          orderIndex: i + 1
        };
        
        const savedQuestion = await this.addQuestion(examId, questionData);
        savedQuestions.push(savedQuestion);
      }
      
      return savedQuestions;
    } catch (error) {
      throw new Error(`Failed to bulk import questions: ${error.message}`);
    }
  }

  /**
   * Duplicate a question within an exam
   */
  async duplicateQuestion(questionId: number): Promise<QuizQuestion> {
    try {
      // Get original question with options
      const [originalQuestion] = await db
        .select()
        .from(quizQuestions)
        .where(eq(quizQuestions.id, questionId));

      if (!originalQuestion) {
        throw new Error('Question not found');
      }

      const originalOptions = await db
        .select()
        .from(quizQuestionOptions)
        .where(eq(quizQuestionOptions.questionId, questionId))
        .orderBy(asc(quizQuestionOptions.orderIndex));

      // Get next order index for the exam
      const [{ maxOrder }] = await db
        .select({ maxOrder: sql<number>`COALESCE(MAX(${quizQuestions.orderIndex}), 0)` })
        .from(quizQuestions)
        .where(eq(quizQuestions.quizId, originalQuestion.quizId));

      // Create duplicate question
      const duplicateData = {
        ...originalQuestion,
        questionText: `${originalQuestion.questionText} (Copy)`,
        orderIndex: maxOrder + 1
      };
      delete (duplicateData as any).id;

      const [duplicatedQuestion] = await db
        .insert(quizQuestions)
        .values(duplicateData)
        .returning();

      // Duplicate options if they exist
      if (originalOptions.length > 0) {
        const duplicateOptions = originalOptions.map(option => ({
          ...option,
          questionId: duplicatedQuestion.id
        }));
        
        // Remove id field from options
        duplicateOptions.forEach(option => delete (option as any).id);
        
        await db.insert(quizQuestionOptions).values(duplicateOptions);
      }

      return duplicatedQuestion;
    } catch (error) {
      throw new Error(`Failed to duplicate question: ${error.message}`);
    }
  }

  /**
   * Reorder questions in an exam
   */
  async reorderQuestions(examId: number, questionOrder: number[]): Promise<void> {
    try {
      // Validate that all questions belong to the exam
      const questions = await db
        .select()
        .from(quizQuestions)
        .where(eq(quizQuestions.quizId, examId));

      const questionIds = questions.map(q => q.id);
      const invalidIds = questionOrder.filter(id => !questionIds.includes(id));
      
      if (invalidIds.length > 0) {
        throw new Error(`Invalid question IDs: ${invalidIds.join(', ')}`);
      }

      // Update order for each question
      for (let i = 0; i < questionOrder.length; i++) {
        await db
          .update(quizQuestions)
          .set({ orderIndex: i + 1 })
          .where(eq(quizQuestions.id, questionOrder[i]));
      }
    } catch (error) {
      throw new Error(`Failed to reorder questions: ${error.message}`);
    }
  }

  /**
   * Update exam settings
   */
  async updateExamSettings(examId: number, settings: ExamSettings): Promise<Quiz> {
    try {
      const updateData = insertQuizSchema.partial().parse(settings);
      
      const [updatedExam] = await db
        .update(quizzes)
        .set(updateData)
        .where(eq(quizzes.id, examId))
        .returning();

      if (!updatedExam) {
        throw new Error('Exam not found');
      }

      return updatedExam;
    } catch (error) {
      throw new Error(`Failed to update exam settings: ${error.message}`);
    }
  }

  /**
   * Validate exam completeness and readiness for publishing
   */
  async validateExam(examId: number): Promise<ExamValidationResult> {
    try {
      const [exam] = await db.select().from(quizzes).where(eq(quizzes.id, examId));
      if (!exam) {
        throw new Error('Exam not found');
      }

      const questions = await db
        .select()
        .from(quizQuestions)
        .where(eq(quizQuestions.quizId, examId))
        .orderBy(asc(quizQuestions.orderIndex));

      const errors: string[] = [];
      const warnings: string[] = [];

      // Basic validation
      if (!exam.title || exam.title.trim() === '') {
        errors.push('Exam title is required');
      }

      if (!exam.description || exam.description.trim() === '') {
        warnings.push('Exam description is recommended');
      }

      if (questions.length === 0) {
        errors.push('Exam must have at least one question');
      }

      // Question validation
      let totalPoints = 0;
      for (const question of questions) {
        if (!question.questionText || question.questionText.trim() === '') {
          errors.push(`Question ${question.orderIndex} is missing question text`);
        }

        totalPoints += question.points || 0;

        // Type-specific validation
        if (question.questionType === 'multiple_choice') {
          const options = await db
            .select()
            .from(quizQuestionOptions)
            .where(eq(quizQuestionOptions.questionId, question.id));

          if (options.length < 2) {
            errors.push(`Multiple choice question ${question.orderIndex} needs at least 2 options`);
          }

          const correctOptions = options.filter(opt => opt.isCorrect);
          if (correctOptions.length === 0) {
            errors.push(`Multiple choice question ${question.orderIndex} needs at least one correct answer`);
          }
        }
      }

      // Settings validation
      if (exam.timeLimit && exam.timeLimit < 1) {
        errors.push('Time limit must be at least 1 minute');
      }

      if (exam.passingScore && (exam.passingScore < 0 || exam.passingScore > 100)) {
        errors.push('Passing score must be between 0 and 100');
      }

      if (totalPoints === 0) {
        warnings.push('Consider adding points to questions for proper scoring');
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        questionCount: questions.length,
        totalPoints
      };
    } catch (error) {
      throw new Error(`Failed to validate exam: ${error.message}`);
    }
  }

  /**
   * Publish an exam (make it available to students)
   */
  async publishExam(examId: number): Promise<Quiz> {
    try {
      // Validate exam before publishing
      const validation = await this.validateExam(examId);
      if (!validation.isValid) {
        throw new Error(`Cannot publish exam: ${validation.errors.join(', ')}`);
      }

      const [publishedExam] = await db
        .update(quizzes)
        .set({ 
          isPublished: true,
          publishedAt: new Date()
        })
        .where(eq(quizzes.id, examId))
        .returning();

      if (!publishedExam) {
        throw new Error('Exam not found');
      }

      return publishedExam;
    } catch (error) {
      throw new Error(`Failed to publish exam: ${error.message}`);
    }
  }

  /**
   * Generate exam preview for testing
   */
  async generateExamPreview(examId: number): Promise<ExamPreview> {
    try {
      const [exam] = await db.select().from(quizzes).where(eq(quizzes.id, examId));
      if (!exam) {
        throw new Error('Exam not found');
      }

      const questions = await db
        .select()
        .from(quizQuestions)
        .where(eq(quizQuestions.quizId, examId))
        .orderBy(asc(quizQuestions.orderIndex));

      // Get options for each question
      const questionsWithOptions = await Promise.all(
        questions.map(async (question) => {
          const options = await db
            .select()
            .from(quizQuestionOptions)
            .where(eq(quizQuestionOptions.questionId, question.id))
            .orderBy(asc(quizQuestionOptions.orderIndex));

          return {
            ...question,
            options: options.length > 0 ? options : undefined
          };
        })
      );

      const totalPoints = questions.reduce((sum, q) => sum + (q.points || 0), 0);
      const estimatedDuration = Math.max(
        exam.timeLimit || 0,
        questions.length * 2 // 2 minutes per question as baseline
      );

      return {
        exam,
        questions: questionsWithOptions,
        totalQuestions: questions.length,
        totalPoints,
        estimatedDuration,
        settings: {
          timeLimit: exam.timeLimit,
          shuffleQuestions: exam.shuffleQuestions,
          attemptsAllowed: exam.attemptsAllowed,
          passingScore: exam.passingScore,
          showResults: exam.showResults,
          showCorrectAnswers: exam.showCorrectAnswers,
          examType: exam.examType
        }
      };
    } catch (error) {
      throw new Error(`Failed to generate exam preview: ${error.message}`);
    }
  }

  /**
   * Get exam with all questions and options
   */
  async getExamDetails(examId: number): Promise<ExamPreview> {
    return this.generateExamPreview(examId);
  }

  /**
   * Delete an exam and all related data
   */
  async deleteExam(examId: number): Promise<void> {
    try {
      // Get all questions for this exam
      const questions = await db
        .select()
        .from(quizQuestions)
        .where(eq(quizQuestions.quizId, examId));

      // Delete all question options first
      for (const question of questions) {
        await db
          .delete(quizQuestionOptions)
          .where(eq(quizQuestionOptions.questionId, question.id));
      }

      // Delete all questions
      await db.delete(quizQuestions).where(eq(quizQuestions.quizId, examId));

      // Delete the exam
      await db.delete(quizzes).where(eq(quizzes.id, examId));
    } catch (error) {
      throw new Error(`Failed to delete exam: ${error.message}`);
    }
  }

  /**
   * Create question templates for common question types
   */
  static getQuestionTemplates(): { [key: string]: QuestionTemplate } {
    return {
      multiple_choice: {
        questionType: 'multiple_choice',
        questionText: 'Select the correct answer:',
        points: 1,
        isRequired: true,
        options: [
          { optionText: 'Option A', isCorrect: true, orderIndex: 0 },
          { optionText: 'Option B', isCorrect: false, orderIndex: 1 },
          { optionText: 'Option C', isCorrect: false, orderIndex: 2 },
          { optionText: 'Option D', isCorrect: false, orderIndex: 3 }
        ]
      },
      true_false: {
        questionType: 'true_false',
        questionText: 'True or False:',
        points: 1,
        isRequired: true
      },
      short_text: {
        questionType: 'short_text',
        questionText: 'Answer the following question:',
        points: 2,
        isRequired: true
      },
      text_assignment: {
        questionType: 'text_assignment',
        questionText: 'Write a detailed response:',
        points: 5,
        isRequired: true
      },
      file_assignment: {
        questionType: 'file_assignment',
        questionText: 'Upload your assignment:',
        points: 10,
        isRequired: true
      }
    };
  }

  /**
   * Get supported question types from factory
   */
  static getSupportedQuestionTypes(): string[] {
    return QuestionServiceFactory.getSupportedTypes();
  }
}