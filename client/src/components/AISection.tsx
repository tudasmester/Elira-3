import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { aiCourses } from "@/data/aiCourses";
import { motion } from "framer-motion";

const AISection: React.FC = () => {
  return (
    <section className="bg-neutral-100 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col lg:flex-row bg-white rounded-2xl overflow-hidden shadow-lg">
          <div className="lg:w-2/5 p-8 lg:p-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold font-heading text-neutral-800 mb-4"
            >
              Ismerkedjen meg a GenAI-val
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-neutral-600 mb-6"
            >
              Hatékony GenAI üzleti stratégiák meghatározása, kidolgozása és végrehajtása.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Button className="inline-flex items-center">
                Összes GenAI megtekintése
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
          <div className="lg:w-3/5 flex flex-wrap">
            <div className="w-full lg:border-l border-neutral-200 flex lg:flex-nowrap flex-wrap">
              <div className="flex p-3 lg:w-auto w-full">
                <div className="px-3 py-2 rounded-full bg-neutral-200 text-neutral-700 text-xs font-medium mr-2">Új</div>
                <div className="px-3 py-2 rounded-full bg-neutral-200 text-neutral-700 text-xs font-medium mr-2">Kezdő</div>
                <div className="px-3 py-2 rounded-full bg-neutral-200 text-neutral-700 text-xs font-medium mr-2">Népszerű</div>
                <div className="px-3 py-2 rounded-full bg-neutral-200 text-neutral-700 text-xs font-medium">Eszközök</div>
              </div>
            </div>
            
            <div className="w-full flex flex-wrap">
              {aiCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="lg:w-1/3 p-4 border-t lg:border-l lg:border-r border-neutral-200"
                >
                  <img src={course.imageUrl} alt={course.title} className="w-full h-32 object-cover rounded-lg mb-4" />
                  <div className="flex items-center mb-2">
                    <img src={course.providerLogo} alt={`${course.provider} logó`} className="w-6 h-6 object-contain mr-2" />
                    <span className="text-xs text-neutral-600">{course.provider}</span>
                  </div>
                  <h3 className="text-base font-bold text-neutral-800 mb-2">{course.title}</h3>
                  <p className="text-xs text-neutral-500 mb-2">{course.type}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AISection;
