import React from "react";
import { motion } from "framer-motion";

const categories = [
  { 
    id: "data", 
    name: "Data Science", 
    bgColor: "bg-emerald-600", 
    icon: "📊" 
  },
  { 
    id: "business", 
    name: "Business", 
    bgColor: "bg-blue-600", 
    icon: "💼" 
  },
  { 
    id: "computer", 
    name: "Computer Science", 
    bgColor: "bg-orange-600", 
    icon: "💻" 
  },
  { 
    id: "health", 
    name: "Health", 
    bgColor: "bg-red-600", 
    icon: "🏥" 
  },
  { 
    id: "social", 
    name: "Social Sciences", 
    bgColor: "bg-violet-600", 
    icon: "🧠" 
  },
  { 
    id: "arts", 
    name: "Arts & Design", 
    bgColor: "bg-pink-600", 
    icon: "🎨" 
  },
  { 
    id: "personal", 
    name: "Personal Development", 
    bgColor: "bg-amber-600", 
    icon: "🌱" 
  },
  { 
    id: "language", 
    name: "Language Learning", 
    bgColor: "bg-cyan-600", 
    icon: "🗣️" 
  },
  { 
    id: "math", 
    name: "Math & Logic", 
    bgColor: "bg-lime-600", 
    icon: "🔢" 
  },
  { 
    id: "physical", 
    name: "Physical Science", 
    bgColor: "bg-indigo-600", 
    icon: "🔬" 
  }
];

const ExploreCategories: React.FC = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Explore Coursera</h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group cursor-pointer"
            >
              <div className={`${category.bgColor} rounded-lg p-4 aspect-square flex flex-col justify-center items-center text-white transition-transform group-hover:scale-105`}>
                <div className="text-3xl mb-2">{category.icon}</div>
                <div className="text-sm font-medium text-center">{category.name}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreCategories;