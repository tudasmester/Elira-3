import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import helmet from 'helmet';
import cors from 'cors';
import { Express, Request, Response, NextFunction } from 'express';

// Rate limiting configurations
export const generalRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Túl sok kérés érkezett erről az IP címről, próbáljon újra később.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login attempts per windowMs
  message: 'Túl sok bejelentkezési kísérlet. Próbáljon újra 15 perc múlva.',
  skipSuccessfulRequests: true,
});

export const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Higher limit for API endpoints
  message: 'API rate limit exceeded. Please try again later.',
});

export const strictRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // Very strict for sensitive operations
  message: 'Túl sok érzékeny művelet. Próbáljon újra később.',
});

// Slow down middleware for progressive delays
export const authSlowDown = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 2, // Allow 2 requests per windowMs without delay
  delayMs: 500, // Add 500ms delay per request after delayAfter
  maxDelayMs: 20000, // Maximum delay of 20 seconds
});

// CORS configuration
export const corsOptions = {
  origin: function (origin: string | undefined, callback: Function) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Development environment
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // Production allowed origins
    const allowedOrigins = [
      'https://your-domain.com',
      'https://www.your-domain.com',
      process.env.REPLIT_DOMAINS?.split(',').map(domain => `https://${domain}`) || []
    ].flat();
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Security headers configuration
export const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false, // Disable for development
};

// Input sanitization middleware
export function sanitizeInput(req: Request, res: Response, next: NextFunction) {
  // Remove potential XSS vectors from string inputs
  function sanitizeValue(value: any): any {
    if (typeof value === 'string') {
      return value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    }
    if (typeof value === 'object' && value !== null) {
      const sanitized: any = Array.isArray(value) ? [] : {};
      for (const key in value) {
        sanitized[key] = sanitizeValue(value[key]);
      }
      return sanitized;
    }
    return value;
  }

  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }

  next();
}

// Security logging middleware
export function securityLogger(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const isSecurityEvent = 
      req.path.includes('/auth/') || 
      req.path.includes('/admin/') ||
      res.statusCode >= 400;
    
    if (isSecurityEvent) {
      console.log(`[SECURITY] ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms - IP: ${req.ip} - User-Agent: ${req.get('User-Agent')}`);
    }
  });
  
  next();
}

// Suspicious activity detection
const suspiciousPatterns = [
  /\.\.\//, // Path traversal
  /<script/i, // Script injection
  /union.*select/i, // SQL injection
  /exec\(/i, // Code execution
  /eval\(/i, // Code evaluation
];

export function detectSuspiciousActivity(req: Request, res: Response, next: NextFunction) {
  const testString = `${req.url} ${JSON.stringify(req.body)} ${JSON.stringify(req.query)}`;
  
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(testString)) {
      console.warn(`[SECURITY ALERT] Suspicious activity detected from IP: ${req.ip} - Pattern: ${pattern} - URL: ${req.url}`);
      return res.status(403).json({ 
        message: 'Gyanús tevékenység észlelve. A kérés blokkolva.' 
      });
    }
  }
  
  next();
}

// Enhanced error handling
export function securityErrorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  // Log the full error for debugging
  console.error(`[ERROR] ${req.method} ${req.path} - ${err.message}`, {
    stack: err.stack,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Don't expose internal errors to clients
  if (err.message.includes('CORS policy violation')) {
    return res.status(403).json({ 
      message: 'Hozzáférés megtagadva.' 
    });
  }

  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({ 
      message: 'Érvénytelen biztonsági token.' 
    });
  }

  // Generic error message for production
  const isDevelopment = process.env.NODE_ENV === 'development';
  res.status(err.status || 500).json({
    message: isDevelopment ? err.message : 'Belső szerver hiba történt.',
    ...(isDevelopment && { stack: err.stack })
  });
}

// Setup all security middleware
export function setupSecurity(app: Express) {
  // Trust proxy for rate limiting behind reverse proxy
  app.set('trust proxy', 1);
  
  // Security headers
  app.use(helmet(helmetConfig));
  
  // CORS
  app.use(cors(corsOptions));
  
  // General rate limiting
  app.use(generalRateLimit);
  
  // Security logging
  app.use(securityLogger);
  
  // Input sanitization
  app.use(sanitizeInput);
  
  // Suspicious activity detection
  app.use(detectSuspiciousActivity);
  
  // Specific rate limits for sensitive routes
  app.use('/api/auth/login', authRateLimit, authSlowDown);
  app.use('/api/auth/register', authRateLimit);
  app.use('/api/auth/forgot-password', strictRateLimit);
  app.use('/api/auth/reset-password', strictRateLimit);
  app.use('/api/admin/', apiRateLimit);
}