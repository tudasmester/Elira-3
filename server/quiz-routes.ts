import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import { requireAuth } from "./auth-working";
import { isAdmin } from "./adminAuth";
import { 
  insertQuizSchema, 
  insertQuizQuestionSchema, 
  insertQuizQuestionOptionSchema,
  insertQuizAttemptSchema,
  insertQuizAnswerSchema,
  Quiz,
  QuizQuestion,
  QuizQuestionOption,
  QuizAttempt,
  QuizAnswer
} from "@shared/schema";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isAdmin?: number;
  };
}

// Quiz evaluation logic
function evaluateAnswer(question: QuizQuestion & { options: QuizQuestionOption[] }, answer: any): { isCorrect: boolean; pointsEarned: number } {
  const questionPoints = question.points || 1;
  
  switch (question.type) {
    case 'multiple_choice':
      const correctOption = question.options.find(opt => opt.isCorrect === 1);
      const isCorrect = correctOption && answer.selectedOptionId === correctOption.id;
      return {
        isCorrect: !!isCorrect,
        pointsEarned: isCorrect ? questionPoints : 0
      };
      
    case 'true_false':
      const correctTrueFalse = question.options.find(opt => opt.isCorrect === 1);
      const isTrueFalseCorrect = correctTrueFalse && answer.selectedOptionId === correctTrueFalse.id;
      return {
        isCorrect: !!isTrueFalseCorrect,
        pointsEarned: isTrueFalseCorrect ? questionPoints : 0
      };
      
    case 'fill_blank':
      // For fill-in-the-blank, we check against the correct answer in options
      const correctFillBlank = question.options.find(opt => opt.isCorrect === 1);
      if (!correctFillBlank || !answer.textAnswer) {
        return { isCorrect: false, pointsEarned: 0 };
      }
      
      // Simple text matching (case-insensitive, trim whitespace)
      const userAnswer = answer.textAnswer.trim().toLowerCase();
      const correctAnswer = correctFillBlank.optionText.trim().toLowerCase();
      const isTextCorrect = userAnswer === correctAnswer;
      
      return {
        isCorrect: isTextCorrect,
        pointsEarned: isTextCorrect ? questionPoints : 0
      };
      
    default:
      return { isCorrect: false, pointsEarned: 0 };
  }
}

