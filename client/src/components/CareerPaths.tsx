import React from "react";
import { ArrowRight } from "lucide-react";
import { careers } from "@/data/careers";
import { motion } from "framer-motion";

const CareerPaths: React.FC = () => {
  return (
    <section className="bg-neutral-100 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start mb-12">
          <div className="md:w-1/3 mb-8 md:mb-0 pr-8">
            <h2 className="text-3xl font-bold font-heading text-neutral-800 mb-4">Válassza ki a szerepkörét</h2>
            <p className="text-neutral-600 mb-6">Szerezze meg az előrelépéshez szükséges ismereteket és készségeket.</p>
            <a href="#" className="inline-flex items-center font-medium text-primary hover:underline">
              Összes szerepkör felfedezése
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
          
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {careers.map((career, index) => (
              <motion.div
                key={career.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 course-card"
              >
                <div className={`h-2 ${career.colorClass}`}></div>
                <div className="p-6">
                  <img 
                    src={career.imageUrl} 
                    alt={`${career.title} szakember`} 
                    className="w-24 h-24 object-cover rounded-full mx-auto mb-4" 
                  />
                  <h3 className="text-xl font-bold text-neutral-800 mb-2">{career.title}</h3>
                  <p className="text-sm text-neutral-600 mb-4">{career.description}</p>
                  <div className="border-t border-neutral-200 pt-4 mt-4">
                    <p className="text-sm font-semibold">Ha kedveli a következőket:</p>
                    <p className="text-sm text-neutral-600">{career.interests}</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm font-bold">{career.salary} <span className="font-normal text-xs text-neutral-500">medián fizetés</span></p>
                    <p className="text-sm text-neutral-500">{career.jobCount} rendelkezésre álló állás</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerPaths;
