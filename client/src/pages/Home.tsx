import React from "react";
import Hero from "@/components/Hero";
import PartnerUniversities from "@/components/PartnerUniversities";
import CareerPaths from "@/components/CareerPaths";
import FeaturedCourses from "@/components/FeaturedCourses";
import DegreePrograms from "@/components/DegreePrograms";
import BusinessSolutions from "@/components/BusinessSolutions";
import AISection from "@/components/AISection";
import NewsletterCTA from "@/components/NewsletterCTA";

const Home: React.FC = () => {
  return (
    <>
      <Hero />
      <PartnerUniversities />
      <CareerPaths />
      <FeaturedCourses />
      <DegreePrograms />
      <BusinessSolutions />
      <AISection />
      <NewsletterCTA />
    </>
  );
};

export default Home;
