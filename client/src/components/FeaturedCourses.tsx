import React from "react";
import { ChevronRight, ArrowRight, Clock, Users, Award, Bookmark, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/courses";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";

const FeaturedCourses: React.FC = () => {
  // Animation variants for the cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    },
    hover: {
      y: -10,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.3 }
    }
  };

  return (
    <section className="bg-gradient-to-b from-white to-primary/5 py-20">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 mb-3 px-4 py-1.5">
            100%-ban ingyenes
          </Badge>
          <h2 className="text-4xl font-bold text-neutral-800 mb-4">Fedezze fel a legjobb kurzusokat</h2>
          <p className="text-neutral-600 text-lg max-w-2xl mx-auto">
            Válogasson a legnevesebb magyar egyetemek és oktatók minőségi tananyagai között
          </p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {courses.map((course) => (
            <motion.div
              key={course.id}
              variants={itemVariants}
              whileHover="hover"
              className="bg-white rounded-2xl overflow-hidden group transition-all duration-300 h-full flex flex-col border border-neutral-100 shadow-sm"
            >
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <img 
                  src={course.imageUrl} 
                  alt={`${course.title} kurzus`} 
                  className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
                  {course.isFree && (
                    <span className="bg-tertiary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                      Ingyenes
                    </span>
                  )}
                  <span className={`bg-white/90 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full shadow-lg ${
                    course.level === "Kezdő" ? "text-emerald-600" : 
                    course.level === "Haladó" ? "text-orange-600" : "text-blue-600"
                  }`}>
                    {course.level}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="sm" variant="secondary" className="bg-white/90 hover:bg-white text-primary backdrop-blur-sm rounded-full shadow-lg">
                    <Bookmark className="h-4 w-4 mr-1" />
                    Mentés
                  </Button>
                </div>
              </div>
              
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center mb-3">
                  <div className="flex-shrink-0 w-8 h-8 mr-3 rounded-full overflow-hidden border border-neutral-200 bg-white p-1">
                    <img 
                      src={course.universityLogo} 
                      alt={`${course.university} logó`} 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <span className="text-sm text-neutral-600 font-medium truncate">
                    {course.university}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-neutral-800 mb-3 leading-tight group-hover:text-primary transition-colors duration-300">
                  {course.title}
                </h3>
                
                <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between mb-6 text-sm text-neutral-500 mt-auto">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-neutral-400" />
                    <span>6-8 hét</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-neutral-400" />
                    <span>1.2k+ hallgató</span>
                  </div>
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <Star className="h-3 w-3 text-neutral-300" />
                    </div>
                  </div>
                </div>
                
                <Link href={`/course/${course.id}`}>
                  <Button 
                    className="w-full group-hover:bg-primary group-hover:text-white transition-colors duration-300"
                    variant="outline"
                  >
                    Részletek megtekintése
                    <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
              
              <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-100">
                <div className="flex items-center text-sm">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 mr-2">
                    <Award className="h-3 w-3 mr-1" />
                    {course.category}
                  </Badge>
                  {course.isFree ? (
                    <span className="font-medium text-emerald-600">Ingyenes beiratkozás</span>
                  ) : (
                    <span className="font-medium text-neutral-900">38,000 Ft</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center"
        >
          <Button 
            variant="default" 
            className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Az összes kurzus felfedezése
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
