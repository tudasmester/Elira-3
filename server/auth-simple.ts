import { Express, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.SESSION_SECRET || "your-secret-key";

export function setupSimpleAuth(app: Express) {
  // Simple registration
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;

      if (!email || !password || !firstName || !lastName) {
        return res.status(400).json({ 
          message: "Email, jelszó, vezetéknév és keresztnév kötelező" 
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

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Create user with UUID
      const userId = uuidv4();
      
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

      // Generate token
      const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: "7d" });

      res.status(201).json({
        message: "Sikeres regisztráció",
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
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

  // Simple login
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

      if (!user || !user.password) {
        return res.status(400).json({ 
          message: "Hibás email vagy jelszó" 
        });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.password);
      
      if (!isValidPassword) {
        return res.status(400).json({ 
          message: "Hibás email vagy jelszó" 
        });
      }

      // Generate token
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

      res.json({
        message: "Sikeres bejelentkezés",
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
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

      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
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
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone
      });

    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    res.json({ message: "Sikeres kijelentkezés" });
  });
}