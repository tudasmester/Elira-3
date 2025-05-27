import type { Express, Request, Response } from "express";
import { db } from "./db";
import { learningPaths, learningPathSteps, courses } from "@shared/schema";
import { requireAuth } from "./auth-system";
import { eq, and, desc } from "drizzle-orm";
import { z } from "zod";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export function registerLearningPathRoutes(app: Express) {
  // Get all learning paths for the authenticated user
  app.get("/api/learning-paths", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      
      const userPaths = await db
        .select()
        .from(learningPaths)
        .where(eq(learningPaths.userId, userId))
        .orderBy(desc(learningPaths.updatedAt));

      res.json(userPaths);
    } catch (error) {
      console.error("Error fetching learning paths:", error);
      res.status(500).json({ message: "Failed to fetch learning paths" });
    }
  });

  // Get a specific learning path with its steps and course details
  app.get("/api/learning-paths/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const pathId = parseInt(req.params.id);
      const userId = req.user!.id;

      const path = await db
        .select()
        .from(learningPaths)
        .where(and(
          eq(learningPaths.id, pathId),
          eq(learningPaths.userId, userId)
        ));

      if (!path.length) {
        return res.status(404).json({ message: "Learning path not found" });
      }

      // Get steps with course details
      const steps = await db
        .select({
          id: learningPathSteps.id,
          learningPathId: learningPathSteps.learningPathId,
          courseId: learningPathSteps.courseId,
          orderIndex: learningPathSteps.orderIndex,
          isCompleted: learningPathSteps.isCompleted,
          estimatedDuration: learningPathSteps.estimatedDuration,
          course: {
            id: courses.id,
            title: courses.title,
            description: courses.description,
            imageUrl: courses.imageUrl,
            level: courses.level,
            category: courses.category,
            duration: courses.duration,
            rating: courses.rating,
          }
        })
        .from(learningPathSteps)
        .leftJoin(courses, eq(learningPathSteps.courseId, courses.id))
        .where(eq(learningPathSteps.learningPathId, pathId))
        .orderBy(learningPathSteps.orderIndex);

      res.json({
        ...path[0],
        steps
      });
    } catch (error) {
      console.error("Error fetching learning path:", error);
      res.status(500).json({ message: "Failed to fetch learning path" });
    }
  });

  // Create a new learning path
  app.post("/api/learning-paths", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!.id;
      
      const createSchema = z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().optional(),
        difficulty: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
        tags: z.array(z.string()).default([]),
        isPublic: z.boolean().default(false),
        totalDuration: z.string().optional(),
      });

      const validatedData = createSchema.parse(req.body);

      const [newPath] = await db
        .insert(learningPaths)
        .values({
          ...validatedData,
          userId,
        })
        .returning();

      res.status(201).json(newPath);
    } catch (error) {
      console.error("Error creating learning path:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create learning path" });
    }
  });

  // Update a learning path
  app.put("/api/learning-paths/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const pathId = parseInt(req.params.id);
      const userId = req.user!.id;

      const updateSchema = z.object({
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
        tags: z.array(z.string()).optional(),
        isPublic: z.boolean().optional(),
        totalDuration: z.string().optional(),
      });

      const validatedData = updateSchema.parse(req.body);

      const [updatedPath] = await db
        .update(learningPaths)
        .set({
          ...validatedData,
          updatedAt: new Date(),
        })
        .where(and(
          eq(learningPaths.id, pathId),
          eq(learningPaths.userId, userId)
        ))
        .returning();

      if (!updatedPath) {
        return res.status(404).json({ message: "Learning path not found" });
      }

      res.json(updatedPath);
    } catch (error) {
      console.error("Error updating learning path:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update learning path" });
    }
  });

  // Delete a learning path
  app.delete("/api/learning-paths/:id", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const pathId = parseInt(req.params.id);
      const userId = req.user!.id;

      // Delete steps first
      await db
        .delete(learningPathSteps)
        .where(eq(learningPathSteps.learningPathId, pathId));

      // Delete the path
      const deletedPath = await db
        .delete(learningPaths)
        .where(and(
          eq(learningPaths.id, pathId),
          eq(learningPaths.userId, userId)
        ))
        .returning();

      if (!deletedPath.length) {
        return res.status(404).json({ message: "Learning path not found" });
      }

      res.json({ message: "Learning path deleted successfully" });
    } catch (error) {
      console.error("Error deleting learning path:", error);
      res.status(500).json({ message: "Failed to delete learning path" });
    }
  });

  // Add a course to a learning path
  app.post("/api/learning-paths/:id/steps", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const pathId = parseInt(req.params.id);
      const userId = req.user!.id;

      // Verify the path belongs to the user
      const path = await db
        .select()
        .from(learningPaths)
        .where(and(
          eq(learningPaths.id, pathId),
          eq(learningPaths.userId, userId)
        ));

      if (!path.length) {
        return res.status(404).json({ message: "Learning path not found" });
      }

      const stepSchema = z.object({
        courseId: z.number(),
        orderIndex: z.number(),
        estimatedDuration: z.string().optional(),
      });

      const validatedData = stepSchema.parse(req.body);

      const [newStep] = await db
        .insert(learningPathSteps)
        .values({
          learningPathId: pathId,
          ...validatedData,
        })
        .returning();

      res.status(201).json(newStep);
    } catch (error) {
      console.error("Error adding step:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add step" });
    }
  });

  // Update step order (for drag and drop)
  app.put("/api/learning-paths/:id/reorder", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const pathId = parseInt(req.params.id);
      const userId = req.user!.id;

      // Verify the path belongs to the user
      const path = await db
        .select()
        .from(learningPaths)
        .where(and(
          eq(learningPaths.id, pathId),
          eq(learningPaths.userId, userId)
        ));

      if (!path.length) {
        return res.status(404).json({ message: "Learning path not found" });
      }

      const reorderSchema = z.object({
        steps: z.array(z.object({
          id: z.number(),
          orderIndex: z.number(),
        }))
      });

      const { steps } = reorderSchema.parse(req.body);

      // Update each step's order
      for (const step of steps) {
        await db
          .update(learningPathSteps)
          .set({ orderIndex: step.orderIndex })
          .where(eq(learningPathSteps.id, step.id));
      }

      res.json({ message: "Steps reordered successfully" });
    } catch (error) {
      console.error("Error reordering steps:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to reorder steps" });
    }
  });

  // Remove a step from a learning path
  app.delete("/api/learning-paths/:pathId/steps/:stepId", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const pathId = parseInt(req.params.pathId);
      const stepId = parseInt(req.params.stepId);
      const userId = req.user!.id;

      // Verify the path belongs to the user
      const path = await db
        .select()
        .from(learningPaths)
        .where(and(
          eq(learningPaths.id, pathId),
          eq(learningPaths.userId, userId)
        ));

      if (!path.length) {
        return res.status(404).json({ message: "Learning path not found" });
      }

      const deletedStep = await db
        .delete(learningPathSteps)
        .where(and(
          eq(learningPathSteps.id, stepId),
          eq(learningPathSteps.learningPathId, pathId)
        ))
        .returning();

      if (!deletedStep.length) {
        return res.status(404).json({ message: "Step not found" });
      }

      res.json({ message: "Step removed successfully" });
    } catch (error) {
      console.error("Error removing step:", error);
      res.status(500).json({ message: "Failed to remove step" });
    }
  });

  // Toggle step completion
  app.patch("/api/learning-paths/:pathId/steps/:stepId/toggle", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      const pathId = parseInt(req.params.pathId);
      const stepId = parseInt(req.params.stepId);
      const userId = req.user!.id;

      // Verify the path belongs to the user
      const path = await db
        .select()
        .from(learningPaths)
        .where(and(
          eq(learningPaths.id, pathId),
          eq(learningPaths.userId, userId)
        ));

      if (!path.length) {
        return res.status(404).json({ message: "Learning path not found" });
      }

      // Get current step status
      const [currentStep] = await db
        .select()
        .from(learningPathSteps)
        .where(eq(learningPathSteps.id, stepId));

      if (!currentStep) {
        return res.status(404).json({ message: "Step not found" });
      }

      // Toggle completion status
      const [updatedStep] = await db
        .update(learningPathSteps)
        .set({ isCompleted: !currentStep.isCompleted })
        .where(eq(learningPathSteps.id, stepId))
        .returning();

      res.json(updatedStep);
    } catch (error) {
      console.error("Error toggling step completion:", error);
      res.status(500).json({ message: "Failed to toggle step completion" });
    }
  });
}