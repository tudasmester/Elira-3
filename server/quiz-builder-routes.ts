import { Express, Request, Response } from 'express';
import { requireAuth } from './auth-working';
import { storage } from './storage';
import { z } from 'zod';

// Validation schemas
const createQuizSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  courseId: z.number(),
  timeLimit: z.number().optional(),
  attemptsAllowed: z.number().optional(),
  passingScore: z.number().optional(),
  examType: z.enum(['quiz', 'exam', 'assessment']).optional(),
  shuffleQuestions: z.boolean().optional(),
  showResults: z.boolean().optional(),
  showCorrectAnswers: z.boolean().optional(),
});

const updateQuizSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  timeLimit: z.number().optional(),
  attemptsAllowed: z.number().optional(),
  passingScore: z.number().optional(),
  examType: z.enum(['quiz', 'exam', 'assessment']).optional(),
  shuffleQuestions: z.boolean().optional(),
  showResults: z.boolean().optional(),
  showCorrectAnswers: z.boolean().optional(),
});

const createQuestionSchema = z.object({
  questionText: z.string().min(1),
  questionType: z.string(),
  points: z.number().optional(),
  orderIndex: z.number().optional(),
  isRequired: z.boolean().optional(),
  hideFromViewer: z.boolean().optional(),
});

const updateQuestionSchema = z.object({
  questionText: z.string().optional(),
  questionType: z.string().optional(),
  points: z.number().optional(),
  orderIndex: z.number().optional(),
  isRequired: z.boolean().optional(),
  hideFromViewer: z.boolean().optional(),
});

