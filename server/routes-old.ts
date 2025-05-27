import express, { type Express, type Request, type Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubscriberSchema, insertEnrollmentSchema, insertCourseSchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth, isAuthenticated } from "./replitAuth";
import enrollmentRouter from "./enrollment-routes";
import { generateCareerPathInfo, getCareerRecommendation, generateSkillsAnalysis } from "./openai";
import { registerAdminRoutes } from "./admin-routes";

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
  
  // Course Management API Endpoints
  
  // GET /api/courses - List all courses with optional filtering
  apiRouter.get("/courses", async (req, res) => {
    try {
      const { 
        category, 
        universityId, 
        free, 
        level, 
        published,
        page = 1, 
        limit = 20,
        search 
      } = req.query;
      
      // Input validation
      const pageNum = Math.max(1, parseInt(page as string) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit as string) || 20));
      
      let courses;
      
      // Apply filters based on query parameters
      if (category && typeof category === 'string') {
        courses = await storage.getCoursesByCategory(category);
      } else if (universityId) {
        const univId = parseInt(universityId as string);
        if (isNaN(univId)) {
          return res.status(400).json({ 
            success: false,
            message: "Invalid university ID format" 
          });
        }
        courses = await storage.getCoursesByUniversity(univId);
      } else if (free === "true") {
        courses = await storage.getFreeCourses();
      } else {
        courses = await storage.getAllCourses();
      }
      
      // Apply additional filters
      let filteredCourses = courses;
      
      if (level && typeof level === 'string') {
        filteredCourses = filteredCourses.filter(course => 
          course.level.toLowerCase() === level.toLowerCase()
        );
      }
      
      if (published !== undefined) {
        const isPublished = published === 'true' ? 1 : 0;
        filteredCourses = filteredCourses.filter(course => 
          course.isPublished === isPublished
        );
      }
      
      if (search && typeof search === 'string') {
        const searchTerm = search.toLowerCase();
        filteredCourses = filteredCourses.filter(course => 
          course.title.toLowerCase().includes(searchTerm) ||
          course.description.toLowerCase().includes(searchTerm) ||
          course.category.toLowerCase().includes(searchTerm)
        );
      }
      
      // Pagination
      const total = filteredCourses.length;
      const offset = (pageNum - 1) * limitNum;
      const paginatedCourses = filteredCourses.slice(offset, offset + limitNum);
      
      res.json({ 
        success: true,
        data: {
          courses: paginatedCourses,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: total,
            pages: Math.ceil(total / limitNum)
          }
        }
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch courses",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });
  
  // GET /api/courses/:id - Get a single course by ID
  apiRouter.get("/courses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Input validation
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({ 
          success: false,
          message: "Invalid course ID format" 
        });
      }
      
      const course = await storage.getCourse(id);
      
      if (!course) {
        return res.status(404).json({ 
          success: false,
          message: "Course not found" 
        });
      }
      
      res.json({ 
        success: true,
        data: { course }
      });
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to fetch course",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // POST /api/courses - Create a new course
  apiRouter.post("/courses", isAuthenticated, async (req, res) => {
    try {
      // Input validation using Zod schema
      const validatedData = insertCourseSchema.parse(req.body);
      
      // Additional business logic validation
      if (validatedData.universityId) {
        const university = await storage.getUniversity(validatedData.universityId);
        if (!university) {
          return res.status(400).json({
            success: false,
            message: "Invalid university ID - university not found"
          });
        }
      }
      
      // Ensure price is valid
      if (validatedData.price && validatedData.price < 0) {
        return res.status(400).json({
          success: false,
          message: "Price cannot be negative"
        });
      }
      
      // Create the course
      const course = await storage.createCourse(validatedData);
      
      res.status(201).json({
        success: true,
        message: "Course created successfully",
        data: { course }
      });
    } catch (error) {
      console.error("Error creating course:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid input data",
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      
      res.status(500).json({
        success: false,
        message: "Failed to create course",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // PUT /api/courses/:id - Update an existing course
  apiRouter.put("/courses/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Input validation
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid course ID format"
        });
      }
      
      // Check if course exists
      const existingCourse = await storage.getCourse(id);
      if (!existingCourse) {
        return res.status(404).json({
          success: false,
          message: "Course not found"
        });
      }
      
      // Validate input data
      const validatedData = insertCourseSchema.parse(req.body);
      
      // Additional business logic validation
      if (validatedData.universityId) {
        const university = await storage.getUniversity(validatedData.universityId);
        if (!university) {
          return res.status(400).json({
            success: false,
            message: "Invalid university ID - university not found"
          });
        }
      }
      
      // Ensure price is valid
      if (validatedData.price && validatedData.price < 0) {
        return res.status(400).json({
          success: false,
          message: "Price cannot be negative"
        });
      }
      
      // Update the course
      const updatedCourse = await storage.updateCourse(id, validatedData);
      
      res.json({
        success: true,
        message: "Course updated successfully",
        data: { course: updatedCourse }
      });
    } catch (error) {
      console.error("Error updating course:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: "Invalid input data",
          errors: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      
      res.status(500).json({
        success: false,
        message: "Failed to update course",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // DELETE /api/courses/:id - Delete a course
  apiRouter.delete("/courses/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Input validation
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid course ID format"
        });
      }
      
      // Check if course exists
      const existingCourse = await storage.getCourse(id);
      if (!existingCourse) {
        return res.status(404).json({
          success: false,
          message: "Course not found"
        });
      }
      
      // Check if course has enrollments (optional business rule)
      // You might want to prevent deletion of courses with active enrollments
      const enrollments = await storage.getCourseEnrollments(id);
      if (enrollments && enrollments.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Cannot delete course with active enrollments",
          data: { enrollmentCount: enrollments.length }
        });
      }
      
      // Delete the course
      await storage.deleteCourse(id);
      
      res.json({
        success: true,
        message: "Course deleted successfully",
        data: { deletedCourseId: id }
      });
    } catch (error) {
      console.error("Error deleting course:", error);
      res.status(500).json({
        success: false,
        message: "Failed to delete course",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  });

  // PATCH /api/courses/:id/publish - Toggle course publication status
  apiRouter.patch("/courses/:id/publish", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { isPublished } = req.body;
      
      // Input validation
      if (isNaN(id) || id <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid course ID format"
        });
      }
      
      if (typeof isPublished !== 'boolean') {
        return res.status(400).json({
          success: false,
          message: "isPublished must be a boolean value"
        });
      }
      
      // Check if course exists
      const existingCourse = await storage.getCourse(id);
      if (!existingCourse) {
        return res.status(404).json({
          success: false,
          message: "Course not found"
        });
      }
      
      // Update publication status
      const updatedCourse = await storage.updateCourse(id, {
        ...existingCourse,
        isPublished: isPublished ? 1 : 0
      });
      
      res.json({
        success: true,
        message: `Course ${isPublished ? 'published' : 'unpublished'} successfully`,
        data: { course: updatedCourse }
      });
    } catch (error) {
      console.error("Error updating course publication status:", error);
      res.status(500).json({
        success: false,
        message: "Failed to update course publication status",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
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
  app.use("/api", apiRouter);
  app.use("/api", enrollmentRouter);
  
  // Register admin routes
  registerAdminRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
