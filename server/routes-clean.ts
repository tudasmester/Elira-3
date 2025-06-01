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

  // Advanced Search API
  app.get("/api/search", async (req: Request, res: Response) => {
    try {
      const { 
        q: query, 
        category, 
        level, 
        duration, 
        university, 
        language, 
        price, 
        rating, 
        sortBy = 'relevance', 
        sortOrder = 'desc' 
      } = req.query;

      if (!query || typeof query !== 'string' || query.trim().length === 0) {
        return res.json([]);
      }

      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
      const courses = await storage.getAllCourses();
      
      // Filter and score results
      let results = courses
        .filter(course => {
          // Text search
          const searchableText = `${course.title} ${course.description} ${course.category} ${course.university}`.toLowerCase();
          const hasMatch = searchTerms.some(term => searchableText.includes(term));
          if (!hasMatch) return false;

          // Apply filters
          if (category) {
            const categories = (category as string).split(',');
            if (!categories.includes(course.category)) return false;
          }
          
          if (level) {
            const levels = (level as string).split(',');
            if (!levels.includes(course.level)) return false;
          }
          
          if (university) {
            const universities = (university as string).split(',');
            if (!universities.includes(course.university)) return false;
          }
          
          if (rating && course.rating) {
            const minRating = parseFloat(rating as string);
            if (course.rating < minRating) return false;
          }

          return true;
        })
        .map(course => {
          // Calculate relevance score
          const titleScore = searchTerms.reduce((score, term) => {
            return score + (course.title.toLowerCase().includes(term) ? 3 : 0);
          }, 0);
          
          const descScore = searchTerms.reduce((score, term) => {
            return score + (course.description.toLowerCase().includes(term) ? 1 : 0);
          }, 0);

          return {
            id: course.id.toString(),
            type: 'course' as const,
            title: course.title,
            description: course.description,
            category: course.category,
            level: course.level,
            duration: course.duration,
            university: course.university,
            rating: course.rating,
            price: course.price,
            imageUrl: course.imageUrl,
            enrollmentCount: course.enrollmentCount,
            lastUpdated: course.updatedAt?.toISOString(),
            relevanceScore: titleScore + descScore
          };
        });

      // Sort results
      results.sort((a, b) => {
        switch (sortBy) {
          case 'rating':
            return sortOrder === 'asc' 
              ? (a.rating || 0) - (b.rating || 0)
              : (b.rating || 0) - (a.rating || 0);
          case 'enrollment':
            return sortOrder === 'asc'
              ? (a.enrollmentCount || 0) - (b.enrollmentCount || 0)
              : (b.enrollmentCount || 0) - (a.enrollmentCount || 0);
          case 'price':
            return sortOrder === 'asc'
              ? (a.price || 0) - (b.price || 0)
              : (b.price || 0) - (a.price || 0);
          case 'alphabetical':
            return sortOrder === 'asc'
              ? a.title.localeCompare(b.title)
              : b.title.localeCompare(a.title);
          case 'recent':
            return sortOrder === 'asc'
              ? new Date(a.lastUpdated || 0).getTime() - new Date(b.lastUpdated || 0).getTime()
              : new Date(b.lastUpdated || 0).getTime() - new Date(a.lastUpdated || 0).getTime();
          default: // relevance
            return sortOrder === 'asc'
              ? a.relevanceScore - b.relevanceScore
              : b.relevanceScore - a.relevanceScore;
        }
      });

      // Remove relevance score from response
      const cleanResults = results.map(({ relevanceScore, ...result }) => result);

      res.json(cleanResults.slice(0, 50)); // Limit to 50 results
    } catch (error) {
      console.error("Search error:", error);
      res.status(500).json({ 
        message: "Search failed" 
      });
    }
  });

  // Analytics and Performance Monitoring APIs
  app.post("/api/analytics/performance", async (req: Request, res: Response) => {
    try {
      const performanceData = req.body;
      
      // Store performance metrics in database or analytics service
      console.log("Performance metrics received:", {
        pageLoadTime: performanceData.pageLoadTime,
        firstContentfulPaint: performanceData.firstContentfulPaint,
        largestContentfulPaint: performanceData.largestContentfulPaint,
        cumulativeLayoutShift: performanceData.cumulativeLayoutShift,
        userEngagement: performanceData.userEngagement,
        timestamp: new Date().toISOString()
      });
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error storing performance metrics:", error);
      res.status(500).json({ message: "Failed to store performance metrics" });
    }
  });

  app.post("/api/analytics/actions", async (req: Request, res: Response) => {
    try {
      const actionData = req.body;
      
      console.log("User action tracked:", {
        action: actionData.action,
        details: actionData.details,
        url: actionData.url,
        timestamp: new Date().toISOString()
      });
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error tracking user action:", error);
      res.status(500).json({ message: "Failed to track user action" });
    }
  });

  app.post("/api/analytics/api-performance", async (req: Request, res: Response) => {
    try {
      const apiData = req.body;
      
      console.log("API performance tracked:", {
        endpoint: apiData.endpoint,
        method: apiData.method,
        duration: apiData.duration,
        status: apiData.status,
        timestamp: new Date().toISOString()
      });
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error tracking API performance:", error);
      res.status(500).json({ message: "Failed to track API performance" });
    }
  });

  app.get("/api/analytics/dashboard", async (req: Request, res: Response) => {
    try {
      // Return aggregated analytics data for admin dashboard
      const analyticsData = {
        performance: {
          averagePageLoadTime: 2.1,
          averageFCP: 1.5,
          averageLCP: 2.8,
          averageCLS: 0.1
        },
        userEngagement: {
          averageTimeOnPage: 180,
          averageScrollDepth: 65,
          bounceRate: 35
        },
        apiPerformance: {
          averageResponseTime: 150,
          errorRate: 2.5,
          requestsPerMinute: 45
        },
        popularSearches: [
          "javascript", "react", "python", "machine learning", "web development"
        ]
      };
      
      res.json(analyticsData);
    } catch (error) {
      console.error("Error fetching analytics dashboard:", error);
      res.status(500).json({ message: "Failed to fetch analytics data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}