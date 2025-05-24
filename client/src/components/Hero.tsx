import React from "react";
import { Button } from "@/components/ui/button-variant";
import { motion } from "framer-motion";
import { useLocation } from "wouter";

const Hero: React.FC = () => {
  const [, setLocation] = useLocation();

  const handleJoinClick = () => {
    setLocation("/onboarding");
  };

  return (
    <section className="bg-white text-neutral-900 relative overflow-hidden">
      <div className="absolute right-0 top-0 w-1/2 h-full z-0">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.07 }}
          transition={{ duration: 1 }}
          className="w-full h-full"
        >
          <div className="text-[800px] font-bold text-primary/5 absolute -right-20 -top-80">C</div>
        </motion.div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
            Learn without <span className="block">limits</span>
          </h1>
          <p className="text-lg mb-8 max-w-lg text-neutral-700">
            Kezdje el, váltson vagy fejlessze karrierjét több mint 5800 tanfolyammal, szakmai bizonyítványokkal és diplomákkal, amelyeket világszínvonalú egyetemek és vállalatok kínálnak.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <Button 
              onClick={handleJoinClick}
              variant="default" 
              size="lg" 
              className="text-base font-medium bg-primary text-white hover:bg-primary/90"
            >
              Join for free
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-base font-medium border-neutral-300 text-neutral-700 hover:bg-neutral-50"
            >
              Try Coursera for Business
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
