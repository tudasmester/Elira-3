import React from "react";
import { universities } from "@/data/universities";
import { motion } from "framer-motion";

const PartnerUniversities: React.FC = () => {
  return (
    <section className="bg-neutral-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-neutral-900 rounded-xl p-8 text-white">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-xl mb-6 font-medium"
          >
            We collaborate with 350+ leading universities and companies
          </motion.h2>
          <div className="flex flex-wrap justify-center items-center gap-10">
            <motion.img 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" 
              alt="Google logo" 
              className="h-7 object-contain brightness-200"
            />
            <motion.img 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              src="https://upload.wikimedia.org/wikipedia/commons/4/4d/Stanford_University_logo.svg" 
              alt="Stanford logo" 
              className="h-7 object-contain brightness-200"
            />
            <motion.img 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" 
              alt="IBM logo" 
              className="h-7 object-contain brightness-200"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnerUniversities;
