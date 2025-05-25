import React from "react";
import { universities } from "@/data/universities";
import { motion } from "framer-motion";
import elteImage from "../assets/ELTE.png";
import corvinusImage from "../assets/corvinus_logo_angol_sz_transparent.png";
import bmeImage from "../assets/bme.png";
import miskolciImage from "../assets/miskolci_new.png";
import otpBankImage from "../assets/otp_bank.png";

const PartnerUniversities: React.FC = () => {
  return (
    <section className="py-16 bg-neutral-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl font-bold mb-4 text-neutral-900"
          >
            Partneri egyetemek és vállalatok
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-neutral-600 text-lg"
          >
            Elismert intézményektől tanulhat, akik garantálják a minőségi oktatást
          </motion.p>
        </div>
        
        {/* University Partners SVG for larger screens */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="hidden lg:block mx-auto mb-12"
        >
          <img 
            src="/images/university-partners.svg" 
            alt="Partneri egyetemek és vállalatok" 
            className="w-full max-w-4xl h-auto mx-auto"
          />
        </motion.div>
        
        {/* Animated partner bar for mobile/tablet */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="lg:hidden bg-gradient-to-r from-primary to-teal-600 rounded-2xl p-6 text-white shadow-xl mb-8"
        >
          <motion.h3 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center text-xl mb-6 font-medium"
          >
            Együttműködünk vezető magyar intézményekkel
          </motion.h3>
          <div className="flex flex-wrap justify-center items-center gap-6">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1 }}
              className="cursor-pointer rounded-lg bg-white/20 backdrop-blur-sm p-2 flex items-center justify-center"
            >
              <div className="bg-white rounded-md px-3 py-1.5 flex items-center justify-center">
                <img 
                  src={miskolciImage} 
                  alt="Miskolci Egyetem logó" 
                  className="h-8 object-contain"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1 }}
              className="cursor-pointer rounded-lg bg-white/20 backdrop-blur-sm p-2 flex items-center justify-center"
            >
              <div className="bg-white rounded-md px-3 py-1.5 flex items-center justify-center">
                <img 
                  src={bmeImage} 
                  alt="BME logó" 
                  className="h-8 object-contain"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1 }}
              className="cursor-pointer rounded-lg bg-white/20 backdrop-blur-sm p-2 flex items-center justify-center"
            >
              <div className="bg-white rounded-md px-3 py-1.5 flex items-center justify-center">
                <img 
                  src={corvinusImage} 
                  alt="Corvinus Egyetem logó" 
                  className="h-8 object-contain"
                />
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.1 }}
              className="cursor-pointer rounded-lg bg-white/20 backdrop-blur-sm p-2 flex items-center justify-center"
            >
              <div className="bg-white rounded-md px-3 py-1.5 flex items-center justify-center">
                <img 
                  src={otpBankImage} 
                  alt="OTP Bank logó" 
                  className="h-8 object-contain"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* University cards with details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
          {/* BME Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-16 w-16 bg-neutral-50 rounded-full flex items-center justify-center p-3 mr-4">
                  <img src={bmeImage} alt="BME" className="max-h-full max-w-full object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-neutral-900">BME</h3>
                  <p className="text-sm text-neutral-500">Műszaki és Informatikai</p>
                </div>
              </div>
              <p className="text-neutral-600 text-sm mb-4">
                A BME Magyarország vezető műszaki egyeteme, amely minőségi oktatást biztosít a mérnöki és informatikai területeken.
              </p>
              <div className="flex items-center text-sm text-neutral-500">
                <span className="font-medium text-primary">32</span>
                <span className="mx-2">kurzus</span>
                <span className="mx-2">•</span>
                <span className="font-medium text-primary">5</span>
                <span className="ml-2">szakterület</span>
              </div>
            </div>
          </motion.div>
          
          {/* Corvinus Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-16 w-16 bg-neutral-50 rounded-full flex items-center justify-center p-3 mr-4">
                  <img src={corvinusImage} alt="Corvinus" className="max-h-full max-w-full object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-neutral-900">Corvinus</h3>
                  <p className="text-sm text-neutral-500">Gazdasági és Üzleti</p>
                </div>
              </div>
              <p className="text-neutral-600 text-sm mb-4">
                A Corvinus Egyetem Közép-Európa egyik legjobb üzleti iskolája, gazdasági és társadalomtudományi képzésekkel.
              </p>
              <div className="flex items-center text-sm text-neutral-500">
                <span className="font-medium text-primary">28</span>
                <span className="mx-2">kurzus</span>
                <span className="mx-2">•</span>
                <span className="font-medium text-primary">4</span>
                <span className="ml-2">szakterület</span>
              </div>
            </div>
          </motion.div>
          
          {/* OTP Bank Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
          >
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="h-16 w-16 bg-neutral-50 rounded-full flex items-center justify-center p-3 mr-4">
                  <img src={otpBankImage} alt="OTP Bank" className="max-h-full max-w-full object-contain" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-neutral-900">OTP Bank</h3>
                  <p className="text-sm text-neutral-500">Vállalati Partner</p>
                </div>
              </div>
              <p className="text-neutral-600 text-sm mb-4">
                Az OTP Bank Magyarország vezető pénzügyi szolgáltatója, amely szakmai kurzusokat kínál a banki és pénzügyi szektorban.
              </p>
              <div className="flex items-center text-sm text-neutral-500">
                <span className="font-medium text-primary">15</span>
                <span className="mx-2">kurzus</span>
                <span className="mx-2">•</span>
                <span className="font-medium text-primary">3</span>
                <span className="ml-2">szakterület</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PartnerUniversities;
