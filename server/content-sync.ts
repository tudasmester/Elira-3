import { storage } from './storage';
import type { InsertCourse } from '@shared/schema';

// Content synchronization system for importing and managing course data
export class ContentSyncService {
  
  // Import courses from existing frontend data structures
  async importCoursesFromFrontend(): Promise<void> {
    try {
      console.log('Starting course import from frontend...');
      
      // Get all existing courses from database
      const existingCourses = await storage.getAllCourses();
      const existingTitles = existingCourses.map(c => c.title);
      
      // Import additional sample courses that match your frontend structure
      const frontendCourses = this.getFrontendCourseData();
      
      for (const courseData of frontendCourses) {
        // Skip if course already exists
        if (existingTitles.includes(courseData.title)) {
          continue;
        }
        
        try {
          await storage.createCourse(courseData);
          console.log(`Imported course: ${courseData.title}`);
        } catch (error) {
          console.error(`Failed to import course ${courseData.title}:`, error);
        }
      }
      
      console.log('Course import completed successfully');
    } catch (error) {
      console.error('Error during course import:', error);
      throw error;
    }
  }
  
  // Get course data that matches your frontend structure
  private getFrontendCourseData(): InsertCourse[] {
    return [
      // Trending/Popular courses
      {
        title: "Full-Stack JavaScript fejlesztés",
        description: "Tanulj meg modern webalkalmazásokat fejleszteni JavaScript technológiákkal. A kurzus során megismered a React, Node.js és MongoDB használatát.",
        shortDescription: "Modern webalkalmazás fejlesztés JavaScript stack-kel",
        imageUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800",
        universityId: 1,
        isFree: 0,
        price: 59900,
        level: "Középhaladó",
        category: "Informatika",
        duration: "16 hét",
        language: "Magyar",
        prerequisites: ["Alapszintű HTML/CSS ismeretek", "JavaScript alapok"],
        learningOutcomes: ["React alkalmazások fejlesztése", "Node.js backend építés", "MongoDB adatbázis kezelés", "RESTful API tervezés"],
        instructorName: "Tóth László",
        isPublished: 1
      },
      
      // Career-focused courses
      {
        title: "UX/UI Design alapok",
        description: "Ismerd meg a felhasználó-központú tervezés elveit és módszereit. Tanulj meg Figma-t használni és készíts professzionális design-okat.",
        shortDescription: "Felhasználói élmény és interface tervezés",
        imageUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800",
        universityId: 2,
        isFree: 1,
        price: 0,
        level: "Kezdő",
        category: "Design",
        duration: "8 hét",
        language: "Magyar",
        prerequisites: ["Alapszintű számítógép-használat", "Kreativitás és nyitottság"],
        learningOutcomes: ["User research módszerek", "Wireframe és prototype készítés", "Figma használata", "Design system létrehozása"],
        instructorName: "Nagy Petra",
        isPublished: 1
      },
      
      {
        title: "Kiberbiztonsági szakértő",
        description: "Válj kiberbiztonsági szakértővé! Tanulj meg hálózati biztonsági megoldásokat tervezni és implementálni vállalati környezetben.",
        shortDescription: "Átfogó kiberbiztonsági képzés",
        imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800",
        universityId: 1,
        isFree: 0,
        price: 89900,
        level: "Haladó",
        category: "Kiberbiztonsság",
        duration: "20 hét",
        language: "Magyar",
        prerequisites: ["Hálózati ismeretek", "Linux alapok", "Programozási tapasztalat"],
        learningOutcomes: ["Penetrációs tesztelés", "Biztonsági audit", "Incident response", "Compliance és szabályozás"],
        instructorName: "Dr. Varga Zoltán",
        isPublished: 1
      },
      
      // Business/Management courses
      {
        title: "Agilis projektmenedzsment",
        description: "Sajátítsd el az agilis módszertanokat és vezess sikeresen IT projekteket. Scrum Master és Product Owner szerepek megismerése.",
        shortDescription: "Modern projektvezetési módszerek",
        imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
        universityId: 3,
        isFree: 0,
        price: 45900,
        level: "Középhaladó",
        category: "Menedzsment",
        duration: "10 hét",
        language: "Magyar",
        prerequisites: ["Csapatmunkában való tapasztalat", "Alapszintű projektmenedzsment ismeretek"],
        learningOutcomes: ["Scrum framework", "Kanban módszertan", "Stakeholder management", "Agilis eszközök használata"],
        instructorName: "Molnár Andrea",
        isPublished: 1
      },
      
      // Free trending course
      {
        title: "Python programozás kezdőknek",
        description: "Kezdj el programozni Pythonnal! Ez a teljesen ingyenes kurzus megtanítja a programozás alapjait és a Python nyelv használatát.",
        shortDescription: "Ingyenes Python programozási alapok",
        imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800",
        universityId: 2,
        isFree: 1,
        price: 0,
        level: "Kezdő",
        category: "Informatika",
        duration: "6 hét",
        language: "Magyar",
        prerequisites: ["Alapszintű számítógép-használat"],
        learningOutcomes: ["Python szintaxis", "Változók és adattípusok", "Ciklusok és feltételek", "Függvények írása"],
        instructorName: "Kiss Tamás",
        isPublished: 1
      },
      
      // Advanced career course
      {
        title: "Machine Learning és AI",
        description: "Tanuld meg a gépi tanulás algoritmusait és építs saját AI modelleket. Gyakorlati projektek valós adatokkal.",
        shortDescription: "Mesterséges intelligencia és gépi tanulás",
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
        universityId: 1,
        isFree: 0,
        price: 99900,
        level: "Haladó",
        category: "Informatika",
        duration: "24 hét",
        language: "Magyar",
        prerequisites: ["Python programozás", "Matematikai alapok", "Statisztikai ismeretek"],
        learningOutcomes: ["Supervised learning", "Deep learning alapok", "Neural networks", "Model deployment"],
        instructorName: "Dr. Szabó Márton",
        isPublished: 1
      }
    ];
  }
  
  // Sync course visibility and trending status
  async syncCourseVisibility(): Promise<void> {
    try {
      const courses = await storage.getAllCourses();
      
      for (const course of courses) {
        // Mark popular courses as highlighted based on criteria
        const shouldHighlight = this.shouldCourseBeHighlighted(course);
        
        if (course.isHighlighted !== (shouldHighlight ? 1 : 0)) {
          await storage.toggleCourseHighlight(course.id);
        }
      }
      
      console.log('Course visibility sync completed');
    } catch (error) {
      console.error('Error syncing course visibility:', error);
    }
  }
  
  // Determine if a course should be highlighted/trending
  private shouldCourseBeHighlighted(course: any): boolean {
    // Logic for determining trending courses
    const trendingKeywords = ['JavaScript', 'Python', 'Machine Learning', 'UX/UI', 'Full-Stack'];
    const isTrending = trendingKeywords.some(keyword => 
      course.title.includes(keyword) || course.category === 'Informatika'
    );
    
    return isTrending || course.isFree === 1;
  }
  
  // Export course data for frontend consumption
  async exportCoursesForFrontend(): Promise<{
    courses: any[];
    trending: any[];
    careers: any[];
  }> {
    try {
      const allCourses = await storage.getAllCourses();
      const highlightedCourses = await storage.getHighlightedCourses();
      
      return {
        courses: allCourses,
        trending: highlightedCourses,
        careers: allCourses.filter(course => 
          course.category === 'Menedzsment' || 
          course.category === 'Design' ||
          course.category === 'Kiberbiztonsság'
        )
      };
    } catch (error) {
      console.error('Error exporting courses for frontend:', error);
      throw error;
    }
  }
  
  // Validate course data integrity
  async validateCourseData(): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    const errors: string[] = [];
    
    try {
      const courses = await storage.getAllCourses();
      
      for (const course of courses) {
        // Validate required fields
        if (!course.title || course.title.trim().length === 0) {
          errors.push(`Course ID ${course.id}: Missing title`);
        }
        
        if (!course.description || course.description.trim().length === 0) {
          errors.push(`Course ID ${course.id}: Missing description`);
        }
        
        if (!course.instructorName || course.instructorName.trim().length === 0) {
          errors.push(`Course ID ${course.id}: Missing instructor name`);
        }
        
        // Validate price consistency
        if (course.isFree === 1 && course.price > 0) {
          errors.push(`Course ID ${course.id}: Free course has non-zero price`);
        }
        
        if (course.isFree === 0 && course.price <= 0) {
          errors.push(`Course ID ${course.id}: Paid course has zero or negative price`);
        }
      }
      
      return {
        valid: errors.length === 0,
        errors
      };
    } catch (error) {
      return {
        valid: false,
        errors: [`Validation failed: ${error.message}`]
      };
    }
  }
}

export const contentSync = new ContentSyncService();