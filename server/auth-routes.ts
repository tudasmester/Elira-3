import { Express, Request, Response } from "express";
import crypto from "crypto";
import { 
  hashPassword, 
  comparePasswords, 
  generateToken, 
  verifyToken,
  generateVerificationToken,
  generatePhoneCode,
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendPhoneVerification,
  setupOAuth,
  initializeAuthServices
} from "./auth";
import { storage } from "./storage";
import passport from "passport";
import session from "express-session";

export function setupAuthRoutes(app: Express) {
  // Initialize authentication services
  initializeAuthServices();
  
  // Session setup
  app.use(session({
    secret: process.env.SESSION_SECRET || "your-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // Setup OAuth strategies
  setupOAuth(app);

  // Email/Password Registration
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email és jelszó szükséges" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "Ez az email cím már regisztrálva van" });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);
      
      // Generate verification token
      const verificationToken = generateVerificationToken();

      // Create user
      const user = await storage.createUser({
        id: crypto.randomUUID(),
        email,
        password: hashedPassword,
        firstName: firstName || "",
        lastName: lastName || "",
        phone: phone || null,
        emailVerificationToken: verificationToken,
        isEmailVerified: 0,
        subscriptionType: "free",
        subscriptionStatus: "inactive",
      });

      // Send verification email (if email service is configured)
      try {
        await sendVerificationEmail(email, verificationToken);
      } catch (error) {
        console.log("Email service not configured, verification email not sent");
      }

      // Generate JWT token
      const token = generateToken(user.id);

      res.status(201).json({
        message: "Sikeres regisztráció",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isEmailVerified: user.isEmailVerified,
          subscriptionType: user.subscriptionType,
        },
        token,
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Regisztrációs hiba" });
    }
  });

  // Email/Password Login
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email és jelszó szükséges" });
      }

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user || !user.password) {
        return res.status(401).json({ message: "Hibás email vagy jelszó" });
      }

      // Check password
      const isValidPassword = await comparePasswords(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Hibás email vagy jelszó" });
      }

      // Generate JWT token
      const token = generateToken(user.id);

      res.json({
        message: "Sikeres bejelentkezés",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          isEmailVerified: user.isEmailVerified,
          subscriptionType: user.subscriptionType,
        },
        token,
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Bejelentkezési hiba" });
    }
  });

  // Phone Registration/Login
  app.post("/api/auth/phone/register", async (req: Request, res: Response) => {
    try {
      const { phone, firstName, lastName } = req.body;

      if (!phone) {
        return res.status(400).json({ message: "Telefonszám szükséges" });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByPhone(phone);
      if (existingUser) {
        return res.status(400).json({ message: "Ez a telefonszám már regisztrálva van" });
      }

      // Generate verification code
      const verificationCode = generatePhoneCode();
      const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Create user
      const user = await storage.createUser({
        id: crypto.randomUUID(),
        phone,
        firstName: firstName || "",
        lastName: lastName || "",
        phoneVerificationCode: verificationCode,
        phoneVerificationExpiry: expiry,
        isPhoneVerified: 0,
        subscriptionType: "free",
        subscriptionStatus: "inactive",
      });

      // Send verification code (if SMS service is configured)
      try {
        await sendPhoneVerification(phone, verificationCode);
      } catch (error) {
        console.log("SMS service not configured, verification code not sent");
      }

      res.status(201).json({
        message: "Ellenőrzési kód elküldve",
        userId: user.id,
        verificationRequired: true,
      });
    } catch (error) {
      console.error("Phone registration error:", error);
      res.status(500).json({ message: "Regisztrációs hiba" });
    }
  });

  // Phone Login
  app.post("/api/auth/phone/login", async (req: Request, res: Response) => {
    try {
      const { phone } = req.body;

      if (!phone) {
        return res.status(400).json({ message: "Telefonszám szükséges" });
      }

      // Find user
      const user = await storage.getUserByPhone(phone);
      if (!user) {
        return res.status(404).json({ message: "Nincs felhasználó ezzel a telefonszámmal" });
      }

      // Generate verification code
      const verificationCode = generatePhoneCode();
      const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Update user with verification code
      await storage.updatePhoneVerification(user.id, verificationCode, expiry);

      // Send verification code (if SMS service is configured)
      try {
        await sendPhoneVerification(phone, verificationCode);
      } catch (error) {
        console.log("SMS service not configured, verification code not sent");
      }

      res.json({
        message: "Ellenőrzési kód elküldve",
        userId: user.id,
        verificationRequired: true,
      });
    } catch (error) {
      console.error("Phone login error:", error);
      res.status(500).json({ message: "Bejelentkezési hiba" });
    }
  });

  // Verify Phone Code
  app.post("/api/auth/phone/verify", async (req: Request, res: Response) => {
    try {
      const { phone, code } = req.body;

      if (!phone || !code) {
        return res.status(400).json({ message: "Telefonszám és kód szükséges" });
      }

      const user = await storage.verifyPhone(phone, code);
      if (!user) {
        return res.status(401).json({ message: "Hibás vagy lejárt ellenőrzési kód" });
      }

      // Generate JWT token
      const token = generateToken(user.id);

      res.json({
        message: "Sikeres bejelentkezés",
        user: {
          id: user.id,
          phone: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
          isPhoneVerified: user.isPhoneVerified,
          subscriptionType: user.subscriptionType,
        },
        token,
      });
    } catch (error) {
      console.error("Phone verification error:", error);
      res.status(500).json({ message: "Ellenőrzési hiba" });
    }
  });

  // Google OAuth routes
  app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

  app.get("/auth/google/callback", 
    passport.authenticate("google", { failureRedirect: "/auth?error=google_failed" }),
    async (req: Request, res: Response) => {
      const user = req.user as any;
      const token = generateToken(user.id);
      res.redirect(`/?token=${token}&auth=success`);
    }
  );

  // Facebook OAuth routes
  app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));

  app.get("/auth/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/auth?error=facebook_failed" }),
    async (req: Request, res: Response) => {
      const user = req.user as any;
      const token = generateToken(user.id);
      res.redirect(`/?token=${token}&auth=success`);
    }
  );

  // Email Verification
  app.get("/api/auth/verify-email", async (req: Request, res: Response) => {
    try {
      const { token } = req.query;

      if (!token || typeof token !== "string") {
        return res.status(400).json({ message: "Hiányzó vagy hibás token" });
      }

      const user = await storage.verifyEmail(token);
      if (!user) {
        return res.status(401).json({ message: "Hibás vagy lejárt token" });
      }

      res.json({ message: "Email cím sikeresen megerősítve" });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({ message: "Ellenőrzési hiba" });
    }
  });

  // Password Reset Request
  app.post("/api/auth/forgot-password", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email cím szükséges" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists for security
        return res.json({ message: "Ha a fiók létezik, jelszó visszaállítási email került kiküldésre" });
      }

      const resetToken = generateVerificationToken();
      const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await storage.updatePasswordReset(user.id, resetToken, expiry);

      // Send password reset email (if email service is configured)
      try {
        await sendPasswordResetEmail(email, resetToken);
      } catch (error) {
        console.log("Email service not configured, reset email not sent");
      }

      res.json({ message: "Ha a fiók létezik, jelszó visszaállítási email került kiküldésre" });
    } catch (error) {
      console.error("Password reset request error:", error);
      res.status(500).json({ message: "Hiba történt" });
    }
  });

  // Password Reset
  app.post("/api/auth/reset-password", async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({ message: "Token és új jelszó szükséges" });
      }

      const hashedPassword = await hashPassword(newPassword);
      const user = await storage.resetPassword(token, hashedPassword);

      if (!user) {
        return res.status(401).json({ message: "Hibás vagy lejárt token" });
      }

      res.json({ message: "Jelszó sikeresen megváltoztatva" });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ message: "Jelszó visszaállítási hiba" });
    }
  });

  // Get Current User
  app.get("/api/auth/me", async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.replace("Bearer ", "");
      
      if (!token) {
        return res.status(401).json({ message: "Token szükséges" });
      }

      const payload = verifyToken(token);
      if (!payload) {
        return res.status(401).json({ message: "Hibás token" });
      }

      const user = await storage.getUser(payload.userId);
      if (!user) {
        return res.status(404).json({ message: "Felhasználó nem található" });
      }

      res.json({
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
          profileImageUrl: user.profileImageUrl,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          subscriptionType: user.subscriptionType,
          subscriptionStatus: user.subscriptionStatus,
          isAdmin: user.isAdmin,
        }
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Hiba történt" });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Kijelentkezési hiba" });
      }
      res.json({ message: "Sikeres kijelentkezés" });
    });
  });
}