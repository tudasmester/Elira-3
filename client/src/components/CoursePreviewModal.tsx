import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Calendar, Award, BookOpen, Users, Star, X, CheckCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { Link } from 'wouter';

interface CoursePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
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
}

const CoursePreviewModal: React.FC<CoursePreviewModalProps> = ({ isOpen, onClose, course }) => {
  const isMobile = useIsMobile();

  const handleViewCourse = () => {
    onClose();
    window.location.href = `/courses/${course.id}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={`sm:max-w-[90%] md:max-w-[800px] p-0 ${isMobile ? 'max-h-[95vh] overflow-y-auto' : ''}`}>
        <DialogHeader className="relative">
          <div className="relative h-[200px] md:h-[250px] overflow-hidden">
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
              <div className="p-6 text-white">
                <Badge className="mb-2 bg-primary text-white">{course.category}</Badge>
                <DialogTitle className="text-2xl font-bold text-white mb-2">{course.title}</DialogTitle>
                <div className="flex items-center space-x-2">
                  <img 
                    src={course.universityLogo} 
                    alt={course.university} 
                    className="w-6 h-6 rounded-full bg-white p-0.5"
                  />
                  <span className="text-sm">{course.university}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white bg-black/50 rounded-full p-1 hover:bg-black/70 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <DialogDescription className="text-base text-neutral-600 mb-6">
              {course.description}
            </DialogDescription>

            {course.highlights && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3 text-lg">Tanfolyam fő pontjai</h3>
                <ul className="space-y-2">
                  {course.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {course.requirements && (
              <div>
                <h3 className="font-semibold mb-3 text-lg">Előfeltételek</h3>
                <ul className="space-y-2">
                  {course.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <ArrowRight className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
                      <span>{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="bg-neutral-50 p-4 rounded-lg">
            <div className="mb-4">
              <h3 className="font-semibold mb-2 text-lg">Kurzus részletei</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-neutral-500 mr-2" />
                  <span>{course.duration || '6 hét'}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="h-5 w-5 text-neutral-500 mr-2" />
                  <span>Szint: {course.level}</span>
                </div>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-neutral-500 mr-2" />
                  <span>Tanúsítvány elérhető</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-neutral-500 mr-2" />
                  <span>400+ beiratkozott diák</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="block text-sm text-neutral-500">Ár</span>
                  {course.isFree ? (
                    <span className="text-xl font-bold text-green-600">Ingyenes</span>
                  ) : (
                    <span className="text-xl font-bold">{course.price?.toLocaleString('hu-HU')} Ft</span>
                  )}
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-1" />
                  <span className="font-semibold">4.8</span>
                </div>
              </div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleViewCourse}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Kurzus megtekintése
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-neutral-200">
          <div className="flex flex-col-reverse sm:flex-row gap-2 w-full justify-between items-center">
            <DialogClose asChild>
              <Button variant="outline">Bezárás</Button>
            </DialogClose>
            <div className="flex items-center">
              <span className="text-sm text-neutral-500 mr-2">Megosztás:</span>
              <div className="flex space-x-2">
                {['facebook', 'twitter', 'linkedin', 'email'].map((platform) => (
                  <button
                    key={platform}
                    className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200"
                    aria-label={`Share on ${platform}`}
                  >
                    <div className="w-4 h-4"></div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CoursePreviewModal;