import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Clock, Users, Award, BookOpen, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";

interface CoursePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  };
}

const CoursePreviewModal: React.FC<CoursePreviewModalProps> = ({
  isOpen,
  onClose,
  course,
}) => {
  const isMobile = useIsMobile();
  
  const renderRatingStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-3 w-3 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} 
      />
    ));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed left-0 right-0 bottom-0 z-50 mx-auto p-4 md:p-0 md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:bottom-auto"
            style={{ 
              maxWidth: isMobile ? "100%" : "600px",
              maxHeight: isMobile ? "85vh" : "90vh"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-full">
              <button
                onClick={onClose}
                className="absolute right-3 top-3 bg-black/40 hover:bg-black/60 text-white p-1.5 rounded-full z-20"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Course Image with Overlay */}
              <div className="relative aspect-video">
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="bg-white/20 backdrop-blur-sm p-3 rounded-full cursor-pointer"
                  >
                    <Play className="h-10 w-10 text-white fill-white" />
                  </motion.div>
                </div>
                
                <div className="absolute bottom-4 left-4 right-4">
                  <Badge className="bg-primary-foreground text-primary mb-2">{course.category}</Badge>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-2 line-clamp-2">
                    {course.title}
                  </h2>
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="flex items-center">
                      {renderRatingStars(4.7)}
                      <span className="text-white text-xs ml-1">4.7</span>
                    </div>
                    <span className="text-white/70 text-xs">(957 értékelés)</span>
                  </div>
                </div>
              </div>

              {/* Course Details */}
              <div className="p-4 overflow-y-auto">
                <div className="flex items-center mb-4">
                  <div className="bg-neutral-100 p-1.5 rounded-full mr-3">
                    <img 
                      src={course.universityLogo} 
                      alt={course.university} 
                      className="h-8 w-8 object-contain"
                    />
                  </div>
                  <div>
                    <span className="font-medium text-neutral-800">{course.university}</span>
                    <p className="text-neutral-500 text-xs">Hivatalos tanúsítvánnyal</p>
                  </div>
                </div>
                
                <p className="text-neutral-600 text-sm mb-4 line-clamp-3">
                  {course.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  <div className="flex items-center bg-neutral-100 px-3 py-1.5 rounded-full text-xs">
                    <Clock className="h-3 w-3 mr-1 text-neutral-500" />
                    <span className="text-neutral-700">6-8 hét</span>
                  </div>
                  <div className="flex items-center bg-neutral-100 px-3 py-1.5 rounded-full text-xs">
                    <Users className="h-3 w-3 mr-1 text-neutral-500" />
                    <span className="text-neutral-700">12,483 tanuló</span>
                  </div>
                  <div className="flex items-center bg-neutral-100 px-3 py-1.5 rounded-full text-xs">
                    <Award className="h-3 w-3 mr-1 text-neutral-500" />
                    <span className="text-neutral-700">{course.level}</span>
                  </div>
                  <div className="flex items-center bg-neutral-100 px-3 py-1.5 rounded-full text-xs">
                    <BookOpen className="h-3 w-3 mr-1 text-neutral-500" />
                    <span className="text-neutral-700">Magyar nyelven</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <div>
                    <span className="text-xl font-bold text-primary block">
                      {course.isFree ? "Ingyenes" : "38,000 Ft"}
                    </span>
                    {!course.isFree && (
                      <span className="text-neutral-500 text-xs line-through">54,000 Ft</span>
                    )}
                  </div>
                  {!course.isFree && (
                    <Badge className="bg-green-100 text-green-800 text-xs">30% kedvezmény</Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <Link href={`/course/${course.id}`}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                      Teljes részletek
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/5">
                    {course.isFree ? "Beiratkozás" : "Próba lecke"}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CoursePreviewModal;