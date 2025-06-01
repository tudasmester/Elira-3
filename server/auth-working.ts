import { Express, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import { User } from "@shared/schema";
import { 
  validateRegistration, 
  validateLogin, 
  handleValidationErrors,
  trackLoginAttempt,
  isAccountLocked,
  getRemainingLockoutTime,
  auditSecurityEvent,
  generateDeviceFingerprint
} from "./enhanced-auth";

interface AuthRequest extends Request {
  user?: User;
}

const JWT_SECRET = process.env.SESSION_SECRET || "elira-dev-secret-key";

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12);
}

export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch {
    return null;
  }
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    console.log("Auth header received:", authHeader ? `Bearer ${authHeader.substring(7, 20)}...` : "None");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("No token provided");
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      console.log("Invalid token");
      return res.status(401).json({ message: "Invalid token" });
    }

    const user = await storage.getUser(decoded.userId);
    if (!user) {
      console.log("User not found for token");
      return res.status(401).json({ message: "User not found" });
    }

    console.log("Authentication successful for user:", user.id);
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    return res.status(401).json({ message: "Authentication failed" });
  }
}

export function setupWorkingAuth(app: Express) {
  // Register endpoint with enhanced validation
  app.post("/api/auth/register", 
    validateRegistration, 
    handleValidationErrors,
    async (req: Request, res: Response) => {
      try {
        const { email, password, firstName, lastName, phone } = req.body;
        const deviceFingerprint = generateDeviceFingerprint(req);

        // Check if user exists
        const existingUser = await storage.getUserByEmail(email);
        if (existingUser) {
          auditSecurityEvent('REGISTRATION_ATTEMPT_EXISTING_EMAIL', null, 
            { email, deviceFingerprint }, req);
          return res.status(400).json({ 
            message: "Ez az email cím már regisztrált" 
          });
        }

        // Hash password with enhanced security
        const hashedPassword = await hashPassword(password);

        // Create user
        const user = await storage.createUser({
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phone: phone || null,
          isEmailVerified: 1,
          isOnboardingComplete: 1,
        });

        // Generate token
        const token = generateToken(user.id);

        // Log successful registration
        auditSecurityEvent('USER_REGISTERED', user.id, 
          { email, deviceFingerprint }, req);

        // Return user data (without password)
        const { password: _, ...userWithoutPassword } = user;

        res.status(201).json({
          message: "Sikeres regisztráció",
          user: userWithoutPassword,
          token
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Szerver hiba" });
    }
  });

  // Login endpoint with enhanced security
  app.post("/api/auth/login", 
    validateLogin, 
    handleValidationErrors,
    async (req: Request, res: Response) => {
      try {
        const { email, password } = req.body;
        const deviceFingerprint = generateDeviceFingerprint(req);

        // Check for account lockout
        if (isAccountLocked(email)) {
          const remainingTime = getRemainingLockoutTime(email);
          auditSecurityEvent('LOGIN_ATTEMPT_LOCKED_ACCOUNT', null, 
            { email, deviceFingerprint, remainingTime }, req);
          return res.status(429).json({ 
            message: `Fiók zárolva. Próbáljon újra ${remainingTime} perc múlva.` 
          });
        }

        // Find user
        const user = await storage.getUserByEmail(email);
        if (!user || !user.password) {
          trackLoginAttempt(email, false);
          auditSecurityEvent('LOGIN_ATTEMPT_INVALID_USER', null, 
            { email, deviceFingerprint }, req);
          return res.status(401).json({ 
            message: "Hibás email vagy jelszó" 
          });
        }

        // Check password
        const isPasswordValid = await comparePasswords(password, user.password);
        if (!isPasswordValid) {
          trackLoginAttempt(email, false);
          auditSecurityEvent('LOGIN_ATTEMPT_INVALID_PASSWORD', user.id, 
            { email, deviceFingerprint }, req);
          return res.status(401).json({ 
            message: "Hibás email vagy jelszó" 
          });
        }

        // Successful login
        trackLoginAttempt(email, true);
        auditSecurityEvent('USER_LOGIN_SUCCESS', user.id, 
          { email, deviceFingerprint }, req);

        // Generate token
        const token = generateToken(user.id);

        // Return user data (without password)
        const { password: _, ...userWithoutPassword } = user;

        res.json({
          message: "Sikeres bejelentkezés",
          user: userWithoutPassword,
          token
        });
      } catch (error) {
        console.error("Login error:", error);
        auditSecurityEvent('LOGIN_ERROR', null, { error: error.message }, req);
        res.status(500).json({ message: "Szerver hiba" });
      }
    });

  // Get current user
  app.get("/api/auth/user", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      // Return user without password
      const { password: _, ...userWithoutPassword } = req.user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Server error" });
    }
  });

  // Logout endpoint
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    res.json({ message: "Sikeres kijelentkezés" });
  });

  // Update profile
  app.put("/api/auth/profile", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { firstName, lastName, phone, profileImageUrl } = req.body;
      
      const updatedUser = await storage.updateUser(req.user.id, {
        firstName,
        lastName,
        phone,
        profileImageUrl
      });

      const { password: _, ...userWithoutPassword } = updatedUser;
      res.json({
        message: "Profil sikeresen frissítve",
        user: userWithoutPassword
      });
    } catch (error) {
      console.error("Profile update error:", error);
      res.status(500).json({ message: "Szerver hiba" });
    }
  });

  // Change password
  app.put("/api/auth/password", requireAuth, async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Not authenticated" });
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ 
          message: "Jelenlegi és új jelszó kötelező" 
        });
      }

      // Verify current password
      if (!req.user.password) {
        return res.status(400).json({ message: "No password set" });
      }

      const isCurrentPasswordValid = await comparePasswords(currentPassword, req.user.password);
      if (!isCurrentPasswordValid) {
        return res.status(400).json({ 
          message: "Helytelen jelenlegi jelszó" 
        });
      }

      // Hash new password
      const hashedNewPassword = await hashPassword(newPassword);

      // Update password
      await storage.updateUser(req.user.id, {
        password: hashedNewPassword
      });

      res.json({ message: "Jelszó sikeresen megváltoztatva" });
    } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({ message: "Szerver hiba" });
    }
  });
}