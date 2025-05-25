import { useState } from 'react';

interface Course {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  level: string;
  isFree: boolean;
  university: string;
  universityLogo: string;
  price?: number;
  duration?: string;
  requirements?: string[];
  highlights?: string[];
}

export const usePreviewModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const openPreview = (course: Course) => {
    setSelectedCourse(course);
    setIsOpen(true);
  };

  const closePreview = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    selectedCourse,
    openPreview,
    closePreview
  };
};