export function registerQuizBuilderRoutes(app: Express) {
  
  // Create a new exam/quiz
  app.post('/api/quiz-builder/exams', requireAuth, async (req: Request, res: Response) => {
    try {
      const validatedData = createQuizSchema.parse(req.body);
      
      const quiz = await storage.createQuiz({
        ...validatedData,
        isPublished: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      res.status(201).json(quiz);
    } catch (error) {
      console.error('Error creating quiz:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create quiz' });
    }
  });

  // Get exam details with questions
  app.get('/api/quiz-builder/exams/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const examId = parseInt(req.params.id);
      
      const exam = await storage.getQuiz(examId);
      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }
      
      const questions = await storage.getQuizQuestions(examId);
      
      res.json({
        exam,
        questions: questions || [],
      });
    } catch (error) {
      console.error('Error fetching exam details:', error);
      res.status(500).json({ message: 'Failed to fetch exam details' });
    }
  });

  // Update exam settings
  app.put('/api/quiz-builder/exams/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const examId = parseInt(req.params.id);
      const validatedData = updateQuizSchema.parse(req.body);
      
      const updatedQuiz = await storage.updateQuiz(examId, {
        ...validatedData,
        updatedAt: new Date(),
      });
      
      if (!updatedQuiz) {
        return res.status(404).json({ message: 'Exam not found' });
      }
      
      res.json(updatedQuiz);
    } catch (error) {
      console.error('Error updating exam:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update exam' });
    }
  });

  // Get question templates
  app.get('/api/quiz-builder/templates', requireAuth, async (req: Request, res: Response) => {
    try {
      const templates = {
        multiple_choice: {
          questionText: 'Melyik a helyes válasz?',
          questionType: 'multiple_choice',
          points: 1,
          options: [
            { optionText: 'A válasz', isCorrect: true, orderIndex: 0 },
            { optionText: 'B válasz', isCorrect: false, orderIndex: 1 },
            { optionText: 'C válasz', isCorrect: false, orderIndex: 2 },
            { optionText: 'D válasz', isCorrect: false, orderIndex: 3 },
          ],
        },
        true_false: {
          questionText: 'Ez az állítás igaz vagy hamis?',
          questionType: 'true_false',
          points: 1,
          options: [
            { optionText: 'Igaz', isCorrect: true, orderIndex: 0 },
            { optionText: 'Hamis', isCorrect: false, orderIndex: 1 },
          ],
        },
        short_text: {
          questionText: 'Írj egy rövid választ!',
          questionType: 'short_text',
          points: 1,
        },
        text_assignment: {
          questionText: 'Írj egy részletes esszét a témáról!',
          questionType: 'text_assignment',
          points: 5,
        },
      };
      
      res.json(templates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      res.status(500).json({ message: 'Failed to fetch templates' });
    }
  });

  // Get supported question types
  app.get('/api/quiz-builder/question-types', requireAuth, async (req: Request, res: Response) => {
    try {
      const supportedTypes = [
        'multiple_choice',
        'true_false',
        'short_text',
        'text_assignment',
        'file_assignment',
        'match_ordering',
        'video_recording',
        'audio_recording'
      ];
      
      res.json({ supportedTypes });
    } catch (error) {
      console.error('Error fetching question types:', error);
      res.status(500).json({ message: 'Failed to fetch question types' });
    }
  });

  // Add a new question to an exam
  app.post('/api/quiz-builder/exams/:id/questions', requireAuth, async (req: Request, res: Response) => {
    try {
      const examId = parseInt(req.params.id);
      const validatedData = createQuestionSchema.parse(req.body);
      
      // Check if exam exists
      const exam = await storage.getQuiz(examId);
      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }
      
      const question = await storage.createQuizQuestion({
        ...validatedData,
        quizId: examId,
        createdAt: new Date(),
      });
      
      res.status(201).json(question);
    } catch (error) {
      console.error('Error creating question:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create question' });
    }
  });

  // Update an existing question
  app.put('/api/quiz-builder/questions/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const questionId = parseInt(req.params.id);
      const validatedData = updateQuestionSchema.parse(req.body);
      
      const updatedQuestion = await storage.updateQuizQuestion(questionId, validatedData);
      
      if (!updatedQuestion) {
        return res.status(404).json({ message: 'Question not found' });
      }
      
      res.json(updatedQuestion);
    } catch (error) {
      console.error('Error updating question:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid input data', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update question' });
    }
  });

  // Delete a question
  app.delete('/api/quiz-builder/questions/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const questionId = parseInt(req.params.id);
      
      const deleted = await storage.deleteQuizQuestion(questionId);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Question not found' });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting question:', error);
      res.status(500).json({ message: 'Failed to delete question' });
    }
  });

  // Duplicate a question
  app.post('/api/quiz-builder/questions/:id/duplicate', requireAuth, async (req: Request, res: Response) => {
    try {
      const questionId = parseInt(req.params.id);
      
      const originalQuestion = await storage.getQuizQuestion(questionId);
      if (!originalQuestion) {
        return res.status(404).json({ message: 'Question not found' });
      }
      
      const duplicatedQuestion = await storage.createQuizQuestion({
        ...originalQuestion,
        id: undefined, // Remove ID so a new one is generated
        questionText: `${originalQuestion.questionText} (másolat)`,
        createdAt: new Date(),
      });
      
      res.status(201).json(duplicatedQuestion);
    } catch (error) {
      console.error('Error duplicating question:', error);
      res.status(500).json({ message: 'Failed to duplicate question' });
    }
  });

  // Reorder questions in an exam
  app.put('/api/quiz-builder/exams/:id/reorder', requireAuth, async (req: Request, res: Response) => {
    try {
      const examId = parseInt(req.params.id);
      const { questionOrder } = req.body;
      
      if (!Array.isArray(questionOrder)) {
        return res.status(400).json({ message: 'Question order must be an array' });
      }
      
      // Update order index for each question
      for (let i = 0; i < questionOrder.length; i++) {
        await storage.updateQuizQuestion(questionOrder[i], { orderIndex: i });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error('Error reordering questions:', error);
      res.status(500).json({ message: 'Failed to reorder questions' });
    }
  });

  // Validate an exam
  app.post('/api/quiz-builder/exams/:id/validate', requireAuth, async (req: Request, res: Response) => {
    try {
      const examId = parseInt(req.params.id);
      
      const exam = await storage.getQuiz(examId);
      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }
      
      const questions = await storage.getQuizQuestions(examId);
      
      const errors: string[] = [];
      const warnings: string[] = [];
      
      // Validation rules
      if (!exam.title || exam.title.trim().length === 0) {
        errors.push('A vizsga címe kötelező');
      }
      
      if (!questions || questions.length === 0) {
        errors.push('A vizsgának legalább egy kérdést tartalmaznia kell');
      } else {
        questions.forEach((question, index) => {
          if (!question.questionText || question.questionText.trim().length === 0) {
            errors.push(`A ${index + 1}. kérdés szövege hiányzik`);
          }
          
          if (!question.points || question.points <= 0) {
            warnings.push(`A ${index + 1}. kérdéshez nincs pontszám megadva`);
          }
        });
      }
      
      const isValid = errors.length === 0;
      
      res.json({
        isValid,
        errors,
        warnings,
      });
    } catch (error) {
      console.error('Error validating exam:', error);
      res.status(500).json({ message: 'Failed to validate exam' });
    }
  });

  // Publish an exam
  app.post('/api/quiz-builder/exams/:id/publish', requireAuth, async (req: Request, res: Response) => {
    try {
      const examId = parseInt(req.params.id);
      
      // First validate the exam
      const exam = await storage.getQuiz(examId);
      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }
      
      const questions = await storage.getQuizQuestions(examId);
      
      if (!questions || questions.length === 0) {
        return res.status(400).json({ message: 'Cannot publish exam without questions' });
      }
      
      const updatedQuiz = await storage.updateQuiz(examId, {
        isPublished: 1,
        updatedAt: new Date(),
      });
      
      res.json(updatedQuiz);
    } catch (error) {
      console.error('Error publishing exam:', error);
      res.status(500).json({ message: 'Failed to publish exam' });
    }
  });

  // Get exam analytics
  app.get('/api/quiz-builder/exams/:id/analytics', requireAuth, async (req: Request, res: Response) => {
    try {
      const examId = parseInt(req.params.id);
      
      const exam = await storage.getQuiz(examId);
      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }
      
      const questions = await storage.getQuizQuestions(examId);
      const totalQuestions = questions?.length || 0;
      const totalPoints = questions?.reduce((sum, q) => sum + (q.points || 0), 0) || 0;
      
      // Mock analytics data for now
      const analytics = {
        totalAttempts: 0,
        averageScore: 0,
        passRate: 0,
        averageTimeSpent: 0,
        questionStats: questions?.map(q => ({
          questionId: q.id,
          correctAnswers: 0,
          incorrectAnswers: 0,
          averageTimeSpent: 0,
        })) || [],
        totalQuestions,
        totalPoints,
        publishedAt: exam.isPublished ? exam.updatedAt : null,
      };
      
      res.json(analytics);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      res.status(500).json({ message: 'Failed to fetch analytics' });
    }
  });

  // Clone exam
  app.post('/api/quiz-builder/exams/:id/clone', requireAuth, async (req: Request, res: Response) => {
    try {
      const examId = parseInt(req.params.id);
      const { newTitle } = req.body;
      
      const originalExam = await storage.getQuiz(examId);
      if (!originalExam) {
        return res.status(404).json({ message: 'Exam not found' });
      }
      
      const clonedExam = await storage.createQuiz({
        ...originalExam,
        id: undefined, // Remove ID so a new one is generated
        title: newTitle || `${originalExam.title} (másolat)`,
        isPublished: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      // Clone questions too
      const originalQuestions = await storage.getQuizQuestions(examId);
      if (originalQuestions && originalQuestions.length > 0) {
        for (const question of originalQuestions) {
          await storage.createQuizQuestion({
            ...question,
            id: undefined,
            quizId: clonedExam.id,
            createdAt: new Date(),
          });
        }
      }
      
      res.status(201).json(clonedExam);
    } catch (error) {
      console.error('Error cloning exam:', error);
      res.status(500).json({ message: 'Failed to clone exam' });
    }
  });
}