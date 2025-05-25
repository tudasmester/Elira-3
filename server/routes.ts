import express, { type Express, type Request, type Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubscriberSchema, insertEnrollmentSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth, isAuthenticated } from "./replitAuth";
import enrollmentRouter from "./enrollment-routes";
import { generateCareerPathInfo, getCareerRecommendation, generateSkillsAnalysis } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);
  
  // API routes
  const apiRouter = express.Router();
  
  // Auth routes
  apiRouter.get('/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  // Universities
  apiRouter.get("/universities", async (req, res) => {
    try {
      const universities = await storage.getAllUniversities();
      res.json({ universities });
    } catch (error) {
      res.status(500).json({ message: "Hiba történt az egyetemek lekérdezésekor" });
    }
  });
  
  apiRouter.get("/universities/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const university = await storage.getUniversity(id);
      
      if (!university) {
        return res.status(404).json({ message: "Az egyetem nem található" });
      }
      
      res.json({ university });
    } catch (error) {
      res.status(500).json({ message: "Hiba történt az egyetem lekérdezésekor" });
    }
  });
  
  // Courses
  apiRouter.get("/courses", async (req, res) => {
    try {
      const { category, universityId, free } = req.query;
      
      let courses;
      
      if (category) {
        courses = await storage.getCoursesByCategory(category as string);
      } else if (universityId) {
        courses = await storage.getCoursesByUniversity(parseInt(universityId as string));
      } else if (free === "true") {
        courses = await storage.getFreeCourses();
      } else {
        courses = await storage.getAllCourses();
      }
      
      res.json({ courses });
    } catch (error) {
      res.status(500).json({ message: "Hiba történt a kurzusok lekérdezésekor" });
    }
  });
  
  apiRouter.get("/courses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const course = await storage.getCourse(id);
      
      if (!course) {
        return res.status(404).json({ message: "A kurzus nem található" });
      }
      
      res.json({ course });
    } catch (error) {
      res.status(500).json({ message: "Hiba történt a kurzus lekérdezésekor" });
    }
  });
  
  // Degrees
  apiRouter.get("/degrees", async (req, res) => {
    try {
      const { universityId } = req.query;
      
      let degrees;
      
      if (universityId) {
        degrees = await storage.getDegreesByUniversity(parseInt(universityId as string));
      } else {
        degrees = await storage.getAllDegrees();
      }
      
      res.json({ degrees });
    } catch (error) {
      res.status(500).json({ message: "Hiba történt a diplomák lekérdezésekor" });
    }
  });
  
  apiRouter.get("/degrees/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const degree = await storage.getDegree(id);
      
      if (!degree) {
        return res.status(404).json({ message: "A diploma nem található" });
      }
      
      res.json({ degree });
    } catch (error) {
      res.status(500).json({ message: "Hiba történt a diploma lekérdezésekor" });
    }
  });
  
  // Newsletter subscription
  apiRouter.post("/newsletter/subscribe", async (req, res) => {
    try {
      const validatedData = insertSubscriberSchema.parse(req.body);
      
      // Check if the email already exists
      const existingSubscriber = await storage.getSubscriberByEmail(validatedData.email);
      
      if (existingSubscriber) {
        return res.status(400).json({ message: "Ez az e-mail cím már fel van iratkozva" });
      }
      
      const subscriber = await storage.addSubscriber(validatedData);
      res.status(201).json({ message: "Sikeres feliratkozás", subscriber });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Érvénytelen adatok", errors: error.errors });
      }
      res.status(500).json({ message: "Hiba történt a feliratkozás során" });
    }
  });
  
  // AI Career Path routes
  apiRouter.get("/career-paths/:career", async (req: Request, res: Response) => {
    try {
      const career = req.params.career;
      const careerInfo = await generateCareerPathInfo(career);
      res.json(careerInfo);
    } catch (error) {
      console.error("Error fetching career path info:", error);
      res.status(500).json({ message: "Hiba történt a karrierút információk lekérdezésekor" });
    }
  });

  apiRouter.post("/career-paths/recommend", async (req: Request, res: Response) => {
    try {
      const { interests, skills, background } = req.body;
      
      if (!Array.isArray(interests) || !Array.isArray(skills) || !background) {
        return res.status(400).json({ 
          message: "Érdeklődési körök, készségek és háttér megadása kötelező" 
        });
      }
      
      const recommendations = await getCareerRecommendation(interests, skills, background);
      res.json(recommendations);
    } catch (error) {
      console.error("Error generating career recommendations:", error);
      res.status(500).json({ message: "Hiba történt a karrierút ajánlások generálásakor" });
    }
  });

  apiRouter.post("/career-paths/skills-analysis", async (req: Request, res: Response) => {
    try {
      const { currentSkills, targetCareer } = req.body;
      
      if (!Array.isArray(currentSkills) || !targetCareer) {
        return res.status(400).json({ 
          message: "Jelenlegi készségek és célkarrier megadása kötelező" 
        });
      }
      
      const analysis = await generateSkillsAnalysis(currentSkills, targetCareer);
      res.json(analysis);
    } catch (error) {
      console.error("Error generating skills analysis:", error);
      res.status(500).json({ message: "Hiba történt a készség elemzés generálásakor" });
    }
  });

  // Mount the API router
  // Add enrollment routes
  app.use("/api", apiRouter);
  app.use("/api", enrollmentRouter);

  const httpServer = createServer(app);
  return httpServer;
}
