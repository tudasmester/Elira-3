import type { Express } from "express";
import { storage } from "./storage";
import { isAuthenticated } from "./replitAuth";
import { isAdmin } from "./adminAuth";
import { insertCourseSchema, insertUniversitySchema } from "@shared/schema";

export function registerAdminRoutes(app: Express) {
  // Admin middleware for all admin routes
  app.use('/api/admin/*', isAuthenticated, isAdmin);

  // Get all courses with pagination for admin
  app.get("/api/admin/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      console.error("Error fetching admin courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  // Get single course for editing
  app.get("/api/admin/courses/:id", async (req, res) => {
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

  // Create new course
  app.post("/api/admin/courses", async (req, res) => {
    try {
      const validatedData = insertCourseSchema.parse(req.body);
      const course = await storage.createCourse(validatedData);
      res.status(201).json(course);
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(500).json({ message: "Failed to create course" });
    }
  });

  // Update course
  app.put("/api/admin/courses/:id", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const validatedData = insertCourseSchema.parse(req.body);
      
      // Check if course exists
      const existingCourse = await storage.getCourse(courseId);
      if (!existingCourse) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      const updatedCourse = await storage.updateCourse(courseId, validatedData);
      res.json(updatedCourse);
    } catch (error) {
      console.error("Error updating course:", error);
      res.status(500).json({ message: "Failed to update course" });
    }
  });

  // Delete course
  app.delete("/api/admin/courses/:id", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      
      // Check if course exists
      const existingCourse = await storage.getCourse(courseId);
      if (!existingCourse) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      await storage.deleteCourse(courseId);
      res.json({ message: "Course deleted successfully" });
    } catch (error) {
      console.error("Error deleting course:", error);
      res.status(500).json({ message: "Failed to delete course" });
    }
  });

  // Get all universities for course creation
  app.get("/api/admin/universities", async (req, res) => {
    try {
      const universities = await storage.getAllUniversities();
      res.json(universities);
    } catch (error) {
      console.error("Error fetching universities:", error);
      res.status(500).json({ message: "Failed to fetch universities" });
    }
  });

  // Create new university
  app.post("/api/admin/universities", async (req, res) => {
    try {
      const validatedData = insertUniversitySchema.parse(req.body);
      const university = await storage.createUniversity(validatedData);
      res.status(201).json(university);
    } catch (error) {
      console.error("Error creating university:", error);
      res.status(500).json({ message: "Failed to create university" });
    }
  });

  // Get admin dashboard stats
  app.get("/api/admin/stats", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      const universities = await storage.getAllUniversities();
      
      const stats = {
        totalCourses: courses.length,
        totalUniversities: universities.length,
        freeCourses: courses.filter(c => c.isFree).length,
        paidCourses: courses.filter(c => !c.isFree).length,
        coursesByCategory: courses.reduce((acc, course) => {
          acc[course.category] = (acc[course.category] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        coursesByLevel: courses.reduce((acc, course) => {
          acc[course.level] = (acc[course.level] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Check if current user is admin
  app.get("/api/admin/check", async (req, res) => {
    try {
      const user = req.user as any;
      const userId = user.claims.sub;
      const userRecord = await storage.getUser(userId);
      
      res.json({ 
        isAdmin: !!userRecord?.isAdmin,
        user: userRecord 
      });
    } catch (error) {
      console.error("Error checking admin status:", error);
      res.status(500).json({ message: "Failed to check admin status" });
    }
  });

  // Super admin endpoint to promote users to admin (protected by environment variable)
  app.post('/api/admin/setup-admin', async (req, res) => {
    try {
      const { userId, adminSecret } = req.body;
      
      // Check if the admin secret matches environment variable
      if (!process.env.ADMIN_SETUP_SECRET || adminSecret !== process.env.ADMIN_SETUP_SECRET) {
        return res.status(403).json({ message: "Invalid admin setup secret" });
      }

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const user = await storage.promoteUserToAdmin(userId);
      res.json({ message: "User promoted to admin successfully", user: { id: user.id, email: user.email, isAdmin: user.isAdmin } });
    } catch (error) {
      console.error("Error promoting user to admin:", error);
      res.status(500).json({ message: "Failed to promote user to admin" });
    }
  });
}