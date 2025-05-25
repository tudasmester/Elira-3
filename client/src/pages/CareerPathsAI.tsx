import React from "react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { BrainCircuit, Sparkles, Activity, Users, Lightbulb, Target, Rocket, ChevronDown } from "lucide-react";
import CareerQuestionnaire from "@/components/CareerQuestionnaire";

const CareerPathsAI: React.FC = () => {
  const [, setLocation] = useLocation();

  return (
    <>
      {/* Premium Hero Section */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiM2MzY2RjEiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2LTJoLTF2MnptLTItMmgydi0xaC0ydjF6bS0yIDJoMXYxaC0xdi0xem0tMi0yaDF2MWgtMXYtMXptLTItMWgxdjFoLTF2LTF6bS0yIDFoMXYxaC0xdi0xem0tMi0xaDF2MWgtMXYtMXptMTYgMTBoLTF2Mmgxdi0yem0tMiAwaDFWMzBoLTF2MXptLTIgMGgxdi0yaC0xdjJ6bS0yIDBoMXYtMWgtMXYxem0tMiAwaDFWMjloLTF2MnptLTIgMGgxVjI4aC0xdjN6bS0yIDBoMVYyOGgtMXYzem0tMiAwaDFWMjhoLTF2M3ptLTIgMGgxVjI5aC0xdjJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20 mix-blend-overlay pointer-events-none"></div>
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl -z-10"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-300/10 rounded-full blur-3xl -z-10"></div>
        
        {/* Premium Seal */}
        <div className="absolute top-10 right-10 lg:top-20 lg:right-20 hidden md:block">
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 blur-sm opacity-80 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-amber-400 to-amber-600 text-white font-bold text-xs uppercase tracking-wider py-1.5 px-3 rounded-full border border-amber-200 shadow-lg flex items-center">
              <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-100" />
              <span>Prémium Teszt</span>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-indigo-700 rounded-full text-sm font-medium mb-6 border border-indigo-100/50 shadow-sm">
                  <BrainCircuit className="w-4 h-4 mr-2 text-indigo-600" />
                  <span className="bg-gradient-to-r from-indigo-700 to-purple-700 inline-block text-transparent bg-clip-text">
                    Tudományos karrierelemzés
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
                    Fedezze fel valódi karrierútját
                  </span>
                </h1>
                
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-px flex-grow bg-gradient-to-r from-indigo-200 to-transparent"></div>
                  <div className="px-4 py-1.5 rounded-md bg-indigo-50 text-indigo-700 font-medium text-sm border border-indigo-100">
                    98% megbízhatóság
                  </div>
                  <div className="h-px flex-grow bg-gradient-to-l from-indigo-200 to-transparent"></div>
                </div>
                
                <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                  Prémium karrierelemzésünk feltárja rejtett tehetségeit és azonosítja az Önhöz tökéletesen illő karrierutakat – pontosan olyan részletességgel, ahogy Ön személyes.
                </p>
                
                <div className="relative">
                  <div className="bg-white/70 backdrop-blur-md p-5 rounded-xl border border-indigo-200/70 shadow-xl mb-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500"></div>
                    
                    <div className="flex flex-col gap-5">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white mr-4 flex-shrink-0 shadow-md">
                          <Target className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-900 text-lg mb-1">Tudományos pontosság</h3>
                          <p className="text-neutral-700">Validált pszichometriai profilozás és munkaerőpiaci trendanalitika alapján.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white mr-4 flex-shrink-0 shadow-md">
                          <Lightbulb className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-neutral-900 text-lg mb-1">Személyre szabott jelentés</h3>
                          <p className="text-neutral-700">Részletes karrierút-térkép az Ön személyiségéhez és készségeihez igazítva.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 items-center">
                  <Button
                    onClick={() => document.getElementById('career-paths')?.scrollIntoView({ behavior: 'smooth' })}
                    className="relative overflow-hidden group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg"
                    size="lg"
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Rocket className="mr-2 h-5 w-5" />
                    <span>Indítsa el a felmérést</span>
                  </Button>
                  
                  <div className="flex items-center text-neutral-500 text-sm ml-2">
                    <div className="flex space-x-1 mr-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Sparkles key={star} className="h-4 w-4 text-amber-400" />
                      ))}
                    </div>
                    <span>8,500+ felhasználó értékelése alapján</span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 opacity-30 blur-lg"></div>
                <div className="relative bg-white/60 backdrop-blur-xl p-7 rounded-2xl shadow-xl border border-indigo-100 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full -mt-10 -mr-10"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full -mb-10 -ml-10"></div>
                  
                  <div className="relative">
                    <div className="flex items-center mb-6">
                      <div className="flex h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-bold text-neutral-800">Karrierelemzés jelentés</h3>
                        <p className="text-sm text-neutral-500">100% személyre szabott eredmények</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        {
                          title: "Átfogó karrierprofil",
                          value: "95%",
                          color: "from-blue-500 to-indigo-500"
                        },
                        {
                          title: "Készség-karrierút illeszkedés",
                          value: "98%",
                          color: "from-purple-500 to-pink-500"
                        },
                        {
                          title: "Személyiség-munkakörnyezet kompatibilitás",
                          value: "91%",
                          color: "from-emerald-500 to-teal-500"
                        }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                          className="bg-white rounded-lg p-4 border border-indigo-50 shadow-sm"
                        >
                          <div className="flex justify-between mb-1.5">
                            <h4 className="font-medium text-neutral-700">{item.title}</h4>
                            <span className="font-semibold text-indigo-700">{item.value}</span>
                          </div>
                          <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: "0%" }}
                              animate={{ width: item.value }}
                              transition={{ duration: 1, delay: 0.7 + index * 0.2 }}
                              className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                            ></motion.div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-indigo-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="mr-2 p-1.5 rounded-full bg-blue-50 text-blue-600">
                            <BrainCircuit className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium text-neutral-600">Mesterséges intelligencia alapú</span>
                        </div>
                        <div className="text-sm text-neutral-500 flex items-center">
                          <span className="text-indigo-600 font-medium">Prémium</span>
                          <div className="ml-1.5 p-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500">
                            <Sparkles className="h-3.5 w-3.5 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Career Questionnaire */}
      <div id="career-paths">
        <CareerQuestionnaire />
      </div>
      
      {/* Additional content could be added here */}
    </>
  );
};

export default CareerPathsAI;