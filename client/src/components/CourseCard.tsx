import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';

interface CourseCardProps {
  course: {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    category: string;
    level: string;
    isFree: boolean;
    university: string;
    universityLogo: string;
    price?: number;
  };
  onPreview: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onPreview }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col border-neutral-200 hover:shadow-md transition-shadow">
        <div className="relative">
          <img 
            src={course.imageUrl} 
            alt={course.title} 
            className="h-48 w-full object-cover"
          />
          <Badge className="absolute top-3 left-3 bg-primary text-white">{course.category}</Badge>
          
          <Button 
            size="sm" 
            variant="outline"
            className="absolute top-3 right-3 bg-white hover:bg-neutral-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPreview();
            }}
          >
            <Info className="h-4 w-4 mr-1" />
            Előnézet
          </Button>
        </div>
        
        <CardContent className="pt-4 flex-grow">
          <div className="flex items-center mb-2">
            <img 
              src={course.universityLogo} 
              alt={course.university}
              className="w-5 h-5 rounded-full mr-2"
            />
            <span className="text-xs text-neutral-500">{course.university}</span>
          </div>
          
          <Link href={`/courses/${course.id}`} className="no-underline">
            <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
              {course.title}
            </h3>
          </Link>
          
          <p className="text-neutral-600 text-sm line-clamp-3 mb-3">
            {course.description}
          </p>
          
          <div className="flex justify-between items-center mt-auto">
            <span className="text-sm text-neutral-500">
              Szint: {course.level}
            </span>
            
            {course.isFree ? (
              <span className="font-semibold text-green-600">Ingyenes</span>
            ) : (
              <span className="font-semibold">{course.price?.toLocaleString('hu-HU')} Ft</span>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 pb-4 px-6">
          <Link href={`/courses/${course.id}`} className="w-full no-underline">
            <Button 
              variant="outline" 
              className="w-full border-primary text-primary hover:bg-primary hover:text-white transition-colors"
            >
              Kurzus megtekintése
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CourseCard;