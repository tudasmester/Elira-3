import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import { requireAuth, verifyToken } from "./auth-working";
import { isAdmin } from "./adminAuth";
import { insertCourseSchema, insertUniversitySchema } from "@shared/schema";
import { contentSync } from "./content-sync";
import multer from 'multer';
import path from 'path';
import { promises as fs } from 'fs';

// Configure multer for file uploads
const storage_multer = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'courses');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `course-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage_multer,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Video upload configuration
const videoStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'videos');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (error) {
      cb(error, uploadDir);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `video-${uniqueSuffix}${ext}`);
  }
});

const videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB limit for videos
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov', 'video/wmv'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed (MP4, WebM, OGG, AVI, MOV, WMV)'));
    }
  }
});

export function registerAdminRoutes(app: Express) {
  // File upload endpoint for course images
  app.post('/api/admin/upload/course-image', requireAuth, isAdmin, upload.single('image'), async (req, res) => {
    try {
      console.log('=== COURSE IMAGE UPLOAD ===');
      console.log('File received:', req.file ? 'Yes' : 'No');
      console.log('File details:', req.file);
      
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const imageUrl = `/uploads/courses/${req.file.filename}`;
      
      console.log('Generated image URL:', imageUrl);
      
      res.json({
        success: true,
        imageUrl: imageUrl,
        filename: req.file.filename,
        size: req.file.size
      });
    } catch (error) {
      console.error('File upload error:', error);
      res.status(500).json({ message: 'File upload failed', error: error.message });
    }
  });

  // Video upload endpoint for lessons
  app.post('/api/admin/upload/video', requireAuth, isAdmin, videoUpload.single('video'), async (req, res) => {
    try {
      console.log('=== VIDEO UPLOAD ===');
      console.log('File received:', req.file ? 'Yes' : 'No');
      console.log('File details:', req.file);
      
      if (!req.file) {
        return res.status(400).json({ message: 'No video file uploaded' });
      }

      const videoUrl = `/uploads/videos/${req.file.filename}`;
      
      console.log('Generated video URL:', videoUrl);
      
      res.json({
        success: true,
        videoUrl: videoUrl,
        filename: req.file.filename,
        size: req.file.size,
        originalName: req.file.originalname
      });
    } catch (error) {
      console.error('Video upload error:', error);
      res.status(500).json({ message: 'Video upload failed', error: error.message });
    }
  });

  // Test endpoint to see if we can reach admin routes at all
  app.post('/api/admin-setup-test', async (req, res) => {
    console.log("=== TEST ENDPOINT REACHED ===");
    console.log("Request body:", req.body);
    res.json({ message: "Test endpoint reached successfully" });
  });

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

  // Admin middleware for all other admin routes (excluding setup)
  app.use('/api/admin/*', (req, res, next) => {
    // Skip admin check for setup endpoint
    if (req.path === '/api/admin/setup-admin') {
      return next();
    }
    // Apply admin middleware for all other admin routes
    requireAuth(req, res, (err) => {
      if (err) return next(err);
      isAdmin(req, res, next);
    });
  });

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
      const course = await storage.getCourseWithDetails(courseId);
      
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      res.json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  // Save course draft
  app.post("/api/admin/courses/draft", async (req, res) => {
    try {
      // Create a partial course with draft status
      const draftData = {
        ...req.body,
        status: 'draft',
        // Provide defaults for required fields if not present
        universityId: req.body.universityId || 1,
        instructorName: req.body.instructorName || 'TBD',
        language: req.body.language || 'Hungarian',
        duration: String(req.body.duration || req.body.estimatedDuration || 1),
        price: req.body.isPaid ? (req.body.price || 0) : 0,
        originalPrice: req.body.originalPrice || req.body.price || 0,
        imageUrl: req.body.imageUrl || '/placeholder-course.jpg',
        prerequisites: Array.isArray(req.body.prerequisites) ? req.body.prerequisites.join(', ') : (req.body.prerequisites || ''),
        tags: Array.isArray(req.body.tags) ? req.body.tags.join(', ') : (req.body.tags || ''),
      };
      
      const validatedData = insertCourseSchema.parse(draftData);
      const course = await storage.createCourse(validatedData);
      res.status(201).json(course);
    } catch (error) {
      console.error("Error saving course draft:", error);
      res.status(500).json({ message: "Failed to save course draft" });
    }
  });

  // Create new course
  app.post("/api/admin/courses", async (req, res) => {
    try {
      console.log("📝 Creating course with data:", req.body);
      
      // Transform wizard data to match course schema
      const courseData = {
        title: req.body.title,
        subtitle: req.body.subtitle || '',
        description: req.body.description,
        category: req.body.category,
        level: req.body.level,
        universityId: req.body.universityId || 1,
        instructorName: req.body.instructorName || 'Admin User',
        language: req.body.language || 'Hungarian',
        duration: String(req.body.estimatedDuration || 1),
        price: req.body.isPaid ? (req.body.price || 0) : 0,
        originalPrice: req.body.originalPrice || req.body.price || 0,
        maxEnrollments: req.body.enrollmentLimit || req.body.maxEnrollments || 100,
        imageUrl: req.body.imageUrl || '/placeholder-course.jpg',
        status: req.body.status || 'published',
        prerequisites: Array.isArray(req.body.prerequisites) ? req.body.prerequisites.join(', ') : (req.body.prerequisites || ''),
        tags: Array.isArray(req.body.tags) ? req.body.tags.filter(tag => tag && tag.trim()).join(', ') : (req.body.tags || ''),
        metaDescription: req.body.metaDescription || req.body.description?.substring(0, 160) || '',
        isHighlighted: false
      };
      
      console.log("📊 Transformed course data:", courseData);
      
      const validatedData = insertCourseSchema.parse(courseData);
      const course = await storage.createCourse(validatedData);
      
      console.log("✅ Course created successfully:", course);
      
      // Store modules and objectives separately if provided
      if (req.body.modules && req.body.modules.length > 0) {
        console.log("📚 Creating modules:", req.body.modules);
        // Note: We'll implement module storage later
      }
      
      if (req.body.learningObjectives && req.body.learningObjectives.length > 0) {
        console.log("🎯 Learning objectives:", req.body.learningObjectives);
        // Note: We'll implement objectives storage later
      }
      
      res.status(201).json(course);
    } catch (error) {
      console.error("❌ Error creating course:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
      }
      res.status(500).json({ 
        message: "Failed to create course",
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Update course
  app.put("/api/admin/courses/:id", async (req, res) => {
    try {
      const courseId = parseInt(req.params.id);
      
      // Check if course exists
      const existingCourse = await storage.getCourse(courseId);
      if (!existingCourse) {
        return res.status(404).json({ message: "Course not found" });
      }

      // For partial updates (like status change), merge with existing data
      const updateData = {
        ...existingCourse,
        ...req.body,
        id: courseId // Ensure ID is preserved
      };

      // Validate the merged data
      const validatedData = insertCourseSchema.parse(updateData);
      
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

  // Admin check endpoint moved to main routes file

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
  app.post('/api/courses/:id/modules', requireAuth, isAdmin, async (req: Request, res: Response) => {
    try {
      const courseId = parseInt(req.params.id);
      const { title, description, status = 'piszkozat' } = req.body;
      
      // Validate required fields
      if (!title || !title.trim()) {
        return res.status(400).json({ message: "Module title is required" });
      }
      
      // Validate status
      const validStatuses = ['piszkozat', 'hamarosan', 'ingyenes', 'fizetos'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          message: "Invalid status. Must be one of: piszkozat, hamarosan, ingyenes, fizetos" 
        });
      }
      
      // Get existing modules to determine the next order index
      const existingModules = await storage.getCourseModules(courseId);
      const orderIndex = existingModules.length;
      
      const moduleData = {
        courseId,
        title: title.trim(),
        description: description?.trim() || '',
        status,
        orderIndex
      };
      
      const module = await storage.createCourseModule(moduleData);
      res.json(module);
    } catch (error) {
      console.error("Error creating module:", error);
      res.status(500).json({ message: "Failed to create module" });
    }
  });

  // Update module - with authentication middleware
  app.put('/api/modules/:id', async (req: any, res: any, next: any) => {
    try {
      // Manual authentication check
      const authHeader = req.headers.authorization;
      console.log("Module update auth header:", authHeader ? `Bearer ${authHeader.substring(7, 20)}...` : "None");
      
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("No valid auth header for module update");
        return res.status(401).json({ message: "Unauthorized" });
      }

      const token = authHeader.substring(7);
      
      // Use the existing verification function
      const { verifyToken } = await import('./auth-working');
      const decoded = verifyToken(token);
      
      if (!decoded) {
        console.log("Token verification failed");
        return res.status(401).json({ message: "Unauthorized" });
      }
      


      const user = await storage.getUser(decoded.userId);
      if (!user || !user.isAdmin) {
        console.log("User not found or not admin:", user?.id, user?.isAdmin);
        return res.status(403).json({ message: "Admin access required" });
      }

      console.log("Module update auth successful for user:", user.id);

      const moduleId = parseInt(req.params.id);
      const updateData = req.body;
      
      console.log("Updating module:", moduleId, "with data:", updateData);
      
      // Validate status if provided
      if (updateData.status) {
        const validStatuses = ['piszkozat', 'hamarosan', 'ingyenes', 'fizetos'];
        if (!validStatuses.includes(updateData.status)) {
          return res.status(400).json({ 
            message: "Invalid status. Must be one of: piszkozat, hamarosan, ingyenes, fizetos" 
          });
        }
      }
      
      // Validate that the update includes allowed fields
      const allowedFields = ['title', 'description', 'status', 'orderIndex'];
      const filteredData: any = {};
      
      for (const field of allowedFields) {
        if (updateData[field] !== undefined) {
          filteredData[field] = updateData[field];
        }
      }
      
      console.log("Filtered update data:", filteredData);
      
      const updatedModule = await storage.updateCourseModule(moduleId, filteredData);
      
      if (!updatedModule) {
        return res.status(404).json({ message: "Module not found" });
      }
      
      console.log("Module updated successfully:", updatedModule);
      res.json(updatedModule);
    } catch (error) {
      console.error("Error updating module:", error);
      res.status(500).json({ message: "Failed to update module" });
    }
  });

  // Delete module
  app.delete('/api/modules/:id', async (req: any, res: any) => {
    try {
      // Manual authentication check
      const authHeader = req.headers.authorization;
      console.log("Module delete auth header:", authHeader ? `Bearer ${authHeader.substring(7, 20)}...` : "None");
      
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log("No valid auth header for module delete");
        return res.status(401).json({ message: "Unauthorized" });
      }

      const token = authHeader.substring(7);
      
      // Use the existing verification function
      const { verifyToken } = await import('./auth-working');
      const decoded = verifyToken(token);
      
      if (!decoded) {
        console.log("Token verification failed for delete");
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser(decoded.userId);
      if (!user || !user.isAdmin) {
        console.log("User not found or not admin for delete:", user?.id, user?.isAdmin);
        return res.status(403).json({ message: "Admin access required" });
      }

      console.log("Module delete auth successful for user:", user.id);

      const moduleId = parseInt(req.params.id);
      console.log("Deleting module:", moduleId);
      
      await storage.deleteCourseModule(moduleId);
      
      console.log("Module deleted successfully:", moduleId);
      res.json({ message: "Module deleted successfully" });
    } catch (error) {
      console.error("Error deleting module:", error);
      res.status(500).json({ message: "Failed to delete module" });
    }
  });

  // Create new lesson for a module
  app.post('/api/modules/:id/lessons', requireAuth, isAdmin, async (req: Request, res: Response) => {
    try {
      const moduleId = parseInt(req.params.id);
      
      // Get existing lessons to determine the next order index
      const existingLessons = await storage.getLessonsByModule(moduleId);
      const order = existingLessons.length;
      
      // Ensure required fields have defaults
      const lessonData = { 
        ...req.body, 
        moduleId, 
        order,
        estimatedDuration: req.body.estimatedDuration || 30, // Default 30 minutes
        content: req.body.content || "Lecke tartalma itt lesz megjelenítve.",
        description: req.body.description || ""
      };
      
      const lesson = await storage.createLesson(lessonData);
      res.json(lesson);
    } catch (error) {
      console.error("Error creating lesson:", error);
      res.status(500).json({ message: "Failed to create lesson" });
    }
  });

  // Toggle course highlight status
  app.post('/api/courses/:id/toggle-highlight', isAdmin, async (req: Request, res: Response) => {
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

  // Delete lesson
  app.delete('/api/lessons/:id', isAdmin, async (req: Request, res: Response) => {
    try {
      const lessonId = parseInt(req.params.id);
      await storage.deleteLesson(lessonId);
      res.json({ message: "Lesson deleted successfully" });
    } catch (error) {
      console.error("Error deleting lesson:", error);
      res.status(500).json({ message: "Failed to delete lesson" });
    }
  });

  // Update module status - specific endpoint for status changes
  app.put('/api/modules/:id/status', isAdmin, async (req: Request, res: Response) => {
    try {
      const moduleId = parseInt(req.params.id);
      const { status } = req.body;
      
      // Validate status
      const validStatuses = ['piszkozat', 'hamarosan', 'ingyenes', 'fizetos'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
          message: "Invalid status. Must be one of: piszkozat, hamarosan, ingyenes, fizetos" 
        });
      }
      
      const module = await storage.updateCourseModule(moduleId, { status });
      res.json({ 
        success: true, 
        module,
        message: `Module status updated to ${status}` 
      });
    } catch (error) {
      console.error("Error updating module status:", error);
      res.status(500).json({ message: "Failed to update module status" });
    }
  });

  // Get module access info - check user access to specific module
  app.get('/api/modules/:id/access', async (req: Request, res: Response) => {
    try {
      const moduleId = parseInt(req.params.id);
      const module = await storage.getCourseModule(moduleId);
      
      if (!module) {
        return res.status(404).json({ message: "Module not found" });
      }

      // For now, return basic access info - can be extended with user subscription checks
      const accessInfo = {
        moduleId: module.id,
        status: module.status,
        accessible: module.status === 'ingyenes' || module.status === 'fizetos',
        requiresPayment: module.status === 'fizetos',
        visible: module.status !== 'piszkozat'
      };

      res.json(accessInfo);
    } catch (error) {
      console.error("Error checking module access:", error);
      res.status(500).json({ message: "Failed to check module access" });
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

  // Course content management endpoints
  app.get('/api/admin/courses/:id/modules', isAdmin, async (req: Request, res: Response) => {
    try {
      const courseId = parseInt(req.params.id);
      console.log(`Fetching modules for course ${courseId}`);
      
      const modules = await storage.getCourseModules(courseId);
      console.log(`Found ${modules.length} modules for course ${courseId}`);
      
      // Debug: Check if lessons are included
      modules.forEach((module, index) => {
        console.log(`Module ${index + 1}: ${module.title} - has ${module.lessons?.length || 0} lessons`);
        if (module.lessons && module.lessons.length > 0) {
          module.lessons.forEach((lesson, lessonIndex) => {
            console.log(`  Lesson ${lessonIndex + 1}: ${lesson.title} (${lesson.type})`);
          });
        }
      });
      
      res.json(modules);
    } catch (error) {
      console.error('Error fetching course modules:', error);
      res.status(500).json({ message: 'Failed to fetch course modules' });
    }
  });

  app.put('/api/admin/courses/:id/content', isAdmin, async (req: Request, res: Response) => {
    try {
      const courseId = parseInt(req.params.id);
      const { modules } = req.body;
      
      // For now, just return success as we're building the module system
      console.log(`Updating content for course ${courseId}:`, modules);
      
      res.json({ 
        message: 'Course content updated successfully',
        modules: modules || []
      });
    } catch (error) {
      console.error('Error updating course content:', error);
      res.status(500).json({ message: 'Failed to update course content' });
    }
  });
}