import { 
  User, InsertUser, UpsertUser, Course, InsertCourse,
  University, InsertUniversity, Degree, InsertDegree,
  Subscriber, InsertSubscriber, Enrollment, InsertEnrollment,
  CourseModule, InsertCourseModule, Lesson, InsertLesson,
  Quiz, InsertQuiz, QuizQuestion, InsertQuizQuestion,
  QuizAnswer, InsertQuizAnswer, CourseResource, InsertCourseResource,
  LessonCompletion, InsertLessonCompletion,
  users, courses, universities, degrees, subscribers, enrollments,
  courseModules, lessons, quizzes, quizQuestions, quizAnswers,
  courseResources, lessonCompletions
} from "@shared/schema";
import { db } from "./db";
import { eq, and, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByPhone(phone: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Authentication tokens
  updateEmailVerification(userId: string, token: string): Promise<void>;
  verifyEmail(token: string): Promise<User | undefined>;
  updatePasswordReset(userId: string, token: string, expiry: Date): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<User | undefined>;
  updatePhoneVerification(userId: string, code: string, expiry: Date): Promise<void>;
  verifyPhone(phone: string, code: string): Promise<User | undefined>;
  
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
  
  // Subscription operations
  updateUserSubscription(userId: string, subscriptionData: {
    subscriptionType?: string;
    subscriptionStatus?: string;
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
    subscriptionEndDate?: Date | null;
  }): Promise<User>;
  
  // Advanced course management
  getCourseWithDetails(courseId: number): Promise<any>;
  getCourseAnalytics(courseId: number): Promise<any>;
  toggleCourseHighlight(courseId: number): Promise<Course>;
  getHighlightedCourses(): Promise<Course[]>;
  
  // Module and lesson operations
  createCourseModule(module: InsertCourseModule): Promise<CourseModule>;
  getCourseModules(courseId: number): Promise<CourseModule[]>;
  updateCourseModule(moduleId: number, module: Partial<InsertCourseModule>): Promise<CourseModule>;
  deleteCourseModule(moduleId: number): Promise<void>;
  
  createLesson(lesson: InsertLesson): Promise<Lesson>;
  getLessons(moduleId: number): Promise<Lesson[]>;
  getLessonsByModule(moduleId: number): Promise<Lesson[]>;
  getLesson(lessonId: number): Promise<Lesson | undefined>;
  updateLesson(lessonId: number, lesson: Partial<InsertLesson>): Promise<Lesson>;
  deleteLesson(lessonId: number): Promise<void>;
  
  // Quiz operations
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  getQuiz(quizId: number): Promise<Quiz | undefined>;
  getQuizzes(lessonId: number): Promise<Quiz[]>;
  updateQuiz(quizId: number, quiz: Partial<InsertQuiz>): Promise<Quiz>;
  deleteQuiz(quizId: number): Promise<void>;
  
  // Quiz question operations
  createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion>;
  getQuizQuestion(questionId: number): Promise<QuizQuestion | undefined>;
  getQuizQuestions(quizId: number): Promise<QuizQuestion[]>;
  updateQuizQuestion(questionId: number, question: Partial<InsertQuizQuestion>): Promise<QuizQuestion>;
  deleteQuizQuestion(questionId: number): Promise<boolean>;
  
  // Quiz answer operations
  createQuizAnswer(answer: InsertQuizAnswer): Promise<QuizAnswer>;
  getQuizAnswers(questionId: number): Promise<QuizAnswer[]>;
  updateQuizAnswer(answerId: number, answer: Partial<InsertQuizAnswer>): Promise<QuizAnswer>;
  deleteQuizAnswer(answerId: number): Promise<void>;
  
  // Course resource operations
  createCourseResource(resource: InsertCourseResource): Promise<CourseResource>;
  getCourseResources(courseId: number): Promise<CourseResource[]>;
  updateCourseResource(resourceId: number, resource: Partial<InsertCourseResource>): Promise<CourseResource>;
  deleteCourseResource(resourceId: number): Promise<void>;
  
  // LMS progress tracking
  markLessonComplete(userId: string, lessonId: number): Promise<LessonCompletion>;
  getLessonProgress(userId: string, courseId: number): Promise<LessonCompletion[]>;
  
  // Course structure retrieval
  getCourseWithFullStructure(courseId: number): Promise<any>;
  
  // Subscription operations
  updateUserSubscription(userId: string, subscriptionData: {
    subscriptionType?: string;
    subscriptionStatus?: string;
    stripeCustomerId?: string | null;
    stripeSubscriptionId?: string | null;
    subscriptionEndDate?: Date | null;
  }): Promise<User>;
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
    const userId = insertUser.id || "user-" + Date.now() + "-" + Math.random().toString(36).substr(2, 9);
    const results = await db.insert(users).values({
      ...insertUser,
      id: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return results[0];
  }
  
  async getUserByPhone(phone: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.phone, phone));
    return user;
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async updateEmailVerification(userId: string, token: string): Promise<void> {
    await db
      .update(users)
      .set({ emailVerificationToken: token, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async verifyEmail(token: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ 
        isEmailVerified: 1, 
        emailVerificationToken: null,
        updatedAt: new Date() 
      })
      .where(eq(users.emailVerificationToken, token))
      .returning();
    return user;
  }

  async updatePasswordReset(userId: string, token: string, expiry: Date): Promise<void> {
    await db
      .update(users)
      .set({ 
        passwordResetToken: token,
        passwordResetExpiry: expiry,
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId));
  }

  async resetPassword(token: string, newPassword: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ 
        password: newPassword,
        passwordResetToken: null,
        passwordResetExpiry: null,
        updatedAt: new Date() 
      })
      .where(eq(users.passwordResetToken, token))
      .returning();
    
    return user;
  }

  async updatePhoneVerification(userId: string, code: string, expiry: Date): Promise<void> {
    await db
      .update(users)
      .set({ 
        phoneVerificationCode: code,
        phoneVerificationExpiry: expiry,
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId));
  }

  async verifyPhone(phone: string, code: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(
      and(
        eq(users.phone, phone),
        eq(users.phoneVerificationCode, code)
      )
    );

    if (!user || !user.phoneVerificationExpiry || new Date() > user.phoneVerificationExpiry) {
      return undefined;
    }

    const [updatedUser] = await db
      .update(users)
      .set({ 
        isPhoneVerified: 1,
        phoneVerificationCode: null,
        phoneVerificationExpiry: null,
        updatedAt: new Date() 
      })
      .where(eq(users.id, user.id))
      .returning();

    return updatedUser;
  }

  async updateUserSubscription(userId: string, subscriptionData: {
    subscriptionType: string;
    subscriptionStatus: string;
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    subscriptionEndDate?: Date;
  }): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        ...subscriptionData,
        updatedAt: new Date() 
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
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
        subscriptionType: userData.subscriptionType || "free",
        subscriptionStatus: userData.subscriptionStatus || "inactive",
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          profileImageUrl: userData.profileImageUrl,
          subscriptionType: userData.subscriptionType || "free",
          subscriptionStatus: userData.subscriptionStatus || "inactive",
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

  // Advanced course management - Optimized version
  async getCourseWithDetails(courseId: number): Promise<any> {
    const course = await this.getCourse(courseId);
    if (!course) return null;

    // Get modules efficiently
    const modules = await db
      .select()
      .from(courseModules)
      .where(eq(courseModules.courseId, courseId))
      .orderBy(courseModules.orderIndex);

    if (modules.length === 0) {
      return { ...course, modules: [] };
    }

    // Get all lessons for all modules in one query using inArray
    const moduleIds = modules.map(m => m.id);
    const allLessons = await db
      .select()
      .from(lessons)
      .where(inArray(lessons.moduleId, moduleIds))
      .orderBy(lessons.order);

    // Get all quizzes for all lessons in one query using inArray
    const lessonIds = allLessons.map(l => l.id);
    const allQuizzes = lessonIds.length > 0 ? await db
      .select()
      .from(quizzes)
      .where(inArray(quizzes.lessonId, lessonIds)) : [];

    // Group lessons by module and quizzes by lesson
    const moduleMap = new Map();
    modules.forEach(module => {
      moduleMap.set(module.id, { ...module, lessons: [] });
    });

    const lessonMap = new Map();
    allLessons.forEach(lesson => {
      const lessonWithQuizzes = { ...lesson, quizzes: [] };
      lessonMap.set(lesson.id, lessonWithQuizzes);
      if (moduleMap.has(lesson.moduleId)) {
        moduleMap.get(lesson.moduleId).lessons.push(lessonWithQuizzes);
      }
    });

    allQuizzes.forEach(quiz => {
      if (lessonMap.has(quiz.lessonId)) {
        lessonMap.get(quiz.lessonId).quizzes.push(quiz);
      }
    });

    const courseWithModules = {
      ...course,
      modules: Array.from(moduleMap.values())
    };

    return courseWithModules;
  }

  async getCourseAnalytics(courseId: number): Promise<any> {
    // Get total students enrolled in the course
    const totalStudents = await db
      .select({ count: sql`count(*)` })
      .from(enrollments)
      .where(eq(enrollments.courseId, courseId));

    // Get completion statistics
    const completionStats = await db
      .select({ 
        completed: sql`count(*) filter (where status = 'completed')`,
        total: sql`count(*)`
      })
      .from(enrollments)
      .where(eq(enrollments.courseId, courseId));

    // Mock analytics data for demonstration
    return {
      totalStudents: totalStudents[0]?.count || 0,
      newStudentsThisMonth: Math.floor(Math.random() * 20) + 5,
      avgCompletionTime: Math.floor(Math.random() * 30) + 15,
      completionRate: completionStats[0]?.total > 0 
        ? Math.round((completionStats[0].completed / completionStats[0].total) * 100)
        : 0,
      avgQuizScore: Math.floor(Math.random() * 20) + 75
    };
  }

  async toggleCourseHighlight(courseId: number): Promise<Course> {
    const course = await this.getCourse(courseId);
    if (!course) throw new Error('Course not found');

    const [updatedCourse] = await db
      .update(courses)
      .set({ 
        isHighlighted: course.isHighlighted ? 0 : 1,
        updatedAt: new Date()
      })
      .where(eq(courses.id, courseId))
      .returning();

    return updatedCourse;
  }

  async getHighlightedCourses(): Promise<Course[]> {
    return await db
      .select()
      .from(courses)
      .where(eq(courses.isHighlighted, 1))
      .orderBy(courses.createdAt);
  }

  // Module and lesson operations
  async createCourseModule(moduleData: InsertCourseModule): Promise<CourseModule> {
    const [module] = await db
      .insert(courseModules)
      .values(moduleData)
      .returning();
    return module;
  }

  async createLesson(lessonData: InsertLesson): Promise<Lesson> {
    const [lesson] = await db
      .insert(lessons)
      .values(lessonData)
      .returning();
    return lesson;
  }

  async updateLesson(lessonId: number, lessonData: Partial<InsertLesson>): Promise<Lesson> {
    const [lesson] = await db
      .update(lessons)
      .set({ ...lessonData, updatedAt: new Date() })
      .where(eq(lessons.id, lessonId))
      .returning();
    return lesson;
  }

  async getLessonsByModule(moduleId: number): Promise<Lesson[]> {
    return await db
      .select()
      .from(lessons)
      .where(eq(lessons.moduleId, moduleId))
      .orderBy(lessons.order);
  }

  // Quiz operations
  async createQuiz(quizData: InsertQuiz): Promise<Quiz> {
    const [quiz] = await db
      .insert(quizzes)
      .values(quizData)
      .returning();
    return quiz;
  }

  async getQuiz(quizId: number): Promise<Quiz | undefined> {
    const [quiz] = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.id, quizId));
    return quiz;
  }

  async getQuizWithDetails(quizId: number): Promise<any> {
    const quiz = await this.getQuiz(quizId);
    if (!quiz) return null;

    const questions = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId))
      .orderBy(quizQuestions.order);

    const questionsWithOptions = await Promise.all(
      questions.map(async (question) => {
        const options = await db
          .select()
          .from(quizQuestionOptions)
          .where(eq(quizQuestionOptions.questionId, question.id))
          .orderBy(quizQuestionOptions.order);
        return { ...question, options };
      })
    );

    return { ...quiz, questions: questionsWithOptions };
  }

  async getQuizByLesson(lessonId: number): Promise<any> {
    const [quiz] = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.lessonId, lessonId));
    
    if (!quiz) return null;
    return this.getQuizWithDetails(quiz.id);
  }

  async createQuizQuestion(questionData: InsertQuizQuestion): Promise<QuizQuestion> {
    const [question] = await db
      .insert(quizQuestions)
      .values(questionData)
      .returning();
    return question;
  }

  async updateQuizQuestion(questionId: number, questionData: Partial<InsertQuizQuestion>): Promise<QuizQuestion> {
    const [question] = await db
      .update(quizQuestions)
      .set(questionData)
      .where(eq(quizQuestions.id, questionId))
      .returning();
    return question;
  }

  async deleteQuizQuestion(questionId: number): Promise<void> {
    await db.delete(quizQuestions).where(eq(quizQuestions.id, questionId));
  }

  async createQuizQuestionOption(optionData: InsertQuizQuestionOption): Promise<QuizQuestionOption> {
    const [option] = await db
      .insert(quizQuestionOptions)
      .values(optionData)
      .returning();
    return option;
  }

  async createQuizAttempt(attemptData: InsertQuizAttempt): Promise<QuizAttempt> {
    const [attempt] = await db
      .insert(quizAttempts)
      .values(attemptData)
      .returning();
    return attempt;
  }

  async getQuizAttempt(attemptId: number): Promise<QuizAttempt | undefined> {
    const [attempt] = await db
      .select()
      .from(quizAttempts)
      .where(eq(quizAttempts.id, attemptId));
    return attempt;
  }

  async getUserQuizAttempts(userId: string, quizId: number): Promise<QuizAttempt[]> {
    return await db
      .select()
      .from(quizAttempts)
      .where(
        and(
          eq(quizAttempts.userId, userId),
          eq(quizAttempts.quizId, quizId)
        )
      );
  }

  async getQuizMaxScore(quizId: number): Promise<number> {
    const result = await db
      .select({ totalPoints: sql<number>`sum(${quizQuestions.points})` })
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId));
    
    return result[0]?.totalPoints || 0;
  }

  async submitQuizAnswer(answerData: {
    attemptId: number;
    questionId: number;
    selectedOptionId?: number;
    textAnswer?: string;
  }): Promise<QuizAnswer> {
    // Get question details
    const question = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.id, answerData.questionId))
      .limit(1);

    if (!question.length) {
      throw new Error("Question not found");
    }

    let isCorrect = 0;
    let pointsEarned = 0;

    // Evaluate answer based on question type
    if (question[0].type === 'multiple_choice' && answerData.selectedOptionId) {
      const option = await db
        .select()
        .from(quizQuestionOptions)
        .where(eq(quizQuestionOptions.id, answerData.selectedOptionId))
        .limit(1);
      
      if (option.length && option[0].isCorrect) {
        isCorrect = 1;
        pointsEarned = question[0].points;
      }
    } else if (question[0].type === 'true_false' && answerData.selectedOptionId) {
      const option = await db
        .select()
        .from(quizQuestionOptions)
        .where(eq(quizQuestionOptions.id, answerData.selectedOptionId))
        .limit(1);
      
      if (option.length && option[0].isCorrect) {
        isCorrect = 1;
        pointsEarned = question[0].points;
      }
    } else if (question[0].type === 'fill_blank' && answerData.textAnswer) {
      // Get the correct answer from options
      const correctOption = await db
        .select()
        .from(quizQuestionOptions)
        .where(
          and(
            eq(quizQuestionOptions.questionId, answerData.questionId),
            eq(quizQuestionOptions.isCorrect, 1)
          )
        )
        .limit(1);

      if (correctOption.length) {
        const userAnswer = answerData.textAnswer.toLowerCase().trim();
        const correctAnswer = correctOption[0].optionText.toLowerCase().trim();
        
        // Flexible matching for fill-in-the-blank
        if (userAnswer === correctAnswer || userAnswer.includes(correctAnswer) || correctAnswer.includes(userAnswer)) {
          isCorrect = 1;
          pointsEarned = question[0].points;
        }
      }
    }

    const [answer] = await db
      .insert(quizAnswers)
      .values({
        ...answerData,
        isCorrect,
        pointsEarned
      })
      .returning();

    return answer;
  }

  async completeQuizAttempt(attemptId: number): Promise<QuizAttempt> {
    // Calculate total score
    const scoreResult = await db
      .select({ 
        totalScore: sql<number>`sum(${quizAnswers.pointsEarned})`,
        maxScore: sql<number>`sum(${quizQuestions.points})`
      })
      .from(quizAnswers)
      .innerJoin(quizQuestions, eq(quizAnswers.questionId, quizQuestions.id))
      .where(eq(quizAnswers.attemptId, attemptId));

    const totalScore = scoreResult[0]?.totalScore || 0;
    const maxScore = scoreResult[0]?.maxScore || 1;
    const percentageScore = Math.round((totalScore / maxScore) * 100);

    const [attempt] = await db
      .update(quizAttempts)
      .set({
        endTime: new Date(),
        totalScore,
        maxScore,
        percentageScore,
        status: "completed"
      })
      .where(eq(quizAttempts.id, attemptId))
      .returning();

    return attempt;
  }

  async getQuizAttemptResults(attemptId: number): Promise<any> {
    const attempt = await this.getQuizAttempt(attemptId);
    if (!attempt) return null;

    const answers = await db
      .select({
        questionId: quizAnswers.questionId,
        selectedOptionId: quizAnswers.selectedOptionId,
        textAnswer: quizAnswers.textAnswer,
        isCorrect: quizAnswers.isCorrect,
        pointsEarned: quizAnswers.pointsEarned,
        question: quizQuestions.question,
        questionType: quizQuestions.type,
        questionPoints: quizQuestions.points
      })
      .from(quizAnswers)
      .innerJoin(quizQuestions, eq(quizAnswers.questionId, quizQuestions.id))
      .where(eq(quizAnswers.attemptId, attemptId));

    return { ...attempt, answers };
  }

  async getUserQuizPerformance(userId: string): Promise<any> {
    const attempts = await db
      .select({
        quizId: quizAttempts.quizId,
        totalScore: quizAttempts.totalScore,
        maxScore: quizAttempts.maxScore,
        percentageScore: quizAttempts.percentageScore,
        completedAt: quizAttempts.endTime,
        quizTitle: quizzes.title
      })
      .from(quizAttempts)
      .innerJoin(quizzes, eq(quizAttempts.quizId, quizzes.id))
      .where(
        and(
          eq(quizAttempts.userId, userId),
          eq(quizAttempts.status, "completed")
        )
      )
      .orderBy(quizAttempts.endTime);

    const totalAttempts = attempts.length;
    const averageScore = totalAttempts > 0 
      ? attempts.reduce((sum, attempt) => sum + attempt.percentageScore, 0) / totalAttempts
      : 0;

    return {
      totalAttempts,
      averageScore: Math.round(averageScore),
      attempts
    };
  }

  async getQuizAnalytics(quizId: number): Promise<any> {
    const attempts = await db
      .select()
      .from(quizAttempts)
      .where(
        and(
          eq(quizAttempts.quizId, quizId),
          eq(quizAttempts.status, "completed")
        )
      );

    const totalAttempts = attempts.length;
    const averageScore = totalAttempts > 0
      ? attempts.reduce((sum, attempt) => sum + attempt.percentageScore, 0) / totalAttempts
      : 0;

    const passRate = totalAttempts > 0
      ? attempts.filter(attempt => attempt.percentageScore >= 70).length / totalAttempts * 100
      : 0;

    return {
      totalAttempts,
      averageScore: Math.round(averageScore),
      passRate: Math.round(passRate),
      attempts
    };
  }

  async isUserAdmin(userId: string): Promise<boolean> {
    const [user] = await db
      .select({ isAdmin: users.isAdmin })
      .from(users)
      .where(eq(users.id, userId));
    
    return user?.isAdmin === 1;
  }

  // Course Module operations
  async getCourseModules(courseId: number): Promise<CourseModule[]> {
    // Get all modules for the course
    const modules = await db
      .select()
      .from(courseModules)
      .where(eq(courseModules.courseId, courseId))
      .orderBy(courseModules.orderIndex);

    // Get all lessons for all modules in this course
    const allLessons = await db
      .select()
      .from(lessons)
      .innerJoin(courseModules, eq(lessons.moduleId, courseModules.id))
      .where(eq(courseModules.courseId, courseId))
      .orderBy(lessons.order);

    // Group lessons by module
    const moduleMap = new Map();
    
    // Initialize modules with empty lesson arrays
    modules.forEach(module => {
      moduleMap.set(module.id, {
        ...module,
        lessons: []
      });
    });

    // Add lessons to their respective modules
    allLessons.forEach(result => {
      const lesson = result.lessons;
      const moduleId = lesson.moduleId;
      if (moduleMap.has(moduleId)) {
        moduleMap.get(moduleId).lessons.push(lesson);
      }
    });

    return Array.from(moduleMap.values());
  }

  async updateCourseModule(moduleId: number, moduleData: Partial<InsertCourseModule>): Promise<CourseModule> {
    const [module] = await db
      .update(courseModules)
      .set(moduleData)
      .where(eq(courseModules.id, moduleId))
      .returning();
    return module;
  }

  async updateCourseModule(moduleId: number, moduleData: Partial<InsertCourseModule>): Promise<CourseModule> {
    const [module] = await db
      .update(courseModules)
      .set(moduleData)
      .where(eq(courseModules.id, moduleId))
      .returning();
    return module;
  }

  async deleteCourseModule(moduleId: number): Promise<void> {
    // First delete all lessons in the module (cascade will handle quizzes)
    await db.delete(lessons).where(eq(lessons.moduleId, moduleId));
    // Then delete the module
    await db.delete(courseModules).where(eq(courseModules.id, moduleId));
  }

  // Lesson operations
  async createLesson(lessonData: InsertLesson): Promise<Lesson> {
    const [lesson] = await db
      .insert(lessons)
      .values(lessonData)
      .returning();
    return lesson;
  }

  async getLessons(moduleId: number): Promise<Lesson[]> {
    return await db
      .select()
      .from(lessons)
      .where(eq(lessons.moduleId, moduleId))
      .orderBy(lessons.order);
  }

  async getLessonsByModule(moduleId: number): Promise<Lesson[]> {
    return await db
      .select()
      .from(lessons)
      .where(eq(lessons.moduleId, moduleId))
      .orderBy(lessons.order);
  }

  async getLesson(lessonId: number): Promise<Lesson | undefined> {
    const [lesson] = await db
      .select()
      .from(lessons)
      .where(eq(lessons.id, lessonId));
    return lesson;
  }

  async updateLesson(lessonId: number, lessonData: Partial<InsertLesson>): Promise<Lesson> {
    const [lesson] = await db
      .update(lessons)
      .set(lessonData)
      .where(eq(lessons.id, lessonId))
      .returning();
    return lesson;
  }

  async deleteLesson(lessonId: number): Promise<void> {
    await db.delete(lessons).where(eq(lessons.id, lessonId));
  }

  // Quiz operations
  async getQuizzes(lessonId: number): Promise<Quiz[]> {
    return await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.lessonId, lessonId));
  }

  async updateQuiz(quizId: number, quizData: Partial<InsertQuiz>): Promise<Quiz> {
    const [quiz] = await db
      .update(quizzes)
      .set(quizData)
      .where(eq(quizzes.id, quizId))
      .returning();
    return quiz;
  }

  async deleteQuiz(quizId: number): Promise<void> {
    await db.delete(quizzes).where(eq(quizzes.id, quizId));
  }

  // Quiz Question operations
  async createQuizQuestion(questionData: InsertQuizQuestion): Promise<QuizQuestion> {
    const [question] = await db
      .insert(quizQuestions)
      .values(questionData)
      .returning();
    return question;
  }

  async getQuizQuestions(quizId: number): Promise<QuizQuestion[]> {
    return await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId))
      .orderBy(quizQuestions.orderIndex);
  }

  async updateQuizQuestion(questionId: number, questionData: Partial<InsertQuizQuestion>): Promise<QuizQuestion> {
    const [question] = await db
      .update(quizQuestions)
      .set(questionData)
      .where(eq(quizQuestions.id, questionId))
      .returning();
    return question;
  }

  async deleteQuizQuestion(questionId: number): Promise<void> {
    await db.delete(quizQuestions).where(eq(quizQuestions.id, questionId));
  }

  // Quiz Answer operations
  async createQuizAnswer(answerData: InsertQuizAnswer): Promise<QuizAnswer> {
    const [answer] = await db
      .insert(quizAnswers)
      .values(answerData)
      .returning();
    return answer;
  }

  async getQuizAnswers(questionId: number): Promise<QuizAnswer[]> {
    return await db
      .select()
      .from(quizAnswers)
      .where(eq(quizAnswers.questionId, questionId))
      .orderBy(quizAnswers.orderIndex);
  }

  async updateQuizAnswer(answerId: number, answerData: Partial<InsertQuizAnswer>): Promise<QuizAnswer> {
    const [answer] = await db
      .update(quizAnswers)
      .set(answerData)
      .where(eq(quizAnswers.id, answerId))
      .returning();
    return answer;
  }

  async deleteQuizAnswer(answerId: number): Promise<void> {
    await db.delete(quizAnswers).where(eq(quizAnswers.id, answerId));
  }

  // Course Resource operations
  async createCourseResource(resourceData: InsertCourseResource): Promise<CourseResource> {
    const [resource] = await db
      .insert(courseResources)
      .values(resourceData)
      .returning();
    return resource;
  }

  async getCourseResources(courseId: number): Promise<CourseResource[]> {
    return await db
      .select()
      .from(courseResources)
      .where(eq(courseResources.courseId, courseId));
  }

  async updateCourseResource(resourceId: number, resourceData: Partial<InsertCourseResource>): Promise<CourseResource> {
    const [resource] = await db
      .update(courseResources)
      .set(resourceData)
      .where(eq(courseResources.id, resourceId))
      .returning();
    return resource;
  }

  async deleteCourseResource(resourceId: number): Promise<void> {
    await db.delete(courseResources).where(eq(courseResources.id, resourceId));
  }

  // LMS Progress tracking
  async markLessonComplete(userId: string, lessonId: number): Promise<LessonCompletion> {
    const [completion] = await db
      .insert(lessonCompletions)
      .values({ userId, lessonId })
      .returning();
    return completion;
  }

  async getLessonProgress(userId: string, courseId: number): Promise<LessonCompletion[]> {
    return await db
      .select()
      .from(lessonCompletions)
      .innerJoin(lessons, eq(lessonCompletions.lessonId, lessons.id))
      .innerJoin(courseModules, eq(lessons.moduleId, courseModules.id))
      .where(and(
        eq(lessonCompletions.userId, userId),
        eq(courseModules.courseId, courseId)
      ));
  }

  // Get course with full structure for LMS
  async getCourseWithFullStructure(courseId: number): Promise<any> {
    const course = await this.getCourse(courseId);
    if (!course) return null;

    const modules = await this.getCourseModules(courseId);
    const courseResources = await this.getCourseResources(courseId);

    const modulesWithContent = await Promise.all(
      modules.map(async (module) => {
        const lessons = await this.getLessons(module.id);
        const lessonsWithQuizzes = await Promise.all(
          lessons.map(async (lesson) => {
            const quizzes = await this.getQuizzes(lesson.id);
            const quizzesWithQuestions = await Promise.all(
              quizzes.map(async (quiz) => {
                const questions = await this.getQuizQuestions(quiz.id);
                const questionsWithAnswers = await Promise.all(
                  questions.map(async (question) => {
                    const answers = await this.getQuizAnswers(question.id);
                    return { ...question, answers };
                  })
                );
                return { ...quiz, questions: questionsWithAnswers };
              })
            );
            return { ...lesson, quizzes: quizzesWithQuizzes };
          })
        );
        return { ...module, lessons: lessonsWithQuizzes };
      })
    );

    return {
      ...course,
      modules: modulesWithContent,
      resources: courseResources
    };
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

  // Quiz Management Methods
  async createQuiz(quizData: InsertQuiz): Promise<Quiz> {
    const [quiz] = await db
      .insert(quizzes)
      .values(quizData)
      .returning();
    return quiz;
  }

  async getQuiz(quizId: number): Promise<Quiz | undefined> {
    const [quiz] = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.id, quizId));
    return quiz;
  }

  async getQuizWithQuestions(quizId: number): Promise<any> {
    const quiz = await this.getQuiz(quizId);
    if (!quiz) return null;

    const questions = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId))
      .orderBy(quizQuestions.order);

    const questionsWithOptions = await Promise.all(
      questions.map(async (question) => {
        const options = await db
          .select()
          .from(quizQuestionOptions)
          .where(eq(quizQuestionOptions.questionId, question.id))
          .orderBy(quizQuestionOptions.order);
        return { ...question, options };
      })
    );

    return { ...quiz, questions: questionsWithOptions };
  }

  async updateQuiz(quizId: number, quizData: Partial<InsertQuiz>): Promise<Quiz> {
    const [quiz] = await db
      .update(quizzes)
      .set(quizData)
      .where(eq(quizzes.id, quizId))
      .returning();
    return quiz;
  }

  async deleteQuiz(quizId: number): Promise<void> {
    await db.delete(quizzes).where(eq(quizzes.id, quizId));
  }

  async getQuizzesByLesson(lessonId: number): Promise<Quiz[]> {
    return await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.lessonId, lessonId));
  }

  // Quiz Questions
  async createQuizQuestion(questionData: InsertQuizQuestion): Promise<QuizQuestion> {
    const [question] = await db
      .insert(quizQuestions)
      .values(questionData)
      .returning();
    return question;
  }

  async updateQuizQuestion(questionId: number, questionData: Partial<InsertQuizQuestion>): Promise<QuizQuestion> {
    const [question] = await db
      .update(quizQuestions)
      .set(questionData)
      .where(eq(quizQuestions.id, questionId))
      .returning();
    return question;
  }

  async deleteQuizQuestion(questionId: number): Promise<void> {
    await db.delete(quizQuestions).where(eq(quizQuestions.id, questionId));
  }

  // Quiz Question Options
  async createQuizQuestionOption(optionData: InsertQuizQuestionOption): Promise<QuizQuestionOption> {
    const [option] = await db
      .insert(quizQuestionOptions)
      .values(optionData)
      .returning();
    return option;
  }

  async updateQuizQuestionOption(optionId: number, optionData: Partial<InsertQuizQuestionOption>): Promise<QuizQuestionOption> {
    const [option] = await db
      .update(quizQuestionOptions)
      .set(optionData)
      .where(eq(quizQuestionOptions.id, optionId))
      .returning();
    return option;
  }

  async deleteQuizQuestionOption(optionId: number): Promise<void> {
    await db.delete(quizQuestionOptions).where(eq(quizQuestionOptions.id, optionId));
  }

  // Quiz Attempts and Answers
  async createQuizAttempt(attemptData: InsertQuizAttempt): Promise<QuizAttempt> {
    const [attempt] = await db
      .insert(quizAttempts)
      .values(attemptData)
      .returning();
    return attempt;
  }

  async getQuizAttempt(attemptId: number): Promise<QuizAttempt | undefined> {
    const [attempt] = await db
      .select()
      .from(quizAttempts)
      .where(eq(quizAttempts.id, attemptId));
    return attempt;
  }

  async updateQuizAttempt(attemptId: number, attemptData: Partial<InsertQuizAttempt>): Promise<QuizAttempt> {
    const [attempt] = await db
      .update(quizAttempts)
      .set(attemptData)
      .where(eq(quizAttempts.id, attemptId))
      .returning();
    return attempt;
  }

  async getUserQuizAttempts(userId: string, quizId: number): Promise<QuizAttempt[]> {
    return await db
      .select()
      .from(quizAttempts)
      .where(and(
        eq(quizAttempts.userId, userId),
        eq(quizAttempts.quizId, quizId)
      ))
      .orderBy(desc(quizAttempts.createdAt));
  }

  async createQuizAnswer(answerData: InsertQuizAnswer): Promise<QuizAnswer> {
    const [answer] = await db
      .insert(quizAnswers)
      .values(answerData)
      .returning();
    return answer;
  }

  async getQuizAttemptAnswers(attemptId: number): Promise<QuizAnswer[]> {
    return await db
      .select()
      .from(quizAnswers)
      .where(eq(quizAnswers.attemptId, attemptId));
  }

  // Quiz Analytics
  async getQuizAnalytics(quizId: number): Promise<any> {
    const totalAttempts = await db
      .select({ count: sql<number>`count(*)` })
      .from(quizAttempts)
      .where(eq(quizAttempts.quizId, quizId));

    const completedAttempts = await db
      .select({ count: sql<number>`count(*)` })
      .from(quizAttempts)
      .where(and(
        eq(quizAttempts.quizId, quizId),
        eq(quizAttempts.status, 'completed')
      ));

    const averageScore = await db
      .select({ avg: sql<number>`avg(percentage_score)` })
      .from(quizAttempts)
      .where(and(
        eq(quizAttempts.quizId, quizId),
        eq(quizAttempts.status, 'completed')
      ));

    return {
      totalAttempts: totalAttempts[0]?.count || 0,
      completedAttempts: completedAttempts[0]?.count || 0,
      averageScore: averageScore[0]?.avg || 0,
      completionRate: totalAttempts[0]?.count > 0 
        ? ((completedAttempts[0]?.count || 0) / (totalAttempts[0]?.count || 1)) * 100 
        : 0
    };
  }

  async getUserQuizPerformance(userId: string): Promise<any> {
    const userAttempts = await db
      .select()
      .from(quizAttempts)
      .where(and(
        eq(quizAttempts.userId, userId),
        eq(quizAttempts.status, 'completed')
      ))
      .orderBy(desc(quizAttempts.createdAt));

    const totalQuizzes = userAttempts.length;
    const averageScore = totalQuizzes > 0 
      ? userAttempts.reduce((sum, attempt) => sum + (attempt.percentageScore || 0), 0) / totalQuizzes
      : 0;

    const passedQuizzes = userAttempts.filter(attempt => (attempt.percentageScore || 0) >= 70).length;

    return {
      totalQuizzes,
      averageScore,
      passedQuizzes,
      passRate: totalQuizzes > 0 ? (passedQuizzes / totalQuizzes) * 100 : 0,
      recentAttempts: userAttempts.slice(0, 10)
    };
  }
}

// Create database storage instance
// Add subscription methods to DatabaseStorage prototype
DatabaseStorage.prototype.updateUserSubscription = async function(userId: string, subscriptionData: {
  subscriptionType?: string;
  subscriptionStatus?: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  subscriptionEndDate?: Date | null;
}): Promise<User> {
  const [user] = await db
    .update(users)
    .set(subscriptionData)
    .where(eq(users.id, userId))
    .returning();
  return user;
};

DatabaseStorage.prototype.getUserByEmail = async function(email: string): Promise<User | undefined> {
  const results = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return results.length > 0 ? results[0] : undefined;
};

export const storage = new DatabaseStorage();

// Initialize database with sample data
storage.initializeData().catch(err => {
  console.error("Failed to initialize database with sample data:", err);
});
