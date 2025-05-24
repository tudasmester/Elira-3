import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { degrees } from "@/data/degrees";
import { motion } from "framer-motion";

const DegreePrograms: React.FC = () => {
  return (
    <section className="bg-neutral-100 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-2xl font-bold font-heading text-neutral-800 mb-4">Diplomát adó programok</h2>
          <p className="text-xl font-heading text-neutral-800 mb-3">Találja meg az Önnek megfelelő felsőfokú végzettséget</p>
          <p className="text-neutral-600">Verhetetlen árak a legjobb egyetemek 100%-ban online diplomáira.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {degrees.map((degree, index) => (
            <motion.div
              key={degree.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 course-card"
            >
              <img src={degree.imageUrl} alt={`${degree.university} kampusz`} className="w-full h-40 object-cover" />
              <div className="p-5">
                <div className="flex items-center mb-3">
                  <img src={degree.universityLogo} alt={`${degree.university} logó`} className="w-8 h-8 object-contain mr-2" />
                  <span className="text-sm text-neutral-600">{degree.university}</span>
                </div>
                <h3 className="text-lg font-bold text-neutral-800 mb-2">{degree.title}</h3>
                <p className="text-sm text-neutral-500 mb-3">Diploma</p>
                <Button className="w-full mb-2">Szerezzen diplomát</Button>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <Button>
            További 8 megtekintése
          </Button>
          <a href="#" className="inline-flex items-center text-primary hover:underline font-medium">
            Az összes megtekintése
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default DegreePrograms;
