import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { z } from 'zod';
import { body, validationResult } from 'express-validator';

// Enhanced password requirements
export const passwordSchema = z.string()
  .min(8, 'A jelszónak legalább 8 karakter hosszúnak kell lennie')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
    'A jelszónak tartalmaznia kell: kisbetű, nagybetű, szám és speciális karakter');

// Email validation
export const emailSchema = z.string()
  .email('Érvénytelen email cím')
  .max(255, 'Az email cím túl hosszú');

// Login attempt tracking
interface LoginAttempt {
  count: number;
  lastAttempt: Date;
  blocked: boolean;
  blockUntil?: Date;
}

const loginAttempts = new Map<string, LoginAttempt>();

// Account lockout configuration
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 30 * 60 * 1000; // 30 minutes
const ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes

export function trackLoginAttempt(identifier: string, success: boolean) {
  const now = new Date();
  let attempt = loginAttempts.get(identifier);

  if (!attempt) {
    attempt = { count: 0, lastAttempt: now, blocked: false };
  }

  // Reset count if outside attempt window
  if (now.getTime() - attempt.lastAttempt.getTime() > ATTEMPT_WINDOW) {
    attempt.count = 0;
    attempt.blocked = false;
    attempt.blockUntil = undefined;
  }

  if (success) {
    // Reset on successful login
    attempt.count = 0;
    attempt.blocked = false;
    attempt.blockUntil = undefined;
  } else {
    // Increment failed attempts
    attempt.count++;
    if (attempt.count >= MAX_LOGIN_ATTEMPTS) {
      attempt.blocked = true;
      attempt.blockUntil = new Date(now.getTime() + LOCKOUT_TIME);
    }
  }

  attempt.lastAttempt = now;
  loginAttempts.set(identifier, attempt);
}

export function isAccountLocked(identifier: string): boolean {
  const attempt = loginAttempts.get(identifier);
  if (!attempt || !attempt.blocked) return false;

  if (attempt.blockUntil && new Date() > attempt.blockUntil) {
    // Lockout expired
    attempt.blocked = false;
    attempt.blockUntil = undefined;
    attempt.count = 0;
    return false;
  }

  return true;
}

export function getRemainingLockoutTime(identifier: string): number {
  const attempt = loginAttempts.get(identifier);
  if (!attempt || !attempt.blockUntil) return 0;
  
  const remaining = attempt.blockUntil.getTime() - new Date().getTime();
  return Math.max(0, Math.ceil(remaining / 1000 / 60)); // minutes
}

// Enhanced password hashing
export async function hashPassword(password: string): Promise<string> {
  // Validate password strength
  passwordSchema.parse(password);
  
  // Use high cost factor for better security
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Secure token generation
export function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function generateNumericCode(length: number = 6): string {
  const digits = '0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += digits[crypto.randomInt(0, digits.length)];
  }
  return code;
}

// JWT token management with rotation
export function generateTokenPair(userId: string) {
  const accessToken = jwt.sign(
    { userId, type: 'access' },
    process.env.SESSION_SECRET!,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId, type: 'refresh' },
    process.env.SESSION_SECRET!,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}

export function verifyToken(token: string): { userId: string; type: string } | null {
  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET!) as any;
    return { userId: decoded.userId, type: decoded.type };
  } catch {
    return null;
  }
}

// Input validation middleware factories
export const validateRegistration = [
  body('email').isEmail().normalizeEmail().withMessage('Érvénytelen email cím'),
  body('password').custom(value => {
    passwordSchema.parse(value);
    return true;
  }),
  body('firstName').isLength({ min: 2, max: 50 }).trim().escape().withMessage('A keresztnév 2-50 karakter között kell legyen'),
  body('lastName').isLength({ min: 2, max: 50 }).trim().escape().withMessage('A vezetéknév 2-50 karakter között kell legyen'),
  body('phone').optional().isMobilePhone('hu-HU').withMessage('Érvénytelen telefonszám'),
];

export const validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Érvénytelen email cím'),
  body('password').isLength({ min: 1 }).withMessage('Jelszó megadása kötelező'),
];

export const validatePasswordReset = [
  body('token').isLength({ min: 32, max: 64 }).withMessage('Érvénytelen token'),
  body('password').custom(value => {
    passwordSchema.parse(value);
    return true;
  }),
];

// Validation error handler
export function handleValidationErrors(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation errors',
      errors: errors.array().map(err => ({
        field: err.type === 'field' ? err.path : 'unknown',
        message: err.msg
      }))
    });
  }
  next();
}

// Session security enhancement
export function enhanceSessionSecurity(req: Request, res: Response, next: NextFunction) {
  // Set secure session cookie options
  if (req.session) {
    req.session.cookie.secure = process.env.NODE_ENV === 'production';
    req.session.cookie.httpOnly = true;
    req.session.cookie.sameSite = 'strict';
    req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // 24 hours
  }
  next();
}

// Two-factor authentication helpers
export function generateTOTPSecret(): string {
  return crypto.randomBytes(20).toString('hex');
}

export function verifyTOTP(token: string, secret: string): boolean {
  // This is a simplified implementation
  // In production, use a proper TOTP library like 'otplib'
  const timeStep = Math.floor(Date.now() / 30000);
  const expectedToken = crypto
    .createHmac('sha1', Buffer.from(secret, 'hex'))
    .update(Buffer.from(timeStep.toString()))
    .digest('hex')
    .slice(-6);
  
  return token === expectedToken;
}

// Device fingerprinting for anomaly detection
export function generateDeviceFingerprint(req: Request): string {
  const components = [
    req.get('User-Agent') || '',
    req.get('Accept-Language') || '',
    req.get('Accept-Encoding') || '',
    req.ip || ''
  ];
  
  return crypto
    .createHash('sha256')
    .update(components.join('|'))
    .digest('hex');
}

// Password breach checking (placeholder for external service)
export async function checkPasswordBreach(password: string): Promise<boolean> {
  // In production, integrate with HaveIBeenPwned API or similar service
  // For now, check against common passwords
  const commonPasswords = [
    'password', '123456', 'password123', 'admin', 'qwerty',
    'letmein', 'welcome', 'monkey', '1234567890'
  ];
  
  return commonPasswords.includes(password.toLowerCase());
}

// Security audit logging
export function auditSecurityEvent(
  event: string, 
  userId: string | null, 
  details: Record<string, any>, 
  req: Request
) {
  const auditLog = {
    timestamp: new Date().toISOString(),
    event,
    userId,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    details
  };
  
  console.log('[SECURITY AUDIT]', JSON.stringify(auditLog));
  
  // In production, store in dedicated audit log table or external service
}