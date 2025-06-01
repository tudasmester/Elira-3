import { Express, Request, Response } from "express";
import { hashPassword, comparePasswords, generateToken, requireAuth } from "./auth";
import { storage } from "./storage";

export function setupAuthRoutes(app: Express) {
  // Onboarding Registration - handles complete user registration with preferences
  app.post("/api/auth/onboarding-register", async (req: Request, res: Response) => {
    try {
      const { 
        email, password, firstName, lastName, phone, 
        interests, goals, experienceLevel, learningStyle 
      } = req.body;

      // Validate required fields
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ 
          message: "Email, jelszó, vezetéknév és keresztnév kötelező" 
        });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ 
          message: "Ez az email cím már regisztrált" 
        });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user with onboarding preferences
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
        interests: JSON.stringify(interests || []),
        goals: JSON.stringify(goals || []),
        experienceLevel: experienceLevel || null,
        preferredLearningStyle: learningStyle || null,
        isOnboardingComplete: 1,
        isEmailVerified: 1, // Auto-verify for now to simplify UX
      });

      // Generate token
      const token = generateToken(user.id);

      res.status(201).json({
        message: "Sikeres regisztráció",
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          interests: user.interests ? JSON.parse(user.interests) : [],
          goals: user.goals ? JSON.parse(user.goals) : [],
          experienceLevel: user.experienceLevel,
          preferredLearningStyle: user.preferredLearningStyle,
          isOnboardingComplete: user.isOnboardingComplete,
        }
      });
    } catch (error: any) {
      console.error("Onboarding registration error:", error);
      res.status(500).json({ 
        message: "Regisztráció során hiba történt" 
      });
    }
  });

  // Email/Password Registration (deprecated - redirect to onboarding)
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;

      // Validate required fields
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ 
          message: "Email, jelszó, vezetéknév és keresztnév kötelező" 
        });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ 
          message: "Ez az email cím már regisztrált" 
        });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
        is_email_verified: 1, // Auto-verify for now to simplify UX
      });

      // Generate token
      const token = generateToken(user.id);

      res.status(201).json({
        message: "Sikeres regisztráció",
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
        }
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ 
        message: "Hiba történt a regisztráció során" 
      });
    }
  });

  // Email/Password Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          message: "Email és jelszó kötelező" 
        });
      }

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ 
          message: "Hibás email vagy jelszó" 
        });
      }

      // Check password
      const isValidPassword = await comparePasswords(password, user.password!);
      if (!isValidPassword) {
        return res.status(401).json({ 
          message: "Hibás email vagy jelszó" 
        });
      }

      // Generate token
      const token = generateToken(user.id);

      res.json({
        message: "Sikeres bejelentkezés",
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ 
        message: "Hiba történt a bejelentkezés során" 
      });
    }
  });

  // Get Current User
  app.get("/api/auth/user", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        profileImageUrl: user.profileImageUrl,
        isEmailVerified: user.isEmailVerified,
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Error fetching user" });
    }
  });

  // Update Profile
  app.put("/api/auth/profile", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { firstName, lastName, email, phone } = req.body;
      
      const updatedUser = await storage.updateUser(userId, {
        firstName,
        lastName,
        email,
        phone
      });

      res.json({
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        phone: updatedUser.phone,
        profileImageUrl: updatedUser.profileImageUrl,
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Change Password
  app.put("/api/auth/password", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const { currentPassword, newPassword } = req.body;
      
      // Get current user to verify password
      const user = await storage.getUser(userId);
      if (!user || !user.password) {
        return res.status(400).json({ message: "User not found" });
      }

      // Verify current password
      const isValidPassword = await comparePasswords(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: "Jelenlegi jelszó helytelen" });
      }

      // Hash new password and update
      const hashedNewPassword = await hashPassword(newPassword);
      await storage.updateUser(userId, { password: hashedNewPassword });

      res.json({ message: "Jelszó sikeresen megváltoztatva" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ message: "Failed to change password" });
    }
  });

  // Update Settings (notifications, privacy)
  app.put("/api/auth/settings", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // For now, we'll just return success
      // In a real app, you'd store these preferences in the database
      res.json({ message: "Beállítások sikeresen mentve" });
    } catch (error) {
      console.error("Update settings error:", error);
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    res.json({ message: "Sikeres kijelentkezés" });
  });

  // Social Login Placeholder Routes (for future implementation)
  app.post("/api/auth/google", async (req: Request, res: Response) => {
    res.status(501).json({ 
      message: "Google bejelentkezés hamarosan elérhető" 
    });
  });

  app.post("/api/auth/facebook", async (req: Request, res: Response) => {
    res.status(501).json({ 
      message: "Facebook bejelentkezés hamarosan elérhető" 
    });
  });

  app.post("/api/auth/apple", async (req: Request, res: Response) => {
    res.status(501).json({ 
      message: "Apple bejelentkezés hamarosan elérhető" 
    });
  });

  // Password reset functionality
  app.post("/api/auth/forgot-password", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email cím kötelező" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists for security
        return res.json({ message: "Ha az email cím regisztrált, elküldtük a visszaállítási linket" });
      }

      // Generate reset token
      const resetToken = generateToken(user.id);
      
      // Store token with expiration (1 hour)
      await storage.createPasswordResetToken(user.id, resetToken, new Date(Date.now() + 3600000));
      
      // In production, send email here
      console.log(`Password reset link: /password-reset?token=${resetToken}`);
      
      res.json({ message: "Ha az email cím regisztrált, elküldtük a visszaállítási linket" });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ message: "Szerver hiba történt" });
    }
  });

  app.post("/api/auth/reset-password", async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;
      
      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token és új jelszó kötelező" });
      }

      // Verify token and get user
      const resetData = await storage.getPasswordResetToken(token);
      if (!resetData || resetData.expiresAt < new Date()) {
        return res.status(400).json({ message: "Érvénytelen vagy lejárt token" });
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);
      
      // Update user password
      await storage.updateUserPassword(resetData.userId, hashedPassword);
      
      // Delete used token
      await storage.deletePasswordResetToken(token);
      
      res.json({ message: "Jelszó sikeresen megváltoztatva" });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ message: "Szerver hiba történt" });
    }
  });

  // Profile image upload endpoints
  app.post("/api/upload/profile-image", requireAuth, async (req: Request, res: Response) => {
    try {
      // In production, implement actual file upload logic
      // For now, return a placeholder URL
      const imageUrl = `/uploads/profiles/user-${Date.now()}.jpg`;
      
      res.json({ imageUrl });
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({ message: "Kép feltöltési hiba" });
    }
  });

  app.delete("/api/upload/profile-image", requireAuth, async (req: Request, res: Response) => {
    try {
      // In production, delete the actual file
      res.json({ message: "Profilkép törölve" });
    } catch (error) {
      console.error("Image delete error:", error);
      res.status(500).json({ message: "Kép törlési hiba" });
    }
  });
}