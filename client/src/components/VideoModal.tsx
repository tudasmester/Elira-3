import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12"
          >
            <div 
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={onClose}
                  className="bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-neutral-100 transition-colors"
                >
                  <X className="h-6 w-6 text-neutral-700" />
                </button>
              </div>
              
              <div className="aspect-video w-full">
                <iframe 
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="Academion - Hogyan működik?"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              
              <div className="p-6 bg-white">
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">Hogyan működik az Academion?</h3>
                <p className="text-neutral-700 mb-4">
                  Ismerje meg, hogyan segít az Academion összekapcsolni a tanulókat Magyarország legjobb egyetemeivel és kurzusaival. Platformunk személyre szabott tanulási utat kínál, rugalmas ütemtervet és elismert képesítéseket.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full">Személyre szabott tanulás</span>
                  <span className="inline-block bg-green-100 text-green-800 text-xs px-2.5 py-1 rounded-full">Rugalmas ütemterv</span>
                  <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full">Egyetemi partnerek</span>
                  <span className="inline-block bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full">Karrierfejlesztés</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default VideoModal;