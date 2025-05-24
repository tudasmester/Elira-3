import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EmailStepProps {
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

const EmailStep: React.FC<EmailStepProps> = ({
  userData,
  updateUserData,
  onNext,
  onBack
}) => {
  const [email, setEmail] = useState(userData.email);
  const [isValid, setIsValid] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setIsValid(validateEmail(newEmail));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsChecking(true);
    
    // Simulate email verification process
    setTimeout(() => {
      updateUserData({ email });
      setIsChecking(false);
      onNext();
    }, 1000);
  };

  // Determine user type label
  const userTypeLabel = userData.userType === "student" ? "tanuló" : "oktató";

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row h-full">
        <div className="md:w-1/2 p-8 md:p-12">
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
            <h1 className="text-2xl font-bold mb-4">Adja meg e-mail címét</h1>
            <p className="text-neutral-600 mb-6">
              Használja e-mail címét a regisztrációhoz és a bejelentkezéshez.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6 mb-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-1">
                    E-mail cím
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="pelda@email.com"
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={!isValid || isChecking}
                  >
                    {isChecking ? "Feldolgozás..." : "Folytatás"}
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-4 text-xs text-neutral-500">
              A Folytatás gombra kattintva elfogadja az <a href="#" className="text-primary hover:underline">Adatvédelmi szabályzatot</a> és a <a href="#" className="text-primary hover:underline">Felhasználási feltételeket</a>.
            </div>
          </motion.div>
        </div>
        
        <div className="md:w-1/2 bg-gradient-to-br from-primary to-secondary p-8 text-white flex items-center">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold mb-4">
                Tervezze meg jövőjét
              </h2>
              <p className="text-white/80">
                Rugalmas tanulási lehetőségek várják {userTypeLabel}ként platformunkon. 
                Csatlakozzon közösségünkhöz, ahol értékes tudást szerezhet és adhat át.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="bg-white/10 rounded-xl p-4 mb-4">
                <div className="flex items-start mb-2">
                  <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center mr-3 shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Rugalmas tanulás</h3>
                    <p className="text-sm text-white/70">Tanuljon a saját tempójában, bárhol és bármikor</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/10 rounded-xl p-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center mr-3 shrink-0">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold">Elismert tanúsítványok</h3>
                    <p className="text-sm text-white/70">Szerezzen értékes képesítéseket vezető magyar egyetemektől</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailStep;