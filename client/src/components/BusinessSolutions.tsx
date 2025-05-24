import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const partnerLogos = [
  { id: 1, name: "L'Oreal", logoUrl: "https://pixabay.com/get/g337022df27b91f7690fa019be7f9188444727687b9da8ab12ba59ca062a2ba8c7afeccb80434e1f7a314f7aefce9588d7cc0d16d78a803821225b5e879bf0d08_1280.jpg" },
  { id: 2, name: "P&G", logoUrl: "https://pixabay.com/get/g337022df27b91f7690fa019be7f9188444727687b9da8ab12ba59ca062a2ba8c7afeccb80434e1f7a314f7aefce9588d7cc0d16d78a803821225b5e879bf0d08_1280.jpg" },
  { id: 3, name: "Tata", logoUrl: "https://pixabay.com/get/g337022df27b91f7690fa019be7f9188444727687b9da8ab12ba59ca062a2ba8c7afeccb80434e1f7a314f7aefce9588d7cc0d16d78a803821225b5e879bf0d08_1280.jpg" },
  { id: 4, name: "Danone", logoUrl: "https://pixabay.com/get/gd24b84804f136c56fc5be9826450ad05303ca2c3fb79de8ccf569cb8a894331d09e47fb733513b5a6b61e46387ebeb780648116c1f20d7cc1b9e1d4e7669f8dc_1280.jpg" },
  { id: 5, name: "Emirates", logoUrl: "https://pixabay.com/get/gd24b84804f136c56fc5be9826450ad05303ca2c3fb79de8ccf569cb8a894331d09e47fb733513b5a6b61e46387ebeb780648116c1f20d7cc1b9e1d4e7669f8dc_1280.jpg" },
  { id: 6, name: "Reliance", logoUrl: "https://pixabay.com/get/gd24b84804f136c56fc5be9826450ad05303ca2c3fb79de8ccf569cb8a894331d09e47fb733513b5a6b61e46387ebeb780648116c1f20d7cc1b9e1d4e7669f8dc_1280.jpg" },
  { id: 7, name: "Capgemini", logoUrl: "https://pixabay.com/get/gd24b84804f136c56fc5be9826450ad05303ca2c3fb79de8ccf569cb8a894331d09e47fb733513b5a6b61e46387ebeb780648116c1f20d7cc1b9e1d4e7669f8dc_1280.jpg" },
  { id: 8, name: "Petrobras", logoUrl: "https://pixabay.com/get/gd24b84804f136c56fc5be9826450ad05303ca2c3fb79de8ccf569cb8a894331d09e47fb733513b5a6b61e46387ebeb780648116c1f20d7cc1b9e1d4e7669f8dc_1280.jpg" },
  { id: 9, name: "GE", logoUrl: "https://pixabay.com/get/gd24b84804f136c56fc5be9826450ad05303ca2c3fb79de8ccf569cb8a894331d09e47fb733513b5a6b61e46387ebeb780648116c1f20d7cc1b9e1d4e7669f8dc_1280.jpg" },
];

const BusinessSolutions: React.FC = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-neutral-100 rounded-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 p-8 md:p-12">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold font-heading text-neutral-800 mb-4"
              >
                Az ideális megoldás az Ön vállalkozása számára
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-neutral-600 mb-6"
              >
                Próbálja ki a világ vezető szervezetei által is választott világszínvonalú oktatást és fejlesztést. Mindezt a Elira for Business keretében.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button className="mb-4">Fedezze fel a Elira for Business-t</Button>
                <p className="text-sm text-neutral-600">
                  Egy kis csapatot szeretne továbbképezni? 
                  <a href="#" className="text-primary hover:underline ml-1">A Elira for Teams megtekintése</a>
                </p>
              </motion.div>
            </div>
            <div className="md:w-1/2 flex justify-center items-center bg-gradient-to-br from-primary to-secondary p-8">
              <div className="grid grid-cols-3 gap-4">
                {partnerLogos.map((logo, index) => (
                  <motion.div
                    key={logo.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white p-3 rounded-lg flex items-center justify-center"
                  >
                    <img src={logo.logoUrl} alt={`${logo.name} logó`} className="w-full h-8 object-contain" />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessSolutions;
