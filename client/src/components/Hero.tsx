import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button-variant";
import { motion, useAnimation } from "framer-motion";
import { useLocation } from "wouter";
import heroImage from "@assets/academion (3).png";
import { Check, ArrowRight, Play, Sparkles, GraduationCap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Hero: React.FC = () => {
  const [, setLocation] = useLocation();
  const controls = useAnimation();
  const [hovered, setHovered] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    controls.start({ 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8 } 
    });
  }, [controls]);

  const handleJoinClick = () => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    } else {
      setLocation("/onboarding");
    }
  };

  const handleExploreClick = () => {
    setLocation("/courses");
  };

  return (
    <section className="bg-gradient-to-br from-teal-50 via-blue-50 to-teal-50 text-neutral-900 relative overflow-hidden pt-10 pb-24 md:pt-16 md:pb-32">
      {/* Background decorative elements */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute right-0 w-3/4 h-3/4 bg-gradient-to-bl from-blue-100/30 to-transparent rounded-full blur-3xl transform translate-x-1/4 -translate-y-1/4"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-teal-100/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-24 h-24 bg-yellow-100/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-purple-100/20 rounded-full blur-2xl"></div>
        
        {/* Floating decorative elements */}
        <motion.div 
          className="absolute top-20 left-[20%] w-8 h-8 bg-primary/10 rounded-full"
          animate={{ 
            y: [0, -15, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 4,
            ease: "easeInOut" 
          }}
        />
        <motion.div 
          className="absolute bottom-32 right-[15%] w-6 h-6 bg-secondary/10 rounded-full"
          animate={{ 
            y: [0, -12, 0],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3.5,
            ease: "easeInOut",
            delay: 1 
          }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Navigation stats bar */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-sm border border-neutral-200/50 rounded-full p-2 mb-12 shadow-lg max-w-3xl mx-auto flex flex-wrap justify-center sm:justify-between items-center"
        >
          <div className="flex items-center space-x-6 px-4">
            <div className="flex items-center text-sm">
              <Sparkles className="h-4 w-4 text-yellow-500 mr-2" />
              <span className="font-medium">500+ kurzus</span>
            </div>
            <div className="flex items-center text-sm">
              <GraduationCap className="h-4 w-4 text-primary mr-2" />
              <span className="font-medium">5 partneri egyetem</span>
            </div>
          </div>
          <div className="text-xs bg-green-100 text-green-800 rounded-full px-3 py-1 font-medium">
            Új: AI-alapú tanulási segéd most elérhető!
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={controls}
            className="lg:w-1/2 lg:pr-6"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-neutral-900">
              Tanulás a<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-teal-500">
                jövő számára
              </span>
            </h1>
            
            <p className="text-lg mb-6 max-w-lg text-neutral-700 leading-relaxed">
              Az Academion összeköti Önt Magyarország vezető egyetemeivel és oktatóival. 
              Fedezzen fel szakértői tudást, szerezzen elismert képesítéseket, és fejlessze karrierjét.
            </p>
            
            {/* Features list */}
            <div className="mb-8 space-y-3">
              {[
                "Elismert magyar egyetemek által hitelesített bizonyítványok",
                "Személyre szabott tanulási tapasztalat",
                "Rugalmas tanulási ütemterv az Ön időbeosztásához igazítva"
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index + 0.5 }}
                  className="flex items-start"
                >
                  <div className="flex-shrink-0 mt-1">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <p className="ml-3 text-neutral-700">{feature}</p>
                </motion.div>
              ))}
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-wrap gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleJoinClick}
                  variant="default" 
                  size="lg" 
                  className="text-base font-medium bg-gradient-to-r from-primary to-teal-500 text-white hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isAuthenticated ? "Irányítópult" : "Csatlakozzon ingyen"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleExploreClick}
                  variant="outline" 
                  size="lg" 
                  className="text-base font-medium border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition-all duration-300"
                >
                  Kurzusok böngészése
                </Button>
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsVideoModalOpen(true)}
                className="flex items-center text-primary font-medium hover:text-primary-dark transition-colors duration-200"
              >
                <div className="bg-white p-2 rounded-full shadow-md mr-2 border border-neutral-100">
                  <Play className="h-5 w-5 text-primary" />
                </div>
                <span>Hogyan működik?</span>
              </motion.button>
            </div>
            
            {/* Trust indicators */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-8 pt-6 border-t border-neutral-200 flex items-center"
            >
              <div className="text-sm text-neutral-500 mr-4">Több mint 50 000 tanuló megbízik bennünk</div>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full bg-neutral-200 border-2 border-white overflow-hidden">
                    <img 
                      src={`https://randomuser.me/api/portraits/men/${i + 10}.jpg`} 
                      alt="User" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right content - interactive display */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-1/2 relative"
          >
            <div className="relative">
              {/* Main platform image with interactive styling */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl overflow-hidden shadow-2xl relative z-20 border border-neutral-200/50"
              >
                <img 
                  src={heroImage} 
                  alt="Academion platform" 
                  className="w-full h-auto object-contain rounded-t-2xl"
                />
                <div className="bg-white p-6 rounded-b-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg">Academion Online Platform</h3>
                    <div className="flex space-x-2">
                      <span className="inline-block w-3 h-3 bg-red-500 rounded-full"></span>
                      <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full"></span>
                      <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{width: "75%"}}></div>
                    </div>
                    <span className="text-sm font-medium">75%</span>
                  </div>
                </div>
              </motion.div>
              
              {/* Course rating overlay element */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute top-10 -left-8 z-30 bg-white rounded-xl shadow-lg p-4 border border-neutral-200"
                whileHover={{ 
                  scale: 1.05,
                  rotate: -2 
                }}
              >
                <div className="flex items-center space-x-1 mb-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="text-lg font-bold">4.9/5.0</div>
                <div className="text-xs text-neutral-500">Több mint 500 értékelés</div>
              </motion.div>
              
              {/* Active learners overlay element */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -bottom-10 right-0 z-30 bg-white p-4 rounded-xl shadow-lg border border-neutral-200"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-sm font-medium mb-2">Aktív tanulók most</div>
                <div className="flex items-center">
                  <div className="relative mr-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                      <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">1,248</div>
                    <div className="text-xs text-green-600 font-medium">+24% az előző héthez képest</div>
                  </div>
                </div>
              </motion.div>
              
              {/* Universities logos floating element */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -top-6 right-10 z-30 bg-white p-3 rounded-xl shadow-lg border border-neutral-200"
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-xs font-medium mb-2 text-neutral-500">Partneregyetemek</div>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 rounded bg-neutral-100 flex items-center justify-center p-1">
                    <img src="@assets/bme.png" alt="BME" className="w-full h-full object-contain" />
                  </div>
                  <div className="w-8 h-8 rounded bg-neutral-100 flex items-center justify-center p-1">
                    <img src="@assets/corvinus_logo_angol_sz_transparent.png" alt="Corvinus" className="w-full h-full object-contain" />
                  </div>
                  <div className="w-8 h-8 rounded bg-neutral-100 flex items-center justify-center p-1">
                    <img src="@assets/miskolci_egyetem.png" alt="Miskolci Egyetem" className="w-full h-full object-contain" />
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C50.45,0,111.91,20.27,171.29,40.23Z" className="fill-white"></path>
        </svg>
      </div>
    </section>
  );
};

export default Hero;
