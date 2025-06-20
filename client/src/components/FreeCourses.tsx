import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye } from "lucide-react";
import elteImage from "../assets/ELTE.png";
import bmeImage from "../assets/bme.png";
import debreceniImage from "../assets/debreceni.png";
import corvinusImage from "../assets/corvinus_logo_angol_sz_transparent.png";
import { Link } from "wouter";
import CoursePreviewModal from "./CoursePreviewModal";

const freeCourses = [
  {
    id: 1,
    university: "Eötvös Loránd Tudományegyetem",
    universityLogo: elteImage,
    title: "Pénzügyi piacok",
    description: "Ismerje meg a pénzügyi piacok működését, a befektetési eszközöket és a modern pénzügyi elemzési módszereket ebben az átfogó kurzusban.",
    imageUrl: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    category: "Pénzügy",
    level: "Kezdő",
    isFree: true,
    type: "Tanfolyam"
  },
  {
    id: 2,
    university: "Budapesti Műszaki és Gazdaságtudományi Egyetem",
    universityLogo: bmeImage,
    title: "Bevezetés a statisztikába",
    description: "Sajátítsa el a statisztikai elemzés alapvető eszközeit és módszereit. A kurzus során megismerkedhet az adatok elemzésének és értelmezésének modern megközelítéseivel.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    category: "Statisztika",
    level: "Kezdő",
    isFree: true,
    type: "Tanfolyam"
  },
  {
    id: 3,
    university: "Debreceni Egyetem",
    universityLogo: debreceniImage,
    title: "Angol a karrierfejlesztésért",
    description: "Fejlessze angol nyelvtudását üzleti környezetben. Ez a kurzus a szakmai kommunikációra, tárgyalástechnikára és prezentációs készségekre összpontosít.",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    category: "Nyelv",
    level: "Középhaladó",
    isFree: true,
    type: "Tanfolyam"
  },
  {
    id: 4,
    university: "Corvinus Egyetem",
    universityLogo: corvinusImage,
    title: "Üzleti analitika Excel segítségével: Alapfokoktól a haladóig",
    description: "Tanulja meg az Excel haladó funkcióit az üzleti elemzéshez. A kurzus a kimutatásoktól a makrókig mindent lefed, amit egy adatelemzőnek tudnia kell.",
    imageUrl: "https://images.unsplash.com/photo-1553484771-371a605b060b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    image: "https://images.unsplash.com/photo-1553484771-371a605b060b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    category: "Üzleti",
    level: "Haladó",
    isFree: true,
    type: "Tanfolyam"
  }
];

const FreeCourses: React.FC = () => {
  const [previewCourse, setPreviewCourse] = useState<typeof freeCourses[0] | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const openPreview = (course: typeof freeCourses[0]) => {
    setPreviewCourse(course);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
  };
  
  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm text-primary font-medium mb-2">100%-ban ingyenes</h3>
            <h2 className="text-2xl md:text-3xl font-bold text-primary-900 mb-4">Kezdje el a tanulást ingyenes tanfolyamokkal</h2>
            <p className="text-neutral-600 mb-8">Fedezze fel a világ legjobb egyetemeinek és vállalatainak ingyenes online kurzusait.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {freeCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer relative"
              >
                <div className="absolute top-3 right-3 z-10 flex gap-2">
                  <span className="bg-primary text-white text-xs px-2 py-1 rounded-full shadow-md">
                    Ingyenes
                  </span>
                </div>
                <div className="absolute top-3 left-3 z-10">
                  <Button 
                    size="sm" 
                    variant="secondary" 
                    className="bg-white/90 hover:bg-white text-primary rounded-full shadow-md h-8 w-8 p-0"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openPreview(course);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="relative h-40">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>
                
                <div className="p-5">
                  <div className="flex items-center mb-3">
                    <img 
                      src={course.universityLogo} 
                      alt={`${course.university} logó`}
                      className="h-6 mr-2 object-contain"
                    />
                    <span className="text-xs text-neutral-600">{course.university}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-3">{course.title}</h3>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="inline-block bg-teal-100 text-primary text-xs px-2 py-1 rounded-full">
                      {course.type}
                    </span>
                    
                    <Link href={`/course/${course.id}`}>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center cursor-pointer"
                      >
                        <ArrowRight className="h-4 w-4 text-primary" />
                      </motion.div>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-10 flex justify-center md:justify-between flex-wrap gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="default" 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white rounded-md shadow-md px-6"
                onClick={() => window.location.href = '/courses?filter=free'}
              >
                További 8 megtekintése
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="lg" 
                className="text-primary border-primary hover:bg-teal-50 rounded-md px-6"
                onClick={() => window.location.href = '/courses'}
              >
                Az összes megtekintése
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Course Preview Modal */}
      {previewCourse && (
        <CoursePreviewModal 
          isOpen={isPreviewOpen}
          onClose={closePreview}
          course={previewCourse}
        />
      )}
    </section>
  );
};

export default FreeCourses;