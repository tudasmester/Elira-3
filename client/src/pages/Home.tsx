import React from "react";
import Hero from "@/components/Hero";
import PartnerUniversities from "@/components/PartnerUniversities";
import CareerPaths from "@/components/CareerPaths";
import PopularCertificates from "@/components/PopularCertificates";
import ExploreCategories from "@/components/ExploreCategories";
import Testimonials from "@/components/Testimonials";
import DegreePrograms from "@/components/DegreePrograms";
import FreeCourses from "@/components/FreeCourses";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { ArrowRight, BarChart3, LightbulbIcon, Users, BookOpen, Award, Zap, Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

const Home: React.FC = () => {
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-4 text-neutral-900"
            >
              Miért válassza az <span className="text-primary">Academion</span> platformot?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-neutral-600 text-lg"
            >
              Célunk, hogy a magyar oktatás legjavát elérhetővé tegyük mindenki számára, bárhol és bármikor
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-neutral-50 rounded-xl p-6 border border-neutral-100 hover:shadow-md transition-all duration-300"
              >
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-bold mb-2 text-neutral-900">{benefit.title}</h3>
                <p className="text-neutral-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "500+", label: "Elérhető kurzus" },
              { number: "50 000+", label: "Regisztrált tanuló" },
              { number: "5", label: "Partneri egyetem" },
              { number: "98%", label: "Elégedettségi ráta" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-neutral-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <PartnerUniversities />
      
      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-bold mb-4 text-neutral-900"
            >
              Hogyan működik?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-neutral-600 text-lg"
            >
              Egyszerű lépésekkel kezdheti el tanulási útját az Academion platformon
            </motion.p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Step number */}
                <div className="text-6xl font-bold text-neutral-100 absolute -top-6 -left-2 select-none">
                  {step.number}
                </div>
                
                {/* Content */}
                <div className="bg-white rounded-xl p-6 border border-neutral-200 relative z-10 hover:shadow-md transition-all duration-300">
                  <h3 className="text-lg font-bold mb-2 text-neutral-900">{step.title}</h3>
                  <p className="text-neutral-600">{step.description}</p>
                </div>
                
                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-neutral-200 z-0">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-primary rounded-full"></div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                onClick={handleJoinClick}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {isAuthenticated ? "Irányítópult megtekintése" : "Kezdje el ingyenesen"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
      
      <FreeCourses />
      <CareerPaths />
      <DegreePrograms />
      <PopularCertificates />
      <ExploreCategories />
      <Testimonials />
      
      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                
                <div className="flex flex-wrap gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      onClick={handleJoinClick}
                      variant="default" 
                      className="bg-white hover:bg-white/90 text-primary rounded-md font-medium px-6"
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
                      variant="outline" 
                      className="text-white border-white hover:bg-white/10 transition-all duration-300 px-6"
                    >
                      Vállalati megoldások
                    </Button>
                  </motion.div>
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
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 border border-white/20">
                <h3 className="text-xl font-bold mb-4">Iratkozzon fel hírlevelünkre</h3>
                <p className="text-white/80 mb-6">Kapjon értesítéseket új kurzusokról, exkluzív ajánlatokról és oktatási tippekről</p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <input 
                    type="email" 
                    placeholder="Email címe" 
                    className="px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 flex-1"
                  />
                  <Button className="bg-white hover:bg-white/90 text-primary rounded-lg px-6">
                    Feliratkozás
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-xs text-white/60 mt-4">
                  Feliratkozásával elfogadja adatvédelmi szabályzatunkat. Bármikor leiratkozhat.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer was removed */}
    </>
  );
};

export default Home;
