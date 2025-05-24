import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import elteImage from "../assets/ELTE.png";

const degreePrograms = [
  {
    id: 1,
    university: "Budapesti Műszaki és Gazdaságtudományi Egyetem",
    universityLogo: "https://www.bme.hu/sites/default/files/hirek/BME-logo-2022-HU-blue.png",
    title: "BSc Gazdasági Informatika",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    type: "Diploma"
  },
  {
    id: 2,
    university: "Budapesti Műszaki és Gazdaságtudományi Egyetem",
    universityLogo: "https://www.bme.hu/sites/default/files/hirek/BME-logo-2022-HU-blue.png",
    title: "BSc Számítógépes Tudományok",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    type: "Diploma"
  },
  {
    id: 3,
    university: "Eötvös Loránd Tudományegyetem",
    universityLogo: "https://www.elte.hu/media/d3/03/8414d9b52afbc0ec63c2198c2c0cda24df9c02d3e21cce1320a9a71eee17/elte_cimer_color.svg",
    title: "BSc Marketing",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    type: "Diploma"
  },
  {
    id: 4,
    university: "Corvinus Egyetem",
    universityLogo: "https://www.uni-corvinus.hu/wp-content/uploads/2020/02/corvinus-logo.png",
    title: "MSc Vezetés és Szervezés",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    type: "Diploma"
  }
];

const DegreePrograms: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-sm text-indigo-600 font-medium mb-2">Diplomát adó programok</h3>
            <h2 className="text-2xl md:text-3xl font-bold text-indigo-900 mb-4">Találja meg az Önnek megfelelő felsőfokú végzettséget</h2>
            <p className="text-neutral-600 mb-8">Verhetetlen árak a legjobb egyetemek 100%-ban online diplomáira.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {degreePrograms.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-40">
                  <img 
                    src={program.image} 
                    alt={program.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-center mb-3">
                    <img 
                      src={program.universityLogo} 
                      alt={`${program.university} logó`}
                      className="h-6 mr-2 object-contain"
                    />
                    <span className="text-xs text-neutral-600">{program.university}</span>
                  </div>
                  <h3 className="font-bold text-lg mb-3">{program.title}</h3>
                  
                  <div className="flex items-center text-indigo-600 text-sm font-medium">
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16.28 13.61C15.15 14.74 13.53 15.09 12.1 14.64L9.51001 17.22C9.33001 17.41 8.96001 17.53 8.69001 17.49L7.49001 17.33C7.09001 17.28 6.73001 16.9 6.67001 16.51L6.51001 15.31C6.47001 15.04 6.60001 14.68 6.78001 14.49L9.36001 11.91C8.92001 10.48 9.26001 8.86001 10.39 7.73001C12.01 6.11001 14.65 6.11001 16.28 7.73001C17.9 9.34001 17.9 11.98 16.28 13.61Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M10.45 16.28L9.59998 15.42" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M13.3945 10.7H13.4035" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Szerezzen diplomát
                  </div>
                  <div className="mt-4">
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {program.type}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-10 flex justify-center md:justify-between flex-wrap gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="default" 
                size="lg" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-md shadow-md px-6"
              >
                További 8 megtekintése
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="lg" 
                className="text-indigo-600 border-indigo-600 hover:bg-indigo-50 rounded-md px-6"
              >
                Az összes megtekintése
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DegreePrograms;