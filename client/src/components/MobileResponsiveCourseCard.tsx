import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Eye, Star, Clock, Users } from 'lucide-react';
import { Link } from 'wouter';
import { useIsMobile } from '@/hooks/use-mobile';

interface CourseCardProps {
  course: {
    id: number;
    title: string;
    description: string;
    imageUrl?: string;
    image?: string; // Some components use imageUrl, others use image
    category: string;
    level: string;
    isFree: boolean;
    university: string;
    universityLogo: string;
    price?: number;
    duration?: string;
    type?: string;
  };
  onPreview: (course: CourseCardProps['course']) => void;
  variant?: 'compact' | 'standard' | 'featured';
}

const MobileResponsiveCourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  onPreview, 
  variant = 'standard' 
}) => {
  const isMobile = useIsMobile();
  
  // Use whichever image property is available
  const imageSource = course.imageUrl || course.image;
  
  // Adjust card styles based on variant and mobile/desktop
  const getCardClasses = () => {
    const baseClasses = "bg-white rounded-xl overflow-hidden transition-all duration-300 h-full flex flex-col";
    
    if (variant === 'compact') {
      return `${baseClasses} border border-neutral-200 hover:shadow-md`;
    } else if (variant === 'featured') {
      return `${baseClasses} shadow-md hover:shadow-xl`;
    } else {
      return `${baseClasses} shadow-sm hover:shadow-md border border-neutral-100`;
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className={getCardClasses()}
    >
      <div className="relative">
        <img 
          src={imageSource} 
          alt={course.title} 
          className={`w-full object-cover ${variant === 'compact' ? 'h-40' : 'h-48'}`}
        />
        
        {/* Course type/category badge */}
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-primary text-white">
            {course.category}
          </Badge>
        </div>
        
        {/* Free badge if applicable */}
        {course.isFree && (
          <Badge className="absolute top-3 right-3 z-10 bg-green-600 text-white">
            Ingyenes
          </Badge>
        )}
        
        {/* Preview button */}
        <Button 
          size="sm" 
          variant="secondary" 
          className="absolute bottom-3 right-3 z-10 bg-white/90 hover:bg-white text-primary shadow-md"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onPreview(course);
          }}
        >
          <Eye className="h-4 w-4 mr-1" />
          {!isMobile && variant !== 'compact' && "Előnézet"}
        </Button>
      </div>
      
      <div className="p-4 flex-grow flex flex-col">
        {/* University logo and name */}
        <div className="flex items-center mb-2">
          <img 
            src={course.universityLogo} 
            alt={course.university}
            className="w-6 h-6 rounded-full object-contain mr-2 bg-white p-0.5 border border-neutral-200"
          />
          <span className="text-xs text-neutral-500 truncate">{course.university}</span>
        </div>
        
        {/* Course title */}
        <Link href={`/courses/${course.id}`} className="no-underline">
          <h3 className={`font-semibold text-neutral-800 mb-3 hover:text-primary transition-colors ${
            variant === 'compact' ? 'text-base line-clamp-2' : 'text-lg line-clamp-2'
          }`}>
            {course.title}
          </h3>
        </Link>
        
        {/* Course description - hide on compact */}
        {variant !== 'compact' && (
          <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
            {course.description}
          </p>
        )}
        
        {/* Course meta data */}
        <div className="mt-auto">
          <div className="flex items-center justify-between text-sm text-neutral-500 mb-4">
            <div className="flex items-center">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>{course.duration || '6-8 hét'}</span>
            </div>
            
            <div className="flex items-center">
              <Users className="h-3.5 w-3.5 mr-1" />
              <span>1.2k+ hallgató</span>
            </div>
            
            <div className="flex items-center">
              <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500 mr-1" />
              <span>4.8</span>
            </div>
          </div>
          
          {/* Price and action button */}
          <div className="flex justify-between items-center">
            <div>
              {course.isFree ? (
                <span className="font-semibold text-green-600">Ingyenes</span>
              ) : (
                <span className="font-semibold">{course.price?.toLocaleString('hu-HU') || '38,000'} Ft</span>
              )}
            </div>
            
            <Link href={`/courses/${course.id}`} className="no-underline">
              <Button 
                variant="outline" 
                size="sm"
                className="text-primary border-primary hover:bg-primary/5"
              >
                Részletek
                <ArrowRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MobileResponsiveCourseCard;