export function registerQuizRoutes(app: Express) {
  
  // Admin Quiz Management Routes
  
  // Create quiz for a lesson
  app.post('/api/admin/lessons/:lessonId/quizzes', isAdmin, async (req: AuthRequest, res: Response) => {
    try {
      const lessonId = parseInt(req.params.lessonId);
      const quizData = insertQuizSchema.parse({
        ...req.body,
        lessonId
      });
      
      console.log('Creating quiz for lesson:', lessonId, quizData);
      
      const quiz = await storage.createQuiz(quizData);
      res.status(201).json(quiz);
    } catch (error) {
      console.error('Error creating quiz:', error);
      res.status(500).json({ message: 'Failed to create quiz' });
    }
  });

  // Get quiz with questions and options
  app.get('/api/admin/quizzes/:quizId', isAdmin, async (req: Request, res: Response) => {
    try {
      const quizId = parseInt(req.params.quizId);
      const quiz = await storage.getQuizWithQuestions(quizId);
      
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      
      res.json(quiz);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      res.status(500).json({ message: 'Failed to fetch quiz' });
    }
  });

  // Update quiz
  app.put('/api/admin/quizzes/:quizId', isAdmin, async (req: Request, res: Response) => {
    try {
      const quizId = parseInt(req.params.quizId);
      const updateData = req.body;
      
      const quiz = await storage.updateQuiz(quizId, updateData);
      res.json(quiz);
    } catch (error) {
      console.error('Error updating quiz:', error);
      res.status(500).json({ message: 'Failed to update quiz' });
    }
  });

  // Delete quiz
  app.delete('/api/admin/quizzes/:quizId', isAdmin, async (req: Request, res: Response) => {
    try {
      const quizId = parseInt(req.params.quizId);
      await storage.deleteQuiz(quizId);
      res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
      console.error('Error deleting quiz:', error);
      res.status(500).json({ message: 'Failed to delete quiz' });
    }
  });

  // Add question to quiz
  app.post('/api/admin/quizzes/:quizId/questions', isAdmin, async (req: Request, res: Response) => {
    try {
      const quizId = parseInt(req.params.quizId);
      const questionData = insertQuizQuestionSchema.parse({
        ...req.body,
        quizId
      });
      
      console.log('Creating question for quiz:', quizId, questionData);
      
      const question = await storage.createQuizQuestion(questionData);
      
      // If options are provided, create them
      if (req.body.options && Array.isArray(req.body.options)) {
        const options = [];
        for (let i = 0; i < req.body.options.length; i++) {
          const optionData = insertQuizQuestionOptionSchema.parse({
            ...req.body.options[i],
            questionId: question.id,
            order: i
          });
          const option = await storage.createQuizQuestionOption(optionData);
          options.push(option);
        }
        
        res.status(201).json({ ...question, options });
      } else {
        res.status(201).json(question);
      }
    } catch (error) {
      console.error('Error creating question:', error);
      res.status(500).json({ message: 'Failed to create question' });
    }
  });

  // Update question
  app.put('/api/admin/questions/:questionId', isAdmin, async (req: Request, res: Response) => {
    try {
      const questionId = parseInt(req.params.questionId);
      const updateData = req.body;
      
      const question = await storage.updateQuizQuestion(questionId, updateData);
      res.json(question);
    } catch (error) {
      console.error('Error updating question:', error);
      res.status(500).json({ message: 'Failed to update question' });
    }
  });

  // Delete question
  app.delete('/api/admin/questions/:questionId', isAdmin, async (req: Request, res: Response) => {
    try {
      const questionId = parseInt(req.params.questionId);
      await storage.deleteQuizQuestion(questionId);
      res.json({ message: 'Question deleted successfully' });
    } catch (error) {
      console.error('Error deleting question:', error);
      res.status(500).json({ message: 'Failed to delete question' });
    }
  });

  // Get quiz analytics
  app.get('/api/admin/quizzes/:quizId/analytics', isAdmin, async (req: Request, res: Response) => {
    try {
      const quizId = parseInt(req.params.quizId);
      const analytics = await storage.getQuizAnalytics(quizId);
      res.json(analytics);
    } catch (error) {
      console.error('Error fetching quiz analytics:', error);
      res.status(500).json({ message: 'Failed to fetch quiz analytics' });
    }
  });

  // Student Quiz Routes

  // Get quiz for lesson (student view)
  app.get('/api/lessons/:lessonId/quiz', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const lessonId = parseInt(req.params.lessonId);
      const quizzes = await storage.getQuizzesByLesson(lessonId);
      
      if (quizzes.length === 0) {
        return res.status(404).json({ message: 'No quiz found for this lesson' });
      }
      
      // Get the first active quiz
      const activeQuiz = quizzes.find(q => q.isActive === 1);
      if (!activeQuiz) {
        return res.status(404).json({ message: 'No active quiz found for this lesson' });
      }
      
      const quizWithQuestions = await storage.getQuizWithQuestions(activeQuiz.id);
      
      // Remove correct answer information for students
      if (quizWithQuestions && quizWithQuestions.questions) {
        quizWithQuestions.questions = quizWithQuestions.questions.map((question: any) => ({
          ...question,
          options: question.options?.map((option: any) => ({
            id: option.id,
            optionText: option.optionText,
            order: option.order
            // Remove isCorrect field
          }))
        }));
      }
      
      res.json(quizWithQuestions);
    } catch (error) {
      console.error('Error fetching quiz for lesson:', error);
      res.status(500).json({ message: 'Failed to fetch quiz' });
    }
  });

  // Start quiz attempt
  app.post('/api/quizzes/:quizId/attempt', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const quizId = parseInt(req.params.quizId);
      const userId = req.user!.id;
      
      // Check if user has exceeded max attempts
      const previousAttempts = await storage.getUserQuizAttempts(userId, quizId);
      const quiz = await storage.getQuiz(quizId);
      
      if (quiz?.maxAttempts && previousAttempts.length >= quiz.maxAttempts) {
        return res.status(400).json({ 
          message: `Maximum attempts (${quiz.maxAttempts}) exceeded for this quiz` 
        });
      }
      
      const attemptData = insertQuizAttemptSchema.parse({
        quizId,
        userId,
        status: 'in_progress'
      });
      
      const attempt = await storage.createQuizAttempt(attemptData);
      res.status(201).json(attempt);
    } catch (error) {
      console.error('Error starting quiz attempt:', error);
      res.status(500).json({ message: 'Failed to start quiz attempt' });
    }
  });

  // Submit quiz attempt
  app.post('/api/quiz-attempts/:attemptId/submit', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const attemptId = parseInt(req.params.attemptId);
      const { answers, timeSpent } = req.body;
      const userId = req.user!.id;
      
      // Verify attempt belongs to user
      const attempt = await storage.getQuizAttempt(attemptId);
      if (!attempt || attempt.userId !== userId) {
        return res.status(403).json({ message: 'Unauthorized to submit this attempt' });
      }
      
      if (attempt.status === 'completed') {
        return res.status(400).json({ message: 'Quiz attempt already completed' });
      }
      
      // Get quiz with questions and correct answers
      const quiz = await storage.getQuizWithQuestions(attempt.quizId);
      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }
      
      let totalScore = 0;
      let maxScore = 0;
      const evaluatedAnswers = [];
      
      // Evaluate each answer
      for (const answerData of answers) {
        const question = quiz.questions.find((q: any) => q.id === answerData.questionId);
        if (!question) continue;
        
        maxScore += question.points || 1;
        
        const evaluation = evaluateAnswer(question, answerData);
        totalScore += evaluation.pointsEarned;
        
        // Save answer
        const quizAnswer = await storage.createQuizAnswer({
          attemptId,
          questionId: answerData.questionId,
          selectedOptionId: answerData.selectedOptionId || null,
          textAnswer: answerData.textAnswer || null,
          isCorrect: evaluation.isCorrect ? 1 : 0,
          pointsEarned: evaluation.pointsEarned,
          timeSpent: answerData.timeSpent || 0
        });
        
        evaluatedAnswers.push({
          ...quizAnswer,
          question: question.question,
          correctAnswer: question.options?.find((opt: any) => opt.isCorrect === 1)?.optionText,
          explanation: question.explanation
        });
      }
      
      const percentageScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
      
      // Update attempt with results
      const completedAttempt = await storage.updateQuizAttempt(attemptId, {
        endTime: new Date(),
        totalScore,
        maxScore,
        percentageScore,
        status: 'completed',
        timeSpent: timeSpent || 0
      });
      
      res.json({
        attempt: completedAttempt,
        results: {
          totalScore,
          maxScore,
          percentageScore,
          passed: percentageScore >= (quiz.passingScore || 70),
          answers: evaluatedAnswers
        }
      });
    } catch (error) {
      console.error('Error submitting quiz attempt:', error);
      res.status(500).json({ message: 'Failed to submit quiz attempt' });
    }
  });

  // Get quiz attempt results
  app.get('/api/quiz-attempts/:attemptId/results', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const attemptId = parseInt(req.params.attemptId);
      const userId = req.user!.id;
      
      const attempt = await storage.getQuizAttempt(attemptId);
      if (!attempt || attempt.userId !== userId) {
        return res.status(403).json({ message: 'Unauthorized to view this attempt' });
      }
      
      if (attempt.status !== 'completed') {
        return res.status(400).json({ message: 'Quiz attempt not completed yet' });
      }
      
      const answers = await storage.getQuizAttemptAnswers(attemptId);
      const quiz = await storage.getQuizWithQuestions(attempt.quizId);
      
      const detailedAnswers = answers.map(answer => {
        const question = quiz?.questions.find((q: any) => q.id === answer.questionId);
        return {
          ...answer,
          question: question?.question,
          explanation: question?.explanation,
          correctAnswer: question?.options?.find((opt: any) => opt.isCorrect === 1)?.optionText
        };
      });
      
      res.json({
        attempt,
        quiz: {
          title: quiz?.title,
          passingScore: quiz?.passingScore
        },
        results: {
          totalScore: attempt.totalScore,
          maxScore: attempt.maxScore,
          percentageScore: attempt.percentageScore,
          passed: (attempt.percentageScore || 0) >= (quiz?.passingScore || 70),
          answers: detailedAnswers
        }
      });
    } catch (error) {
      console.error('Error fetching quiz results:', error);
      res.status(500).json({ message: 'Failed to fetch quiz results' });
    }
  });

  // Get user quiz performance
  app.get('/api/users/:userId/quiz-performance', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.params.userId;
      
      // Users can only view their own performance unless admin
      if (req.user!.id !== userId && !req.user!.isAdmin) {
        return res.status(403).json({ message: 'Unauthorized to view this performance data' });
      }
      
      const performance = await storage.getUserQuizPerformance(userId);
      res.json(performance);
    } catch (error) {
      console.error('Error fetching user quiz performance:', error);
      res.status(500).json({ message: 'Failed to fetch quiz performance' });
    }
  });
}