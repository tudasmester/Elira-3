import React, { createContext, useState, useContext, ReactNode } from 'react';
import CoursePreviewModal from '@/components/CoursePreviewModal2';
import { courses } from '@/data/courses';

// Define the preview context type
type PreviewContextType = {
  openPreview: (courseId: number) => void;
  closePreview: () => void;
};

// Create the context with default values
const PreviewContext = createContext<PreviewContextType>({
  openPreview: () => {},
  closePreview: () => {}
});

// Custom hook to use the preview modal
export const usePreviewModal = () => useContext(PreviewContext);

// Provider component for the preview modal
interface PreviewProviderProps {
  children: ReactNode;
}

export const PreviewProvider: React.FC<PreviewProviderProps> = ({ children }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState<number | null>(null);

  const openPreview = (courseId: number) => {
    setCurrentCourseId(courseId);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
  };

  const currentCourse = currentCourseId !== null 
    ? courses.find(course => course.id === currentCourseId) 
    : null;

  return (
    <PreviewContext.Provider value={{ openPreview, closePreview }}>
      {children}
      
      {currentCourse && (
        <CoursePreviewModal
          isOpen={isPreviewOpen}
          onClose={closePreview}
          course={currentCourse}
        />
      )}
    </PreviewContext.Provider>
  );
};