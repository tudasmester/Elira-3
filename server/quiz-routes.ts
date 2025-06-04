import type { Express, Request, Response } from "express";
import { db } from "./db";
import { requireAuth } from "./auth-working";
import { storage } from "./storage";
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
  insertCourseSchema,
  type Quiz,
  type QuizQuestion,
  type QuizQuestionOption,
  type QuizAttempt,
  type QuizAnswer,
  type QuizResult,
  QUESTION_TYPES
} from "@shared/schema";
import { eq, and, desc, asc } from "drizzle-orm";
import { QuestionServiceFactory } from "./services/QuestionTypeService";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export function registerQuizRoutes(app: Express) {
  
  // Course Management API endpoints
  
  // GET /api/courses - List all courses
  app.get('/api/courses', requireAuth, async (req: Request, res: Response) => {
    try {
      const courses = await storage.getCourses();
      res.json(courses);
    } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).json({ message: 'Failed to fetch courses' });
    }
  });

  // POST /api/courses - Create new course
  app.post('/api/courses', requireAuth, async (req: Request, res: Response) => {
    try {
      // Validation
      if (!req.body.title || req.body.title.trim() === '') {
        return res.status(400).json({ message: 'Course title is required' });
      }
      
      if (!req.body.description || req.body.description.trim() === '') {
        return res.status(400).json({ message: 'Course description is required' });
      }

      const courseData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(courseData);
      res.status(201).json(course);
    } catch (error) {
      console.error('Error creating course:', error);
      res.status(500).json({ message: 'Failed to create course' });
    }
  });

  // PUT /api/courses/:id - Update course
  app.put('/api/courses/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const courseId = parseInt(req.params.id);
      
      // Validation
      if (req.body.title && req.body.title.trim() === '') {
        return res.status(400).json({ message: 'Course title cannot be empty' });
      }

      const updateData = insertCourseSchema.partial().parse(req.body);
      const updatedCourse = await storage.updateCourse(courseId, updateData);
      
      if (!updatedCourse) {
        return res.status(404).json({ message: 'Course not found' });
      }

      res.json(updatedCourse);
    } catch (error) {
      console.error('Error updating course:', error);
      res.status(500).json({ message: 'Failed to update course' });
    }
  });

  // DELETE /api/courses/:id - Delete course
  app.delete('/api/courses/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const courseId = parseInt(req.params.id);
      
      // Check if course exists
      const course = await storage.getCourse(courseId);
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      await storage.deleteCourse(courseId);
      res.json({ message: 'Course deleted successfully' });
    } catch (error) {
      console.error('Error deleting course:', error);
      res.status(500).json({ message: 'Failed to delete course' });
    }
  });
  
  // Course-level exam management (as requested)
  
  // GET /api/courses/:courseId/exams - List exams for a course
  app.get('/api/courses/:courseId/exams', requireAuth, async (req: Request, res: Response) => {
    try {
      const courseId = parseInt(req.params.courseId);
      
      const courseExams = await db
        .select()
        .from(quizzes)
        .where(eq(quizzes.courseId, courseId))
        .orderBy(asc(quizzes.createdAt));

      res.json(courseExams);
    } catch (error) {
      console.error('Error fetching course exams:', error);
      res.status(500).json({ message: 'Failed to fetch course exams' });
    }
  });

  // POST /api/courses/:courseId/exams - Create new exam for course
  app.post('/api/courses/:courseId/exams', requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const courseId = parseInt(req.params.courseId);
      
      // Validation
      if (!req.body.title || req.body.title.trim() === '') {
        return res.status(400).json({ message: 'Quiz title is required' });
      }

      const examData = insertQuizSchema.parse({
        ...req.body,
        courseId,
        lessonId: null // Course-level exam, not tied to specific lesson
      });

      const [exam] = await db.insert(quizzes).values(examData).returning();
      res.status(201).json(exam);
    } catch (error) {
      console.error('Error creating course exam:', error);
      res.status(500).json({ message: 'Failed to create course exam' });
    }
  });

  // GET /api/exams/:examId - Get exam details with questions
  app.get('/api/exams/:examId', requireAuth, async (req: Request, res: Response) => {
    try {
      const examId = parseInt(req.params.examId);
      
      // Get exam details
      const [exam] = await db
        .select()
        .from(quizzes)
        .where(eq(quizzes.id, examId));

      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }

      // Get questions with options
      const questions = await db
        .select()
        .from(quizQuestions)
        .where(eq(quizQuestions.quizId, examId))
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
        ...exam,
        questions: questionsWithOptions
      });
    } catch (error) {
      console.error('Error fetching exam:', error);
      res.status(500).json({ message: 'Failed to fetch exam' });
    }
  });

  // PUT /api/exams/:examId - Update exam
  app.put('/api/exams/:examId', requireAuth, async (req: Request, res: Response) => {
    try {
      const examId = parseInt(req.params.examId);
      
      // Validation
      if (req.body.title && req.body.title.trim() === '') {
        return res.status(400).json({ message: 'Quiz title cannot be empty' });
      }

      const updateData = insertQuizSchema.partial().parse(req.body);

      const [updatedExam] = await db
        .update(quizzes)
        .set({ ...updateData, updatedAt: new Date() })
        .where(eq(quizzes.id, examId))
        .returning();

      if (!updatedExam) {
        return res.status(404).json({ message: 'Exam not found' });
      }

      res.json(updatedExam);
    } catch (error) {
      console.error('Error updating exam:', error);
      res.status(500).json({ message: 'Failed to update exam' });
    }
  });

  // DELETE /api/exams/:examId - Delete exam
  app.delete('/api/exams/:examId', requireAuth, async (req: Request, res: Response) => {
    try {
      const examId = parseInt(req.params.examId);

      // Check if exam exists
      const [exam] = await db
        .select()
        .from(quizzes)
        .where(eq(quizzes.id, examId));

      if (!exam) {
        return res.status(404).json({ message: 'Exam not found' });
      }

      // Delete exam (cascade will handle related data)
      await db.delete(quizzes).where(eq(quizzes.id, examId));

      res.json({ message: 'Exam deleted successfully' });
    } catch (error) {
      console.error('Error deleting exam:', error);
      res.status(500).json({ message: 'Failed to delete exam' });
    }
  });

  // GET /api/exams/:examId/questions - List questions for an exam
  app.get('/api/exams/:examId/questions', requireAuth, async (req: Request, res: Response) => {
    try {
      const examId = parseInt(req.params.examId);
      
      const questions = await db
        .select()
        .from(quizQuestions)
        .where(eq(quizQuestions.quizId, examId))
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

      res.json(questionsWithOptions);
    } catch (error) {
      console.error('Error fetching exam questions:', error);
      res.status(500).json({ message: 'Failed to fetch exam questions' });
    }
  });

  // POST /api/exams/:examId/questions - Add new question to exam (using specialized services)
  app.post('/api/exams/:examId/questions', requireAuth, async (req: Request, res: Response) => {
    try {
      const examId = parseInt(req.params.examId);
      
      // Basic validation
      if (!req.body.questionText || req.body.questionText.trim() === '') {
        return res.status(400).json({ message: 'Question text is required' });
      }

      if (!req.body.questionType) {
        return res.status(400).json({ message: 'Question type is required' });
      }

      // Get specialized service for question type
      const questionService = QuestionServiceFactory.getService(req.body.questionType);
      
      const questionData = {
        ...req.body,
        quizId: examId
      };

      // Use specialized service to save question with type-specific validation
      const savedQuestion = await questionService.saveQuestion(questionData);
      
      res.status(201).json(savedQuestion);
    } catch (error) {
      console.error('Error creating exam question:', error);
      if (error.message.includes('Validation failed')) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: 'Failed to create exam question' });
    }
  });

  // GET /api/questions/:questionId - Get question details
  app.get('/api/questions/:questionId', requireAuth, async (req: Request, res: Response) => {
    try {
      const questionId = parseInt(req.params.questionId);
      
      const [question] = await db
        .select()
        .from(quizQuestions)
        .where(eq(quizQuestions.id, questionId));

      if (!question) {
        return res.status(404).json({ message: 'Question not found' });
      }

      const options = await db
        .select()
        .from(quizQuestionOptions)
        .where(eq(quizQuestionOptions.questionId, questionId))
        .orderBy(asc(quizQuestionOptions.orderIndex));

      res.json({
        ...question,
        options
      });
    } catch (error) {
      console.error('Error fetching question:', error);
      res.status(500).json({ message: 'Failed to fetch question' });
    }
  });

  // PUT /api/questions/:questionId/reorder - Reorder questions
  app.put('/api/questions/:questionId/reorder', requireAuth, async (req: Request, res: Response) => {
    try {
      const questionId = parseInt(req.params.questionId);
      const { newOrderIndex } = req.body;

      if (typeof newOrderIndex !== 'number' || newOrderIndex < 0) {
        return res.status(400).json({ message: 'Valid order index is required' });
      }

      const [updatedQuestion] = await db
        .update(quizQuestions)
        .set({ orderIndex: newOrderIndex })
        .where(eq(quizQuestions.id, questionId))
        .returning();

      if (!updatedQuestion) {
        return res.status(404).json({ message: 'Question not found' });
      }

      res.json(updatedQuestion);
    } catch (error) {
      console.error('Error reordering question:', error);
      res.status(500).json({ message: 'Failed to reorder question' });
    }
  });
  
  // Create a new quiz/exam (legacy endpoint for lesson-specific quizzes)
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