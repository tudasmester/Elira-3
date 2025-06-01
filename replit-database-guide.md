# Replit PostgreSQL Database Management Guide for Elira E-Learning Platform

## Accessing Replit's Database Tools

### **1. Database Tab Interface**
- **Location**: Look for the "Database" tab in your Replit sidebar (cylinder icon)
- **Quick Access**: Click on the database icon to open the visual database editor
- **Connection Status**: Green indicator shows active database connection

### **2. Built-in Query Editor**
```sql
-- Access via Database tab > "Query" button
-- Execute SQL directly in the browser interface

-- Example: View all courses
SELECT id, title, isPublished, enrollmentCount 
FROM courses 
ORDER BY createdAt DESC;

-- Example: Check user enrollments
SELECT u.firstName, u.lastName, c.title, e.enrolledAt, e.progress
FROM users u
JOIN enrollments e ON u.id = e.userId
JOIN courses c ON e.courseId = c.id
WHERE e.status = 'active';
```

### **3. Visual Schema Browser**
- **Table Explorer**: Browse all tables, columns, and relationships
- **Data Preview**: Click any table to see sample data
- **Schema Visualization**: View foreign key relationships graphically

## Essential Database Operations for E-Learning Platform

### **Creating and Managing Tables**

#### **Using SQL Commands (Recommended)**
```sql
-- Create a new course category table
CREATE TABLE course_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  iconUrl VARCHAR(500),
  isActive BOOLEAN DEFAULT true,
  displayOrder INTEGER DEFAULT 0,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add sample categories
INSERT INTO course_categories (name, description, displayOrder) VALUES
('Programozás', 'Szoftverfejlesztés és programozási nyelvek', 1),
('Üzleti ismeretek', 'Menedzsment, marketing és vállalkozás', 2),
('Design', 'Grafikai tervezés és felhasználói élmény', 3),
('Adatelemzés', 'Adattudomány és gépi tanulás', 4);
```

#### **Using Drizzle Migrations (Best Practice)**
```bash
# In Replit Shell
npm run db:push
```

### **Data Management Workflows**

#### **Course Content Management**
```sql
-- Publish multiple courses at once
UPDATE courses 
SET isPublished = true, publishedAt = NOW() 
WHERE id IN (1, 2, 3, 4) AND isPublished = false;

-- Check enrollment statistics
SELECT 
  c.title,
  c.enrollmentCount,
  COUNT(e.id) as actual_enrollments,
  AVG(e.progress) as avg_progress
FROM courses c
LEFT JOIN enrollments e ON c.id = e.courseId
WHERE c.isPublished = true
GROUP BY c.id, c.title, c.enrollmentCount;
```

#### **User Activity Analysis**
```sql
-- Find most active learners
SELECT 
  u.firstName || ' ' || u.lastName as student_name,
  COUNT(e.id) as enrolled_courses,
  AVG(e.progress) as avg_progress,
  MAX(e.lastAccessedAt) as last_activity
FROM users u
JOIN enrollments e ON u.id = e.userId
WHERE u.isAdmin = 0
GROUP BY u.id, u.firstName, u.lastName
ORDER BY enrolled_courses DESC, avg_progress DESC
LIMIT 10;
```

## Replit Database Advantages for Development

### **1. Zero Configuration Setup**
- **Instant Access**: Database available immediately without setup
- **Environment Variables**: `DATABASE_URL` automatically configured
- **SSL Enabled**: Secure connections by default

### **2. Integrated Development Experience**
```javascript
// Seamless integration with your app
import { db } from './server/db';

// Database operations work immediately
const courses = await db.select().from(courses).where(eq(courses.isPublished, true));
```

### **3. Real-Time Collaboration**
- **Shared Database**: Team members access same database instance
- **Live Changes**: See schema updates from team members instantly
- **Version Control**: Database state preserved across deployments

### **4. Development-to-Production Pipeline**
```sql
-- Easily export data for production
COPY courses TO '/tmp/courses_backup.csv' WITH CSV HEADER;

-- Import test data during development
COPY users(email, firstName, lastName, isAdmin) 
FROM '/path/to/test_users.csv' WITH CSV HEADER;
```

## Advanced Database Management Techniques

### **Performance Monitoring**
```sql
-- Monitor query performance
EXPLAIN ANALYZE 
SELECT c.*, u.name as university_name 
FROM courses c 
JOIN universities u ON c.universityId = u.id 
WHERE c.isPublished = true;

-- Check table sizes
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats 
WHERE tablename IN ('courses', 'enrollments', 'users');
```

