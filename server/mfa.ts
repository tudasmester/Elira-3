import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { storage } from './storage';
import { User } from '@shared/schema';
import { sendPhoneVerification } from './auth';

// MFA method types
export enum MFAMethod {
  SMS = 'sms',
  EMAIL = 'email',
  TOTP = 'totp'
}

// MFA session storage (in production, use Redis or database)
const mfaSessions = new Map<string, {
  userId: string;
  method: MFAMethod;
  code: string;
  expiresAt: Date;
  verified: boolean;
  attempts: number;
}>();

// Generate secure 6-digit code
export function generateMFACode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate MFA session token
export function generateMFAToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Initialize MFA process
export async function initiateMFA(user: User, method: MFAMethod): Promise<string> {
  const code = generateMFACode();
  const token = generateMFAToken();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Store MFA session
  mfaSessions.set(token, {
    userId: user.id,
    method,
    code,
    expiresAt,
    verified: false,
    attempts: 0
  });

  // Send code based on method
  switch (method) {
    case MFAMethod.SMS:
      if (user.phone) {
        await sendPhoneVerification(user.phone, code);
      } else {
        throw new Error('Nincs telefonszám regisztrálva');
      }
      break;
      
    case MFAMethod.EMAIL:
      if (user.email) {
        // Send email with code (implement email service)
        console.log(`MFA code for ${user.email}: ${code}`);
      } else {
        throw new Error('Nincs email cím regisztrálva');
      }
      break;
      
    case MFAMethod.TOTP:
      // TOTP doesn't need code sending, user generates it
      break;
  }

  return token;
}

// Verify MFA code
export async function verifyMFACode(token: string, inputCode: string): Promise<boolean> {
  const session = mfaSessions.get(token);
  
  if (!session) {
    throw new Error('Érvénytelen MFA token');
  }

  if (new Date() > session.expiresAt) {
    mfaSessions.delete(token);
    throw new Error('MFA kód lejárt');
  }

  session.attempts++;

  // Rate limiting: max 3 attempts
  if (session.attempts > 3) {
    mfaSessions.delete(token);
    throw new Error('Túl sok sikertelen kísérlet');
  }

  if (session.code === inputCode) {
    session.verified = true;
    return true;
  }

  return false;
}

// Check if MFA is verified
export function isMFAVerified(token: string): boolean {
  const session = mfaSessions.get(token);
  return session?.verified || false;
}

// Clean up MFA session
export function completeMFA(token: string): void {
  mfaSessions.delete(token);
}

// Middleware to require MFA
export function requireMFA(req: Request & { user?: User; mfaToken?: string }, res: Response, next: NextFunction) {
  const mfaToken = req.headers['x-mfa-token'] as string;
  
  if (!mfaToken) {
    return res.status(403).json({ 
      message: 'MFA token szükséges',
      requireMFA: true 
    });
  }

  if (!isMFAVerified(mfaToken)) {
    return res.status(403).json({ 
      message: 'MFA ellenőrzés szükséges',
      requireMFA: true 
    });
  }

  req.mfaToken = mfaToken;
  next();
}

// Setup MFA routes
export function setupMFARoutes(app: any) {
  // Initiate MFA
  app.post('/api/auth/mfa/initiate', async (req: Request & { user?: User }, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Bejelentkezés szükséges' });
      }

      const { method } = req.body;
      
      if (!Object.values(MFAMethod).includes(method)) {
        return res.status(400).json({ message: 'Érvénytelen MFA módszer' });
      }

      const token = await initiateMFA(req.user, method);
      
      res.json({
        message: 'MFA kód elküldve',
        token,
        method
      });
    } catch (error) {
      console.error('MFA initiation error:', error);
      res.status(500).json({ message: error.message || 'Szerver hiba' });
    }
  });

  // Verify MFA code
  app.post('/api/auth/mfa/verify', async (req: Request, res: Response) => {
    try {
      const { token, code } = req.body;

      if (!token || !code) {
        return res.status(400).json({ message: 'Token és kód megadása kötelező' });
      }

      const verified = await verifyMFACode(token, code);
      
      if (verified) {
        res.json({
          message: 'MFA sikeres',
          verified: true
        });
      } else {
        res.status(400).json({
          message: 'Hibás MFA kód',
          verified: false
        });
      }
    } catch (error) {
      console.error('MFA verification error:', error);
      res.status(400).json({ message: error.message || 'Ellenőrzési hiba' });
    }
  });

  // Resend MFA code
  app.post('/api/auth/mfa/resend', async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      const session = mfaSessions.get(token);
      
      if (!session) {
        return res.status(400).json({ message: 'Érvénytelen token' });
      }

      const user = await storage.getUser(session.userId);
      if (!user) {
        return res.status(400).json({ message: 'Felhasználó nem található' });
      }

      // Generate new code and extend expiration
      const newCode = generateMFACode();
      session.code = newCode;
      session.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      session.attempts = 0;

      // Resend based on method
      switch (session.method) {
        case MFAMethod.SMS:
          if (user.phone) {
            await sendPhoneVerification(user.phone, newCode);
          }
          break;
        case MFAMethod.EMAIL:
          if (user.email) {
            console.log(`New MFA code for ${user.email}: ${newCode}`);
          }
          break;
      }

      res.json({ message: 'MFA kód újraküldve' });
    } catch (error) {
      console.error('MFA resend error:', error);
      res.status(500).json({ message: 'Szerver hiba' });
    }
  });
}

// Cleanup expired MFA sessions (run periodically)
export function cleanupExpiredMFASessions() {
  const now = new Date();
  for (const [token, session] of mfaSessions.entries()) {
    if (now > session.expiresAt) {
      mfaSessions.delete(token);
    }
  }
}

// Start cleanup interval
setInterval(cleanupExpiredMFASessions, 5 * 60 * 1000); // Every 5 minutes