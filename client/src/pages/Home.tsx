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

const Home: React.FC = () => {
  const [, setLocation] = useLocation();
  
  const handleJoinClick = () => {
    setLocation("/onboarding");
  };
  
  return (
    <>
      <Hero />
      <PartnerUniversities />
      <CareerPaths />
      <FreeCourses />
      <DegreePrograms />
      <PopularCertificates />
      <ExploreCategories />
      <Testimonials />
      
      {/* Final CTA Section */}
      <section className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-4">Tegye meg a következő lépést személyes céljai felé az Elira platformmal</h2>
                <p className="text-blue-100 mb-6">
                  Indítsa el, váltson vagy fejlessze karrierjét több mint 5800 kurzussal, szakmai bizonyítvánnyal és diplomával a világszínvonalú egyetemektől és vállalatoktól.
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={handleJoinClick}
                    className="bg-white hover:bg-blue-50 text-indigo-900 rounded-md shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Csatlakozzon ingyen
                  </Button>
                </motion.div>
              </motion.div>
            </div>
            <motion.div 
              className="md:w-1/3"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <img 
                src="https://images.unsplash.com/photo-1571260899304-425eee4c7efd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300" 
                alt="Tanuló diák" 
                className="rounded-lg w-full shadow-xl"
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-neutral-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-900 mb-4">elira</div>
            <p className="text-neutral-500 text-sm">© 2025 Elira Oktatási Platform. Minden jog fenntartva.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
