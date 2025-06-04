import { db } from "../db";
import { quizQuestions, quizQuestionOptions, type InsertQuizQuestion, type InsertQuizQuestionOption } from "@shared/schema";
import { eq, and } from "drizzle-orm";

export interface QuestionValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface QuestionServiceInterface {
  validateQuestionData(data: any): QuestionValidationResult;
  saveQuestion(data: InsertQuizQuestion): Promise<any>;
  updateQuestion(questionId: number, data: Partial<InsertQuizQuestion>): Promise<any>;
  deleteQuestion(questionId: number): Promise<void>;
  getQuestionWithOptions(questionId: number): Promise<any>;
}

export abstract class BaseQuestionService implements QuestionServiceInterface {
  
  abstract validateQuestionData(data: any): QuestionValidationResult;

  async saveQuestion(data: InsertQuizQuestion): Promise<any> {
    const validation = this.validateQuestionData(data);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    const [question] = await db.insert(quizQuestions).values(data).returning();
    return question;
  }

  async updateQuestion(questionId: number, data: Partial<InsertQuizQuestion>): Promise<any> {
    if (Object.keys(data).length > 0) {
      const validation = this.validateQuestionData(data);
      if (!validation.isValid) {
        throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
      }
    }

    const [updatedQuestion] = await db
      .update(quizQuestions)
      .set(data)
      .where(eq(quizQuestions.id, questionId))
      .returning();

    return updatedQuestion;
  }

  async deleteQuestion(questionId: number): Promise<void> {
    // Delete options first (foreign key constraint)
    await db.delete(quizQuestionOptions).where(eq(quizQuestionOptions.questionId, questionId));
    // Delete question
    await db.delete(quizQuestions).where(eq(quizQuestions.id, questionId));
  }

  async getQuestionWithOptions(questionId: number): Promise<any> {
    const [question] = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.id, questionId));

    if (!question) {
      throw new Error('Question not found');
    }

    const options = await db
      .select()
      .from(quizQuestionOptions)
      .where(eq(quizQuestionOptions.questionId, questionId))
      .orderBy(quizQuestionOptions.orderIndex);

    return {
      ...question,
      options
    };
  }

  protected async saveOptions(questionId: number, options: InsertQuizQuestionOption[]): Promise<any[]> {
    if (!options || options.length === 0) return [];

    const optionsWithQuestionId = options.map((option, index) => ({
      ...option,
      questionId,
      orderIndex: option.orderIndex ?? index
    }));

    return await db.insert(quizQuestionOptions).values(optionsWithQuestionId).returning();
  }

  protected async updateOptions(questionId: number, options: InsertQuizQuestionOption[]): Promise<any[]> {
    // Delete existing options
    await db.delete(quizQuestionOptions).where(eq(quizQuestionOptions.questionId, questionId));
    
    // Insert new options
    return await this.saveOptions(questionId, options);
  }
}

// Multiple Choice Question Service
export class MultipleChoiceQuestionService extends BaseQuestionService {
  
