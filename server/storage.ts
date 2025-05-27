import { 
  User, InsertUser, UpsertUser, Course, InsertCourse,
  University, InsertUniversity, Degree, InsertDegree,
  Subscriber, InsertSubscriber, Enrollment, InsertEnrollment,
  users, courses, universities, degrees, subscribers, enrollments
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Course operations
  getCourse(id: number): Promise<Course | undefined>;
  getAllCourses(): Promise<Course[]>;
  getCoursesByCategory(category: string): Promise<Course[]>;
  getCoursesByUniversity(universityId: number): Promise<Course[]>;
  getFreeCourses(): Promise<Course[]>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, course: InsertCourse): Promise<Course>;
  deleteCourse(id: number): Promise<void>;
  
  // University operations
  getUniversity(id: number): Promise<University | undefined>;
  getAllUniversities(): Promise<University[]>;
  createUniversity(university: InsertUniversity): Promise<University>;
  
  // Degree operations
  getDegree(id: number): Promise<Degree | undefined>;
  getAllDegrees(): Promise<Degree[]>;
  getDegreesByUniversity(universityId: number): Promise<Degree[]>;
  createDegree(degree: InsertDegree): Promise<Degree>;
  
  // Newsletter subscriber operations
  addSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  getSubscriberByEmail(email: string): Promise<Subscriber | undefined>;
  getAllSubscribers(): Promise<Subscriber[]>;
  
  // Enrollment operations
  enrollUserInCourse(enrollment: InsertEnrollment): Promise<Enrollment>;
  getEnrollment(userId: string, courseId: number): Promise<Enrollment | undefined>;
  getUserEnrollments(userId: string): Promise<Enrollment[]>;
  getCourseEnrollments(courseId: number): Promise<Enrollment[]>;
  updateEnrollmentProgress(id: number, progress: number): Promise<Enrollment>;
  updateEnrollmentStatus(id: number, status: string): Promise<Enrollment>;
  isUserEnrolledInCourse(userId: string, courseId: number): Promise<boolean>;
  
  // Admin operations
  promoteUserToAdmin(userId: string): Promise<User>;
  demoteUserFromAdmin(userId: string): Promise<User>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return results.length > 0 ? results[0] : undefined;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!email) return undefined;
    const results = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return results.length > 0 ? results[0] : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const results = await db.insert(users).values({
      id: "temp-" + Date.now(), // This will be replaced in real auth flow
      email: insertUser.email,
      firstName: insertUser.firstName,
      lastName: insertUser.lastName,
      profileImageUrl: insertUser.profileImageUrl
    }).returning();
    return results[0];
  }
  
  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        profileImageUrl: userData.profileImageUrl,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }
  
  // Course operations
  async getCourse(id: number): Promise<Course | undefined> {
    const results = await db.select().from(courses).where(eq(courses.id, id)).limit(1);
    return results.length > 0 ? results[0] : undefined;
  }
  
  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses);
  }
  
  async getCoursesByCategory(category: string): Promise<Course[]> {
    return await db.select().from(courses).where(eq(courses.category, category));
  }
  
  async getCoursesByUniversity(universityId: number): Promise<Course[]> {
    return await db.select().from(courses).where(eq(courses.universityId, universityId));
  }
  
  async getFreeCourses(): Promise<Course[]> {
    return await db.select().from(courses).where(eq(courses.isFree, 1));
  }
  
  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    // Ensure isFree is always set to a number
    const courseToInsert = {
      ...insertCourse,
      isFree: insertCourse.isFree ?? 0
    };
    const results = await db.insert(courses).values(courseToInsert).returning();
    return results[0];
  }

  async updateCourse(id: number, courseData: InsertCourse): Promise<Course> {
    const courseToUpdate = {
      ...courseData,
      isFree: courseData.isFree ?? 0
    };
    const results = await db
      .update(courses)
      .set(courseToUpdate)
      .where(eq(courses.id, id))
      .returning();
    return results[0];
  }

  async deleteCourse(id: number): Promise<void> {
    await db.delete(courses).where(eq(courses.id, id));
  }
  
  // University operations
  async getUniversity(id: number): Promise<University | undefined> {
    const results = await db.select().from(universities).where(eq(universities.id, id)).limit(1);
    return results.length > 0 ? results[0] : undefined;
  }
  
  async getAllUniversities(): Promise<University[]> {
    return await db.select().from(universities);
  }
  
  async createUniversity(insertUniversity: InsertUniversity): Promise<University> {
    const results = await db.insert(universities).values(insertUniversity).returning();
    return results[0];
  }
  
  // Degree operations
  async getDegree(id: number): Promise<Degree | undefined> {
    const results = await db.select().from(degrees).where(eq(degrees.id, id)).limit(1);
    return results.length > 0 ? results[0] : undefined;
  }
  
  async getAllDegrees(): Promise<Degree[]> {
    return await db.select().from(degrees);
  }
  
  async getDegreesByUniversity(universityId: number): Promise<Degree[]> {
    return await db.select().from(degrees).where(eq(degrees.universityId, universityId));
  }
  
  async createDegree(insertDegree: InsertDegree): Promise<Degree> {
    const results = await db.insert(degrees).values(insertDegree).returning();
    return results[0];
  }
  
  // Newsletter subscriber operations
  async addSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const results = await db.insert(subscribers).values(insertSubscriber).returning();
    return results[0];
  }
  
  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    const results = await db.select().from(subscribers).where(eq(subscribers.email, email)).limit(1);
    return results.length > 0 ? results[0] : undefined;
  }
  
  async getAllSubscribers(): Promise<Subscriber[]> {
    return await db.select().from(subscribers);
  }
  
  // Enrollment operations
  async enrollUserInCourse(enrollment: InsertEnrollment): Promise<Enrollment> {
    // Check if enrollment already exists
    const existingEnrollment = await this.getEnrollment(enrollment.userId, enrollment.courseId);
    
    if (existingEnrollment) {
      // If already enrolled, just return the existing enrollment
      return existingEnrollment;
    }
    
    // Otherwise create a new enrollment
    const [newEnrollment] = await db
      .insert(enrollments)
      .values(enrollment)
      .returning();
      
    return newEnrollment;
  }
  
  async getEnrollment(userId: string, courseId: number): Promise<Enrollment | undefined> {
    const [enrollment] = await db
      .select()
      .from(enrollments)
      .where(
        and(
          eq(enrollments.userId, userId),
          eq(enrollments.courseId, courseId)
        )
      );
      
    return enrollment;
  }
  
  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    return await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.userId, userId));
  }
  
  async getCourseEnrollments(courseId: number): Promise<Enrollment[]> {
    return await db
      .select()
      .from(enrollments)
      .where(eq(enrollments.courseId, courseId));
  }
  
  async updateEnrollmentProgress(id: number, progress: number): Promise<Enrollment> {
    const [updatedEnrollment] = await db
      .update(enrollments)
      .set({ 
        progress,
        lastAccessedAt: new Date()
      })
      .where(eq(enrollments.id, id))
      .returning();
      
    return updatedEnrollment;
  }
  
  async updateEnrollmentStatus(id: number, status: string): Promise<Enrollment> {
    const [updatedEnrollment] = await db
      .update(enrollments)
      .set({ 
        status,
        lastAccessedAt: new Date(),
        ...(status === "completed" ? { completedAt: new Date() } : {})
      })
      .where(eq(enrollments.id, id))
      .returning();
      
    return updatedEnrollment;
  }
  
  async isUserEnrolledInCourse(userId: string, courseId: number): Promise<boolean> {
    const enrollment = await this.getEnrollment(userId, courseId);
    return !!enrollment;
  }

  // Admin operations
  async promoteUserToAdmin(userId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ isAdmin: 1, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async demoteUserFromAdmin(userId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ isAdmin: 0, updatedAt: new Date() })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  // Initialize database with sample data if needed
  async initializeData() {
    const existingUniversities = await this.getAllUniversities();
    
    if (existingUniversities.length === 0) {
      await this.createUniversity({
        name: "Budapesti Műszaki és Gazdaságtudományi Egyetem",
        description: "Magyarország vezető műszaki egyeteme",
        logoUrl: "https://pixabay.com/get/g29baaa3b40bdd5c7ad38226a85a0fcc24fde8d64aade6e9548243db4599904ef03d40a4ec3cb0f191af374a69f2f49c6e56273e3ead50cd5895300b96e86ba3d_1280.jpg",
        country: "Magyarország"
      });
      
      await this.createUniversity({
        name: "Eötvös Loránd Tudományegyetem",
        description: "Magyarország egyik legrégebbi és legrangosabb egyeteme",
        logoUrl: "https://pixabay.com/get/g29baaa3b40bdd5c7ad38226a85a0fcc24fde8d64aade6e9548243db4599904ef03d40a4ec3cb0f191af374a69f2f49c6e56273e3ead50cd5895300b96e86ba3d_1280.jpg",
        country: "Magyarország"
      });
      
      await this.createUniversity({
        name: "Corvinus Egyetem",
        description: "Vezető gazdasági és üzleti képzések",
        logoUrl: "https://pixabay.com/get/g29baaa3b40bdd5c7ad38226a85a0fcc24fde8d64aade6e9548243db4599904ef03d40a4ec3cb0f191af374a69f2f49c6e56273e3ead50cd5895300b96e86ba3d_1280.jpg",
        country: "Magyarország"
      });
    }
  }
}

// Create database storage instance
export const storage = new DatabaseStorage();

// Initialize database with sample data
storage.initializeData().catch(err => {
  console.error("Failed to initialize database with sample data:", err);
});
