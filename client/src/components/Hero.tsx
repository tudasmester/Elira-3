import React from "react";
import { Button } from "@/components/ui/button-variant";
import { motion } from "framer-motion";

const Hero: React.FC = () => {
  return (
    <section className="hero-pattern text-white">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold font-heading leading-tight mb-4"
          >
            Tanuljon <span className="text-tertiary">korlátok nélkül</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg mb-8 max-w-lg"
          >
            Kezdje el, váltson vagy fejlessze karrierjét több mint 5800 tanfolyammal, szakmai bizonyítványokkal és diplomákkal, amelyeket világszínvonalú egyetemek és vállalatok kínálnak.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <Button variant="secondary" size="lg" className="text-base font-medium">
              Csatlakozzon ingyen
            </Button>
            <Button variant="whiteOutline" size="lg" className="bg-white text-primary hover:bg-neutral-100 text-base font-medium">
              A Coursera for Business kipróbálása
            </Button>
          </motion.div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.3, scale: 1 }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatType: "reverse" 
              }}
              className="absolute -top-4 -left-4 w-24 h-24 bg-tertiary rounded-full opacity-30"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 0.3, scale: 1 }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatType: "reverse",
                delay: 0.5 
              }}
              className="absolute -bottom-4 -right-4 w-32 h-32 bg-accent rounded-full opacity-30"
            />
            <motion.img 
              initial={{ y: 0 }}
              animate={{ y: -10 }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                repeatType: "reverse" 
              }}
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=600" 
              alt="Tanuló diák" 
              className="rounded-full w-64 h-64 object-cover border-4 border-white z-10 relative"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
