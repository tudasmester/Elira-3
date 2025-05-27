import { Express, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.SESSION_SECRET || "your-secret-key";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
}

// Utility functions
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) return false;
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

// Authentication middleware
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid token" });
  }

  // Add user ID to request for use in protected routes
  req.user = { id: decoded.userId } as any;
  next();
}

export function setupAuthSystem(app: Express) {
  // Registration endpoint
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;

      // Validation
      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ 
          message: "Email, jelszó, vezetéknév és keresztnév kötelező" 
        });
      }

      if (password.length < 6) {
        return res.status(400).json({ 
          message: "A jelszónak legalább 6 karakter hosszúnak kell lennie" 
        });
      }

      // Check if user exists
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (existingUser.length > 0) {
        return res.status(400).json({ 
          message: "Ez az email cím már regisztrált" 
        });
      }

      // Create user
      const userId = uuidv4();
      const hashedPassword = await hashPassword(password);
      
      const [newUser] = await db
        .insert(users)
        .values({
          id: userId,
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phone: phone || null,
          isEmailVerified: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        .returning();

      const token = generateToken(newUser.id);

      res.status(201).json({
        message: "Sikeres regisztráció",
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          phone: newUser.phone
        }
      });

    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ 
        message: "Hiba történt a regisztráció során" 
      });
    }
  });

  // Login endpoint
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ 
          message: "Email és jelszó kötelező" 
        });
      }

      // Find user
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!user) {
        return res.status(400).json({ 
          message: "Hibás email vagy jelszó" 
        });
      }

      // Verify password
      const isValidPassword = await comparePasswords(password, user.password || "");
      
      if (!isValidPassword) {
        return res.status(400).json({ 
          message: "Hibás email vagy jelszó" 
        });
      }

      const token = generateToken(user.id);

      res.json({
        message: "Sikeres bejelentkezés",
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone
        }
      });

    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ 
        message: "Hiba történt a bejelentkezés során" 
      });
    }
  });

  // Get current user
  app.get("/api/auth/user", async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      
      if (!token) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const decoded = verifyToken(token);
      if (!decoded) {
        return res.status(401).json({ message: "Invalid token" });
      }
      
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, decoded.userId))
        .limit(1);

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone
      });

    } catch (error) {
      console.error("Get user error:", error);
      res.status(401).json({ message: "Invalid token" });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    res.json({ message: "Sikeres kijelentkezés" });
  });

  // Password reset request
  app.post("/api/auth/forgot-password", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email cím kötelező" });
      }

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!user) {
        // Don't reveal if email exists or not for security
        return res.json({ 
          message: "Ha az email cím regisztrált, elküldjük a jelszó visszaállítási linket" 
        });
      }

      // In a real app, you would send an email here
      // For now, just return success
      res.json({ 
        message: "Ha az email cím regisztrált, elküldjük a jelszó visszaállítási linket" 
      });

    } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ 
        message: "Hiba történt a jelszó visszaállítási kérelem során" 
      });
    }
  });

  // Password reset
  app.post("/api/auth/reset-password", async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ 
          message: "Token és új jelszó kötelező" 
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ 
          message: "A jelszónak legalább 6 karakter hosszúnak kell lennie" 
        });
      }

      // In a real app, you would verify the reset token here
      // For now, just return success for demonstration
      res.json({ message: "Jelszó sikeresen megváltoztatva" });

    } catch (error) {
      console.error("Reset password error:", error);
      res.status(500).json({ 
        message: "Hiba történt a jelszó megváltoztatása során" 
      });
    }
  });

  console.log("✅ Authentication system initialized successfully");
}