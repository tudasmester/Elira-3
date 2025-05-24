import React from "react";
import { universities } from "@/data/universities";
import { motion } from "framer-motion";
import elteImage from "../assets/ELTE.png";

const PartnerUniversities: React.FC = () => {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-8 text-white shadow-xl"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-xl mb-6 font-medium"
          >
            Együttműködünk 350+ vezető egyetemmel és vállalattal
          </motion.h2>
          <div className="flex flex-wrap justify-center items-center gap-10">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.1 }}
              className="cursor-pointer"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" 
                alt="Google logó" 
                className="h-7 object-contain brightness-200"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.1 }}
              className="cursor-pointer"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/4/4d/Stanford_University_logo.svg" 
                alt="Stanford logó" 
                className="h-7 object-contain brightness-200"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.1 }}
              className="cursor-pointer"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" 
                alt="IBM logó" 
                className="h-7 object-contain brightness-200"
              />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PartnerUniversities;
