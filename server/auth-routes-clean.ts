import { Express, Request, Response } from "express";
import { hashPassword, comparePasswords, generateToken, requireAuth } from "./auth";
import { storage } from "./storage";

export function setupAuthRoutes(app: Express) {
  // Email/Password Registration
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
}