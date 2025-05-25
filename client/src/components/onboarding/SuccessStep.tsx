import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";

interface SuccessStepProps {
  userData: {
    userType: string;
    email: string;
    verificationCode: string;
    goal: string;
  };
  onFinish: () => void;
}

const SuccessStep: React.FC<SuccessStepProps> = ({
  userData,
  onFinish
}) => {
  // Trigger confetti on component mount
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // since particles fall down, start a bit higher than random
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  // Determine the text based on user type and goal
  const getUserTypeText = () => {
    if (userData.userType === "student") {
      return "tanuló";
    } else {
      return "oktató";
    }
  };

  const getGoalText = () => {
    switch (userData.goal) {
      case "learn":
        return "új készségek elsajátítása";
      case "certificate":
        return "tanúsítvány megszerzése";
      case "career":
        return "karrierváltás";
      default:
        return "tanulás";
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="p-8 md:p-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
              <svg className="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Gratulálunk!</h1>
          <p className="text-xl text-neutral-600 mb-8 max-w-lg mx-auto">
            Sikeresen befejezte a regisztrációt! Üdvözöljük az Academion platformon, mint {getUserTypeText()}.
          </p>

          <div className="bg-neutral-50 rounded-xl p-6 mb-8 max-w-md mx-auto">
            <h2 className="text-lg font-bold mb-4">Az Ön profilja</h2>
            <div className="text-left space-y-4">
              <div>
                <div className="text-sm text-neutral-500">E-mail cím</div>
                <div className="font-medium">{userData.email}</div>
              </div>
              <div>
                <div className="text-sm text-neutral-500">Felhasználó típusa</div>
                <div className="font-medium">{userData.userType === "student" ? "Tanuló" : "Oktató"}</div>
              </div>
              <div>
                <div className="text-sm text-neutral-500">Fő cél</div>
                <div className="font-medium capitalize">{getGoalText()}</div>
              </div>
            </div>
          </div>

          <p className="text-neutral-600 mb-8">
            A következő lépésben testreszabjuk a felületet az Ön céljának megfelelően: <strong>{getGoalText()}</strong>.
          </p>
          
          <Button 
            onClick={onFinish}
            size="lg"
            className="min-w-[200px]"
          >
            Irány a kezdőlap
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessStep;