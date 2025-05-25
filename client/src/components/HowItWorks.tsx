import React from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, GraduationCap, UserPlus, Search } from "lucide-react";

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const HowItWorks: React.FC = () => {
  const [, setLocation] = useLocation();
  
  const steps: Step[] = [
    {
      number: "01",
      title: "Regisztráljon ingyenesen",
      description: "Hozza létre fiókját és töltse ki tanulási céljait.",
      icon: <UserPlus className="h-6 w-6" />,
      color: "from-blue-400 to-blue-600"
    },
    {
      number: "02",
      title: "Fedezze fel a kurzusokat",
      description: "Böngéssze a különböző kategóriákat és találja meg az Önnek megfelelő képzéseket.",
      icon: <Search className="h-6 w-6" />,
      color: "from-primary to-teal-600"
    },
    {
      number: "03",
      title: "Iratkozzon fel a kurzusokra",
      description: "Válasszon az ingyenes és prémium kurzusok közül, és kezdje el a tanulást.",
      icon: <BookOpen className="h-6 w-6" />,
      color: "from-indigo-400 to-indigo-600"
    },
    {
      number: "04",
      title: "Szerezzen bizonyítványt",
      description: "Teljesítse a követelményeket és kapja meg az elismerést tudásáért.",
      icon: <GraduationCap className="h-6 w-6" />,
      color: "from-teal-400 to-teal-600"
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white z-0"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-40 right-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 left-10 w-64 h-64 bg-blue-100/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900"
          >
            Hogyan <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">működik</span>?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-neutral-700 text-lg"
          >
            Egyszerű lépések a tanulás megkezdéséhez az Academion platformon
          </motion.p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative">
          {/* Connecting line between steps */}
          <div className="hidden lg:block absolute top-24 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-gray-100 via-primary/20 to-gray-100 z-0"></div>
          
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-xl p-6 border border-neutral-100 hover:border-neutral-200 hover:shadow-lg transition-all duration-300 relative z-10"
            >
              <div className="mb-6 relative">
                {/* Step number with gradient background */}
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-xl mb-4`}>
                  {step.number}
                </div>
                
                {/* Connecting line for mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden absolute bottom-2 left-7 w-0.5 h-12 bg-gradient-to-b from-primary/30 to-transparent"></div>
                )}
              </div>
              
              <div className="flex items-center mb-3">
                <div className="mr-3 text-primary">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold text-neutral-900">{step.title}</h3>
              </div>
              <p className="text-neutral-600 mb-4">{step.description}</p>
              
              {/* Conditional button for first and second steps */}
              {index === 0 && (
                <Button 
                  onClick={() => setLocation("/api/login")}
                  variant="outline" 
                  size="sm"
                  className="mt-2 text-primary border-primary/30 hover:border-primary hover:bg-primary/5"
                >
                  Regisztráció
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              )}
              
              {index === 1 && (
                <Button 
                  onClick={() => setLocation("/courses")}
                  variant="outline" 
                  size="sm"
                  className="mt-2 text-primary border-primary/30 hover:border-primary hover:bg-primary/5"
                >
                  Kurzusok böngészése
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Custom illustration */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 max-w-2xl mx-auto"
        >
          <div className="rounded-2xl bg-white shadow-lg border border-neutral-100 p-6 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-white/20 z-0"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
              {/* Learning journey visualization */}
              <div className="flex-1">
                <div className="space-y-4">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-primary to-blue-500 rounded-full"></div>
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium text-primary">Kezdés</span>
                    <span className="font-medium text-neutral-400">Tanulás</span>
                    <span className="font-medium text-neutral-400">Bizonyítvány</span>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <h4 className="font-medium text-neutral-800 mb-1">Az Ön tanulási útja</h4>
                    <p className="text-sm text-neutral-600">Személyre szabott élmény az Ön céljaihoz igazítva</p>
                  </div>
                </div>
              </div>
              
              {/* Call to action */}
              <div className="md:w-1/3">
                <Button 
                  onClick={() => setLocation("/api/login")}
                  className="w-full bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 text-white"
                >
                  Kezdje el ma
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-xs text-center mt-3 text-neutral-500">
                  Több mint 50,000 tanuló már csatlakozott
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;