# API Documentation - Elira Platform

## Authentication & Authorization

### Authentication Headers
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

### Auth Status Codes
- `200` - Success
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `422` - Validation Error

## Authentication Endpoints

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "János",
  "lastName": "Kovács",
  "phone": "+36301234567"
}
```

**Response (201):**
```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "firstName": "János",
  "lastName": "Kovács",
  "isAdmin": 0,
  "token": "jwt-token-string"
}
```

### POST /api/auth/login
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "firstName": "János",
    "lastName": "Kovács",
    "isAdmin": 0
  },
  "token": "jwt-token-string"
}
```

### GET /api/auth/user
Get current authenticated user information.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "firstName": "János",
  "lastName": "Kovács",
  "phone": "+36301234567",
  "profileImageUrl": null,
  "subscriptionType": "free",
  "isAdmin": 0,
  "createdAt": "2025-06-05T10:00:00.000Z"
}
```

### PUT /api/auth/profile
Update user profile information.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "firstName": "János",
  "lastName": "Nagy",
  "phone": "+36301234567"
}
```

**Response (200):**
```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "firstName": "János",
  "lastName": "Nagy",
  "phone": "+36301234567"
}
```

### POST /api/auth/logout
Logout user and blacklist JWT token.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "message": "Successfully logged out"
}
```

## Admin Endpoints

### GET /api/admin/check
Verify admin status of current user.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "isAdmin": true,
  "user": {
    "id": "uuid-string",
    "email": "admin@example.com",
    "isAdmin": 1
  }
}
```

### GET /api/admin/courses
Get all courses for admin management.

**Headers:** `Authorization: Bearer <token>` (Admin required)

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Digitális Marketing Stratégiák",
    "description": "Komprehenzív digitális marketing kurzus",
    "shortDescription": "Marketing alapok és stratégiák",
    "imageUrl": "https://example.com/course-image.jpg",
    "universityId": 1,
    "level": "kezdő",
    "category": "marketing",
    "duration": "6 hét",
    "price": 49900,
    "originalPrice": 79900,
    "isHighlighted": 1,
    "isPublished": 1,
    "createdAt": "2025-06-01T10:00:00.000Z"
  }
]
```

### POST /api/admin/courses
Create a new course.

**Headers:** `Authorization: Bearer <token>` (Admin required)

**Request Body:**
```json
{
  "title": "Új Kurzus Címe",
  "description": "Részletes kurzus leírás",
  "shortDescription": "Rövid összefoglaló",
  "imageUrl": "https://example.com/image.jpg",
  "universityId": 1,
  "level": "kezdő",
  "category": "programozás",
  "duration": "8 hét",
  "price": 59900,
  "originalPrice": 89900
}
```

**Response (201):**
```json
{
  "id": 25,
  "title": "Új Kurzus Címe",
  "description": "Részletes kurzus leírás",
  "isPublished": 0,
  "createdAt": "2025-06-05T10:00:00.000Z"
}
```

### GET /api/admin/courses/:id
Get detailed course information for admin.

**Headers:** `Authorization: Bearer <token>` (Admin required)

**Response (200):**
```json
{
  "id": 1,
  "title": "Digitális Marketing Stratégiák",
  "description": "Komprehenzív digitális marketing kurzus",
  "modules": [
    {
      "id": 1,
      "title": "Bevezetés a Digital Marketingbe",
      "description": "Alapfogalmak és stratégiák",
      "orderIndex": 0,
      "status": "aktív",
      "lessons": [
        {
          "id": 1,
          "title": "Mi a digital marketing?",
          "type": "szöveg",
          "duration": 15,
          "orderIndex": 0
        }
      ]
    }
  ]
}
```

### PUT /api/admin/courses/:id
Update course information.

**Headers:** `Authorization: Bearer <token>` (Admin required)

**Request Body:**
```json
{
  "title": "Frissített Kurzus Cím",
  "description": "Új leírás",
  "price": 69900,
  "isPublished": 1
}
```

### DELETE /api/admin/courses/:id
Delete a course and all associated content.

**Headers:** `Authorization: Bearer <token>` (Admin required)

**Response (204):** No content

## Course Management Endpoints

### GET /api/admin/courses/:id/modules
Get all modules for a specific course.

**Headers:** `Authorization: Bearer <token>` (Admin required)

**Response (200):**
```json
[
  {
    "id": 1,
    "courseId": 1,
    "title": "Bevezetés a témába",
    "description": "Alapfogalmak és célok",
    "orderIndex": 0,
    "status": "aktív",
    "lessons": [
      {
        "id": 1,
        "moduleId": 1,
        "title": "Első lecke",
        "type": "szöveg",
        "duration": 15,
        "orderIndex": 0
      }
    ]
  }
]
```

### POST /api/courses/:id/modules
Create a new module within a course.

**Headers:** `Authorization: Bearer <token>` (Admin required)

**Request Body:**
```json
{
  "title": "Új Modul Címe",
  "description": "Modul leírása",
  "orderIndex": 1
}
```

**Response (201):**
```json
{
  "id": 15,
  "courseId": 1,
  "title": "Új Modul Címe",
  "description": "Modul leírása",
  "orderIndex": 1,
  "status": "piszkozat"
}
```

### POST /api/modules/:id/lessons
Create a new lesson within a module.

**Headers:** `Authorization: Bearer <token>` (Admin required)

**Request Body:**
```json
{
  "title": "Új Lecke Címe",
  "description": "Lecke leírása",
  "content": "Lecke tartalma",
  "type": "szöveg",
  "duration": 20,
  "orderIndex": 0,
  "videoUrl": "https://example.com/video.mp4"
}
```

**Response (201):**
```json
{
  "id": 45,
  "moduleId": 15,
  "title": "Új Lecke Címe",
  "type": "szöveg",
  "duration": 20,
  "orderIndex": 0
}
```

## Quiz Management Endpoints

### GET /api/lessons/:lessonId/quizzes
Get all quizzes associated with a lesson.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
[
  {
    "id": 1,
    "lessonId": 45,
    "title": "Tudáspróba kvíz",
    "description": "Lecke anyagának ellenőrzése",
    "instructions": "Válaszolj a kérdésekre a tanult anyag alapján",
    "timeLimit": 1800,
    "passingScore": 70,
    "maxAttempts": 3,
    "status": "active",
    "isActive": true,
    "showCorrectAnswers": true,
    "shuffleQuestions": false
  }
]
```

### POST /api/quizzes
Create a new quiz.

**Headers:** `Authorization: Bearer <token>` (Admin required)

**Request Body:**
```json
{
  "lessonId": 45,
  "title": "Új Kvíz",
  "description": "Kvíz leírása",
  "instructions": "Kövesse az utasításokat",
  "timeLimit": 1200,
  "passingScore": 80,
  "maxAttempts": 2,
  "showCorrectAnswers": true,
  "shuffleQuestions": false
}
```

**Response (201):**
```json
{
  "id": 5,
  "lessonId": 45,
  "title": "Új Kvíz",
  "status": "active",
  "createdAt": "2025-06-05T10:00:00.000Z"
}
```

### GET /api/quizzes/:quizId/questions
Get all questions for a specific quiz.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
[
  {
    "id": 1,
    "quizId": 5,
    "questionText": "Mi a digitális marketing fő célja?",
    "questionType": "multiple_choice",
    "points": 10,
    "orderIndex": 0,
    "settings": {
      "allowMultipleAnswers": false
    },
    "options": [
      {
        "id": 1,
        "questionId": 1,
        "optionText": "Vásárlók megszerzése",
        "isCorrect": true,
        "order": 0
      },
      {
        "id": 2,
        "questionId": 1,
        "optionText": "Költségek csökkentése",
        "isCorrect": false,
        "order": 1
      }
    ]
  }
]
```

### POST /api/quiz-questions
Create a new quiz question.

**Headers:** `Authorization: Bearer <token>` (Admin required)

**Request Body:**
```json
{
  "quizId": 5,
  "questionText": "Hogyan működik a SEO?",
  "questionType": "multiple_choice",
  "points": 15,
  "orderIndex": 1,
  "settings": {
    "allowMultipleAnswers": false,
    "randomizeOptions": true
  }
}
```

**Response (201):**
```json
{
  "id": 8,
  "quizId": 5,
  "questionText": "Hogyan működik a SEO?",
  "questionType": "multiple_choice",
  "points": 15,
  "orderIndex": 1
}
```

### POST /api/questions/:questionId/options
Create multiple choice options for a question.

**Headers:** `Authorization: Bearer <token>` (Admin required)

**Request Body:**
```json
{
  "options": [
    {
      "optionText": "Keresőoptimalizálás",
      "isCorrect": true
    },
    {
      "optionText": "Közösségi média",
      "isCorrect": false
    },
    {
      "optionText": "Email marketing",
      "isCorrect": false
    }
  ]
}
```

**Response (201):**
```json
[
  {
    "id": 15,
    "questionId": 8,
    "optionText": "Keresőoptimalizálás",
    "isCorrect": true,
    "order": 0
  },
  {
    "id": 16,
    "questionId": 8,
    "optionText": "Közösségi média",
    "isCorrect": false,
    "order": 1
  }
]
```

### GET /api/quizzes/:id/full
Get complete quiz with all questions and options.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "id": 5,
  "lessonId": 45,
  "title": "Komplett Kvíz",
  "description": "Teljes kvíz minden kérdéssel",
  "timeLimit": 1800,
  "passingScore": 70,
  "questions": [
    {
      "id": 1,
      "questionText": "Mi a digitális marketing?",
      "questionType": "multiple_choice",
      "points": 10,
      "orderIndex": 0,
      "options": [
        {
          "id": 1,
          "optionText": "Online marketing tevékenységek",
          "isCorrect": true,
          "order": 0
        }
      ]
    }
  ]
}
```

