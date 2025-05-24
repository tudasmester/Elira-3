import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserTypeStepProps {
  userData: {
    userType: string;
    email: string;
    verificationCode: string;
    goal: string;
  };
  updateUserData: (data: Partial<typeof userData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const UserTypeStep: React.FC<UserTypeStepProps> = ({
  userData,
  updateUserData,
  onNext,
  onBack
}) => {
  const handleSelectType = (type: string) => {
    updateUserData({ userType: type });
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-8 md:p-12">
        <button 
          onClick={onBack}
          className="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Vissza
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-primary text-2xl font-bold font-heading mb-6">Elira</div>
          <h1 className="text-3xl font-bold mb-4">Mi hozta az Elira platformra?</h1>
          <p className="text-neutral-600 mb-10">
            Válassza ki, hogy milyen minőségben szeretné használni a platformot, így személyre szabhatjuk élményét.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectType("student")}
              className="bg-white border-2 border-neutral-200 hover:border-primary rounded-xl p-6 cursor-pointer transition-colors"
            >
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L3 9L12 14L21 9L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3 9V18L12 23L21 18V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 14V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Tanulni szeretnék</h3>
              <p className="text-neutral-600 text-center text-sm">
                Kurzusokat keresek, hogy új készségeket sajátítsak el és fejlesszem tudásomat
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectType("teacher")}
              className="bg-white border-2 border-neutral-200 hover:border-primary rounded-xl p-6 cursor-pointer transition-colors"
            >
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21H7C4.79086 21 3 19.2091 3 17V10C3 7.79086 4.79086 6 7 6H17C19.2091 6 21 7.79086 21 10V17C21 19.2091 19.2091 21 17 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 10V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 14L12 10L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 3L14 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <h3 className="text-xl font-bold text-center mb-2">Tanítani szeretnék</h3>
              <p className="text-neutral-600 text-center text-sm">
                Oktatóként csatlakoznék a platformhoz, hogy megosszam tudásomat másokkal
              </p>
            </motion.div>
          </div>

          <div className="text-center text-sm text-neutral-500 mt-8">
            Már van fiókja? <a href="/login" className="text-primary hover:underline">Bejelentkezés</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserTypeStep;