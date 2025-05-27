import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuthRoutes } from "./auth-routes";
import { requireAuth } from "./auth";
import { storage } from "./storage";
import { registerAdminRoutes } from "./admin-routes";
import { generateCareerPathInfo, getCareerRecommendation, generateSkillsAnalysis } from "./openai";
import { contentManager } from "./content-manager";
import type { Request, Response } from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup comprehensive authentication routes (email/password, phone, social login)
  setupAuthRoutes(app);

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

  // Enrollment routes
  app.post("/api/enrollments", requireAuth, async (req: Request, res: Response) => {
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

  app.get("/api/enrollments", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const enrollments = await storage.getUserEnrollments(userId);
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      res.status(500).json({ message: "Failed to fetch enrollments" });
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

  // Register subscription routes
  const { registerSubscriptionRoutes } = await import("./subscription-routes-fixed");
  registerSubscriptionRoutes(app);
  
  // Register admin routes
  const { registerAdminRoutes: registerSimpleAdminRoutes } = await import("./admin-routes-working");
  registerSimpleAdminRoutes(app);

  // Auth routes
  // This route is now handled by auth-routes.ts

  const httpServer = createServer(app);
  return httpServer;
}