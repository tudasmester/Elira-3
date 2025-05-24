import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const certificates = [
  {
    id: 1,
    provider: "Google",
    title: "Google Data Analytics",
    description: "Data Analysis, Tableau, SQL",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
  },
  {
    id: 2,
    provider: "Google",
    title: "Google Project Management",
    description: "Project Planning, Communication, Leadership",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
  },
  {
    id: 3,
    provider: "Google",
    title: "Google IT Support",
    description: "Networking, Cybersecurity, System Administration",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1573495612937-f22e7f5d84aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
  },
  {
    id: 4,
    provider: "Google",
    title: "Google Digital Marketing",
    description: "SEO, Social Media, E-commerce",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200"
  }
];

const PopularCertificates: React.FC = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Most Popular Certificates</h2>
          <p className="text-neutral-600">Explore our most popular programs, get job-ready for an in-demand career</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {certificates.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-neutral-800 rounded-lg overflow-hidden"
            >
              <div className="relative">
                <img 
                  src={cert.image} 
                  alt={cert.title} 
                  className="w-full h-40 object-cover"
                />
              </div>
              <div className="p-4 text-white">
                <div className="text-xs text-neutral-400 mb-1">{cert.provider}</div>
                <h3 className="text-sm font-medium mb-2">{cert.title}</h3>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-neutral-400">{cert.description}</div>
                  <div className="flex items-center">
                    <span className="text-xs mr-1">{cert.rating}</span>
                    <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center space-x-4">
          <Button variant="outline" className="rounded-full bg-primary text-white border-none hover:bg-primary/90">
            Show more
          </Button>
          <Button variant="outline" className="rounded-full text-neutral-700 border-neutral-300 hover:bg-neutral-50">
            View All
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PopularCertificates;