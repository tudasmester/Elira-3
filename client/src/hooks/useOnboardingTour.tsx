import { useState, useEffect } from "react";

export function useOnboardingTour() {
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showTour, setShowTour] = useState(false);

  useEffect(() => {
    // Check if user has completed the tour before
    const hasCompletedTour = localStorage.getItem('elira_tour_completed');
    const isNewUser = localStorage.getItem('elira_new_user');
    
    if (!hasCompletedTour && (isNewUser === 'true' || !hasCompletedTour)) {
      setIsFirstVisit(true);
      // Show tour after a brief delay for better UX
      setTimeout(() => {
        setShowTour(true);
      }, 1000);
    }
  }, []);

  const startTour = () => {
    setShowTour(true);
  };

  const closeTour = () => {
    setShowTour(false);
  };

  const completeTour = () => {
    setShowTour(false);
    localStorage.setItem('elira_tour_completed', 'true');
    localStorage.removeItem('elira_new_user');
    setIsFirstVisit(false);
  };

  return {
    isFirstVisit,
    showTour,
    startTour,
    closeTour,
    completeTour
  };
}