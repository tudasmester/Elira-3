import { Express, Request, Response } from 'express';
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { z } from 'zod';
import { db } from './db';
import { lessons, lessonAttachments, lessonQuizzes } from '@shared/schema';
import { eq, and } from 'drizzle-orm';
import { isAdmin } from './adminAuth';

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/lessons';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4',
      'video/avi',
      'video/mov',
      'audio/mp3',
      'audio/wav',
      'application/zip',
      'application/x-zip-compressed'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

// Validation schemas
const createLessonSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  videoUrl: z.string().url().optional().or(z.literal('')),
  videoEmbedCode: z.string().optional(),
  estimatedDuration: z.number().min(1, 'Duration must be at least 1 minute'),
  order: z.number().min(1),
});

const updateLessonSchema = createLessonSchema.partial();

const reorderLessonsSchema = z.object({
  lessons: z.array(z.object({
    id: z.number(),
    order: z.number(),
  })),
});

const createQuizSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  type: z.enum(['multiple_choice', 'true_false', 'short_answer']),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().min(1, 'Correct answer is required'),
  explanation: z.string().optional(),
  points: z.number().min(1).max(10).default(1),
});

export function registerLessonRoutes(app: Express) {
  // Get lessons for a module
  app.get('/api/modules/:moduleId/lessons', isAdmin, async (req: Request, res: Response) => {
    try {
      const moduleId = parseInt(req.params.moduleId);
      
      const modulelessons = await db
        .select({
          id: lessons.id,
          title: lessons.title,
          description: lessons.description,
          content: lessons.content,
          videoUrl: lessons.videoUrl,
          estimatedDuration: lessons.estimatedDuration,
          order: lessons.order,
          moduleId: lessons.moduleId,
          createdAt: lessons.createdAt,
          updatedAt: lessons.updatedAt,
        })
        .from(lessons)
        .where(eq(lessons.moduleId, moduleId))
        .orderBy(lessons.order);

      // Get attachment and quiz counts for each lesson
      const lessonsWithCounts = await Promise.all(
        modulelessons.map(async (lesson) => {
          const [attachmentCount] = await db
            .select({ count: lessonAttachments.id })
            .from(lessonAttachments)
            .where(eq(lessonAttachments.lessonId, lesson.id));

          const [quizCount] = await db
            .select({ count: lessonQuizzes.id })
            .from(lessonQuizzes)
            .where(eq(lessonQuizzes.lessonId, lesson.id));

          return {
            ...lesson,
            attachmentCount: attachmentCount?.count || 0,
            quizCount: quizCount?.count || 0,
          };
        })
      );

      res.json(lessonsWithCounts);
    } catch (error) {
      console.error('Error fetching lessons:', error);
      res.status(500).json({ message: 'Failed to fetch lessons' });
    }
  });

  // Get a specific lesson with all its data
  app.get('/api/lessons/:id', isAdmin, async (req: Request, res: Response) => {
    try {
      const lessonId = parseInt(req.params.id);
      
      const [lesson] = await db
        .select()
        .from(lessons)
        .where(eq(lessons.id, lessonId));

      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }

      // Get attachments
      const attachments = await db
        .select()
        .from(lessonAttachments)
        .where(eq(lessonAttachments.lessonId, lessonId));

      // Get quizzes
      const quizzes = await db
        .select()
        .from(lessonQuizzes)
        .where(eq(lessonQuizzes.lessonId, lessonId));

      const lessonData = {
        ...lesson,
        attachments: attachments.map(att => ({
          id: att.id.toString(),
          name: att.fileName,
          url: att.fileUrl,
          type: att.fileType,
          size: att.fileSize,
        })),
        quizzes: quizzes.map(quiz => ({
          id: quiz.id.toString(),
          question: quiz.question,
          type: quiz.type as 'multiple_choice' | 'true_false' | 'short_answer',
          options: quiz.options ? JSON.parse(quiz.options) : undefined,
          correctAnswer: quiz.correctAnswer,
          explanation: quiz.explanation,
          points: quiz.points,
        })),
      };

      res.json(lessonData);
    } catch (error) {
      console.error('Error fetching lesson:', error);
      res.status(500).json({ message: 'Failed to fetch lesson' });
    }
  });

  // Create a new lesson
  app.post('/api/modules/:moduleId/lessons', isAdmin, async (req: Request, res: Response) => {
    try {
      const moduleId = parseInt(req.params.moduleId);
      const validatedData = createLessonSchema.parse(req.body);

      const [newLesson] = await db
        .insert(lessons)
        .values({
          ...validatedData,
          moduleId,
          videoUrl: validatedData.videoUrl || null,
          videoEmbedCode: validatedData.videoEmbedCode || null,
        })
        .returning();

      // Handle attachments if provided
      if (req.body.attachments && Array.isArray(req.body.attachments)) {
        const attachmentData = req.body.attachments.map((att: any) => ({
          lessonId: newLesson.id,
          fileName: att.name,
          fileUrl: att.url,
          fileType: att.type,
          fileSize: att.size,
        }));

        await db.insert(lessonAttachments).values(attachmentData);
      }

      // Handle quizzes if provided
      if (req.body.quizzes && Array.isArray(req.body.quizzes)) {
        const quizData = req.body.quizzes.map((quiz: any) => ({
          lessonId: newLesson.id,
          question: quiz.question,
          type: quiz.type,
          options: quiz.options ? JSON.stringify(quiz.options) : null,
          correctAnswer: quiz.correctAnswer,
          explanation: quiz.explanation || null,
          points: quiz.points || 1,
        }));

        await db.insert(lessonQuizzes).values(quizData);
      }

      res.status(201).json(newLesson);
    } catch (error) {
      console.error('Error creating lesson:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to create lesson' });
    }
  });

  // Update a lesson
  app.put('/api/lessons/:id', isAdmin, async (req: Request, res: Response) => {
    try {
      const lessonId = parseInt(req.params.id);
      const validatedData = updateLessonSchema.parse(req.body);

      const [updatedLesson] = await db
        .update(lessons)
        .set({
          ...validatedData,
          videoUrl: validatedData.videoUrl || null,
          videoEmbedCode: validatedData.videoEmbedCode || null,
          updatedAt: new Date(),
        })
        .where(eq(lessons.id, lessonId))
        .returning();

      if (!updatedLesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }

      // Update attachments if provided
      if (req.body.attachments) {
        // Delete existing attachments
        await db.delete(lessonAttachments).where(eq(lessonAttachments.lessonId, lessonId));
        
        // Insert new attachments
        if (Array.isArray(req.body.attachments) && req.body.attachments.length > 0) {
          const attachmentData = req.body.attachments.map((att: any) => ({
            lessonId: lessonId,
            fileName: att.name,
            fileUrl: att.url,
            fileType: att.type,
            fileSize: att.size,
          }));

          await db.insert(lessonAttachments).values(attachmentData);
        }
      }

      // Update quizzes if provided
      if (req.body.quizzes) {
        // Delete existing quizzes
        await db.delete(lessonQuizzes).where(eq(lessonQuizzes.lessonId, lessonId));
        
        // Insert new quizzes
        if (Array.isArray(req.body.quizzes) && req.body.quizzes.length > 0) {
          const quizData = req.body.quizzes.map((quiz: any) => ({
            lessonId: lessonId,
            question: quiz.question,
            type: quiz.type,
            options: quiz.options ? JSON.stringify(quiz.options) : null,
            correctAnswer: quiz.correctAnswer,
            explanation: quiz.explanation || null,
            points: quiz.points || 1,
          }));

          await db.insert(lessonQuizzes).values(quizData);
        }
      }

      res.json(updatedLesson);
    } catch (error) {
      console.error('Error updating lesson:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to update lesson' });
    }
  });

  // Delete a lesson
  app.delete('/api/lessons/:id', isAdmin, async (req: Request, res: Response) => {
    try {
      const lessonId = parseInt(req.params.id);

      // Delete related data first
      await db.delete(lessonAttachments).where(eq(lessonAttachments.lessonId, lessonId));
      await db.delete(lessonQuizzes).where(eq(lessonQuizzes.lessonId, lessonId));

      // Delete the lesson
      const [deletedLesson] = await db
        .delete(lessons)
        .where(eq(lessons.id, lessonId))
        .returning();

      if (!deletedLesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }

      res.json({ message: 'Lesson deleted successfully' });
    } catch (error) {
      console.error('Error deleting lesson:', error);
      res.status(500).json({ message: 'Failed to delete lesson' });
    }
  });

  // Reorder lessons within a module
  app.put('/api/modules/:moduleId/lessons/reorder', isAdmin, async (req: Request, res: Response) => {
    try {
      const moduleId = parseInt(req.params.moduleId);
      const { lessons: lessonOrder } = reorderLessonsSchema.parse(req.body);

      // Update lesson orders
      await Promise.all(
        lessonOrder.map(({ id, order }) =>
          db
            .update(lessons)
            .set({ order, updatedAt: new Date() })
            .where(and(eq(lessons.id, id), eq(lessons.moduleId, moduleId)))
        )
      );

      res.json({ message: 'Lessons reordered successfully' });
    } catch (error) {
      console.error('Error reordering lessons:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Failed to reorder lessons' });
    }
  });

  // Upload lesson attachment
  app.post('/api/upload/lesson-attachment', isAdmin, upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const fileUrl = `/uploads/lessons/${req.file.filename}`;
      
      res.json({
        id: `attachment_${Date.now()}`,
        url: fileUrl,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      res.status(500).json({ message: 'Failed to upload file' });
    }
  });

  // Get module data (for lesson management page)
  app.get('/api/modules/:id', isAdmin, async (req: Request, res: Response) => {
    try {
      const moduleId = parseInt(req.params.id);
      
      // Note: This would need to be implemented based on your modules table
      // For now, returning a placeholder response
      res.json({
        id: moduleId,
        title: `Module ${moduleId}`,
        description: 'Module description',
        courseId: 1,
        order: 1,
      });
    } catch (error) {
      console.error('Error fetching module:', error);
      res.status(500).json({ message: 'Failed to fetch module' });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static('uploads'));
}