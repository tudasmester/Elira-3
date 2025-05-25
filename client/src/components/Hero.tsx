import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button-variant";
import { motion, useAnimation } from "framer-motion";
import { useLocation } from "wouter";
import heroImage from "../assets/medical-office-manager-hero_1X.png";

const Hero: React.FC = () => {
  const [, setLocation] = useLocation();
  const controls = useAnimation();
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    controls.start({ 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8 } 
    });
  }, [controls]);

  const handleJoinClick = () => {
    setLocation("/onboarding");
  };

  return (
    <section className="bg-gradient-to-br from-teal-50 to-blue-50 text-neutral-900 relative overflow-hidden py-12 md:py-24">
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute right-0 w-3/4 h-3/4 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-purple-100/20 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={controls}
            className="lg:w-1/2 mb-10 lg:mb-0 lg:pr-10"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-primary-900">
              Tanuljon<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-400">korlátok nélkül</span>
            </h1>
            <p className="text-lg mb-8 max-w-lg text-neutral-700">
              Teljes körű digitális szolgáltatást nyújtunk, amely magával ragadó felhasználói élményt épít. Tanuljon korlátok nélkül a legjobb hazai és nemzetközi szakértőktől.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleJoinClick}
                  variant="default" 
                  size="lg" 
                  className="text-base font-medium bg-gradient-to-r from-primary to-purple-600 text-white hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Csatlakozzon ingyen
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-base font-medium border-primary text-primary hover:bg-primary/5 transition-all duration-300"
                >
                  Vállalati megoldások
                </Button>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-1/2 relative"
          >
            <div className="relative">
              {/* Main image with card-like styling */}
              <motion.div
                whileHover={{ y: -5 }}
                className="rounded-3xl overflow-hidden shadow-2xl relative z-20"
              >
                <img 
                  src={heroImage} 
                  alt="Tanuló diák" 
                  className="w-full h-auto object-contain rounded-3xl"
                />
              </motion.div>
              
              {/* Activity overlay element */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute top-10 -left-8 z-30 bg-gradient-to-r from-purple-500 to-purple-400 text-white p-4 rounded-xl shadow-lg"
                whileHover={{ 
                  scale: 1.05,
                  rotate: -2 
                }}
              >
                <div className="font-medium">Aktivitás</div>
                <div className="text-2xl font-bold">18 <span className="text-xs">óra/hét</span></div>
              </motion.div>
              
              {/* Stats overlay element */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -bottom-10 left-1/2 -translate-x-1/2 z-30 bg-white p-4 rounded-xl shadow-lg w-64"
                whileHover={{ 
                  scale: 1.05,
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Statisztikák</span>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">&larr;</button>
                    <button className="text-gray-400 hover:text-gray-600">&rarr;</button>
                  </div>
                </div>
                <div className="flex items-end justify-between h-16">
                  {[40, 65, 30, 85, 55, 70, 20, 90, 45, 60].map((height, i) => (
                    <div 
                      key={i} 
                      className="w-1.5 bg-indigo-600 rounded-full"
                      style={{ height: `${height}%` }}
                    ></div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
