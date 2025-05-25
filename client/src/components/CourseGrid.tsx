import React, { useState } from 'react';
import { courses } from '@/data/courses';
import MobileResponsiveCourseCard from './MobileResponsiveCourseCard';
import CoursePreviewModal from './CoursePreviewModal';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

interface CourseGridProps {
  title?: string;
  subtitle?: string;
  courses?: typeof courses;
  limit?: number;
  showViewAll?: boolean;
  variant?: 'compact' | 'standard' | 'featured';
  categories?: string[];
}

const CourseGrid: React.FC<CourseGridProps> = ({
  title,
  subtitle,
  courses: propCourses,
  limit = 6,
  showViewAll = true,
  variant = 'standard',
  categories = []
}) => {
  const isMobile = useIsMobile();
  const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Use provided courses or fallback to imported courses
  const allCourses = propCourses || courses;
  
  // Filter courses by category if selected
  const filteredCourses = selectedCategory 
    ? allCourses.filter(course => course.category === selectedCategory) 
    : allCourses;
  
  // Limit the number of courses shown
  const displayedCourses = filteredCourses.slice(0, limit);
  
  // Get unique categories from courses for filtering
  const uniqueCategories = categories.length > 0 
    ? categories 
    : [...allCourses.map(course => course.category).filter((category, index, self) => 
        self.indexOf(category) === index)];
  
  const openPreview = (course: any) => {
    setSelectedCourse(course);
    setIsPreviewOpen(true);
  };
  
  const closePreview = () => {
    setIsPreviewOpen(false);
  };

  return (
    <div className="w-full">
      {/* Header with title and category filters */}
      {(title || subtitle || uniqueCategories.length > 0) && (
        <div className="mb-8">
          {title && (
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-neutral-900">{title}</h2>
          )}
          
          {subtitle && (
            <p className="text-neutral-600 mb-4">{subtitle}</p>
          )}
          
          {/* Category filters */}
          {uniqueCategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={selectedCategory === null ? "bg-primary text-white" : ""}
              >
                Összes
              </Button>
              
              {uniqueCategories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-primary text-white" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Course grid */}
      <div className={`grid grid-cols-1 ${
        variant === 'compact' 
          ? 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
          : 'md:grid-cols-2 lg:grid-cols-3'
      } gap-6 mb-8`}>
        {displayedCourses.map((course) => (
          <MobileResponsiveCourseCard
            key={course.id}
            course={course}
            onPreview={() => openPreview(course)}
            variant={variant}
          />
        ))}
      </div>
      
      {/* View all button */}
      {showViewAll && (
        <div className="flex justify-center mt-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="default" 
              className="bg-primary hover:bg-primary/90 text-white"
            >
              {isMobile ? "Továbbiak" : "További kurzusok megtekintése"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      )}
      
      {/* Course Preview Modal */}
      {selectedCourse && (
        <CoursePreviewModal
          isOpen={isPreviewOpen}
          onClose={closePreview}
          course={selectedCourse}
        />
      )}
    </div>
  );
};

export default CourseGrid;