# Deployment Guide - Elira Platform

## Prerequisites

### System Requirements
- Node.js 18+ or 20+
- PostgreSQL 14+
- 2GB+ RAM
- 10GB+ storage space

### Required Environment Variables
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication
SESSION_SECRET=your-secure-session-secret-key
ADMIN_SETUP_SECRET=your-admin-setup-secret

# Optional: AI Features
OPENAI_API_KEY=your-openai-api-key

# Optional: Payment Integration
STRIPE_SECRET_KEY=sk_live_or_test_key
VITE_STRIPE_PUBLIC_KEY=pk_live_or_test_key
STRIPE_PLUS_PRICE_ID=price_id_for_plus_plan
STRIPE_ANNUAL_PRICE_ID=price_id_for_annual_plan

# Optional: Email Service
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password

# Optional: SMS Service (Twilio)
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
```

## Local Development Setup

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd elira-platform
npm install
```

### 2. Database Setup
```bash
# Create PostgreSQL database
createdb elira_platform

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Push database schema
npm run db:push
```

### 3. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

### 4. Create Admin User
1. Register a new user account
2. Use the admin setup endpoint with your secret:
```bash
curl -X POST http://localhost:5000/api/setup-admin-direct \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"userId": "your-user-id", "adminSecret": "your-admin-secret"}'
```

## Production Deployment

### Option 1: Replit Deployment (Recommended)

#### Prerequisites
- Replit account
- PostgreSQL database (Neon, Supabase, or similar)

#### Steps
1. **Database Setup**
   - Create PostgreSQL database on Neon/Supabase
   - Note the connection string

2. **Environment Configuration**
   - Add all required environment variables in Replit Secrets
   - Ensure DATABASE_URL points to your production database

3. **Deploy**
   - Use Replit's Deploy button
   - Application will be available at your Replit domain

#### Replit Environment Setup
```bash
# In Replit Shell
npm install
npm run db:push
npm run dev
```

### Option 2: VPS/Cloud Deployment

#### Server Setup (Ubuntu 22.04)
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Install PM2 for process management
sudo npm install -g pm2

# Install Nginx for reverse proxy
sudo apt install nginx
```

#### Application Deployment
```bash
# Clone repository
git clone <repository-url> /var/www/elira
cd /var/www/elira

# Install dependencies
npm install

# Build application
npm run build

# Set up environment
sudo nano /var/www/elira/.env
# Add all required environment variables

# Set up database
npm run db:push

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### PM2 Configuration (ecosystem.config.js)
```javascript
module.exports = {
  apps: [{
    name: 'elira-platform',
    script: 'server/index.js',
    cwd: '/var/www/elira',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

#### Nginx Configuration
```nginx
# /etc/nginx/sites-available/elira
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### SSL Setup with Let's Encrypt
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Option 3: Docker Deployment

#### Dockerfile
```dockerfile
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application code
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 5000

# Start application
CMD ["npm", "start"]
```

#### Docker Compose
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:password@db:5432/elira
      - SESSION_SECRET=your-session-secret
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=elira
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

## Database Migration and Backup

### Database Backup
```bash
# Create backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Restore backup
psql $DATABASE_URL < backup-20250605.sql
```

### Schema Updates
```bash
# Apply schema changes
npm run db:push

# Generate migrations (if using migrations)
npm run db:generate
npm run db:migrate
```

## Performance Optimization

### Application Optimization
```javascript
// PM2 configuration for clustering
module.exports = {
  apps: [{
    name: 'elira-platform',
    script: 'server/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
```

### Database Optimization
```sql
-- Create performance indexes
CREATE INDEX CONCURRENTLY idx_courses_published_category 
ON courses(isPublished, category) WHERE isPublished = 1;

CREATE INDEX CONCURRENTLY idx_lessons_module_order 
ON lessons(moduleId, orderIndex);

CREATE INDEX CONCURRENTLY idx_quiz_attempts_user_quiz 
ON quizAttempts(userId, quizId);

-- Analyze tables for query optimization
ANALYZE courses;
ANALYZE modules;
ANALYZE lessons;
ANALYZE quizzes;
```

### Nginx Caching
```nginx
# Add to Nginx configuration
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

location /api/ {
    proxy_pass http://localhost:3000;
    proxy_cache_valid 200 5m;
    add_header X-Cache-Status $upstream_cache_status;
}
```

## Monitoring and Logging

### PM2 Monitoring
```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs elira-platform

# Restart application
pm2 restart elira-platform

# Reload with zero downtime
pm2 reload elira-platform
```

### Application Logging
```javascript
// server/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

### Health Check Endpoint
```javascript
// Add to server/routes.ts
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});
```

## Security Configuration

### Production Security Headers
```javascript
// server/index.ts
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### Rate Limiting
```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

app.use('/api/', limiter);
```

### CORS Configuration
```javascript
import cors from 'cors';

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:5000'],
  credentials: true
}));
```

## Backup and Recovery

### Automated Database Backup
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/elira"
BACKUP_FILE="$BACKUP_DIR/elira_backup_$DATE.sql"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
pg_dump $DATABASE_URL > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Remove backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE.gz"
```

### Automated File Backup
```bash
#!/bin/bash
# file-backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/elira-files"
APP_DIR="/var/www/elira"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application files and uploads
tar -czf "$BACKUP_DIR/files_backup_$DATE.tar.gz" \
  --exclude="$APP_DIR/node_modules" \
  --exclude="$APP_DIR/.git" \
  --exclude="$APP_DIR/logs" \
  "$APP_DIR"

echo "File backup completed: files_backup_$DATE.tar.gz"
```

### Recovery Procedures
```bash
# Database recovery
gunzip -c backup_20250605_120000.sql.gz | psql $DATABASE_URL

# File recovery
tar -xzf files_backup_20250605_120000.tar.gz -C /var/www/

# Restart application
pm2 restart elira-platform
```

## Troubleshooting

### Common Issues

#### Database Connection Issues
```bash
# Check database connectivity
psql $DATABASE_URL -c "SELECT version();"

# Check database user permissions
psql $DATABASE_URL -c "SELECT current_user, session_user;"
```

#### Application Won't Start
```bash
# Check logs
pm2 logs elira-platform

# Check port availability
sudo netstat -tlnp | grep :5000

# Check environment variables
pm2 env 0
```

#### High Memory Usage
```bash
# Check memory usage
pm2 monit

# Restart application
pm2 restart elira-platform

# Add memory limit to PM2 config
max_memory_restart: '1G'
```

### Performance Issues
```bash
# Check database performance
SELECT * FROM pg_stat_activity WHERE state = 'active';

# Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificates
sudo certbot renew --dry-run

# Test SSL configuration
openssl s_client -connect your-domain.com:443 -servername your-domain.com
```

This deployment guide provides comprehensive instructions for deploying the Elira platform in various environments while maintaining security, performance, and reliability standards.