import type { Express, Request, Response } from "express";
import { db } from "./db";
import { requireAuth } from "./auth-working";
import { 
  quizzes, 
  quizQuestions, 
  quizQuestionOptions, 
  quizAttempts, 
  quizAnswers, 
  quizResults,
  insertQuizSchema,
  insertQuizQuestionSchema,
  insertQuizQuestionOptionSchema,
  insertQuizAttemptSchema,
  insertQuizAnswerSchema,
  insertQuizResultSchema,
  type Quiz,
  type QuizQuestion,
  type QuizQuestionOption,
  type QuizAttempt,
  type QuizAnswer,
  type QuizResult,
  QUESTION_TYPES
} from "@shared/schema";
import { eq, and, desc, asc } from "drizzle-orm";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export function registerQuizRoutes(app: Express) {
  
  // Create a new quiz/exam
  app.post('/api/lessons/:lessonId/quizzes', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const lessonId = parseInt(req.params.lessonId);
      const quizData = insertQuizSchema.parse({
        ...req.body,
        lessonId
      });

      const [quiz] = await db.insert(quizzes).values(quizData).returning();
      res.status(201).json(quiz);
    } catch (error) {
      console.error('Error creating quiz:', error);
      res.status(500).json({ message: 'Failed to create quiz' });
    }
  });

  // Get all quizzes for a lesson
  app.get('/api/lessons/:lessonId/quizzes', requireAuth, async (req: Request, res: Response) => {
    try {
      const lessonId = parseInt(req.params.lessonId);
      
      const lessonQuizzes = await db
        .select()
        .from(quizzes)
        .where(eq(quizzes.lessonId, lessonId))
        .orderBy(asc(quizzes.createdAt));

      res.json(lessonQuizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      res.status(500).json({ message: 'Failed to fetch quizzes' });
    }
  });

  // Get quiz with questions and options
  app.get('/api/quizzes/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const quizId = parseInt(req.params.id);
      
      // Get quiz details
      const [quiz] = await db
        .select()
        .from(quizzes)
        .where(eq(quizzes.id, quizId));

      if (!quiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }

      // Get questions with options
      const questions = await db
        .select()
        .from(quizQuestions)
        .where(eq(quizQuestions.quizId, quizId))
        .orderBy(asc(quizQuestions.orderIndex));

      const questionsWithOptions = await Promise.all(
        questions.map(async (question) => {
          const options = await db
            .select()
            .from(quizQuestionOptions)
            .where(eq(quizQuestionOptions.questionId, question.id))
            .orderBy(asc(quizQuestionOptions.orderIndex));

          return {
            ...question,
            options
          };
        })
      );

      res.json({
        ...quiz,
        questions: questionsWithOptions
      });
    } catch (error) {
      console.error('Error fetching quiz:', error);
      res.status(500).json({ message: 'Failed to fetch quiz' });
    }
  });

  // Update quiz settings
  app.put('/api/quizzes/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const quizId = parseInt(req.params.id);
      const updateData = insertQuizSchema.partial().parse(req.body);

      const [updatedQuiz] = await db
        .update(quizzes)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(quizzes.id, quizId))
        .returning();

      if (!updatedQuiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }

      res.json(updatedQuiz);
    } catch (error) {
      console.error('Error updating quiz:', error);
      res.status(500).json({ message: 'Failed to update quiz' });
    }
  });

  // Delete quiz
  app.delete('/api/quizzes/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const quizId = parseInt(req.params.id);

      // Delete quiz (cascade will handle related data)
      await db.delete(quizzes).where(eq(quizzes.id, quizId));

      res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
      console.error('Error deleting quiz:', error);
      res.status(500).json({ message: 'Failed to delete quiz' });
    }
  });

  // Add question to quiz
  app.post('/api/quizzes/:quizId/questions', requireAuth, async (req: Request, res: Response) => {
    try {
      const quizId = parseInt(req.params.quizId);
      const questionData = insertQuizQuestionSchema.parse({
        ...req.body,
        quizId
      });

      const [question] = await db.insert(quizQuestions).values(questionData).returning();
      res.status(201).json(question);
    } catch (error) {
      console.error('Error creating question:', error);
      res.status(500).json({ message: 'Failed to create question' });
    }
  });

  // Update question
  app.put('/api/questions/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const questionId = parseInt(req.params.id);
      const updateData = insertQuizQuestionSchema.partial().parse(req.body);

      const [updatedQuestion] = await db
        .update(quizQuestions)
        .set(updateData)
        .where(eq(quizQuestions.id, questionId))
        .returning();

      if (!updatedQuestion) {
        return res.status(404).json({ message: 'Question not found' });
      }

      res.json(updatedQuestion);
    } catch (error) {
      console.error('Error updating question:', error);
      res.status(500).json({ message: 'Failed to update question' });
    }
  });

  // Delete question
  app.delete('/api/questions/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const questionId = parseInt(req.params.id);

      await db.delete(quizQuestions).where(eq(quizQuestions.id, questionId));
      res.json({ message: 'Question deleted successfully' });
    } catch (error) {
      console.error('Error deleting question:', error);
      res.status(500).json({ message: 'Failed to delete question' });
    }
  });

  // Add answer option to question
  app.post('/api/questions/:questionId/options', requireAuth, async (req: Request, res: Response) => {
    try {
      const questionId = parseInt(req.params.questionId);
      const optionData = insertQuizQuestionOptionSchema.parse({
        ...req.body,
        questionId
      });

      const [option] = await db.insert(quizQuestionOptions).values(optionData).returning();
      res.status(201).json(option);
    } catch (error) {
      console.error('Error creating option:', error);
      res.status(500).json({ message: 'Failed to create option' });
    }
  });

  // Update answer option
  app.put('/api/options/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const optionId = parseInt(req.params.id);
      const updateData = insertQuizQuestionOptionSchema.partial().parse(req.body);

      const [updatedOption] = await db
        .update(quizQuestionOptions)
        .set(updateData)
        .where(eq(quizQuestionOptions.id, optionId))
        .returning();

      if (!updatedOption) {
        return res.status(404).json({ message: 'Option not found' });
      }

      res.json(updatedOption);
    } catch (error) {
      console.error('Error updating option:', error);
      res.status(500).json({ message: 'Failed to update option' });
    }
  });

  // Delete answer option
  app.delete('/api/options/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const optionId = parseInt(req.params.id);

      await db.delete(quizQuestionOptions).where(eq(quizQuestionOptions.id, optionId));
      res.json({ message: 'Option deleted successfully' });
    } catch (error) {
      console.error('Error deleting option:', error);
      res.status(500).json({ message: 'Failed to delete option' });
    }
  });

  // Start quiz attempt
  app.post('/api/quizzes/:quizId/attempts', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const quizId = parseInt(req.params.quizId);
      const userId = req.user!.id;

      // Check existing attempts
      const existingAttempts = await db
        .select()
        .from(quizAttempts)
        .where(and(
          eq(quizAttempts.quizId, quizId),
          eq(quizAttempts.userId, userId)
        ));

      const attemptNumber = existingAttempts.length + 1;

      const [attempt] = await db.insert(quizAttempts).values({
        quizId,
        userId,
        attemptNumber,
        status: 'in_progress'
      }).returning();

      res.status(201).json(attempt);
    } catch (error) {
      console.error('Error starting quiz attempt:', error);
      res.status(500).json({ message: 'Failed to start quiz attempt' });
    }
  });

  // Submit answer for question
  app.post('/api/attempts/:attemptId/answers', requireAuth, async (req: Request, res: Response) => {
    try {
      const attemptId = parseInt(req.params.attemptId);
      const answerData = insertQuizAnswerSchema.parse({
        ...req.body,
        attemptId
      });

      const [answer] = await db.insert(quizAnswers).values(answerData).returning();
      res.status(201).json(answer);
    } catch (error) {
      console.error('Error submitting answer:', error);
      res.status(500).json({ message: 'Failed to submit answer' });
    }
  });

  // Complete quiz attempt
  app.post('/api/attempts/:attemptId/complete', requireAuth, async (req: Request, res: Response) => {
    try {
      const attemptId = parseInt(req.params.id);

      // Update attempt status
      const [completedAttempt] = await db
        .update(quizAttempts)
        .set({ 
          status: 'completed',
          completedAt: new Date()
        })
        .where(eq(quizAttempts.id, attemptId))
        .returning();

      // Calculate results (simplified version)
      const answers = await db
        .select()
        .from(quizAnswers)
        .where(eq(quizAnswers.attemptId, attemptId));

      const correctAnswers = answers.filter(answer => answer.isCorrect).length;
      const totalQuestions = answers.length;
      const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

      // Create quiz result
      const [result] = await db.insert(quizResults).values({
        attemptId,
        userId: completedAttempt.userId,
        quizId: completedAttempt.quizId,
        totalQuestions,
        correctAnswers,
        incorrectAnswers: totalQuestions - correctAnswers,
        skippedAnswers: 0,
        totalScore: correctAnswers,
        maxPossibleScore: totalQuestions,
        percentage,
        passed: percentage >= 70 // Default passing score
      }).returning();

      res.json({
        attempt: completedAttempt,
        result
      });
    } catch (error) {
      console.error('Error completing quiz attempt:', error);
      res.status(500).json({ message: 'Failed to complete quiz attempt' });
    }
  });

  // Get quiz results for user
  app.get('/api/quizzes/:quizId/results', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const quizId = parseInt(req.params.quizId);
      const userId = req.user!.id;

      const results = await db
        .select()
        .from(quizResults)
        .where(and(
          eq(quizResults.quizId, quizId),
          eq(quizResults.userId, userId)
        ))
        .orderBy(desc(quizResults.createdAt));

      res.json(results);
    } catch (error) {
      console.error('Error fetching quiz results:', error);
      res.status(500).json({ message: 'Failed to fetch quiz results' });
    }
  });

  // Get available question types
  app.get('/api/quiz/question-types', requireAuth, async (req: Request, res: Response) => {
    try {
      res.json(Object.values(QUESTION_TYPES));
    } catch (error) {
      console.error('Error fetching question types:', error);
      res.status(500).json({ message: 'Failed to fetch question types' });
    }
  });
}