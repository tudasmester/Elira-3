import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GoalSelectionStepProps {
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

const GoalSelectionStep: React.FC<GoalSelectionStepProps> = ({
  userData,
  updateUserData,
  onNext,
  onBack
}) => {
  const [selectedGoal, setSelectedGoal] = useState<string>(userData.goal || "");
  
  const goals = [
    {
      id: "learn",
      title: "Új készségek elsajátítása",
      description: "Fedezze fel a kurzusokat és sajátítsa el a készségeket, amelyek a karrierjét előremozdítják",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 4L3 9L12 14L21 9L12 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 9V18L12 23L21 18V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 14V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: "certificate",
      title: "Tanúsítvány megszerzése",
      description: "Szerezzen elismert tanúsítványt egy vezető magyar egyetemtől",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 15C15.866 15 19 11.866 19 8C19 4.13401 15.866 1 12 1C8.13401 1 5 4.13401 5 8C5 11.866 8.13401 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.21 13.89L7 23L12 20L17 23L15.79 13.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: "career",
      title: "Karrierváltás",
      description: "Új szakmához szükséges ismeretek és képesítések megszerzése",
      icon: (
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 21V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 8H20V21H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8 16H4V21H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoal(goalId);
  };

  const handleContinue = () => {
    if (selectedGoal) {
      updateUserData({ goal: selectedGoal });
      onNext();
    }
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
          <h1 className="text-3xl font-bold mb-4">Mi az Ön fő célja?</h1>
          <p className="text-neutral-600 mb-10">
            Válassza ki elsődleges célját, hogy személyre szabottabb élményt nyújthassunk Önnek.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {goals.map((goal) => (
              <motion.div
                key={goal.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleGoalSelect(goal.id)}
                className={`
                  relative rounded-xl p-6 cursor-pointer transition-all duration-200
                  ${selectedGoal === goal.id 
                    ? 'border-2 border-primary bg-primary/5' 
                    : 'border-2 border-neutral-200 hover:border-neutral-300 bg-white'}
                `}
              >
                {selectedGoal === goal.id && (
                  <div className="absolute top-3 right-3 text-primary">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}
                
                <div className={`w-12 h-12 rounded-full mb-4 flex items-center justify-center ${
                  selectedGoal === goal.id 
                    ? 'bg-primary text-white' 
                    : 'bg-neutral-100 text-neutral-700'
                }`}>
                  {goal.icon}
                </div>
                
                <h3 className="text-lg font-bold mb-2">{goal.title}</h3>
                <p className="text-neutral-600 text-sm">{goal.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center">
            <Button 
              onClick={handleContinue}
              disabled={!selectedGoal}
              size="lg"
              className="min-w-[200px]"
            >
              Folytatás
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default GoalSelectionStep;