### **Data Integrity Checks**
```sql
-- Verify enrollment data consistency
SELECT 
  'Orphaned Enrollments' as issue,
  COUNT(*) as count
FROM enrollments e
LEFT JOIN courses c ON e.courseId = c.id
WHERE c.id IS NULL

UNION ALL

SELECT 
  'Invalid Progress Values' as issue,
  COUNT(*) as count
FROM enrollments 
WHERE progress < 0 OR progress > 100;
```

### **Backup and Migration Strategies**
```sql
-- Create development data snapshots
CREATE TABLE courses_backup AS SELECT * FROM courses;
CREATE TABLE users_backup AS SELECT * FROM users;

-- Restore from backup when needed
TRUNCATE courses;
INSERT INTO courses SELECT * FROM courses_backup;
```

## Using Replit's Database Features Effectively

### **1. Quick Data Inspection**
- **Browse Mode**: Use table browser for quick data review
- **Filter Views**: Apply filters to see specific data subsets
- **Export Options**: Download query results as CSV

### **2. Development Data Management**
```sql
-- Create test user accounts
INSERT INTO users (id, email, firstName, lastName, isAdmin) VALUES
('test-student-1', 'student1@test.com', 'Anna', 'Kovács', 0),
('test-student-2', 'student2@test.com', 'Péter', 'Nagy', 0),
('test-admin-1', 'admin@test.com', 'Admin', 'User', 1);

-- Create sample enrollments for testing
INSERT INTO enrollments (userId, courseId, progress, status) VALUES
('test-student-1', 1, 75, 'active'),
('test-student-1', 2, 100, 'completed'),
('test-student-2', 1, 30, 'active');
```

### **3. Schema Evolution**
```sql
-- Add new features during development
ALTER TABLE courses ADD COLUMN estimatedHours INTEGER;
ALTER TABLE courses ADD COLUMN difficultyLevel VARCHAR(20) DEFAULT 'beginner';

-- Update existing data
UPDATE courses SET estimatedHours = 40 WHERE duration LIKE '%weeks%';
UPDATE courses SET estimatedHours = 120 WHERE duration LIKE '%months%';
```

## Best Practices for Replit Database Development

### **1. Environment Management**
```javascript
// Use environment-specific configurations
const isDevelopment = process.env.NODE_ENV === 'development';

if (isDevelopment) {
  // Enable detailed logging
  console.log('Database queries:', query);
}
```

### **2. Data Seeding for Development**
```sql
-- Create comprehensive test dataset
WITH sample_data AS (
  SELECT 
    'Tanuló ' || generate_series(1, 100) as name,
    'student' || generate_series(1, 100) || '@test.com' as email
)
INSERT INTO users (id, email, firstName, lastName)
SELECT 
  'test-user-' || row_number() OVER(),
  email,
  split_part(name, ' ', 1),
  split_part(name, ' ', 2)
FROM sample_data;
```

### **3. Development Debugging**
```sql
-- Debug enrollment issues
SELECT 
  e.*,
  c.title as course_title,
  u.firstName as student_name
FROM enrollments e
JOIN courses c ON e.courseId = c.id
JOIN users u ON e.userId = u.id
WHERE e.progress > 100 OR e.enrolledAt > NOW();
```

## Security and Access Control

### **1. Development vs Production Data**
```sql
-- Mask sensitive data in development
UPDATE users SET 
  email = 'dev' || id || '@test.com',
  password = 'development_password_hash'
WHERE email NOT LIKE '%@test.com';
```

### **2. Access Pattern Analysis**
```sql
-- Monitor database usage patterns
SELECT 
  query,
  calls,
  total_time,
  mean_time
FROM pg_stat_statements
WHERE query LIKE '%courses%'
ORDER BY total_time DESC;
```

## Integration with Replit Deployment

### **1. Database Persistence**
- **Automatic Backups**: Replit handles database backups automatically
- **Deployment Continuity**: Database persists through app deployments
- **Branch Isolation**: Each branch can have its own database state

### **2. Production Readiness**
```sql
-- Production optimization queries
ANALYZE courses;
ANALYZE enrollments;
ANALYZE users;

-- Create production indexes
CREATE INDEX CONCURRENTLY idx_courses_published_category 
ON courses(isPublished, category) WHERE isPublished = true;
```

This guide provides comprehensive coverage of using Replit's PostgreSQL database effectively for your e-learning platform development, from basic operations to advanced optimization techniques.