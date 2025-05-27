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
  // Setup streamlined authentication routes (email/password + social login)
  setupAuthRoutes(app);

  // Register admin routes
  registerAdminRoutes(app);

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
      res.status(500).json({ message: "Error fetching courses" });
    }
  });

  app.get("/api/courses/trending", async (req: Request, res: Response) => {
    try {
      const courses = await contentManager.getTrendingCourses();
      res.json(courses);
    } catch (error) {
      console.error("Error fetching trending courses:", error);
      res.status(500).json({ message: "Error fetching trending courses" });
    }
  });

  app.get("/api/courses/careers", async (req: Request, res: Response) => {
    try {
      const courses = await contentManager.getCoursesByPage('careers');
      res.json(courses);
    } catch (error) {
      console.error("Error fetching career courses:", error);
      res.status(500).json({ message: "Error fetching career courses" });
    }
  });

  app.get("/api/courses/:id", async (req: Request, res: Response) => {
    try {
      const courseId = parseInt(req.params.id);
      const course = await storage.getCourseWithDetails(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      res.json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Error fetching course" });
    }
  });

  // Universities data
  app.get("/api/universities", async (req: Request, res: Response) => {
    try {
      const universities = await storage.getUniversities();
      res.json(universities);
    } catch (error) {
      console.error("Error fetching universities:", error);
      res.status(500).json({ message: "Error fetching universities" });
    }
  });

  // Enrollment routes
  app.post("/api/enrollments", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const { courseId } = req.body;
      
      if (!userId || !courseId) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      const enrollment = await storage.createEnrollment({ userId, courseId });
      res.status(201).json(enrollment);
    } catch (error) {
      console.error("Error creating enrollment:", error);
      res.status(500).json({ message: "Error creating enrollment" });
    }
  });

  app.get("/api/enrollments", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const enrollments = await storage.getUserEnrollments(userId);
      res.json(enrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      res.status(500).json({ message: "Error fetching enrollments" });
    }
  });

  // Newsletter subscription
  app.post("/api/subscribe", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      // Store newsletter subscription
      await storage.createNewsletterSubscription({ email });
      res.json({ message: "Successfully subscribed to newsletter" });
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      res.status(500).json({ message: "Error subscribing to newsletter" });
    }
  });

  // AI Career Path routes
  app.get("/api/career-paths/:career", async (req: Request, res: Response) => {
    try {
      const career = req.params.career;
      const careerInfo = await generateCareerPathInfo(career);
      res.json(careerInfo);
    } catch (error) {
      console.error("Error generating career path info:", error);
      res.status(500).json({ message: "Error generating career path information" });
    }
  });

  app.post("/api/career-paths/recommend", async (req: Request, res: Response) => {
    try {
      const { interests, experience, goals } = req.body;
      const recommendation = await getCareerRecommendation(interests, experience, goals);
      res.json(recommendation);
    } catch (error) {
      console.error("Error getting career recommendation:", error);
      res.status(500).json({ message: "Error getting career recommendation" });
    }
  });

  app.post("/api/career-paths/skills-analysis", async (req: Request, res: Response) => {
    try {
      const { currentSkills, targetRole } = req.body;
      const analysis = await generateSkillsAnalysis(currentSkills, targetRole);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing skills:", error);
      res.status(500).json({ message: "Error analyzing skills" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}