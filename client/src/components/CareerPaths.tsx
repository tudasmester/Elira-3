import React, { useState } from "react";
import { ArrowRight, BarChart3, TrendingUp, ChevronRight } from "lucide-react";
import { careerPaths } from "@/data/careers";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

const CareerPaths: React.FC = () => {
  const [activeCard, setActiveCard] = useState(0);
  const [, setLocation] = useLocation();
  
  // Using the Data Scientist career from the existing careers data
  const dataScientist = careerPaths.find(career => career.id === 'data-scientist');
  
  const handleExploreCareer = () => {
    setLocation(`/careers/${dataScientist?.id}`);
  };
  
  return (
    <section className="py-16 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-primary-900">Indítson új karriert akár 6 hónap alatt</h2>
          <p className="text-neutral-600 mb-8">Nézze meg karrierprogramjainkat</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gradient-to-br from-primary to-blue-700 rounded-2xl p-6 mb-10 shadow-xl relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mt-20 -mr-20"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -mb-10 -ml-10"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 relative z-10">
            {/* Career Information Section */}
            <div className="lg:col-span-2 text-white">
              <div className="space-y-4">
                <div className="flex space-x-3">
                  <div className="bg-indigo-500/20 backdrop-blur-sm rounded-lg p-2">
                    <BarChart3 className="h-5 w-5 text-indigo-300" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-blue-200">{dataScientist?.category === 'tech' ? 'Technológia' : 'Szakmai terület'}</span>
                    <span className="text-sm text-blue-200">Keresett pozíció</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold">{dataScientist?.title}</h3>
                <p className="text-sm text-blue-100">{dataScientist?.description}</p>
                
                <div className="flex items-center space-x-3">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2">
                    <TrendingUp className="h-4 w-4 text-green-300" />
                  </div>
                  <div>
                    <div className="text-sm text-blue-200">Növekedési ráta</div>
                    <div className="text-lg font-semibold">{dataScientist?.growthRate}</div>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-blue-200">Átlagos fizetés</div>
                  <div className="text-xl font-semibold">{dataScientist?.averageSalary}</div>
                </div>
                
                <div className="pt-4">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button 
                      onClick={handleExploreCareer}
                      className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-md w-full shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Data Scientist karrierút
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Career Recommendations */}
            <div className="lg:col-span-3">
              <div className="text-white mb-3">
                <h4 className="text-lg font-semibold">Ajánlott szakmai tanúsítványok</h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Certificate Card 1 */}
                <motion.div 
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="bg-gradient-to-br from-blue-700 to-indigo-600 rounded-lg overflow-hidden flex cursor-pointer shadow-lg"
                >
                  <div className="w-2/5">
                    <img 
                      src="https://images.unsplash.com/photo-1456428746267-a1756408f782?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200" 
                      alt="IBM Data Science" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-3/5 p-3">
                    <div className="text-xs text-blue-300">IBM</div>
                    <div className="text-sm font-medium text-white">IBM Data Science Professional Certificate</div>
                    <div className="mt-2 flex items-center text-xs text-blue-300">
                      <span className="mr-2">4.9</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Certificate Card 2 */}
                <motion.div 
                  whileHover={{ scale: 1.03, y: -5 }}
                  className="bg-gradient-to-br from-blue-700 to-indigo-600 rounded-lg overflow-hidden flex cursor-pointer shadow-lg"
                >
                  <div className="w-2/5">
                    <img 
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200" 
                      alt="Microsoft Azure Data Scientist" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-3/5 p-3">
                    <div className="text-xs text-blue-300">Microsoft</div>
                    <div className="text-sm font-medium text-white">Microsoft Certified: Azure Data Scientist</div>
                    <div className="mt-2 flex items-center text-xs text-blue-300">
                      <span className="mr-2">4.8</span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CareerPaths;
