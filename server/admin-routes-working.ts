import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import { isAdmin } from "./adminAuth";

export function registerAdminRoutes(app: Express) {
  // Get all courses for admin dashboard
  app.get('/api/admin/courses', isAdmin, async (req: Request, res: Response) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      console.error("Error fetching admin courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  // Create new course
  app.post('/api/admin/courses', isAdmin, async (req: Request, res: Response) => {
    try {
      const course = await storage.createCourse(req.body);
      res.status(201).json(course);
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(500).json({ message: "Failed to create course" });
    }
  });

  // Get course by ID for admin
  app.get('/api/admin/courses/:id', isAdmin, async (req: Request, res: Response) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourse(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  // Update course
  app.put('/api/admin/courses/:id', isAdmin, async (req: Request, res: Response) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.updateCourse(courseId, req.body);
      res.json(course);
    } catch (error) {
      console.error("Error updating course:", error);
      res.status(500).json({ message: "Failed to update course" });
    }
  });

  // Delete course
  app.delete('/api/admin/courses/:id', isAdmin, async (req: Request, res: Response) => {
    try {
      const courseId = parseInt(req.params.id);
      await storage.deleteCourse(courseId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting course:", error);
      res.status(500).json({ message: "Failed to delete course" });
    }
  });

  // Get highlighted courses (public endpoint)
  app.get('/api/courses/highlighted', async (req: Request, res: Response) => {
    try {
      const highlightedCourses = await storage.getHighlightedCourses();
      res.json(highlightedCourses);
    } catch (error) {
      console.error("Error fetching highlighted courses:", error);
      res.status(500).json({ message: "Failed to fetch highlighted courses" });
    }
  });
}