import React from "react";
import Layout from "@/components/Layout";
import AICareerPathVisualization from "@/components/AICareerPathVisualization";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { BrainCircuit, Sparkles, Activity, Users } from "lucide-react";

const CareerPathsAI: React.FC = () => {
  const [, setLocation] = useLocation();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-900/5 to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-1/3 left-10 w-64 h-64 bg-purple-300/10 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                  <BrainCircuit className="w-4 h-4 mr-2" />
                  Mesterséges intelligencia
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
                    AI-alapú karriertervezés
                  </span>
                </h1>
                <p className="text-lg text-neutral-700 mb-8 leading-relaxed">
                  Fedezze fel a személyre szabott karrierutakat és fejlődési lehetőségeket
                  a legmodernebb mesterséges intelligencia segítségével. Ismerje meg a 
                  szükséges készségeket és képzéseket, amelyek a sikeres karrierhez vezetnek.
                </p>
                
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={() => document.getElementById('career-paths')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                  >
                    Karrierutak felfedezése
                  </Button>
                  <Button
                    onClick={() => setLocation("/career-assessment")}
                    variant="outline"
                    className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                  >
                    Személyes értékelés
                  </Button>
                </div>
              </motion.div>
            </div>
            
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white p-6 rounded-2xl shadow-xl border border-indigo-100 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full -mt-10 -mr-10"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white mr-3">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-semibold text-neutral-800">AI karriertervező előnyei</h3>
                  </div>
                  
                  <div className="space-y-4">
                    {[
                      {
                        icon: <BrainCircuit className="h-5 w-5 text-indigo-600" />,
                        title: "Intelligens elemzés",
                        description: "Az AI elemzi a munkaerőpiaci trendeket és azonosítja a legkeresettebb készségeket"
                      },
                      {
                        icon: <Activity className="h-5 w-5 text-purple-600" />,
                        title: "Személyre szabott",
                        description: "Az Ön céljaihoz és készségeihez igazított karrierút tervezés"
                      },
                      {
                        icon: <Users className="h-5 w-5 text-blue-600" />,
                        title: "Szakértői adatok",
                        description: "Valós idejű adatok és szakértői betekintés a karrierlehetőségekbe"
                      }
                    ].map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                        className="flex bg-gradient-to-r from-indigo-50/50 to-white rounded-lg p-3 border border-indigo-100"
                      >
                        <div className="flex-shrink-0 mr-3">
                          {benefit.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-neutral-800">{benefit.title}</h4>
                          <p className="text-sm text-neutral-600">{benefit.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Career Path Visualization */}
      <div id="career-paths">
        <AICareerPathVisualization />
      </div>
      
      {/* Additional content could be added here */}
    </Layout>
  );
};

export default CareerPathsAI;