# Technical Architecture - Elira Platform

## System Overview

Elira is built as a modern full-stack web application with a clear separation between client and server responsibilities. The architecture follows best practices for scalability, maintainability, and security.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT (React/TypeScript)                │
├─────────────────────────────────────────────────────────────┤
│  Components Layer                                          │
│  ├── Pages (CourseOutlineBuilder, AdminPanel)             │
│  ├── Components (LessonEditor, QuizManager)               │
│  └── UI Components (shadcn/ui)                            │
├─────────────────────────────────────────────────────────────┤
│  State Management                                          │
│  ├── React Query (Server State)                           │
│  ├── Local State (useState, useReducer)                   │
│  └── Context API (Auth, Theme)                            │
├─────────────────────────────────────────────────────────────┤
│  API Layer                                                 │
│  ├── queryClient (React Query configuration)              │
│  ├── apiRequest (HTTP client wrapper)                     │
│  └── Endpoints (/api/*)                                   │
└─────────────────────────────────────────────────────────────┘
                               │
                          HTTP/JSON
                               │
┌─────────────────────────────────────────────────────────────┐
│                   SERVER (Express/TypeScript)               │
├─────────────────────────────────────────────────────────────┤
│  Route Layer                                               │
│  ├── auth-working.ts (Authentication)                     │
│  ├── admin-routes.ts (Admin Management)                   │
│  ├── quiz-routes.ts (Quiz Operations)                     │
│  └── routes.ts (Main API Routes)                          │
├─────────────────────────────────────────────────────────────┤
│  Middleware                                                │
│  ├── requireAuth (JWT Verification)                       │
│  ├── isAdmin (Admin Authorization)                        │
│  ├── Validation (Zod Schemas)                             │
│  └── Error Handling                                       │
├─────────────────────────────────────────────────────────────┤
│  Business Logic                                            │
│  ├── ContentManager (Course Operations)                   │
│  ├── ExamBuilderService (Quiz Logic)                      │
│  └── Storage Interface (Data Access)                      │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                │
│  ├── storage.ts (Database Operations)                     │
│  ├── Drizzle ORM (Query Builder)                          │
│  └── PostgreSQL (Database)                                │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack Details

### Frontend Technologies

#### React.js with TypeScript
- **Version**: Latest stable
- **Purpose**: Component-based UI development
- **Benefits**: Type safety, component reusability, modern React features

#### Tailwind CSS
- **Purpose**: Utility-first CSS framework
- **Configuration**: Custom theme with Hungarian design aesthetics
- **Benefits**: Rapid UI development, consistent styling, responsive design

#### shadcn/ui Components
- **Purpose**: Pre-built accessible UI components
- **Components Used**: Dialog, Tabs, Forms, Buttons, Tables
- **Benefits**: Accessibility, consistent design system

#### React Query (@tanstack/react-query)
- **Purpose**: Server state management
- **Features**: Caching, background updates, optimistic updates
- **Configuration**: Custom query client with error handling

#### Wouter
- **Purpose**: Lightweight client-side routing
- **Benefits**: Small bundle size, React hooks integration

### Backend Technologies

#### Express.js with TypeScript
- **Purpose**: Web application framework
- **Features**: Middleware support, routing, HTTP utilities
- **Configuration**: CORS, JSON parsing, static file serving

#### PostgreSQL
- **Purpose**: Primary database
- **Features**: ACID compliance, advanced queries, JSON support
- **Connection**: Connection pooling with @neondatabase/serverless

#### Drizzle ORM
- **Purpose**: Type-safe database operations
- **Features**: SQL-like syntax, TypeScript integration, migrations
- **Schema**: Comprehensive type definitions in shared/schema.ts

#### JWT Authentication
- **Purpose**: Stateless authentication
- **Implementation**: jsonwebtoken library
- **Features**: Token generation, verification, blacklisting

## Data Flow Architecture

### Client-to-Server Communication

```
User Action → Component Event → API Call → Server Route → Middleware → Business Logic → Database → Response → State Update → UI Render
```

### Authentication Flow

```
1. User Login → Credentials Validation → JWT Generation → Token Storage
2. API Request → Token Extraction → JWT Verification → User Context → Route Handler
3. Admin Action → Admin Check → Role Verification → Protected Operation
```

### Course Management Flow

```
1. Admin Creates Course → Validation → Database Insert → Cache Invalidation
2. Add Modules → Module Creation → Lesson Association → Content Organization
3. Create Lessons → Lesson Editor → Quiz Integration → Content Publishing
4. Student Access → Course Enrollment → Progress Tracking → Assessment
```

## Database Architecture

### Entity Relationship Overview

```
Universities (1) ──────────── (N) Courses
                                    │
                              (1)   │   (N)
                                    │
                               Modules (1) ──────────── (N) Lessons
                                                            │
                                                      (1)   │   (N)
                                                            │
                                                        Quizzes (1) ─── (N) Questions
                                                                            │
                                                                      (1)   │   (N)
                                                                            │
                                                                        Options

Users (N) ──────────── (N) Enrollments ──────────── (N) Courses
  │
  │ (1:N)
  │
Progress ──────────── (N) Lessons
  │
  │ (1:N)
  │
QuizAttempts ──────────── (N) Quizzes
```

### Key Database Tables

#### Core Content Tables
- **courses**: Course information and metadata
- **modules**: Course sections and organization
- **lessons**: Individual learning units
- **quizzes**: Assessment tools integrated with lessons
- **quizQuestions**: Individual quiz questions
- **questionOptions**: Multiple choice options

#### User Management Tables
- **users**: User profiles and authentication data
- **enrollments**: Course enrollment tracking
- **progress**: Learning progress tracking
- **quizAttempts**: Quiz submission history

#### System Tables
- **universities**: Educational institution data
- **subscribers**: Newsletter subscription management

## Security Architecture

### Authentication Security

#### JWT Implementation
```typescript
// Token Generation
const token = jwt.sign(
  { userId: user.id }, 
  process.env.SESSION_SECRET!, 
  { expiresIn: '7d' }
);

// Token Verification
const decoded = jwt.verify(token, process.env.SESSION_SECRET!) as { userId: string };
```

#### Password Security
```typescript
// Password Hashing (12 rounds)
const hashedPassword = await bcrypt.hash(password, 12);

// Password Verification
const isValid = await bcrypt.compare(password, user.password);
```

### Authorization Layers

#### Middleware Chain
```typescript
app.get('/api/admin/*', requireAuth, isAdmin, routeHandler);
```

1. **requireAuth**: Validates JWT token
2. **isAdmin**: Checks user admin status
3. **routeHandler**: Executes protected operation

#### Role-Based Access Control
- **Guest**: Public course browsing
- **User**: Course enrollment, progress tracking
- **Admin**: Full course management, user administration

### Data Validation

#### Input Validation with Zod
```typescript
const courseSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  universityId: z.number().int().positive()
});
```

## Performance Architecture

### Frontend Optimizations

#### Code Splitting
- Route-based code splitting with React.lazy
- Component-level lazy loading
- Dynamic imports for large dependencies

#### State Management Optimization
```typescript
// React Query Cache Configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    }
  }
});
```

#### Bundle Optimization
- Tree shaking with Vite
- Asset optimization
- CSS purging with Tailwind

### Backend Optimizations

#### Database Query Optimization
```typescript
// Efficient queries with Drizzle
const coursesWithModules = await db
  .select()
  .from(courses)
  .leftJoin(modules, eq(courses.id, modules.courseId))
  .where(eq(courses.isPublished, 1));
```

#### Connection Pooling
```typescript
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000
});
```

## Scalability Considerations

### Horizontal Scaling
- Stateless server design enables load balancing
- JWT tokens eliminate session storage requirements
- Database connection pooling supports multiple instances

### Vertical Scaling
- Efficient SQL queries with proper indexing
- Lazy loading and pagination for large datasets
- Optimized asset delivery with CDN integration

### Caching Strategy
- React Query for client-side caching
- Database query result caching
- Static asset caching with long-term headers

## Error Handling Architecture

### Client-Side Error Handling
```typescript
// React Query Error Handling
const { data, error, isLoading } = useQuery({
  queryKey: ['/api/courses'],
  queryFn: () => apiRequest('GET', '/api/courses'),
  onError: (error) => {
    toast({
      title: "Hiba történt",
      description: error.message,
      variant: "destructive"
    });
  }
});
```

### Server-Side Error Handling
```typescript
// Global Error Middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  console.error(`Error ${status}:`, err);
  res.status(status).json({ message });
});
```

## Development Architecture

### Build Process
1. **TypeScript Compilation**: Type checking and compilation
2. **Vite Build**: Asset bundling and optimization
3. **CSS Processing**: Tailwind compilation and purging
4. **Asset Optimization**: Image and font optimization

### Development Tools
- **Hot Module Replacement**: Instant development feedback
- **TypeScript Language Server**: IDE integration
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting consistency

This technical architecture provides the foundation for understanding how Elira's components interact and scale to meet educational platform requirements.