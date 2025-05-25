import { 
  User, InsertUser, UpsertUser, Course, InsertCourse,
  University, InsertUniversity, Degree, InsertDegree,
  Subscriber, InsertSubscriber,
  users, courses, universities, degrees, subscribers
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
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return results.length > 0 ? results[0] : undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return results.length > 0 ? results[0] : undefined;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const results = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return results.length > 0 ? results[0] : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const results = await db.insert(users).values(insertUser).returning();
    return results[0];
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
