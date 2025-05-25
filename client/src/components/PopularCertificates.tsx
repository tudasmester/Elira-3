import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const certificates = [
  {
    id: 1,
    provider: "Google",
    title: "Google Adatelemzés",
    description: "Adatelemzés, Tableau, SQL",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
  },
  {
    id: 2,
    provider: "Google",
    title: "Google Projektmenedzsment",
    description: "Projekttervezés, Kommunikáció, Vezetés",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
  },
  {
    id: 3,
    provider: "Google",
    title: "Google IT-támogatás",
    description: "Hálózatkezelés, Kiberbiztonság, Rendszeradminisztráció",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1573495612937-f22e7f5d84aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
  },
  {
    id: 4,
    provider: "Google",
    title: "Google Digitális Marketing",
    description: "SEO, Közösségi média, E-kereskedelem",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
  }
];

const PopularCertificates: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-indigo-900">Legnépszerűbb tanúsítványok</h2>
          <p className="text-neutral-600">Fedezze fel a legnépszerűbb programjainkat, és készüljön fel egy keresett karrierre</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.2 }
              }}
              onHoverStart={() => setHoveredCard(cert.id)}
              onHoverEnd={() => setHoveredCard(null)}
              className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl overflow-hidden shadow-lg cursor-pointer transform transition-all duration-300"
            >
              <div className="relative">
                <img 
                  src={cert.image} 
                  alt={cert.title} 
                  className="w-full h-40 object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/80 to-transparent"></div>
              </div>
              <div className="p-5 text-white">
                <div className="text-xs text-blue-200 mb-1">{cert.provider}</div>
                <h3 className="text-lg font-medium mb-2">{cert.title}</h3>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-blue-200">{cert.description}</div>
                  <div className="flex items-center">
                    <span className="text-xs mr-1">{cert.rating}</span>
                    <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ 
                    opacity: hoveredCard === cert.id ? 1 : 0,
                    height: hoveredCard === cert.id ? 'auto' : 0
                  }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 overflow-hidden"
                >
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-lg shadow transition-all duration-300"
                    onClick={() => window.location.href = `/certificate/${cert.id}`}
                  >
                    Tanfolyam megtekintése
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center space-x-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="default" 
              className="rounded-full bg-gradient-to-r from-primary to-purple-600 text-white border-none hover:opacity-90 shadow-md hover:shadow-lg px-8"
              onClick={() => window.location.href = '/certificates?popular=true'}
            >
              Továbbiak megtekintése
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline" 
              className="rounded-full text-primary border-primary hover:bg-primary/5 px-8"
              onClick={() => window.location.href = '/certificates'}
            >
              Összes megtekintése
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PopularCertificates;