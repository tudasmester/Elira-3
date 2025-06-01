# Database & Data Management Improvements for Elira

## 🗄️ Database Migration System

### Current State
The application uses Drizzle ORM with `npm run db:push` for schema changes.

### Recommended Migration System
```typescript
// drizzle/migrations/0001_initial_schema.sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  -- Add proper constraints and indexes
  CONSTRAINT valid_email CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create indexes for performance
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_courses_published ON courses(isPublished, category);
CREATE INDEX CONCURRENTLY idx_enrollments_user_course ON enrollments(userId, courseId);
```

### Migration Commands
```bash
# Generate migration
npm run db:generate

# Apply migrations
npm run db:migrate

# Rollback migration
npm run db:rollback
```

## 💾 Database Backup & Recovery

### Automated Backup Script
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="elira_db"

# Create backup
pg_dump $DATABASE_URL > "$BACKUP_DIR/elira_backup_$DATE.sql"

# Compress backup
gzip "$BACKUP_DIR/elira_backup_$DATE.sql"

# Remove backups older than 30 days
find $BACKUP_DIR -name "elira_backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: elira_backup_$DATE.sql.gz"
```

### Recovery Procedures
```bash
# Restore from backup
psql $DATABASE_URL < backup_file.sql

# Point-in-time recovery
pg_restore -d $DATABASE_URL backup_file.dump
```

## 📊 Database Indexing Strategy

### Performance Indexes
```sql
-- User-related indexes
CREATE INDEX CONCURRENTLY idx_users_subscription ON users(subscriptionType, subscriptionStatus);
CREATE INDEX CONCURRENTLY idx_users_verification ON users(isEmailVerified, isPhoneVerified);
CREATE INDEX CONCURRENTLY idx_users_onboarding ON users(isOnboardingComplete);

-- Course discovery indexes
CREATE INDEX CONCURRENTLY idx_courses_search ON courses 
  USING GIN(to_tsvector('hungarian', title || ' ' || description));
CREATE INDEX CONCURRENTLY idx_courses_category_level ON courses(category, level, isPublished);
CREATE INDEX CONCURRENTLY idx_courses_university ON courses(universityId, isPublished);
CREATE INDEX CONCURRENTLY idx_courses_price ON courses(price, isFree) WHERE isPublished = true;

-- Learning progress indexes
CREATE INDEX CONCURRENTLY idx_enrollments_user_status ON enrollments(userId, status);
CREATE INDEX CONCURRENTLY idx_enrollments_course_active ON enrollments(courseId, status) 
  WHERE status = 'active';
CREATE INDEX CONCURRENTLY idx_lesson_completions_user ON lessonCompletions(userId, completedAt);

-- Analytics indexes
CREATE INDEX CONCURRENTLY idx_quiz_attempts_performance ON quizAttempts(userId, quizId, score);
CREATE INDEX CONCURRENTLY idx_user_activities_timeline ON userActivities(userId, timestamp DESC);
```

### Composite Indexes for Complex Queries
```sql
-- Course recommendation system
CREATE INDEX CONCURRENTLY idx_courses_recommendation ON courses(category, level, rating, enrollmentCount) 
  WHERE isPublished = true;

-- Admin dashboard analytics
CREATE INDEX CONCURRENTLY idx_enrollments_analytics ON enrollments(courseId, status, enrolledAt);
CREATE INDEX CONCURRENTLY idx_revenue_tracking ON enrollments(amountPaid, enrolledAt) 
  WHERE amountPaid > 0;
```

## ✅ Database Validation

### Constraint Implementation
```sql
-- User data validation
ALTER TABLE users ADD CONSTRAINT valid_phone 
  CHECK (phone IS NULL OR phone ~ '^\+[1-9]\d{1,14}$');

ALTER TABLE users ADD CONSTRAINT valid_subscription_dates
  CHECK (subscriptionEndDate IS NULL OR subscriptionEndDate > CURRENT_TIMESTAMP);

-- Course content validation
ALTER TABLE courses ADD CONSTRAINT valid_price 
  CHECK ((isFree = 1 AND price = 0) OR (isFree = 0 AND price > 0));

ALTER TABLE courses ADD CONSTRAINT valid_duration 
  CHECK (estimatedHours > 0 AND estimatedHours <= 1000);

-- Learning progress validation
ALTER TABLE enrollments ADD CONSTRAINT valid_progress 
  CHECK (progress >= 0 AND progress <= 100);

ALTER TABLE enrollments ADD CONSTRAINT valid_time_spent 
  CHECK (totalTimeSpent >= 0);

-- Quiz validation
ALTER TABLE quizAttempts ADD CONSTRAINT valid_score 
  CHECK (score >= 0 AND score <= 100);

ALTER TABLE quizAttempts ADD CONSTRAINT valid_timing 
  CHECK (completedAt >= startedAt);
```

### Data Integrity Functions
```sql
-- Function to validate enrollment consistency
CREATE OR REPLACE FUNCTION validate_enrollment_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if course exists and is published
  IF NOT EXISTS (SELECT 1 FROM courses WHERE id = NEW.courseId AND isPublished = true) THEN
    RAISE EXCEPTION 'Cannot enroll in unpublished course';
  END IF;
  
  -- Prevent duplicate enrollments
  IF EXISTS (SELECT 1 FROM enrollments WHERE userId = NEW.userId AND courseId = NEW.courseId) THEN
    RAISE EXCEPTION 'User already enrolled in this course';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_enrollment_trigger
  BEFORE INSERT ON enrollments
  FOR EACH ROW EXECUTE FUNCTION validate_enrollment_data();
```

## 🔄 Connection Pooling

### PostgreSQL Connection Configuration
```typescript
// server/db.ts enhancement
import { Pool } from '@neondatabase/serverless';

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
  max: 20,                    // Maximum connections
  min: 5,                     // Minimum connections
  idle: 10000,                // Close connections after 10s idle
  connect_timeout: 60,        // Connection timeout
  application_name: 'elira_platform'
};

export const pool = new Pool(poolConfig);

// Health check function
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}
```

## 📈 Database Monitoring

### Performance Monitoring Queries
```sql
-- Monitor slow queries
SELECT query, mean_time, calls, total_time
FROM pg_stat_statements
WHERE mean_time > 100  -- Queries taking more than 100ms
ORDER BY mean_time DESC;

-- Check index usage
SELECT schemaname, tablename, attname, n_distinct, correlation
FROM pg_stats
WHERE tablename IN ('users', 'courses', 'enrollments')
ORDER BY tablename, attname;

-- Monitor connection usage
SELECT state, count(*) 
FROM pg_stat_activity 
GROUP BY state;

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Automated Monitoring Script
```typescript
// server/monitoring/db-monitor.ts
export class DatabaseMonitor {
  async checkPerformance() {
    const slowQueries = await db.execute(`
      SELECT query, mean_time, calls 
      FROM pg_stat_statements 
      WHERE mean_time > 1000
    `);
    
    if (slowQueries.length > 0) {
      console.warn('Slow queries detected:', slowQueries);
    }
  }
  
  async checkConnections() {
    const connections = await db.execute(`
      SELECT count(*) as active_connections
      FROM pg_stat_activity 
      WHERE state = 'active'
    `);
    
    const activeCount = connections[0].active_connections;
    if (activeCount > 15) {
      console.warn(`High connection count: ${activeCount}`);
    }
  }
  
  async checkTableSizes() {
    const sizes = await db.execute(`
      SELECT tablename, pg_size_pretty(pg_total_relation_size(tablename)) as size
      FROM pg_tables 
      WHERE schemaname = 'public'
    `);
    
    return sizes;
  }
}
```

## 🔐 Security Enhancements

### Row Level Security (RLS)
```sql
-- Enable RLS on sensitive tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY user_self_access ON users
  FOR ALL USING (id = current_setting('app.current_user_id'));

-- Students can only see their own enrollments
CREATE POLICY student_enrollment_access ON enrollments
  FOR ALL USING (userId = current_setting('app.current_user_id'));

-- Admins can see everything
CREATE POLICY admin_full_access ON users
  FOR ALL USING (current_setting('app.user_role') = 'admin');
```

### Audit Logging
```sql
-- Create audit log table
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  table_name VARCHAR(50) NOT NULL,
  operation VARCHAR(10) NOT NULL,
  old_values JSONB,
  new_values JSONB,
  user_id VARCHAR(36),
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (table_name, operation, old_values, new_values, user_id)
  VALUES (
    TG_TABLE_NAME,
    TG_OP,
    CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD) ELSE NULL END,
    CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN row_to_json(NEW) ELSE NULL END,
    current_setting('app.current_user_id', true)
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
```

This comprehensive database improvement plan ensures your Elira platform has enterprise-level data management, performance optimization, and security measures in place.