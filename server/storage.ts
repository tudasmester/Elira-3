import { 
  User, InsertUser, Course, InsertCourse,
  University, InsertUniversity, Degree, InsertDegree,
  Subscriber, InsertSubscriber
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private universities: Map<number, University>;
  private degrees: Map<number, Degree>;
  private subscribers: Map<number, Subscriber>;
  
  private userIdCounter: number;
  private courseIdCounter: number;
  private universityIdCounter: number;
  private degreeIdCounter: number;
  private subscriberIdCounter: number;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.universities = new Map();
    this.degrees = new Map();
    this.subscribers = new Map();
    
    this.userIdCounter = 1;
    this.courseIdCounter = 1;
    this.universityIdCounter = 1;
    this.degreeIdCounter = 1;
    this.subscriberIdCounter = 1;
    
    // Initialize with some sample data
    this.initializeData();
  }
  
  private initializeData() {
    // Add some initial universities
    const bme = this.createUniversity({
      name: "Budapesti Műszaki és Gazdaságtudományi Egyetem",
      description: "Magyarország vezető műszaki egyeteme",
      logoUrl: "https://pixabay.com/get/g29baaa3b40bdd5c7ad38226a85a0fcc24fde8d64aade6e9548243db4599904ef03d40a4ec3cb0f191af374a69f2f49c6e56273e3ead50cd5895300b96e86ba3d_1280.jpg",
      country: "Magyarország"
    });
    
    const elte = this.createUniversity({
      name: "Eötvös Loránd Tudományegyetem",
      description: "Magyarország egyik legrégebbi és legrangosabb egyeteme",
      logoUrl: "https://pixabay.com/get/g29baaa3b40bdd5c7ad38226a85a0fcc24fde8d64aade6e9548243db4599904ef03d40a4ec3cb0f191af374a69f2f49c6e56273e3ead50cd5895300b96e86ba3d_1280.jpg",
      country: "Magyarország"
    });
    
    const corvinus = this.createUniversity({
      name: "Corvinus Egyetem",
      description: "Vezető gazdasági és üzleti képzések",
      logoUrl: "https://pixabay.com/get/g29baaa3b40bdd5c7ad38226a85a0fcc24fde8d64aade6e9548243db4599904ef03d40a4ec3cb0f191af374a69f2f49c6e56273e3ead50cd5895300b96e86ba3d_1280.jpg",
      country: "Magyarország"
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }
  
  // Course operations
  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }
  
  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }
  
  async getCoursesByCategory(category: string): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(
      (course) => course.category === category
    );
  }
  
  async getCoursesByUniversity(universityId: number): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(
      (course) => course.universityId === universityId
    );
  }
  
  async getFreeCourses(): Promise<Course[]> {
    return Array.from(this.courses.values()).filter(
      (course) => course.isFree === 1
    );
  }
  
  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.courseIdCounter++;
    const createdAt = new Date();
    // Ensure isFree is always set to a number
    const isFree = insertCourse.isFree ?? 0;
    const course: Course = { ...insertCourse, id, createdAt, isFree };
    this.courses.set(id, course);
    return course;
  }
  
  // University operations
  async getUniversity(id: number): Promise<University | undefined> {
    return this.universities.get(id);
  }
  
  async getAllUniversities(): Promise<University[]> {
    return Array.from(this.universities.values());
  }
  
  async createUniversity(insertUniversity: InsertUniversity): Promise<University> {
    const id = this.universityIdCounter++;
    const createdAt = new Date();
    const university: University = { ...insertUniversity, id, createdAt };
    this.universities.set(id, university);
    return university;
  }
  
  // Degree operations
  async getDegree(id: number): Promise<Degree | undefined> {
    return this.degrees.get(id);
  }
  
  async getAllDegrees(): Promise<Degree[]> {
    return Array.from(this.degrees.values());
  }
  
  async getDegreesByUniversity(universityId: number): Promise<Degree[]> {
    return Array.from(this.degrees.values()).filter(
      (degree) => degree.universityId === universityId
    );
  }
  
  async createDegree(insertDegree: InsertDegree): Promise<Degree> {
    const id = this.degreeIdCounter++;
    const createdAt = new Date();
    const degree: Degree = { ...insertDegree, id, createdAt };
    this.degrees.set(id, degree);
    return degree;
  }
  
  // Newsletter subscriber operations
  async addSubscriber(insertSubscriber: InsertSubscriber): Promise<Subscriber> {
    const id = this.subscriberIdCounter++;
    const createdAt = new Date();
    const subscriber: Subscriber = { ...insertSubscriber, id, createdAt };
    this.subscribers.set(id, subscriber);
    return subscriber;
  }
  
  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    return Array.from(this.subscribers.values()).find(
      (subscriber) => subscriber.email === email
    );
  }
  
  async getAllSubscribers(): Promise<Subscriber[]> {
    return Array.from(this.subscribers.values());
  }
}

export const storage = new MemStorage();
