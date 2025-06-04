import type { Express } from "express";
import { createServer, type Server } from "http";
// import { setupAuthRoutes } from "./auth-routes-clean";
// import { requireAuth } from "./auth";
import { storage } from "./storage";
import { registerAdminRoutes } from "./admin-routes";
import { registerLearningPathRoutes } from "./learning-path-routes";
import { registerLessonRoutes } from "./lesson-routes";
import { registerQuizRoutes } from "./quiz-routes";
import { registerQuizBuilderRoutes } from "./quiz-builder-routes";
import { generateCareerPathInfo, getCareerRecommendation, generateSkillsAnalysis } from "./openai";
import { contentManager } from "./content-manager";
import type { Request, Response } from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  // Enable working authentication system
  const { setupWorkingAuth, requireAuth } = await import("./auth-working");
  setupWorkingAuth(app);

  // Direct admin setup endpoint (bypasses admin route middleware)
  app.post('/api/setup-admin-direct', requireAuth, async (req, res) => {
    try {
      console.log("=== DIRECT ADMIN SETUP ===");
      console.log("Request body:", JSON.stringify(req.body, null, 2));
      console.log("User:", JSON.stringify(req.user, null, 2));
      
      const { userId, adminSecret } = req.body;
      
      if (!adminSecret || adminSecret !== process.env.ADMIN_SETUP_SECRET) {
        console.log("❌ Invalid secret");
        return res.status(403).json({ message: 'Invalid admin secret' });
      }

      if (!userId) {
        console.log("❌ No userId");
        return res.status(400).json({ message: 'User ID required' });
      }

      console.log("✅ Promoting user to admin:", userId);
      const user = await storage.promoteUserToAdmin(userId);
      console.log("✅ Success:", { id: user.id, isAdmin: user.isAdmin });
      
      return res.json({ 
        success: true,
        message: 'Admin access granted successfully',
        user: { id: user.id, email: user.email, isAdmin: user.isAdmin }
      });
    } catch (error) {
      console.error("❌ Error:", error);
      return res.status(500).json({ 
        message: 'Failed to promote user to admin',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Initialize admin content (one-time setup)
  app.post("/api/admin/initialize", async (req: Request, res: Response) => {
    try {
      const result = await contentManager.initializeAdminCourses();
      res.json(result);
    } catch (error) {
      console.error("Error initializing admin content:", error);
      res.status(500).json({ success: false, message: "Initialization failed" });
    }
  });

  // Frontend course routes - ALL data flows FROM admin
  app.get("/api/courses", async (req: Request, res: Response) => {
    try {
      const page = req.query.page as 'courses' | 'trending' | 'careers';
      const courses = page 
        ? await contentManager.getCoursesByPage(page)
        : await contentManager.getPublishedCourses();
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  // Trending courses (highlighted in admin)
  app.get("/api/courses/trending", async (req: Request, res: Response) => {
    try {
      const courses = await contentManager.getTrendingCourses();
      res.json(courses);
    } catch (error) {
      console.error("Error fetching trending courses:", error);
      res.status(500).json({ message: "Failed to fetch trending courses" });
    }
  });

  // Career-focused courses
  app.get("/api/courses/careers", async (req: Request, res: Response) => {
    try {
      const courses = await contentManager.getCoursesByPage('careers');
      res.json(courses);
    } catch (error) {
      console.error("Error fetching career courses:", error);
      res.status(500).json({ message: "Failed to fetch career courses" });
    }
  });

  // Single course details
  app.get("/api/courses/:id", async (req: Request, res: Response) => {
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

  // Lesson details endpoint
  app.get("/api/lessons/:id", requireAuth, async (req: Request, res: Response) => {
    try {
      const lessonId = parseInt(req.params.id);
      const lesson = await storage.getLesson(lessonId);
      
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      
      res.json(lesson);
    } catch (error) {
      console.error("Error fetching lesson:", error);
      res.status(500).json({ message: "Failed to fetch lesson" });
    }
  });

  // University routes
  app.get("/api/universities", async (req: Request, res: Response) => {
    try {
      const universities = await storage.getAllUniversities();
      res.json(universities);
    } catch (error) {
      console.error("Error fetching universities:", error);
      res.status(500).json({ message: "Failed to fetch universities" });
    }
  });

  // User statistics endpoint
  app.get("/api/user/stats", async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const enrollments = await storage.getUserEnrollments(userId);
      
      const totalEnrollments = enrollments.length;
      const completedCourses = enrollments.filter(e => e.isCompleted === 1).length;
      const averageProgress = enrollments.length > 0 
        ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / totalEnrollments)
        : 0;
      
      const stats = {
        totalEnrollments,
        completedCourses,
        totalStudyTime: completedCourses * 8, // Estimate 8 hours per completed course
        certificatesEarned: completedCourses,
        currentStreak: 3, // This would come from activity tracking
        averageProgress
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user statistics" });
    }
  });

  // Enrollment routes
  app.post("/api/enrollments", async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const enrollment = await storage.enrollUserInCourse({
        userId,
        courseId: req.body.courseId,
        enrolledAt: new Date(),
        status: 'active',
        progress: 0
      });

      res.status(201).json(enrollment);
    } catch (error) {
      console.error("Error creating enrollment:", error);
      res.status(500).json({ message: "Failed to enroll in course" });
    }
  });

  app.get("/api/enrollments", async (req: Request, res: Response) => {
    try {
      // For now, return empty array - will implement proper user-specific enrollments later
      res.json([]);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      res.status(500).json({ message: "Hiba történt a beiratkozások betöltése során" });
    }
  });

  // Newsletter subscription
  app.post("/api/subscribe", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      // Check if already subscribed
      const existing = await storage.getSubscriberByEmail(email);
      if (existing) {
        return res.status(409).json({ message: "Email already subscribed" });
      }

      const subscriber = await storage.addSubscriber({
        email,
        subscribedAt: new Date(),
        isActive: true
      });

      res.status(201).json(subscriber);
    } catch (error) {
      console.error("Error subscribing email:", error);
      res.status(500).json({ message: "Failed to subscribe" });
    }
  });

  // Career path AI routes
  app.get("/api/career-paths/:career", async (req: Request, res: Response) => {
    try {
      const careerPath = req.params.career;
      const careerInfo = await generateCareerPathInfo(careerPath);
      res.json(careerInfo);
    } catch (error) {
      console.error("Error generating career path info:", error);
      res.status(500).json({ message: "Failed to generate career path information" });
    }
  });

  app.post("/api/career-paths/recommend", async (req: Request, res: Response) => {
    try {
      const { interests, experience, goals } = req.body;
      const recommendation = await getCareerRecommendation(interests, experience, goals);
      res.json(recommendation);
    } catch (error) {
      console.error("Error generating career recommendation:", error);
      res.status(500).json({ message: "Failed to generate career recommendation" });
    }
  });

  app.post("/api/career-paths/skills-analysis", async (req: Request, res: Response) => {
    try {
      const { skills, targetRole } = req.body;
      const analysis = await generateSkillsAnalysis(skills, targetRole);
      res.json(analysis);
    } catch (error) {
      console.error("Error generating skills analysis:", error);
      res.status(500).json({ message: "Failed to generate skills analysis" });
    }
  });

  // Learning Path Builder routes
  registerLearningPathRoutes(app);
  
  // Simple admin check endpoint for debugging (must be before admin routes)
  app.get('/api/admin/check', requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      console.log("MAIN ROUTE - Admin check - User object:", JSON.stringify(user, null, 2));
      
      if (!user || !user.id) {
        console.log("MAIN ROUTE - No user or user ID");
        return res.json({ isAdmin: false, user: null });
      }
      
      const userId = user.id;
      const userRecord = await storage.getUser(userId);
      console.log("MAIN ROUTE - User record from DB:", JSON.stringify(userRecord, null, 2));
      
      const isAdmin = userRecord?.isAdmin === 1;
      console.log("MAIN ROUTE - Final admin status:", isAdmin);
      
      res.json({ 
        isAdmin,
        user: userRecord 
      });
    } catch (error) {
      console.error("MAIN ROUTE - Error checking admin status:", error);
      res.status(500).json({ message: "Failed to check admin status" });
    }
  });
  
  // Admin routes 
  registerAdminRoutes(app);
  
  // Lesson routes
  registerLessonRoutes(app);
  
  // Quiz routes
  registerQuizRoutes(app);
  
  // Quiz Builder routes
  registerQuizBuilderRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}