import { db } from './db';
import { eq, and, or, gte, lte, desc, asc, count, sql } from 'drizzle-orm';
import { courses, users, enrollments, universities } from '@shared/schema';

// Query optimization utilities for database performance
export class QueryOptimizer {
  
  // Optimized course search with proper indexing
  static async searchCourses({
    query,
    category,
    level,
    university,
    priceRange,
    limit = 20,
    offset = 0,
    sortBy = 'popularity'
  }: {
    query?: string;
    category?: string;
    level?: string;
    university?: string;
    priceRange?: { min: number; max: number };
    limit?: number;
    offset?: number;
    sortBy?: 'popularity' | 'rating' | 'price' | 'newest';
  }) {
    let queryBuilder = db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        shortDescription: courses.shortDescription,
        imageUrl: courses.imageUrl,
        price: courses.price,
        isFree: courses.isFree,
        rating: courses.rating,
        enrollmentCount: courses.enrollmentCount,
        level: courses.level,
        category: courses.category,
        duration: courses.duration,
        universityId: courses.universityId,
        instructorName: courses.instructorName,
        isPublished: courses.isPublished,
        createdAt: courses.createdAt
      })
      .from(courses)
      .where(eq(courses.isPublished, 1));

    // Add search conditions
    const conditions = [];

    if (query) {
      conditions.push(
        or(
          sql`${courses.title} ILIKE ${`%${query}%`}`,
          sql`${courses.description} ILIKE ${`%${query}%`}`,
          sql`${courses.instructorName} ILIKE ${`%${query}%`}`
        )
      );
    }

    if (category) {
      conditions.push(eq(courses.category, category));
    }

    if (level) {
      conditions.push(eq(courses.level, level));
    }

    if (university) {
      conditions.push(eq(courses.universityId, parseInt(university)));
    }

    if (priceRange) {
      if (priceRange.min > 0) {
        conditions.push(gte(courses.price, priceRange.min));
      }
      if (priceRange.max > 0) {
        conditions.push(lte(courses.price, priceRange.max));
      }
    }

    if (conditions.length > 0) {
      queryBuilder = queryBuilder.where(and(...conditions));
    }

    // Add sorting
    switch (sortBy) {
      case 'popularity':
        queryBuilder = queryBuilder.orderBy(desc(courses.enrollmentCount));
        break;
      case 'rating':
        queryBuilder = queryBuilder.orderBy(desc(courses.rating));
        break;
      case 'price':
        queryBuilder = queryBuilder.orderBy(asc(courses.price));
        break;
      case 'newest':
        queryBuilder = queryBuilder.orderBy(desc(courses.createdAt));
        break;
    }

    return queryBuilder.limit(limit).offset(offset);
  }

  // Optimized dashboard analytics with aggregations
  static async getDashboardStats(userId: string) {
    const [userStats] = await db
      .select({
        totalEnrollments: count(enrollments.id),
        completedCourses: sql<number>`COUNT(CASE WHEN ${enrollments.status} = 'completed' THEN 1 END)`,
        activeCourses: sql<number>`COUNT(CASE WHEN ${enrollments.status} = 'active' THEN 1 END)`,
        averageProgress: sql<number>`AVG(${enrollments.progress})`
      })
      .from(enrollments)
      .where(eq(enrollments.userId, userId));

    return userStats;
  }

  // Batch query for course details with related data
  static async getCourseWithDetails(courseId: number) {
    const [courseDetails] = await db
      .select({
        id: courses.id,
        title: courses.title,
        description: courses.description,
        shortDescription: courses.shortDescription,
        imageUrl: courses.imageUrl,
        trailerVideoUrl: courses.trailerVideoUrl,
        price: courses.price,
        isFree: courses.isFree,
        rating: courses.rating,
        enrollmentCount: courses.enrollmentCount,
        level: courses.level,
        category: courses.category,
        duration: courses.duration,
        estimatedHours: courses.estimatedHours,
        instructorName: courses.instructorName,
        instructorBio: courses.instructorBio,
        instructorImageUrl: courses.instructorImageUrl,
        language: courses.language,
        subtitles: courses.subtitles,
        certificate: courses.certificate,
        prerequisites: courses.prerequisites,
        learningOutcomes: courses.learningOutcomes,
        tags: courses.tags,
        isPublished: courses.isPublished,
        createdAt: courses.createdAt,
        updatedAt: courses.updatedAt,
        universityName: universities.name,
        universityLogoUrl: universities.logoUrl,
        universityWebsite: universities.website
      })
      .from(courses)
      .innerJoin(universities, eq(courses.universityId, universities.id))
      .where(and(
        eq(courses.id, courseId),
        eq(courses.isPublished, 1)
      ));

    return courseDetails;
  }

  // Optimized trending courses
  static async getTrendingCourses(limit = 10) {
    return db
      .select({
        id: courses.id,
        title: courses.title,
        shortDescription: courses.shortDescription,
        imageUrl: courses.imageUrl,
        price: courses.price,
        isFree: courses.isFree,
        rating: courses.rating,
        enrollmentCount: courses.enrollmentCount,
        level: courses.level,
        category: courses.category,
        instructorName: courses.instructorName,
        universityId: courses.universityId
      })
      .from(courses)
      .where(eq(courses.isPublished, 1))
      .orderBy(
        desc(sql`(${courses.enrollmentCount} * 0.7 + ${courses.rating} * 30)`),
        desc(courses.createdAt)
      )
      .limit(limit);
  }
}

// Query performance monitoring
export function wrapQueryWithMetrics<T>(
  queryName: string,
  queryFn: () => Promise<T>
): Promise<T> {
  const startTime = Date.now();
  
  return queryFn()
    .then(result => {
      const duration = Date.now() - startTime;
      
      if (duration > 1000) {
        console.warn(`Slow query detected: ${queryName} took ${duration}ms`);
      }
      
      return result;
    })
    .catch(error => {
      const duration = Date.now() - startTime;
      console.error(`Query failed: ${queryName} after ${duration}ms`, error);
      throw error;
    });
}