## Public Course Endpoints

### GET /api/courses
Get all published courses for public viewing.

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Digitális Marketing Stratégiák",
    "shortDescription": "Marketing alapok",
    "imageUrl": "https://example.com/image.jpg",
    "level": "kezdő",
    "category": "marketing",
    "duration": "6 hét",
    "price": 49900,
    "originalPrice": 79900
  }
]
```

### GET /api/courses/trending
Get highlighted/trending courses.

**Response (200):**
```json
[
  {
    "id": 2,
    "title": "Népszerű Programozás Kurzus",
    "isHighlighted": 1,
    "enrollmentCount": 150,
    "rating": 4.8
  }
]
```

### GET /api/courses/:id
Get detailed information about a specific course.

**Response (200):**
```json
{
  "id": 1,
  "title": "Digitális Marketing Stratégiák",
  "description": "Teljes körű digitális marketing képzés",
  "imageUrl": "https://example.com/course-image.jpg",
  "trailerVideoUrl": "https://example.com/trailer.mp4",
  "level": "kezdő",
  "category": "marketing",
  "duration": "6 hét",
  "price": 49900,
  "originalPrice": 79900,
  "modules": [
    {
      "id": 1,
      "title": "Bevezetés",
      "description": "Alapfogalmak",
      "lessonCount": 5
    }
  ]
}
```

### POST /api/courses/:id/enroll
Enroll current user in a course.

**Headers:** `Authorization: Bearer <token>`

**Response (201):**
```json
{
  "enrollmentId": 123,
  "courseId": 1,
  "userId": "uuid-string",
  "enrolledAt": "2025-06-05T10:00:00.000Z",
  "status": "active"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Invalid request data",
  "errors": [
    {
      "field": "email",
      "message": "Email is required"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 422 Validation Error
```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "title",
      "message": "Title must be between 1 and 255 characters"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error occurred"
}
```

## Rate Limiting

API endpoints are protected by rate limiting:
- **Public endpoints**: 100 requests per 15 minutes per IP
- **Authenticated endpoints**: 1000 requests per 15 minutes per user
- **Admin endpoints**: 5000 requests per 15 minutes per admin user

## Data Types and Enums

### Course Levels
- `"kezdő"` - Beginner
- `"haladó"` - Intermediate
- `"expert"` - Expert

### Course Categories
- `"programozás"` - Programming
- `"marketing"` - Marketing
- `"üzlet"` - Business
- `"design"` - Design

### Lesson Types
- `"szöveg"` - Text content
- `"videó"` - Video content
- `"kvíz"` - Quiz content
- `"fájl"` - File/document content

### Quiz Question Types
- `"multiple_choice"` - Multiple choice
- `"true_false"` - True/false
- `"short_text"` - Short text answer
- `"long_text"` - Long text answer
- `"file_upload"` - File upload

### Module Status
- `"piszkozat"` - Draft
- `"aktív"` - Active
- `"hamarosan"` - Coming soon
- `"ingyenes"` - Free
- `"fizetos"` - Paid

This API documentation provides comprehensive coverage of all available endpoints, request/response formats, and data structures used in the Elira platform.