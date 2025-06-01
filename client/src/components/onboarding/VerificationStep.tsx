import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VerificationStepProps {
  userData: {
    userType: string;
    email: string;
    verificationCode: string;
    goal: string;
  };
  updateUserData: (data: Partial<{ userType: string; email: string; verificationCode: string; goal: string; }>) => void;
  onNext: () => void;
  onBack: () => void;
}

const VerificationStep: React.FC<VerificationStepProps> = ({
  userData,
  updateUserData,
  onNext,
  onBack
}) => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first input on component mount
  useEffect(() => {
    const firstInput = inputRefs.current[0];
    if (firstInput) {
      firstInput.focus();
    }
  }, []);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      // If pasting, distribute characters across inputs
      const chars = value.split('');
      const newCode = [...verificationCode];
      
      chars.forEach((char, charIndex) => {
        if (index + charIndex < newCode.length) {
          newCode[index + charIndex] = char;
        }
      });
      
      setVerificationCode(newCode);
      
      // Focus on the appropriate input after paste
      const nextIndex = Math.min(index + chars.length, verificationCode.length - 1);
      const nextInput = inputRefs.current[nextIndex];
      if (nextInput) {
        nextInput.focus();
      }
    } else {
      // Normal single character input
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);
      
      // Auto-focus next input
      if (value && index < verificationCode.length - 1) {
        const nextInput = inputRefs.current[index + 1];
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!verificationCode[index] && index > 0) {
        const prevInput = inputRefs.current[index - 1];
        if (prevInput) {
          prevInput.focus();
        }
      }
    }
  };

  const handleVerify = () => {
    const code = verificationCode.join('');
    if (code.length !== 6) return;
    
    setIsVerifying(true);
    
    // Simulate verification
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      updateUserData({ verificationCode: code });
      
      // Proceed to next step after verification
      setTimeout(() => {
        onNext();
      }, 1000);
    }, 1500);
  };

  const handleResendCode = () => {
    setIsResending(true);
    
    // Simulate resending code
    setTimeout(() => {
      setIsResending(false);
      // Reset the inputs
      setVerificationCode(['', '', '', '', '', '']);
      const firstInput = inputRefs.current[0];
      if (firstInput) {
        firstInput.focus();
      }
    }, 1500);
  };

  // Check if all inputs are filled
  const isCodeComplete = verificationCode.every(v => v !== '');

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
            <h1 className="text-2xl font-bold mb-4">Ellenőrző kód megadása</h1>
            <p className="text-neutral-600 mb-6">
              Elküldtünk egy 6 számjegyű ellenőrző kódot a következő e-mail címre:<br />
              <span className="font-medium">{userData.email}</span>
            </p>

            <div className="mb-6">
              <div className="flex justify-between max-w-sm mx-auto mb-4">
                {verificationCode.map((digit, index) => (
                  <div key={index} className="w-12">
                    <Input
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      ref={(el) => inputRefs.current[index] = el}
                      className="w-full h-12 text-center text-lg font-medium rounded-lg border"
                      disabled={isVerifying || isVerified}
                    />
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col items-center">
                {!isVerified ? (
                  <Button 
                    onClick={handleVerify}
                    disabled={!isCodeComplete || isVerifying || isVerified}
                    className="w-full max-w-sm mb-4"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Ellenőrzés...
                      </>
                    ) : 'Ellenőrzés'}
                  </Button>
                ) : (
                  <div className="flex items-center text-green-600 mb-4">
                    <Check className="mr-2 h-5 w-5" />
                    <span>Sikeres ellenőrzés!</span>
                  </div>
                )}
                
                <button 
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending || isVerifying || isVerified}
                  className="text-primary hover:underline text-sm font-medium"
                >
                  {isResending ? (
                    <span className="flex items-center">
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Kód újraküldése...
                    </span>
                  ) : 'Nem kapta meg a kódot? Új kód küldése'}
                </button>
              </div>
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
                Az e-mail cím ellenőrzése után már csak néhány lépés választja el 
                attól, hogy hozzáférjen a legjobb magyar egyetemek kurzusaihoz.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white/10 rounded-xl p-4"
            >
              <div className="flex items-start">
                <div className="w-8 h-8 rounded-full bg-white text-primary flex items-center justify-center mr-3 shrink-0">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold">Adatbiztonság a fókuszban</h3>
                  <p className="text-sm text-white/70">
                    Az Academion platform teljes mértékben megfelel a GDPR előírásoknak, 
                    és a legmodernebb titkosítási technológiákat alkalmazza az Ön adatainak védelmére.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationStep;