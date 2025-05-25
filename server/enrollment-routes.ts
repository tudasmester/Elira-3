import express from "express";
import { isAuthenticated } from "./replitAuth";
import { storage } from "./storage";
import { z } from "zod";

// Create router for enrollment endpoints
const enrollmentRouter = express.Router();

// Enroll user in a course
enrollmentRouter.post("/courses/enroll", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { courseId } = req.body;
    
    if (!courseId) {
      return res.status(400).json({ message: "A kurzus azonosítója kötelező" });
    }
    
    // Check if course exists
    const course = await storage.getCourse(Number(courseId));
    if (!course) {
      return res.status(404).json({ message: "A kurzus nem található" });
    }
    
    // Enroll user in course
    const enrollment = await storage.enrollUserInCourse({
      userId,
      courseId: Number(courseId)
    });
    
    res.status(201).json({ 
      message: "Sikeres beiratkozás a kurzusra",
      enrollment
    });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    res.status(500).json({ message: "Hiba történt a kurzusra való beiratkozás során" });
  }
});

// Get user enrollments
enrollmentRouter.get("/enrollments/user", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const enrollments = await storage.getUserEnrollments(userId);
    
    // Get course details for each enrollment
    const enrichedEnrollments = await Promise.all(
      enrollments.map(async (enrollment) => {
        const course = await storage.getCourse(enrollment.courseId);
        return {
          ...enrollment,
          course
        };
      })
    );
    
    res.json({ enrollments: enrichedEnrollments });
  } catch (error) {
    console.error("Error fetching user enrollments:", error);
    res.status(500).json({ message: "Hiba történt a beiratkozások lekérdezésekor" });
  }
});

// Check if user is enrolled in a course
enrollmentRouter.get("/enrollments/check/:courseId", isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const courseId = parseInt(req.params.courseId);
    
    const isEnrolled = await storage.isUserEnrolledInCourse(userId, courseId);
    
    res.json({ isEnrolled });
  } catch (error) {
    console.error("Error checking enrollment status:", error);
    res.status(500).json({ message: "Hiba történt a beiratkozási állapot ellenőrzésekor" });
  }
});

// Update enrollment progress
enrollmentRouter.put("/enrollments/:id/progress", isAuthenticated, async (req: any, res) => {
  try {
    const enrollmentId = parseInt(req.params.id);
    const { progress } = req.body;
    
    if (typeof progress !== 'number' || progress < 0 || progress > 100) {
      return res.status(400).json({ message: "Érvénytelen haladási érték (0-100 között kell lennie)" });
    }
    
    const updatedEnrollment = await storage.updateEnrollmentProgress(enrollmentId, progress);
    
    res.json({ 
      message: "A haladás sikeresen frissítve", 
      enrollment: updatedEnrollment 
    });
  } catch (error) {
    console.error("Error updating enrollment progress:", error);
    res.status(500).json({ message: "Hiba történt a haladás frissítésekor" });
  }
});

export default enrollmentRouter;