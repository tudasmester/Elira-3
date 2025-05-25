import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface WelcomeStepProps {
  onNext: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onNext }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row h-full">
        <div className="md:w-1/2 p-8 md:p-12">
          <div className="h-full flex flex-col">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-primary text-3xl font-bold font-heading mb-8">Academion</div>
              <h1 className="text-3xl font-bold mb-6">
                Új módja a <span className="text-primary">tanulásnak</span>
              </h1>
              <p className="text-neutral-600 mb-8">
                Fedezzen fel sokszínű kurzusokat vezető magyar egyetemektől, és érje el szakmai céljait az Elira segítségével.
              </p>
              <div className="mt-auto">
                <Button onClick={onNext} size="lg" className="w-full md:w-auto">
                  Kezdjük el
                </Button>
                <div className="mt-4 text-center text-sm text-neutral-500">
                  Már van fiókja? <a href="/login" className="text-primary hover:underline">Bejelentkezés</a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="md:w-1/2 bg-gradient-to-br from-primary to-secondary p-8 text-white flex items-center">
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                Tanuljon a legjobbaktól
              </h2>
              <p className="text-white/80">
                Csatlakozzon több mint 10,000 diákhoz, akik már élvezik a vezető magyar egyetemek 
                online kurzusait. Tanuljon rugalmasan, saját tempójában.
              </p>
            </div>
            
            <div className="flex items-center mb-6">
              <div className="flex -space-x-2 mr-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                    <img 
                      src={`https://i.pravatar.cc/150?img=${i+10}`} 
                      alt="User avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="font-bold">Megbízható platform</div>
                <div className="text-white/80">Több mint 10,000 felhasználó</div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {["BME", "ELTE", "Corvinus", "Debreceni Egyetem", "Szegedi Tudományegyetem"].map((uni) => (
                <div key={uni} className="bg-white/10 rounded-full px-3 py-1 text-sm">
                  {uni}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeStep;