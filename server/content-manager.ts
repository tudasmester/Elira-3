import { storage } from './storage';
import { Course, InsertCourse } from '@shared/schema';

/**
 * Content Manager - Single Source of Truth
 * All course content originates here and flows to frontend pages
 */
export class ContentManager {
  
  /**
   * Get all published courses for frontend consumption
   */
  async getPublishedCourses(): Promise<Course[]> {
    const courses = await storage.getAllCourses();
    return courses.filter(course => course.isPublished === 1);
  }

  /**
   * Get trending/featured courses (highlighted in admin)
   */
  async getTrendingCourses(): Promise<Course[]> {
    return await storage.getHighlightedCourses();
  }

  /**
   * Get courses by category for specific pages
   */
  async getCoursesByPage(page: 'courses' | 'trending' | 'careers'): Promise<Course[]> {
    const allCourses = await this.getPublishedCourses();
    
    switch (page) {
      case 'courses':
        // Main courses page shows all published courses
        return allCourses;
        
      case 'trending':
        // Trending page shows only highlighted courses
        return await this.getTrendingCourses();
        
      case 'careers':
        // Career page shows career-focused categories
        return allCourses.filter(course => 
          ['Design', 'Marketing', 'Mesterséges Intelligencia', 'UX/UI'].includes(course.category)
        );
        
      default:
        return allCourses;
    }
  }

  /**
   * Create initial admin courses (one-time setup)
   */
  async initializeAdminCourses(): Promise<{ success: boolean; imported: number }> {
    try {
      const existingCourses = await storage.getAllCourses();
      
      // Only initialize if we have less than 5 courses
      if (existingCourses.length >= 5) {
        return { success: true, imported: 0 };
      }

      const initialCourses: InsertCourse[] = [
        {
          title: "Adattudomány és Machine Learning",
          description: "Komprehenzív kurzus az adattudomány és gépi tanulás területén. Tanulj meg Python-t használni adatelemzésre, építs prediktív modelleket és dolgozz valós adatokkal.",
          shortDescription: "Adatelemzés és ML algoritmusok mesterkurzus",
          imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
          universityId: 1,
          isFree: 0,
          price: 89900,
          level: "Haladó",
          category: "Adattudomány",
          duration: "20 hét",
          language: "Magyar",
          prerequisites: "Matematikai alapok, Python alapismeretek",
          learningOutcomes: "Adatelemzési technikák, Machine Learning algoritmusok, Deep Learning alapok, Valós projektek",
          instructorName: "Dr. Nagy Péter",
          isPublished: 1
        },
        {
          title: "Full-Stack Webfejlesztés",
          description: "Modern webalkalmazások fejlesztése React és Node.js technológiákkal. A kurzus során teljes körű webfejlesztői tudást szerezhetsz.",
          shortDescription: "Teljes körű webfejlesztői képzés",
          imageUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800",
          universityId: 2,
          isFree: 0,
          price: 69900,
          level: "Középhaladó",
          category: "Webfejlesztés",
          duration: "16 hét",
          language: "Magyar",
          prerequisites: "HTML/CSS alapok, JavaScript ismeretek",
          learningOutcomes: "React frontend fejlesztés, Node.js backend, API tervezés, Adatbázis kezelés",
          instructorName: "Kovács Anna",
          isPublished: 1
        },
        {
          title: "UX/UI Design Specializáció",
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
          prerequisites: "Alapszintű számítógépes ismeretek",
          learningOutcomes: "Figma használata, User research módszerek, Wireframing és prototyping, Usability testing",
          instructorName: "Kiss Mónika",
          isPublished: 1
        },
        {
          title: "Digital Marketing Stratégia",
          description: "Mesterd el a digitális marketing minden területét. Social media marketing, SEO optimalizálás, Google Ads kampányok és analytics.",
          shortDescription: "Teljes körű digitális marketing képzés",
          imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
          universityId: 3,
          isFree: 0,
          price: 49900,
          level: "Kezdő",
          category: "Marketing",
          duration: "12 hét",
          language: "Magyar",
          prerequisites: "Alapszintű számítógépes ismeretek",
          learningOutcomes: "SEO stratégiák, PPC kampányok, Social media marketing, Analytics elemzés",
          instructorName: "Szabó Eszter",
          isPublished: 1
        },
        {
          title: "Mesterséges Intelligencia Alapok",
          description: "Bevezetés az AI világába. Neurális hálózatok, természetes nyelvfeldolgozás és számítógépes látás alkalmazások.",
          shortDescription: "AI és gépi tanulás gyakorlati alkalmazásokkal",
          imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800",
          universityId: 3,
          isFree: 1,
          price: 0,
          level: "Középhaladó",
          category: "Mesterséges Intelligencia",
          duration: "16 hét",
          language: "Magyar",
          prerequisites: "Python programozás, Matematikai alapok",
          learningOutcomes: "TensorFlow használata, NLP alkalmazások, Computer Vision, Chatbot fejlesztés",
          instructorName: "Dr. Balogh Éva",
          isPublished: 1
        }
      ];

      let importedCount = 0;
      for (const courseData of initialCourses) {
        try {
          await storage.createCourse(courseData);
          importedCount++;
        } catch (error) {
          console.error('Error creating course:', courseData.title, error);
        }
      }

      // Set first 2 courses as highlighted for trending
      const courses = await storage.getAllCourses();
      if (courses.length >= 2) {
        await storage.toggleCourseHighlight(courses[0].id);
        await storage.toggleCourseHighlight(courses[1].id);
      }

      return { success: true, imported: importedCount };
    } catch (error) {
      console.error('Error initializing admin courses:', error);
      return { success: false, imported: 0 };
    }
  }

  /**
   * Get course statistics for admin dashboard
   */
  async getContentStats() {
    const courses = await storage.getAllCourses();
    const published = courses.filter(c => c.isPublished === 1);
    const trending = await storage.getHighlightedCourses();
    
    return {
      totalCourses: courses.length,
      publishedCourses: published.length,
      trendingCourses: trending.length,
      freeCourses: published.filter(c => c.isFree === 1).length,
      paidCourses: published.filter(c => c.isFree === 0).length
    };
  }
}

export const contentManager = new ContentManager();