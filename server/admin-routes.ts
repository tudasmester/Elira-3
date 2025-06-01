import type { Express } from "express";
import { storage } from "./storage";
import { requireAuth } from "./auth-working";
import { isAdmin } from "./adminAuth";
import { insertCourseSchema, insertUniversitySchema } from "@shared/schema";
import { contentSync } from "./content-sync";

export function registerAdminRoutes(app: Express) {
  // Admin setup endpoint - only requires authentication, not admin privileges
  app.post('/api/admin/setup-admin', requireAuth, async (req, res) => {
    try {
      console.log("=== ADMIN SETUP START ===");
      console.log("Request body:", JSON.stringify(req.body, null, 2));
      console.log("Authenticated user:", JSON.stringify(req.user, null, 2));
      console.log("Environment secret exists:", !!process.env.ADMIN_SETUP_SECRET);
      
      const { userId, adminSecret } = req.body;
      console.log("Extracted - userId:", userId, "adminSecret provided:", !!adminSecret);
      
      // Check if the admin secret matches environment variable
      if (!process.env.ADMIN_SETUP_SECRET || adminSecret !== process.env.ADMIN_SETUP_SECRET) {
        console.log("❌ Secret mismatch. Provided:", adminSecret?.substring(0, 3) + "...", "Expected:", process.env.ADMIN_SETUP_SECRET?.substring(0, 3) + "...");
        return res.status(403).json({ message: "Invalid admin setup secret" });
      }

      if (!userId) {
        console.log("❌ No userId provided");
        return res.status(400).json({ message: "User ID is required" });
      }

      console.log("✅ Promoting user to admin:", userId);
      const user = await storage.promoteUserToAdmin(userId);
      console.log("✅ User promoted successfully:", { id: user.id, isAdmin: user.isAdmin });
      
      const response = { 
        message: "User promoted to admin successfully", 
        user: { id: user.id, email: user.email, isAdmin: user.isAdmin },
        success: true
      };
      console.log("✅ Sending response:", JSON.stringify(response, null, 2));
      
      return res.json(response);
    } catch (error) {
      console.error("❌ Admin setup error:", error);
      return res.status(500).json({ 
        message: "Failed to promote user to admin", 
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Admin middleware for all other admin routes
  app.use('/api/admin/*', requireAuth, isAdmin);

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

  // Get detailed course with modules, lessons, and analytics
  app.get('/api/admin/courses/:id/detailed', isAdmin, async (req: Request, res: Response) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourseWithDetails(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.json(course);
    } catch (error) {
      console.error("Error fetching detailed course:", error);
      res.status(500).json({ message: "Failed to fetch course details" });
    }
  });

  // Get course analytics
  app.get('/api/admin/courses/:id/analytics', isAdmin, async (req: Request, res: Response) => {
    try {
      const courseId = parseInt(req.params.id);
      const analytics = await storage.getCourseAnalytics(courseId);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching course analytics:", error);
      res.status(500).json({ message: "Failed to fetch course analytics" });
    }
  });

  // Create new module for a course
  app.post('/api/courses/:id/modules', isAdmin, async (req: Request, res: Response) => {
    try {
      const courseId = parseInt(req.params.id);
      const moduleData = { ...req.body, courseId };
      
      const module = await storage.createCourseModule(moduleData);
      res.json(module);
    } catch (error) {
      console.error("Error creating module:", error);
      res.status(500).json({ message: "Failed to create module" });
    }
  });

  // Create new lesson for a module
  app.post('/api/modules/:id/lessons', isAdmin, async (req: Request, res: Response) => {
    try {
      const moduleId = parseInt(req.params.id);
      const lessonData = { ...req.body, moduleId };
      
      const lesson = await storage.createLesson(lessonData);
      res.json(lesson);
    } catch (error) {
      console.error("Error creating lesson:", error);
      res.status(500).json({ message: "Failed to create lesson" });
    }
  });

  // Toggle course highlight status
  apiRouter.post('/courses/:id/toggle-highlight', isAdmin, async (req: Request, res: Response) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.toggleCourseHighlight(courseId);
      res.json(course);
    } catch (error) {
      console.error("Error toggling course highlight:", error);
      res.status(500).json({ message: "Failed to toggle course highlight" });
    }
  });

  // Update lesson content
  app.put('/api/lessons/:id', isAdmin, async (req: Request, res: Response) => {
    try {
      const lessonId = parseInt(req.params.id);
      const lesson = await storage.updateLesson(lessonId, req.body);
      res.json(lesson);
    } catch (error) {
      console.error("Error updating lesson:", error);
      res.status(500).json({ message: "Failed to update lesson" });
    }
  });

  // Create quiz for a lesson
  app.post('/api/lessons/:id/quizzes', isAdmin, async (req: Request, res: Response) => {
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

  // Get all highlighted courses for frontend
  app.get('/api/courses/highlighted', async (req: Request, res: Response) => {
    try {
      const highlightedCourses = await storage.getHighlightedCourses();
      res.json({ success: true, data: { courses: highlightedCourses } });
    } catch (error) {
      console.error("Error fetching highlighted courses:", error);
      res.status(500).json({ message: "Failed to fetch highlighted courses" });
    }
  });



  // ========== CONTENT IMPORT & SYNCHRONIZATION ENDPOINTS ==========
  
  // Import courses from existing frontend pages (/courses, /trending, /careers)
  app.post('/api/admin/import-courses', async (req, res) => {
    try {
      await contentSync.importCoursesFromFrontend();
      res.json({ 
        success: true, 
        message: "Courses imported successfully from frontend pages" 
      });
    } catch (error) {
      console.error("Error importing courses:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to import courses from frontend" 
      });
    }
  });

  // Sync course visibility and trending status
  app.post('/api/admin/sync-visibility', async (req, res) => {
    try {
      await contentSync.syncCourseVisibility();
      res.json({ 
        success: true, 
        message: "Course visibility synchronized successfully" 
      });
    } catch (error) {
      console.error("Error syncing visibility:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to sync course visibility" 
      });
    }
  });

  // Export course data for frontend consumption (real-time sync)
  app.get('/api/admin/export-frontend', async (req, res) => {
    try {
      const exportData = await contentSync.exportCoursesForFrontend();
      res.json({ 
        success: true, 
        data: exportData 
      });
    } catch (error) {
      console.error("Error exporting for frontend:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to export courses for frontend" 
      });
    }
  });

  // Validate course data integrity
  app.get('/api/admin/validate-data', async (req, res) => {
    try {
      const validation = await contentSync.validateCourseData();
      res.json({ 
        success: validation.valid, 
        validation 
      });
    } catch (error) {
      console.error("Error validating data:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to validate course data" 
      });
    }
  });

  // Bulk course operations
  app.post('/api/admin/courses/bulk-update', async (req, res) => {
    try {
      const { courseIds, updates } = req.body;
      
      if (!courseIds || !Array.isArray(courseIds)) {
        return res.status(400).json({ message: "Course IDs array is required" });
      }

      const results = [];
      for (const courseId of courseIds) {
        try {
          const updatedCourse = await storage.updateCourse(parseInt(courseId), updates);
          results.push({ courseId, success: true, course: updatedCourse });
        } catch (error) {
          results.push({ courseId, success: false, error: error.message });
        }
      }

      res.json({ 
        success: true, 
        message: `Bulk update completed for ${courseIds.length} courses`,
        results 
      });
    } catch (error) {
      console.error("Error in bulk update:", error);
      res.status(500).json({ message: "Failed to perform bulk update" });
    }
  });

  // Archive/unarchive courses
  app.put('/api/admin/courses/:id/archive', async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      const { archive } = req.body;
      
      const updatedCourse = await storage.updateCourse(courseId, { 
        isPublished: archive ? 0 : 1 
      });
      
      res.json({ 
        success: true, 
        course: updatedCourse,
        message: archive ? "Course archived successfully" : "Course unarchived successfully"
      });
    } catch (error) {
      console.error("Error archiving/unarchiving course:", error);
      res.status(500).json({ message: "Failed to archive/unarchive course" });
    }
  });

  // Get content synchronization status
  app.get('/api/admin/sync-status', async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      const universities = await storage.getAllUniversities();
      
      const syncStatus = {
        lastSyncTime: new Date().toISOString(),
        totalCourses: courses.length,
        publishedCourses: courses.filter(c => c.isPublished === 1).length,
        archivedCourses: courses.filter(c => c.isPublished === 0).length,
        freeCourses: courses.filter(c => c.isFree === 1).length,
        paidCourses: courses.filter(c => c.isFree === 0).length,
        highlightedCourses: courses.filter(c => c.isHighlighted === 1).length,
        universities: universities.length,
        categories: [...new Set(courses.map(c => c.category))],
        levels: [...new Set(courses.map(c => c.level))]
      };
      
      res.json({ 
        success: true, 
        syncStatus 
      });
    } catch (error) {
      console.error("Error getting sync status:", error);
      res.status(500).json({ message: "Failed to get synchronization status" });
    }
  });
}