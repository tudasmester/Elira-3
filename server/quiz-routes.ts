import type { Express, Request, Response } from "express";
import { requireAuth } from "./auth-working";
import { storage } from "./storage";
import { isAdmin } from "./adminAuth";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isAdmin: number;
  };
}

export function registerQuizRoutes(app: Express) {
  // Get quizzes for a lesson
  app.get('/api/lessons/:lessonId/quizzes', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const lessonId = parseInt(req.params.lessonId);
      const quizzes = await storage.getQuizzesByLesson(lessonId);
      res.json(quizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      res.status(500).json({ message: 'Failed to fetch quizzes' });
    }
  });

  // Create a new quiz
  app.post('/api/quizzes', requireAuth, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const quizData = {
        ...req.body,
        status: 'active'
      };
      const quiz = await storage.createQuiz(quizData);
      res.status(201).json(quiz);
    } catch (error) {
      console.error('Error creating quiz:', error);
      res.status(500).json({ message: 'Failed to create quiz' });
    }
  });

  // Update a quiz
  app.put('/api/quizzes/:id', requireAuth, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const quizId = parseInt(req.params.id);
      const quiz = await storage.updateQuiz(quizId, req.body);
      res.json(quiz);
    } catch (error) {
      console.error('Error updating quiz:', error);
      res.status(500).json({ message: 'Failed to update quiz' });
    }
  });

  // Delete a quiz
  app.delete('/api/quizzes/:id', requireAuth, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const quizId = parseInt(req.params.id);
      await storage.deleteQuiz(quizId);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting quiz:', error);
      res.status(500).json({ message: 'Failed to delete quiz' });
    }
  });

  // Get questions for a quiz
  app.get('/api/quizzes/:quizId/questions', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const quizId = parseInt(req.params.quizId);
      const questions = await storage.getQuizQuestions(quizId);
      res.json(questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      res.status(500).json({ message: 'Failed to fetch questions' });
    }
  });

  // Create a new question
  app.post('/api/quiz-questions', requireAuth, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const questionData = {
        ...req.body,
        orderIndex: req.body.orderIndex || 0
      };
      const question = await storage.createQuizQuestion(questionData);
      res.status(201).json(question);
    } catch (error) {
      console.error('Error creating question:', error);
      res.status(500).json({ message: 'Failed to create question' });
    }
  });

  // Update a question
  app.put('/api/quiz-questions/:id', requireAuth, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const questionId = parseInt(req.params.id);
      const question = await storage.updateQuizQuestion(questionId, req.body);
      res.json(question);
    } catch (error) {
      console.error('Error updating question:', error);
      res.status(500).json({ message: 'Failed to update question' });
    }
  });

  // Delete a question
  app.delete('/api/quiz-questions/:id', requireAuth, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const questionId = parseInt(req.params.id);
      await storage.deleteQuizQuestion(questionId);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting question:', error);
      res.status(500).json({ message: 'Failed to delete question' });
    }
  });

  // Create question options
  app.post('/api/questions/:questionId/options', requireAuth, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const questionId = parseInt(req.params.questionId);
      const options = req.body.options || [];
      
      // Delete existing options first
      await storage.deleteQuestionOptions(questionId);
      
      // Create new options
      const createdOptions = [];
      for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const optionData = {
          questionId,
          optionText: option.optionText,
          isCorrect: option.isCorrect,
          order: i
        };
        const createdOption = await storage.createQuestionOption(optionData);
        createdOptions.push(createdOption);
      }
      
      res.status(201).json(createdOptions);
    } catch (error) {
      console.error('Error creating options:', error);
      res.status(500).json({ message: 'Failed to create options' });
    }
  });

  // Get quiz with questions and options
  app.get('/api/quizzes/:id/full', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const quizId = parseInt(req.params.id);
      const quiz = await storage.getQuiz(quizId);
      
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      
      const questions = await storage.getQuizQuestions(quizId);
      const questionsWithOptions = await Promise.all(
        questions.map(async (question) => {
          const options = await storage.getQuestionOptions(question.id);
          return { ...question, options };
        })
      );
      
      res.json({ ...quiz, questions: questionsWithOptions });
    } catch (error) {
      console.error('Error fetching full quiz:', error);
      res.status(500).json({ message: 'Failed to fetch quiz' });
    }
  });
}