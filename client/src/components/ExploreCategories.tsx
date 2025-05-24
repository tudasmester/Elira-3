import React, { useState } from "react";
import { motion } from "framer-motion";

const categories = [
  { 
    id: "data", 
    name: "Adattudomány", 
    gradient: "from-emerald-500 to-emerald-700", 
    icon: "📊" 
  },
  { 
    id: "business", 
    name: "Üzlet", 
    gradient: "from-blue-500 to-blue-700", 
    icon: "💼" 
  },
  { 
    id: "computer", 
    name: "Számítástechnika", 
    gradient: "from-orange-500 to-orange-700", 
    icon: "💻" 
  },
  { 
    id: "health", 
    name: "Egészségügy", 
    gradient: "from-red-500 to-red-700", 
    icon: "🏥" 
  },
  { 
    id: "social", 
    name: "Társadalomtudomány", 
    gradient: "from-violet-500 to-violet-700", 
    icon: "🧠" 
  },
  { 
    id: "arts", 
    name: "Művészet és design", 
    gradient: "from-pink-500 to-pink-700", 
    icon: "🎨" 
  },
  { 
    id: "personal", 
    name: "Személyes fejlődés", 
    gradient: "from-amber-500 to-amber-700", 
    icon: "🌱" 
  },
  { 
    id: "language", 
    name: "Nyelvtanulás", 
    gradient: "from-cyan-500 to-cyan-700", 
    icon: "🗣️" 
  },
  { 
    id: "math", 
    name: "Matematika és logika", 
    gradient: "from-lime-500 to-lime-700", 
    icon: "🔢" 
  },
  { 
    id: "physical", 
    name: "Fizikai tudomány", 
    gradient: "from-indigo-500 to-indigo-700", 
    icon: "🔬" 
  }
];

const ExploreCategories: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <section className="py-16 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 via-white to-purple-50/40 z-0"></div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-indigo-900">Fedezze fel az Elira platformot</h2>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ 
                scale: 1.05, 
                transition: { duration: 0.2 } 
              }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setActiveCategory(category.id)}
              onHoverEnd={() => setActiveCategory(null)}
              className="cursor-pointer"
            >
              <div 
                className={`bg-gradient-to-br ${category.gradient} rounded-xl p-4 aspect-square flex flex-col justify-center items-center text-white shadow-md hover:shadow-xl transition-all duration-300`}
              >
                <motion.div 
                  animate={{ 
                    scale: activeCategory === category.id ? 1.2 : 1,
                    y: activeCategory === category.id ? -5 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="text-4xl mb-3"
                >
                  {category.icon}
                </motion.div>
                <div className="text-sm font-medium text-center">{category.name}</div>
                
                {activeCategory === category.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl"
                  >
                    <span className="text-white font-medium text-sm px-3 py-1 bg-white/20 rounded-full backdrop-blur-sm">
                      Megtekintés
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreCategories;