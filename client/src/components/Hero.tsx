import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button-variant";
import { motion, useAnimation } from "framer-motion";
import { useLocation } from "wouter";
import heroImage from "@assets/elirahero.png";
import { Check, ArrowRight, Play, Sparkles, GraduationCap, Clock, Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import VideoModal from "./VideoModal";

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
    <section className="relative overflow-hidden pt-10 pb-24 md:pt-16 md:pb-32">
      {/* Background decorative elements */}
      <div className="absolute inset-0 w-full h-full z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-primary/10 to-teal-500/10 opacity-80"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI0MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiIGlkPSJhIj48c3RvcCBzdG9wLWNvbG9yPSIjRkZGIiBvZmZzZXQ9IjAlIi8+PHN0b3Agc3RvcC1jb2xvcj0iI0ZGRiIgc3RvcC1vcGFjaXR5PSIwIiBvZmZzZXQ9IjEwMCUiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBkPSJNMCAwaDcyMHY0MDBIMHoiIGZpbGw9InVybCgjYSkiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZmlsbC1vcGFjaXR5PSIuMDUiLz48L3N2Zz4=')] bg-center bg-no-repeat opacity-100"></div>
        
        {/* Main decorative blurs */}
        <div className="absolute -top-64 -right-24 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-64 -left-24 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl"></div>
        
        {/* Floating decorative elements */}
        <motion.div 
          className="absolute top-20 left-[20%] w-10 h-10 bg-primary/10 rounded-full"
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
          className="absolute bottom-32 right-[15%] w-8 h-8 bg-teal-500/10 rounded-full"
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
        
        {/* Animated accent lines */}
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/40 to-transparent"
            animate={{
              opacity: [0, 1, 0],
              x: [-100, 0, 100]
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "linear"
            }}
          />
        </div>
        <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/40 to-transparent"
            animate={{
              opacity: [0, 1, 0],
              x: [-100, 0, 100]
            }}
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: "linear",
              delay: 2
            }}
          />
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Navigation stats bar */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white/90 backdrop-blur-md border border-neutral-200/50 rounded-2xl p-3 mb-12 shadow-xl max-w-3xl mx-auto flex flex-wrap justify-center sm:justify-between items-center"
        >
          <div className="flex items-center space-x-6 px-4">
            <div className="flex items-center text-sm">
              <div className="bg-amber-100 p-2 rounded-full">
                <Sparkles className="h-4 w-4 text-amber-500" />
              </div>
              <span className="font-medium ml-2">500+ kurzus</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="bg-primary/10 p-2 rounded-full">
                <GraduationCap className="h-4 w-4 text-primary" />
              </div>
              <span className="font-medium ml-2">5 partneri egyetem</span>
            </div>
          </div>
          <div className="text-sm bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-full px-4 py-1.5 font-medium shadow-sm">
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
            <div className="relative">
              <div className="absolute -left-8 -top-8 w-16 h-16 bg-blue-200/30 rounded-full blur-xl"></div>
              <div className="absolute -right-8 -bottom-4 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8 text-neutral-900">
                <span className="relative inline-block">
                  Tanulás a
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-primary to-teal-500">
                  jövő számára
                </span>
              </h1>
            </div>
            
            <p className="text-lg mb-8 max-w-lg text-neutral-700 leading-relaxed">
              Az Elira összeköti Önt Magyarország vezető egyetemeivel és oktatóival. 
              Fedezzen fel szakértői tudást, szerezzen elismert képesítéseket, és fejlessze karrierjét.
            </p>
            
            {/* Features list */}
            <div className="mb-8 space-y-4">
              {[
                {
                  text: "Elismert magyar egyetemek által hitelesített bizonyítványok",
                  icon: <GraduationCap className="h-5 w-5" />
                },
                {
                  text: "Személyre szabott tanulási tapasztalat",
                  icon: <Sparkles className="h-5 w-5" />
                },
                {
                  text: "Rugalmas tanulási ütemterv az Ön időbeosztásához igazítva",
                  icon: <Clock className="h-5 w-5" />
                }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index + 0.5 }}
                  whileHover={{ x: 3 }}
                  className="flex items-start p-3 bg-white/70 backdrop-blur-sm rounded-xl border border-neutral-100 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex-shrink-0 mr-3 h-10 w-10 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-full flex items-center justify-center">
                    <div className="text-primary">
                      {feature.icon}
                    </div>
                  </div>
                  <p className="text-neutral-700 font-medium mt-1">{feature.text}</p>
                </motion.div>
              ))}
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-wrap gap-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                {/* Decorative animation behind primary button */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/50 to-blue-500/50 blur-lg opacity-70 animate-pulse"></div>
                
                <Button 
                  onClick={handleJoinClick}
                  variant="default" 
                  size="lg" 
                  className="relative text-base font-medium bg-gradient-to-r from-primary to-blue-600 text-white hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 border-0 py-6 px-8"
                >
                  {isAuthenticated ? "Irányítópult" : "Csatlakozzon ingyen"}
                  <ArrowRight className="ml-2 h-5 w-5" />
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
                  className="text-base font-medium bg-white/80 backdrop-blur-sm border-neutral-200 text-neutral-800 hover:bg-white hover:border-primary/50 hover:text-primary transition-all duration-300 py-6 px-8"
                >
                  Kurzusok böngészése
                </Button>
              </motion.div>
              
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsVideoModalOpen(true)}
                className="flex items-center text-primary font-medium hover:text-blue-600 transition-colors duration-200"
              >
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-full shadow-md mr-3 border border-neutral-100 hover:shadow-lg transition-all duration-300">
                  <Play className="h-5 w-5 text-primary" fill="currentColor" />
                </div>
                <span className="text-base">Hogyan működik?</span>
              </motion.button>
            </div>
            
            {/* Trust indicators */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="mt-8 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-sm"
            >
              <div className="flex items-center mb-3 sm:mb-0">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mr-3">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-sm font-medium text-neutral-700">Több mint <span className="text-blue-600 font-bold text-base">50,000</span> tanuló megbízik bennünk</div>
              </div>
              <div className="sm:ml-auto flex items-center">
                <div className="flex -space-x-2 mr-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <motion.div 
                      key={i} 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1 + i * 0.1, duration: 0.3 }}
                      whileHover={{ y: -3, zIndex: 10 }}
                      className="w-8 h-8 rounded-full bg-neutral-200 border-2 border-white overflow-hidden shadow-sm relative z-0 hover:z-10"
                    >
                      <img 
                        src={`https://randomuser.me/api/portraits/men/${i + 10}.jpg`} 
                        alt="User" 
                        className="w-full h-full object-cover" 
                      />
                    </motion.div>
                  ))}
                </div>
                <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  +14.8K ezen a héten
                </span>
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
              {/* Decorative backdrop for the main platform display */}
              <div className="absolute inset-0 translate-x-5 translate-y-5 blur-xl opacity-40 bg-gradient-to-br from-blue-300/30 via-primary/30 to-teal-300/30 rounded-xl"></div>
              
              {/* Main platform image with interactive styling */}
              <motion.div
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl overflow-hidden shadow-2xl relative z-20 border border-neutral-200/50 backdrop-blur-sm"
              >
                {/* Platform header with animated dots */}
                <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-b border-neutral-100 flex items-center">
                  <div className="flex space-x-2 mr-4">
                    <motion.span 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2, repeatDelay: 1 }}
                      className="inline-block w-3 h-3 bg-red-500 rounded-full"
                    ></motion.span>
                    <motion.span 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2, repeatDelay: 1, delay: 0.3 }}
                      className="inline-block w-3 h-3 bg-yellow-500 rounded-full"
                    ></motion.span>
                    <motion.span 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2, repeatDelay: 1, delay: 0.6 }}
                      className="inline-block w-3 h-3 bg-green-500 rounded-full"
                    ></motion.span>
                  </div>
                  <div className="flex-1 bg-neutral-100 h-7 rounded-full overflow-hidden flex items-center justify-center">
                    <div className="text-xs text-neutral-500 font-medium">elira.hu</div>
                  </div>
                </div>
                
                {/* Main platform content */}
                <img 
                  src={heroImage} 
                  alt="Elira platform" 
                  className="w-full h-auto object-contain"
                />
                
                {/* Platform footer with progress */}
                <div className="bg-white p-6 border-t border-neutral-100">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-lg text-neutral-800">Haladási áttekintő</h3>
                    <div className="text-xs px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium">
                      Jelenleg aktív
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span className="text-neutral-600">Teljes haladás</span>
                        <span className="font-bold text-neutral-800">75%</span>
                      </div>
                      <div className="h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: "0%" }}
                          animate={{ width: "75%" }}
                          transition={{ duration: 1.5, delay: 1 }}
                          className="h-full bg-gradient-to-r from-primary to-blue-500 rounded-full"
                        ></motion.div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>4/6 teljesített modul</span>
                      <span>2 nap múlva esedékes</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Course rating overlay element */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute top-10 -left-8 z-30 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-neutral-200"
                whileHover={{ 
                  scale: 1.05,
                  rotate: -2,
                  boxShadow: "0 15px 30px rgba(0,0,0,0.1)"
                }}
              >
                <div className="flex items-center space-x-1 mb-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <motion.svg 
                      key={i} 
                      animate={i === 5 ? { scale: [1, 1.3, 1], rotate: [0, 10, 0] } : {}}
                      transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
                      className="w-4 h-4 text-yellow-400" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.799-2.034c-.784-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </motion.svg>
                  ))}
                </div>
                <div className="text-lg font-bold">4.9/5.0</div>
                <div className="text-xs text-neutral-500 font-medium">Több mint 500 értékelés</div>
                <div className="mt-2 pt-2 border-t border-neutral-200">
                  <div className="text-xs text-green-600 font-medium flex items-center">
                    <ArrowRight className="h-3 w-3 mr-1" />
                    Kiemelkedő minőség
                  </div>
                </div>
              </motion.div>
              
              {/* Active learners overlay element */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute -bottom-8 right-0 z-30 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-neutral-200"
                whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
              >
                <div className="text-sm font-medium mb-2 text-neutral-700">Aktív tanulók most</div>
                <div className="flex items-center">
                  <div className="relative mr-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <motion.div 
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-6 h-6 bg-green-500 rounded-full"
                      ></motion.div>
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-neutral-800">1,248</div>
                    <div className="text-xs text-green-600 font-medium flex items-center">
                      <ArrowRight className="h-3 w-3 mr-1" />
                      +24% az előző héthez képest
                    </div>
                  </div>
                </div>
              </motion.div>
              
              {/* Universities logos floating element */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -top-10 right-10 z-30 bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-neutral-200"
                whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(0,0,0,0.1)" }}
              >
                <div className="flex items-center mb-2">
                  <GraduationCap className="h-4 w-4 text-blue-600 mr-2" />
                  <div className="text-sm font-medium text-neutral-700">Partneregyetemek</div>
                </div>
                <div className="flex space-x-2">
                  <motion.div 
                    whileHover={{ y: -2 }}
                    className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-1 shadow-sm border border-neutral-100"
                  >
                    <img src="https://bme.hu/sites/default/files/page/field_main_image/bme_logo.png" alt="BME" className="w-full h-full object-contain" />
                  </motion.div>
                  <motion.div 
                    whileHover={{ y: -2 }}
                    className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-1 shadow-sm border border-neutral-100"
                  >
                    <img src="https://www.uni-corvinus.hu/wp-content/uploads/2021/10/corvinus_logo_color.png" alt="Corvinus" className="w-full h-full object-contain" />
                  </motion.div>
                  <motion.div 
                    whileHover={{ y: -2 }}
                    className="w-10 h-10 rounded-lg bg-white flex items-center justify-center p-1 shadow-sm border border-neutral-100"
                  >
                    <img src="https://media.licdn.com/dms/image/C4D0BAQHcMIgd_7HhEw/company-logo_200_200/0/1630592132108?e=2147483647&v=beta&t=4nDLuA7mPJiBtI9XsL7HFOjqF0SibCvn2h6mnPTxzQ4" alt="ELTE" className="w-full h-full object-contain" />
                  </motion.div>
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
      
      {/* Video Modal */}
      <VideoModal 
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </section>
  );
};

export default Hero;
