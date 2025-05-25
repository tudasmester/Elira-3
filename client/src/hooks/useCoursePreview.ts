import { useState } from 'react';
import { courses as allCourses } from '@/data/courses';

export type CoursePreviewType = {
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
};

export const useCoursePreview = () => {
  const [previewCourse, setPreviewCourse] = useState<CoursePreviewType | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const openPreview = (courseId: number) => {
    const course = allCourses.find(c => c.id === courseId);
    if (course) {
      setPreviewCourse(course);
      setIsPreviewOpen(true);
    }
  };

  const openPreviewWithData = (course: CoursePreviewType) => {
    setPreviewCourse(course);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
  };

  return {
    previewCourse,
    isPreviewOpen,
    openPreview,
    openPreviewWithData,
    closePreview
  };
};