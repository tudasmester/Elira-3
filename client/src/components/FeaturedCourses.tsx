import React from "react";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { courses } from "@/data/courses";
import { motion } from "framer-motion";

const FeaturedCourses: React.FC = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-3">100%-ban ingyenes</span>
          <h2 className="text-3xl font-bold font-heading text-neutral-800 mb-4">Kezdje el a tanulást ingyenes tanfolyamokkal</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Fedezze fel a világ legjobb egyetemeinek és vállalatainak ingyenes online kurzusait.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 course-card"
            >
              <div className="relative">
                <span className="absolute top-2 right-2 bg-tertiary text-neutral-800 text-xs font-bold px-2 py-1 rounded">Ingyenes</span>
                <img src={course.imageUrl} alt={`${course.title} kurzus`} className="w-full h-40 object-cover" />
              </div>
              <div className="p-5">
                <div className="flex items-center mb-3">
                  <img src={course.universityLogo} alt={`${course.university} logó`} className="w-6 h-6 object-contain mr-2" />
                  <span className="text-sm text-neutral-600">{course.university}</span>
                </div>
                <h3 className="text-lg font-bold text-neutral-800 mb-2">{course.title}</h3>
                <p className="text-sm text-neutral-500 mb-4">Tanfolyam</p>
                <a href="#" className="inline-flex items-center font-medium text-primary hover:underline text-sm">
                  További részletek
                  <ChevronRight className="ml-1 h-3 w-3" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="flex justify-center">
          <Button variant="outline" className="border-2 border-primary text-primary hover:bg-primary hover:text-white">
            Az összes megtekintése
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCourses;
