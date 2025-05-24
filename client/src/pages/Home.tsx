import React from "react";
import Hero from "@/components/Hero";
import PartnerUniversities from "@/components/PartnerUniversities";
import CareerPaths from "@/components/CareerPaths";
import PopularCertificates from "@/components/PopularCertificates";
import ExploreCategories from "@/components/ExploreCategories";
import Testimonials from "@/components/Testimonials";
import { Button } from "@/components/ui/button";

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <PartnerUniversities />
      <CareerPaths />
      <PopularCertificates />
      <ExploreCategories />
      <Testimonials />
      
      {/* Final CTA Section */}
      <section className="bg-neutral-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Take the next step toward your personal goals with Coursera</h2>
              <p className="text-neutral-300 mb-6">
                Start, switch, or advance your career with more than 5,800 courses, Professional Certificates, and degrees from world-class universities and companies.
              </p>
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-md">
                Join for free
              </Button>
            </div>
            <div className="md:w-1/3">
              <img 
                src="https://images.unsplash.com/photo-1571260899304-425eee4c7efd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300" 
                alt="Student learning" 
                className="rounded-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-neutral-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary mb-4">coursera</div>
            <p className="text-neutral-500 text-sm">© 2025 Coursera Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Home;
