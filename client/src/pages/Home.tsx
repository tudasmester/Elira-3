import React, { useState } from "react";
import Hero from "@/components/Hero";
import PartnerUniversities from "@/components/PartnerUniversities";
import CareerPaths from "@/components/CareerPaths";
import PopularCertificates from "@/components/PopularCertificates";
import ExploreCategories from "@/components/ExploreCategories";
import Testimonials from "@/components/Testimonials";
import DegreePrograms from "@/components/DegreePrograms";
import FreeCourses from "@/components/FreeCourses";
import HowItWorks from "@/components/HowItWorks";
import OnboardingTour from "@/components/OnboardingTour";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowRight, BarChart3, LightbulbIcon, Users, BookOpen, Award, Send, CheckCircle, Zap } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useOnboardingTour } from "@/hooks/useOnboardingTour";
import { Link } from "wouter";

const Home: React.FC = () => {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const { showTour, startTour, closeTour, completeTour } = useOnboardingTour();

  
  const handleJoinClick = () => {
    if (isAuthenticated) {
      setLocation("/dashboard");
    } else {
      setLocation("/onboarding");
    }
  };
  
  // Benefits section data
  const benefits = [
    {
      icon: <BookOpen className="h-6 w-6 text-primary" />,
      title: "Elismert magyar egyetemek kurzusai",
      description: "Tanuljon a legkiválóbb magyar egyetemek és oktatóik által létrehozott kurzusokon, amelyek segítenek a szakmai fejlődésben."
    },
    {
      icon: <LightbulbIcon className="h-6 w-6 text-primary" />,
      title: "Személyre szabott tanulási élmény",
      description: "Az AI-alapú rendszerünk segít megtalálni az Ön számára legmegfelelőbb kurzusokat és tanulási útvonalakat."
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
      title: "Részletes fejlődési statisztikák",
      description: "Kövesse nyomon tanulási előrehaladását részletes jelentésekkel és teljesítménymutatókkal."
    },
    {
      icon: <Award className="h-6 w-6 text-primary" />,
      title: "Elismert bizonyítványok",
      description: "Szerezzen hivatalosan elismert bizonyítványokat, amelyek valódi értéket jelentenek a munkaerőpiacon."
    }
  ];
  
  // How it works steps
  const steps = [
    {
      number: "01",
      title: "Regisztráljon ingyenesen",
      description: "Hozza létre fiókját és töltse ki tanulási céljait."
    },
    {
      number: "02",
      title: "Fedezze fel a kurzusokat",
      description: "Böngéssze a különböző kategóriákat és találja meg az Önnek megfelelő képzéseket."
    },
    {
      number: "03",
      title: "Iratkozzon fel a kurzusokra",
      description: "Válasszon az ingyenes és prémium kurzusok közül, és kezdje el a tanulást."
    },
    {
      number: "04",
      title: "Szerezzen bizonyítványt",
      description: "Teljesítse a követelményeket és kapja meg az elismerést tudásáért."
    }
  ];
  
  return (
    <>
      <Hero />
      
      {/* Why Choose Academion Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-white z-0"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-teal-200/30 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-blue-200/30 rounded-full blur-xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-4 text-neutral-900"
            >
              Miért válassza az <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">Academion</span> platformot?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-neutral-700 text-lg"
            >
              Célunk, hogy a magyar oktatás legjavát elérhetővé tegyük mindenki számára, bárhol és bármikor
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -5, 
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
                className="bg-white rounded-xl p-6 border border-neutral-100 hover:border-neutral-200 transition-all duration-300 relative overflow-hidden group"
              >
                {/* Decorative background for each card */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 w-14 h-14 rounded-xl flex items-center justify-center mb-5 relative z-10 group-hover:from-primary/20 group-hover:to-blue-500/20 transition-all duration-300">
                  <div className="text-primary group-hover:text-blue-600 transition-colors duration-300">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold mb-3 text-neutral-900 relative z-10">{benefit.title}</h3>
                <p className="text-neutral-600 group-hover:text-neutral-700 transition-colors duration-300 relative z-10">{benefit.description}</p>
                
                <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-primary/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Button 
              onClick={() => setLocation("/courses")}
              variant="outline" 
              className="bg-white/80 backdrop-blur-sm text-primary border-primary/30 hover:border-primary hover:bg-primary/5"
            >
              Fedezze fel az összes előnyt
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </section>
      
      <PartnerUniversities />
      
      <HowItWorks />
      
      <FreeCourses />
      <CareerPaths />
      <DegreePrograms />
      <PopularCertificates />
      <ExploreCategories />
      <Testimonials />
      
      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/10 to-transparent"></div>
        <div className="absolute inset-0 bg-[url('/images/grid-pattern.svg')] bg-center opacity-10"></div>
        
        {/* Floating shapes */}
        <motion.div 
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute top-20 right-[15%] w-32 h-32 bg-white/10 rounded-full blur-2xl"
        ></motion.div>
        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          className="absolute bottom-20 left-[15%] w-40 h-40 bg-blue-400/10 rounded-full blur-2xl"
        ></motion.div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Fejlessze karrierjét az Academion segítségével már ma</h2>
                <p className="text-white/90 text-lg mb-8 max-w-lg">
                  Több mint 500 kurzus, szakmai bizonyítvány és diploma a legkiválóbb magyar egyetemektől és vállalati partnerektől. Csatlakozzon a több mint 50 000 tanulóhoz, akik már elkezdték tanulási útjukat.
                </p>
                
                <div className="flex flex-wrap gap-4 mb-8">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative"
                  >
                    {/* Decorative glow behind button */}
                    <div className="absolute inset-0 rounded-lg bg-white/30 blur-md"></div>
                    <Button 
                      onClick={handleJoinClick}
                      variant="default" 
                      className="relative bg-white hover:bg-white/90 text-primary font-medium px-6 py-6 shadow-xl"
                    >
                      {isAuthenticated ? "Irányítópult" : "Csatlakozzon ingyen"}
                      <Zap className="ml-2 h-4 w-4" />
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      onClick={() => setLocation("/business")}
                      variant="outline" 
                      className="text-white border-white hover:bg-white/10 transition-all duration-300 px-6 py-6"
                    >
                      Vállalati megoldások
                    </Button>
                  </motion.div>
                </div>
                
                {/* Added benefits list */}
                <div className="space-y-3">
                  {[
                    "Személyre szabott tanulási élmény",
                    "Elismert oktatók és szakemberek",
                    "Rugalmas tanulási ütemterv"
                  ].map((benefit, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      viewport={{ once: true }}
                      className="flex items-center"
                    >
                      <CheckCircle className="h-5 w-5 text-white/80 mr-3 flex-shrink-0" />
                      <span className="text-white/90">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
            
            {/* Newsletter signup */}
            <motion.div 
              className="lg:w-2/5 w-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/20 shadow-xl">
                <h3 className="text-xl font-bold mb-4">Iratkozzon fel hírlevelünkre</h3>
                <p className="text-white/80 mb-6">Kapjon értesítéseket új kurzusokról, exkluzív ajánlatokról és oktatási tippekről</p>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const email = (e.target as HTMLFormElement).email.value;
                  if (email) {
                    // Here you would normally submit to an API
                    alert(`Sikeres feliratkozás: ${email}`);
                    (e.target as HTMLFormElement).reset();
                  }
                }}>
                  <div className="flex flex-col sm:flex-row gap-3 mb-4">
                    <input 
                      name="email"
                      type="email" 
                      placeholder="Email címe" 
                      required
                      className="px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 flex-1"
                    />
                    <Button 
                      type="submit" 
                      className="bg-white hover:bg-white/90 text-primary rounded-lg px-6"
                    >
                      Feliratkozás
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Added success state */}
                  <div className="p-3 rounded-lg bg-white/10 mb-4 hidden" id="success-message">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-300 mr-2" />
                      <span className="text-white text-sm">Sikeres feliratkozás! Köszönjük!</span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-white/60 mt-2">
                    Feliratkozásával elfogadja adatvédelmi szabályzatunkat. Bármikor leiratkozhat.
                  </p>
                </form>
                
                {/* Added trust indicators */}
                <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-sm text-white/80 mb-3">Megbízható oktatási platformunk</p>
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-8 h-8 rounded-full bg-white overflow-hidden border-2 border-primary">
                          <img 
                            src={`https://randomuser.me/api/portraits/men/${i + 10}.jpg`} 
                            alt="User" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-white/80">
                      Csatlakozzon 50,000+ felhasználónkhoz
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      

      
      {/* Onboarding Tour */}
      <OnboardingTour
        isOpen={showTour}
        onClose={closeTour}
        onComplete={completeTour}
      />
      

    </>
  );
};

export default Home;
