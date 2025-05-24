import React, { useState } from "react";
import { useLocation } from "wouter";
import WelcomeStep from "@/components/onboarding/WelcomeStep";
import UserTypeStep from "@/components/onboarding/UserTypeStep";
import EmailStep from "@/components/onboarding/EmailStep";
import VerificationStep from "@/components/onboarding/VerificationStep";
import GoalSelectionStep from "@/components/onboarding/GoalSelectionStep";
import SuccessStep from "@/components/onboarding/SuccessStep";

const Onboarding: React.FC = () => {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    userType: "", // "student" or "teacher"
    email: "",
    verificationCode: "",
    goal: "" // "learn", "teach" or "manage"
  });

  const updateUserData = (data: Partial<typeof userData>) => {
    setUserData({ ...userData, ...data });
  };

  const nextStep = () => {
    if (step === 6) {
      // Final step, redirect to dashboard
      setLocation("/dashboard");
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    if (step === 1) {
      // First step, go back to home
      setLocation("/");
      return;
    }
    setStep(step - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <WelcomeStep onNext={nextStep} />;
      case 2:
        return (
          <UserTypeStep
            userData={userData}
            updateUserData={updateUserData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <EmailStep
            userData={userData}
            updateUserData={updateUserData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <VerificationStep
            userData={userData}
            updateUserData={updateUserData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <GoalSelectionStep
            userData={userData}
            updateUserData={updateUserData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 6:
        return (
          <SuccessStep
            userData={userData}
            onFinish={nextStep}
          />
        );
      default:
        return <WelcomeStep onNext={nextStep} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100">
      <div className="container mx-auto px-4 py-8">
        {renderStep()}
      </div>
    </div>
  );
};

export default Onboarding;