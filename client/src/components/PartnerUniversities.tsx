import React from "react";
import { universities } from "@/data/universities";
import { motion } from "framer-motion";

const categories = [
  { id: "beginner", name: "Kezdő", active: true },
  { id: "popular", name: "Népszerű", active: false },
  { id: "software", name: "Szoftverfejlesztés és IT", active: false },
  { id: "business", name: "Üzlet", active: false },
  { id: "marketing", name: "Értékesítés és marketing", active: false },
  { id: "data", name: "Adattudomány és analitika", active: false },
  { id: "health", name: "Egészségügy", active: false },
];

const PartnerUniversities: React.FC = () => {
  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-xl text-neutral-700 mb-8 font-medium">
          Több mint <span className="text-primary font-bold">300 vezető egyetemmel és céggel</span> működünk együtt
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-8 mb-12">
          {universities.map((university, index) => (
            <motion.img
              key={university.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              src={university.logoUrl}
              alt={`${university.name} logó`}
              className="h-10 object-contain grayscale hover:grayscale-0 transition duration-300"
            />
          ))}
        </div>
        
        {/* Category Filter Tabs */}
        <div className="flex justify-center mb-8 overflow-x-auto py-2">
          <div className="inline-flex space-x-2 bg-neutral-200 p-1 rounded-full">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-pill px-5 py-2 rounded-full ${
                  category.active 
                    ? "bg-primary text-white" 
                    : "text-neutral-700 hover:bg-neutral-300"
                } font-medium text-sm transition duration-200`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerUniversities;
