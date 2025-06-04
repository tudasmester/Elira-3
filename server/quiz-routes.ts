import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import { requireAuth } from "./auth-working";
import { isAdmin } from "./adminAuth";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export function registerQuizRoutes(app: Express) {
  // **Quiz Management (Admin):**

  // Create quiz for lesson
  app.post('/api/admin/lessons/:lessonId/quizzes', requireAuth, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const lessonId = parseInt(req.params.lessonId);
      const quizData = { ...req.body, lessonId };
      const quiz = await storage.createQuiz(quizData);
      res.json(quiz);
    } catch (error) {
      console.error("Error creating quiz:", error);
      res.status(500).json({ message: "Failed to create quiz" });
    }
  });

  // Get quiz details with questions and options
  app.get('/api/admin/quizzes/:quizId', requireAuth, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const quizId = parseInt(req.params.quizId);
      const quiz = await storage.getQuizWithDetails(quizId);
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found" });
      }
      res.json(quiz);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      res.status(500).json({ message: "Failed to fetch quiz" });
    }
  });

  // Update quiz
  app.put('/api/admin/quizzes/:quizId', requireAuth, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const quizId = parseInt(req.params.quizId);
      const quiz = await storage.updateQuiz(quizId, req.body);
      res.json(quiz);
    } catch (error) {
      console.error("Error updating quiz:", error);
      res.status(500).json({ message: "Failed to update quiz" });
    }
  });

  // Delete quiz
  app.delete('/api/admin/quizzes/:quizId', requireAuth, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const quizId = parseInt(req.params.quizId);
      await storage.deleteQuiz(quizId);
      res.json({ message: "Quiz deleted successfully" });
    } catch (error) {
      console.error("Error deleting quiz:", error);
      res.status(500).json({ message: "Failed to delete quiz" });
    }
  });

  // Add question to quiz
  app.post('/api/admin/quizzes/:quizId/questions', requireAuth, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const quizId = parseInt(req.params.quizId);
      const questionData = { ...req.body, quizId };
      const question = await storage.createQuizQuestion(questionData);
      res.json(question);
    } catch (error) {
      console.error("Error creating quiz question:", error);
      res.status(500).json({ message: "Failed to create quiz question" });
    }
  });

  // Update question
  app.put('/api/admin/questions/:questionId', requireAuth, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const questionId = parseInt(req.params.questionId);
      const question = await storage.updateQuizQuestion(questionId, req.body);
      res.json(question);
    } catch (error) {
      console.error("Error updating quiz question:", error);
      res.status(500).json({ message: "Failed to update quiz question" });
    }
  });

  // Delete question
  app.delete('/api/admin/questions/:questionId', requireAuth, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const questionId = parseInt(req.params.questionId);
      await storage.deleteQuizQuestion(questionId);
      res.json({ message: "Question deleted successfully" });
    } catch (error) {
      console.error("Error deleting quiz question:", error);
      res.status(500).json({ message: "Failed to delete quiz question" });
    }
  });

  // Add option to question
  app.post('/api/admin/questions/:questionId/options', requireAuth, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const questionId = parseInt(req.params.questionId);
      const optionData = { ...req.body, questionId };
      const option = await storage.createQuizQuestionOption(optionData);
      res.json(option);
    } catch (error) {
      console.error("Error creating quiz option:", error);
      res.status(500).json({ message: "Failed to create quiz option" });
    }
  });

  // **Student Quiz System:**

  // Get quiz for lesson (student view)
  app.get('/api/lessons/:lessonId/quiz', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const lessonId = parseInt(req.params.lessonId);
      const quiz = await storage.getQuizByLesson(lessonId);
      if (!quiz) {
        return res.status(404).json({ message: "No quiz found for this lesson" });
      }
      res.json(quiz);
    } catch (error) {
      console.error("Error fetching lesson quiz:", error);
      res.status(500).json({ message: "Failed to fetch quiz" });
    }
  });

  // Start quiz attempt
  app.post('/api/quizzes/:quizId/attempt', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const quizId = parseInt(req.params.quizId);
      const userId = req.user!.id;

      // Check if user has exceeded max attempts
      const userAttempts = await storage.getUserQuizAttempts(userId, quizId);
      const quiz = await storage.getQuiz(quizId);
      
      if (quiz?.maxAttempts && userAttempts.length >= quiz.maxAttempts) {
        return res.status(400).json({ message: "Maximum attempts exceeded" });
      }

      const attemptData = {
        quizId,
        userId,
        maxScore: await storage.getQuizMaxScore(quizId),
        status: "in_progress" as const
      };

      const attempt = await storage.createQuizAttempt(attemptData);
      res.json(attempt);
    } catch (error) {
      console.error("Error starting quiz attempt:", error);
      res.status(500).json({ message: "Failed to start quiz attempt" });
    }
  });

  // Submit quiz answer
  app.post('/api/quiz-attempts/:attemptId/answer', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const attemptId = parseInt(req.params.attemptId);
      const { questionId, selectedOptionId, textAnswer } = req.body;

      // Verify attempt belongs to user
      const attempt = await storage.getQuizAttempt(attemptId);
      if (!attempt || attempt.userId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const answer = await storage.submitQuizAnswer({
        attemptId,
        questionId,
        selectedOptionId,
        textAnswer
      });

      res.json(answer);
    } catch (error) {
      console.error("Error submitting quiz answer:", error);
      res.status(500).json({ message: "Failed to submit answer" });
    }
  });

  // Submit quiz (complete attempt)
  app.post('/api/quiz-attempts/:attemptId/submit', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const attemptId = parseInt(req.params.attemptId);

      // Verify attempt belongs to user
      const attempt = await storage.getQuizAttempt(attemptId);
      if (!attempt || attempt.userId !== req.user!.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const result = await storage.completeQuizAttempt(attemptId);
      res.json(result);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      res.status(500).json({ message: "Failed to submit quiz" });
    }
  });

  // Get quiz attempt results
  app.get('/api/quiz-attempts/:attemptId/results', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const attemptId = parseInt(req.params.attemptId);

      // Verify attempt belongs to user or user is admin
      const attempt = await storage.getQuizAttempt(attemptId);
      const isOwner = attempt?.userId === req.user!.id;
      const userIsAdmin = await storage.isUserAdmin(req.user!.id);

      if (!attempt || (!isOwner && !userIsAdmin)) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const results = await storage.getQuizAttemptResults(attemptId);
      res.json(results);
    } catch (error) {
      console.error("Error fetching quiz results:", error);
      res.status(500).json({ message: "Failed to fetch results" });
    }
  });

  // **Analytics & Tracking:**

  // Get user quiz performance
  app.get('/api/users/:userId/quiz-performance', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.params.userId;
      
      // Users can only view their own performance unless they're admin
      const userIsAdmin = await storage.isUserAdmin(req.user!.id);
      if (userId !== req.user!.id && !userIsAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const performance = await storage.getUserQuizPerformance(userId);
      res.json(performance);
    } catch (error) {
      console.error("Error fetching user quiz performance:", error);
      res.status(500).json({ message: "Failed to fetch performance data" });
    }
  });

  // Get quiz analytics (admin only)
  app.get('/api/admin/quizzes/:quizId/analytics', requireAuth, isAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const quizId = parseInt(req.params.quizId);
      const analytics = await storage.getQuizAnalytics(quizId);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching quiz analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Get all quizzes for a lesson (existing endpoint)
  app.get('/api/lessons/:id/quizzes', requireAuth, async (req: Request, res: Response) => {
    try {
      const lessonId = parseInt(req.params.id);
      const quizzes = await storage.getQuizzes(lessonId);
      res.json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      res.status(500).json({ message: "Failed to fetch quizzes" });
    }
  });

  // Create quiz (existing endpoint)
  app.post('/api/lessons/:id/quizzes', requireAuth, isAdmin, async (req: Request, res: Response) => {
    try {
      const lessonId = parseInt(req.params.id);
      const quizData = { ...req.body, lessonId };
      const quiz = await storage.createQuiz(quizData);
      res.json(quiz);
    } catch (error) {
      console.error("Error creating quiz:", error);
      res.status(500).json({ message: "Failed to create quiz" });
    }
  });

  // Delete quiz (existing endpoint)
  app.delete('/api/quizzes/:id', requireAuth, isAdmin, async (req: Request, res: Response) => {
    try {
      const quizId = parseInt(req.params.id);
      await storage.deleteQuiz(quizId);
      res.json({ message: "Quiz deleted successfully" });
    } catch (error) {
      console.error("Error deleting quiz:", error);
      res.status(500).json({ message: "Failed to delete quiz" });
    }
  });
}