  validateQuestionData(data: any): QuestionValidationResult {
    const errors: string[] = [];

    if (!data.questionText || data.questionText.trim() === '') {
      errors.push('Question text is required');
    }

    if (data.questionType !== 'multiple_choice') {
      errors.push('Invalid question type for multiple choice');
    }

    // Validate options if provided
    if (data.options) {
      if (!Array.isArray(data.options) || data.options.length < 2) {
        errors.push('Multiple choice questions must have at least 2 options');
      }

      const hasCorrectAnswer = data.options.some((option: any) => option.isCorrect);
      if (!hasCorrectAnswer) {
        errors.push('At least one option must be marked as correct');
      }

      // Validate each option
      data.options.forEach((option: any, index: number) => {
        if (!option.optionText || option.optionText.trim() === '') {
          errors.push(`Option ${index + 1} text is required`);
        }
        if (typeof option.isCorrect !== 'boolean') {
          errors.push(`Option ${index + 1} must have a valid isCorrect value`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async saveQuestion(data: InsertQuizQuestion & { options?: InsertQuizQuestionOption[] }): Promise<any> {
    const { options, ...questionData } = data;
    
    const question = await super.saveQuestion(questionData);
    
    if (options && options.length > 0) {
      const savedOptions = await this.saveOptions(question.id, options);
      return {
        ...question,
        options: savedOptions
      };
    }

    return question;
  }

  async updateQuestion(questionId: number, data: Partial<InsertQuizQuestion> & { options?: InsertQuizQuestionOption[] }): Promise<any> {
    const { options, ...questionData } = data;
    
    const updatedQuestion = await super.updateQuestion(questionId, questionData);
    
    if (options) {
      const updatedOptions = await this.updateOptions(questionId, options);
      return {
        ...updatedQuestion,
        options: updatedOptions
      };
    }

    return updatedQuestion;
  }
}

// True/False Question Service
export class TrueFalseQuestionService extends BaseQuestionService {
  
  validateQuestionData(data: any): QuestionValidationResult {
    const errors: string[] = [];

    if (!data.questionText || data.questionText.trim() === '') {
      errors.push('Question text is required');
    }

    if (data.questionType !== 'true_false') {
      errors.push('Invalid question type for true/false');
    }

    if (data.correctAnswer !== undefined && typeof data.correctAnswer !== 'boolean') {
      errors.push('Correct answer must be true or false');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async saveQuestion(data: InsertQuizQuestion & { correctAnswer?: boolean }): Promise<any> {
    const question = await super.saveQuestion(data);
    
    // Auto-create True/False options
    const trueOption: InsertQuizQuestionOption = {
      questionId: question.id,
      optionText: 'Igaz',
      isCorrect: data.correctAnswer === true,
      orderIndex: 0
    };

    const falseOption: InsertQuizQuestionOption = {
      questionId: question.id,
      optionText: 'Hamis',
      isCorrect: data.correctAnswer === false,
      orderIndex: 1
    };

    const options = await this.saveOptions(question.id, [trueOption, falseOption]);
    
    return {
      ...question,
      options
    };
  }

  async updateQuestion(questionId: number, data: Partial<InsertQuizQuestion>): Promise<any> {
    const updatedQuestion = await super.updateQuestion(questionId, data);
    
    // Update True/False options if correctAnswer changed
    if (data.correctAnswer !== undefined) {
      const trueOption: InsertQuizQuestionOption = {
        questionId,
        optionText: 'Igaz',
        isCorrect: data.correctAnswer === true,
        orderIndex: 0
      };

      const falseOption: InsertQuizQuestionOption = {
        questionId,
        optionText: 'Hamis',
        isCorrect: data.correctAnswer === false,
        orderIndex: 1
      };

      const options = await this.updateOptions(questionId, [trueOption, falseOption]);
      
      return {
        ...updatedQuestion,
        options
      };
    }

    return updatedQuestion;
  }
}

// Text-based Question Service
export class TextQuestionService extends BaseQuestionService {
  
  validateQuestionData(data: any): QuestionValidationResult {
    const errors: string[] = [];

    if (!data.questionText || data.questionText.trim() === '') {
      errors.push('Question text is required');
    }

    const validTextTypes = ['short_text', 'long_text', 'essay'];
    if (!validTextTypes.includes(data.questionType)) {
      errors.push('Invalid question type for text questions');
    }

    // Validate word limits if provided
    if (data.maxWords !== undefined && (data.maxWords < 1 || data.maxWords > 10000)) {
      errors.push('Maximum words must be between 1 and 10000');
    }

    if (data.minWords !== undefined && data.minWords < 0) {
      errors.push('Minimum words cannot be negative');
    }

    if (data.maxWords !== undefined && data.minWords !== undefined && data.minWords > data.maxWords) {
      errors.push('Minimum words cannot be greater than maximum words');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// File Upload Question Service
export class FileUploadQuestionService extends BaseQuestionService {
  
  validateQuestionData(data: any): QuestionValidationResult {
    const errors: string[] = [];

    if (!data.questionText || data.questionText.trim() === '') {
      errors.push('Question text is required');
    }

    if (data.questionType !== 'file_upload') {
      errors.push('Invalid question type for file upload');
    }

    // Validate file constraints
    if (data.maxFileSize !== undefined && (data.maxFileSize < 1 || data.maxFileSize > 100)) {
      errors.push('Maximum file size must be between 1MB and 100MB');
    }

    if (data.allowedFileTypes && Array.isArray(data.allowedFileTypes)) {
      const validTypes = ['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png', 'gif', 'mp4', 'avi', 'mov', 'mp3', 'wav'];
      const invalidTypes = data.allowedFileTypes.filter((type: string) => !validTypes.includes(type));
      if (invalidTypes.length > 0) {
        errors.push(`Invalid file types: ${invalidTypes.join(', ')}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Match & Ordering Question Service
export class MatchOrderingQuestionService extends BaseQuestionService {
  
  validateQuestionData(data: any): QuestionValidationResult {
    const errors: string[] = [];

    if (!data.questionText || data.questionText.trim() === '') {
      errors.push('Question text is required');
    }

    const validTypes = ['matching', 'ordering', 'drag_drop'];
    if (!validTypes.includes(data.questionType)) {
      errors.push('Invalid question type for match & ordering');
    }

    // Validate pairs for matching questions
    if (data.questionType === 'matching' && data.matchingPairs) {
      if (!Array.isArray(data.matchingPairs) || data.matchingPairs.length < 2) {
        errors.push('Matching questions must have at least 2 pairs');
      }

      data.matchingPairs.forEach((pair: any, index: number) => {
        if (!pair.left || pair.left.trim() === '') {
          errors.push(`Matching pair ${index + 1} left side is required`);
        }
        if (!pair.right || pair.right.trim() === '') {
          errors.push(`Matching pair ${index + 1} right side is required`);
        }
      });
    }

    // Validate items for ordering questions
    if (data.questionType === 'ordering' && data.orderingItems) {
      if (!Array.isArray(data.orderingItems) || data.orderingItems.length < 2) {
        errors.push('Ordering questions must have at least 2 items');
      }

      data.orderingItems.forEach((item: any, index: number) => {
        if (!item.text || item.text.trim() === '') {
          errors.push(`Ordering item ${index + 1} text is required`);
        }
        if (typeof item.correctOrder !== 'number' || item.correctOrder < 1) {
          errors.push(`Ordering item ${index + 1} must have a valid correct order`);
        }
      });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  async saveQuestion(data: InsertQuizQuestion & { matchingPairs?: any[], orderingItems?: any[] }): Promise<any> {
    const { matchingPairs, orderingItems, ...questionData } = data;
    
    const question = await super.saveQuestion(questionData);
    
    // Save matching pairs as options
    if (matchingPairs && matchingPairs.length > 0) {
      const options = matchingPairs.map((pair, index) => ({
        questionId: question.id,
        optionText: pair.left,
        optionValue: pair.right,
        isCorrect: true,
        orderIndex: index
      }));
      
      const savedOptions = await this.saveOptions(question.id, options);
      return {
        ...question,
        options: savedOptions,
        matchingPairs
      };
    }

    // Save ordering items as options
    if (orderingItems && orderingItems.length > 0) {
      const options = orderingItems.map((item, index) => ({
        questionId: question.id,
        optionText: item.text,
        optionValue: item.correctOrder.toString(),
        isCorrect: true,
        orderIndex: index
      }));
      
      const savedOptions = await this.saveOptions(question.id, options);
      return {
        ...question,
        options: savedOptions,
        orderingItems
      };
    }

    return question;
  }
}

// Question Service Factory
export class QuestionServiceFactory {
  static getService(questionType: string): BaseQuestionService {
    switch (questionType) {
      case 'multiple_choice':
        return new MultipleChoiceQuestionService();
      case 'true_false':
        return new TrueFalseQuestionService();
      case 'short_text':
      case 'long_text':
      case 'essay':
        return new TextQuestionService();
      case 'file_upload':
        return new FileUploadQuestionService();
      case 'matching':
      case 'ordering':
      case 'drag_drop':
        return new MatchOrderingQuestionService();
      default:
        throw new Error(`Unsupported question type: ${questionType}`);
    }
  }

  static getSupportedTypes(): string[] {
    return [
      'multiple_choice',
      'true_false',
      'short_text',
      'long_text',
      'essay',
      'file_upload',
      'matching',
      'ordering',
      'drag_drop'
    ];
  }
}