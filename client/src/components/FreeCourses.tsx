import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import elteImage from "../assets/ELTE.png";
import bmeImage from "../assets/bme.png";

const freeCourses = [
  {
    id: 1,
    university: "Eötvös Loránd Tudományegyetem",
    universityLogo: elteImage,
    title: "Pénzügyi piacok",
    image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    type: "Tanfolyam"
  },
  {
    id: 2,
    university: "Budapesti Műszaki és Gazdaságtudományi Egyetem",
    universityLogo: bmeImage,
    title: "Bevezetés a statisztikába",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    type: "Tanfolyam"
  },
  {
    id: 3,
    university: "Debreceni Egyetem",
    universityLogo: "https://unideb.hu/sites/default/files/DE_SZGK_Emblem_Eng.png",
    title: "Angol a karrierfejlesztésért",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    type: "Tanfolyam"
  },
  {
    id: 4,
    university: "Szegedi Tudományegyetem",
    universityLogo: "https://u-szeged.hu/site/upload/2019/08/SZTE_cimer.png",
    title: "Üzleti analitika Excel segítségével: Alapfokoktól a haladóig",
    image: "https://images.unsplash.com/photo-1553484771-371a605b060b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    type: "Tanfolyam"
  }
];

const FreeCourses: React.FC = () => {
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
            <h3 className="text-sm text-indigo-600 font-medium mb-2">100%-ban ingyenes</h3>
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-4">Kezdje el a tanulást ingyenes tanfolyamokkal</h2>
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
                <div className="absolute top-3 right-3 z-10">
                  <span className="bg-indigo-600 text-white text-xs px-2 py-1 rounded-full shadow-md">
                    Ingyenes
                  </span>
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
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {course.type}
                    </span>
                    
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center cursor-pointer"
                    >
                      <ArrowRight className="h-4 w-4 text-indigo-600" />
                    </motion.div>
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
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-md px-6"
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
                className="text-indigo-600 border-indigo-600 hover:bg-indigo-50 rounded-md px-6"
              >
                Az összes megtekintése
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeCourses;