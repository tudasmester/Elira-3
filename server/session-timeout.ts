import { Request, Response, NextFunction } from 'express';
import { User } from '@shared/schema';

// Session timeout configuration
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before timeout

// Track active sessions
const activeSessions = new Map<string, {
  userId: string;
  lastActivity: Date;
  warningShown: boolean;
}>();

interface SessionRequest extends Request {
  user?: User;
  sessionId?: string;
}

// Update session activity
export function updateSessionActivity(sessionId: string, userId: string) {
  activeSessions.set(sessionId, {
    userId,
    lastActivity: new Date(),
    warningShown: false
  });
}

// Check if session is expired
export function isSessionExpired(sessionId: string): boolean {
  const session = activeSessions.get(sessionId);
  if (!session) return true;
  
  const now = new Date();
  const timeSinceLastActivity = now.getTime() - session.lastActivity.getTime();
  
  return timeSinceLastActivity > SESSION_TIMEOUT;
}

// Check if session needs warning
export function shouldShowWarning(sessionId: string): boolean {
  const session = activeSessions.get(sessionId);
  if (!session || session.warningShown) return false;
  
  const now = new Date();
  const timeSinceLastActivity = now.getTime() - session.lastActivity.getTime();
  
  return timeSinceLastActivity > (SESSION_TIMEOUT - WARNING_TIME);
}

// Mark warning as shown
export function markWarningShown(sessionId: string) {
  const session = activeSessions.get(sessionId);
  if (session) {
    session.warningShown = true;
  }
}

// Remove session
export function removeSession(sessionId: string) {
  activeSessions.delete(sessionId);
}

// Session timeout middleware
export function sessionTimeoutMiddleware(req: SessionRequest, res: Response, next: NextFunction) {
  // Generate or get session ID
  const sessionId = req.headers['x-session-id'] as string || req.sessionID || 'default';
  req.sessionId = sessionId;
  
  if (req.user) {
    // Check if session is expired
    if (isSessionExpired(sessionId)) {
      removeSession(sessionId);
      return res.status(401).json({ 
        message: 'Munkamenet lejárt. Kérjük, jelentkezzen be újra.',
        sessionExpired: true 
      });
    }
    
    // Check if warning should be shown
    if (shouldShowWarning(sessionId)) {
      markWarningShown(sessionId);
      res.setHeader('X-Session-Warning', 'true');
      res.setHeader('X-Session-Expires-In', WARNING_TIME.toString());
    }
    
    // Update session activity
    updateSessionActivity(sessionId, req.user.id);
  }
  
  next();
}

// Extend session endpoint
export function setupSessionTimeoutRoutes(app: any) {
  // Extend session
  app.post('/api/auth/extend-session', (req: SessionRequest, res: Response) => {
    if (!req.user || !req.sessionId) {
      return res.status(401).json({ message: 'Nincs aktív munkamenet' });
    }
    
    updateSessionActivity(req.sessionId, req.user.id);
    
    res.json({
      message: 'Munkamenet meghosszabbítva',
      expiresIn: SESSION_TIMEOUT
    });
  });
  
  // Get session status
  app.get('/api/auth/session-status', (req: SessionRequest, res: Response) => {
    if (!req.user || !req.sessionId) {
      return res.status(401).json({ message: 'Nincs aktív munkamenet' });
    }
    
    const session = activeSessions.get(req.sessionId);
    if (!session) {
      return res.status(401).json({ message: 'Munkamenet nem található' });
    }
    
    const now = new Date();
    const timeSinceLastActivity = now.getTime() - session.lastActivity.getTime();
    const remainingTime = SESSION_TIMEOUT - timeSinceLastActivity;
    
    res.json({
      remainingTime: Math.max(0, remainingTime),
      lastActivity: session.lastActivity,
      needsWarning: shouldShowWarning(req.sessionId)
    });
  });
  
  // Manual logout
  app.post('/api/auth/logout-session', (req: SessionRequest, res: Response) => {
    if (req.sessionId) {
      removeSession(req.sessionId);
    }
    
    res.json({ message: 'Sikeres kijelentkezés' });
  });
}

// Cleanup expired sessions periodically
export function cleanupExpiredSessions() {
  const now = new Date();
  
  for (const [sessionId, session] of activeSessions.entries()) {
    const timeSinceLastActivity = now.getTime() - session.lastActivity.getTime();
    
    if (timeSinceLastActivity > SESSION_TIMEOUT) {
      activeSessions.delete(sessionId);
    }
  }
}

// Start cleanup interval
setInterval(cleanupExpiredSessions, 5 * 60 * 1000); // Every 5 minutes