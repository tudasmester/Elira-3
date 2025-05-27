import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { storage } from "./storage";
import { User } from "@shared/schema";
import nodemailer from "nodemailer";
import twilio from "twilio";

// Types
interface AuthRequest extends Request {
  user?: User;
}

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Password hashing
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  if (!password || !hash) return false;
  return bcrypt.compare(password, String(hash));
}

// JWT token generation
export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    console.log("Token verified successfully for user:", decoded.userId);
    return decoded;
  } catch (error) {
    console.log("Token verification error:", error.message);
    return null;
  }
}

// Email service
let emailTransporter: nodemailer.Transporter | null = null;

function initializeEmailService() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
}

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  if (!emailTransporter) {
    console.log("Email service not configured");
    return;
  }

  const verificationUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/verify-email?token=${token}`;
  
  await emailTransporter.sendMail({
    from: process.env.FROM_EMAIL || "noreply@academion.hu",
    to: email,
    subject: "Erősítsd meg az email címed - Academion",
    html: `
      <h2>Üdvözlünk az Academion-ban!</h2>
      <p>Kérjük, erősítsd meg az email címed az alábbi linkre kattintva:</p>
      <a href="${verificationUrl}" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Email cím megerősítése</a>
      <p>Ha nem te regisztráltál, figyelmen kívül hagyhatod ezt az emailt.</p>
    `,
  });
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  if (!emailTransporter) {
    console.log("Email service not configured");
    return;
  }

  const resetUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/reset-password?token=${token}`;
  
  await emailTransporter.sendMail({
    from: process.env.FROM_EMAIL || "noreply@academion.hu",
    to: email,
    subject: "Jelszó visszaállítás - Academion",
    html: `
      <h2>Jelszó visszaállítás</h2>
      <p>Jelszó visszaállítási kérelmet kaptunk a fiókodhoz. Kattints az alábbi linkre a jelszó megváltoztatásához:</p>
      <a href="${resetUrl}" style="background: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Jelszó visszaállítása</a>
      <p>Ha nem te kérted a jelszó visszaállítást, figyelmen kívül hagyhatod ezt az emailt.</p>
    `,
  });
}

// Phone verification service
let twilioClient: twilio.Twilio | null = null;

function initializePhoneService() {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
}

export async function sendPhoneVerification(phone: string, code: string): Promise<void> {
  if (!twilioClient) {
    console.log("Phone service not configured");
    return;
  }

  await twilioClient.messages.create({
    body: `Az Academion ellenőrzési kódod: ${code}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phone,
  });
}

// Generate verification codes
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function generatePhoneCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Middleware for authentication
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  console.log("Auth header received:", authHeader ? "Bearer " + authHeader.substring(7, 27) + "..." : "None");
  
  const token = authHeader?.replace("Bearer ", "");
  
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "Authentication required" });
  }

  const payload = verifyToken(token);
  if (!payload) {
    console.log("Token verification failed for token:", token.substring(0, 20) + "...");
    return res.status(401).json({ message: "Unauthorized" });
  }

  console.log("Authentication successful for user:", payload.userId);
  // Set user object for downstream middleware
  req.user = { id: payload.userId };
  next();
}

// OAuth setup
export function setupOAuth(app: Express) {
  // Google OAuth
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback"
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email from Google"), undefined);
        }

        let user = await storage.getUserByEmail(email);
        
        if (!user) {
          // Create new user
          user = await storage.createUser({
            id: crypto.randomUUID(),
            email,
            googleId: profile.id,
            firstName: profile.name?.givenName || "",
            lastName: profile.name?.familyName || "",
            profileImageUrl: profile.photos?.[0]?.value,
            isEmailVerified: 1,
          });
        } else {
          // Update existing user with Google ID
          user = await storage.updateUser(user.id, {
            googleId: profile.id,
            isEmailVerified: 1,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, undefined);
      }
    }));
  }

  // Facebook OAuth
  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: ['id', 'emails', 'name', 'picture']
    }, async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email from Facebook"), undefined);
        }

        let user = await storage.getUserByEmail(email);
        
        if (!user) {
          // Create new user
          user = await storage.createUser({
            id: crypto.randomUUID(),
            email,
            facebookId: profile.id,
            firstName: profile.name?.givenName || "",
            lastName: profile.name?.familyName || "",
            profileImageUrl: profile.photos?.[0]?.value,
            isEmailVerified: 1,
          });
        } else {
          // Update existing user with Facebook ID
          user = await storage.updateUser(user.id, {
            facebookId: profile.id,
            isEmailVerified: 1,
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, undefined);
      }
    }));
  }

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}

// Initialize services
export function initializeAuthServices() {
  initializeEmailService();
  initializePhoneService();
}