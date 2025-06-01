import session from 'express-session';
import connectPg from 'connect-pg-simple';
import { Express } from 'express';

// Enhanced session configuration
export function setupSecureSession(app: Express) {
  const PostgresSessionStore = connectPg(session);
  
  const sessionStore = new PostgresSessionStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: true,
    tableName: 'sessions',
    ttl: 24 * 60 * 60, // 24 hours in seconds
    pruneSessionInterval: 60 * 60, // Prune expired sessions every hour
  });

  const sessionConfig: session.SessionOptions = {
    store: sessionStore,
    secret: process.env.SESSION_SECRET!,
    name: 'elira.session', // Custom session name for security
    resave: false,
    saveUninitialized: false,
    rolling: true, // Reset expiration on activity
    cookie: {
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      httpOnly: true, // Prevent XSS
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict', // CSRF protection
    }
  };

  app.use(session(sessionConfig));
}

// Session validation middleware
export function validateSession(req: any, res: any, next: any) {
  if (req.session && req.session.userId) {
    // Check if session is valid and not expired
    const now = new Date();
    const sessionCreated = new Date(req.session.createdAt || now);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    
    if (now.getTime() - sessionCreated.getTime() > maxAge) {
      req.session.destroy((err: any) => {
        if (err) console.error('Session destruction error:', err);
      });
      return res.status(401).json({ message: 'Munkamenet lejárt' });
    }
    
    // Update last activity
    req.session.lastActivity = now;
  }
  
  next();
}