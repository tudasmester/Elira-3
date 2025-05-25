import React, { useState } from "react";
import { X, Play, BookOpen, ChevronRight, ChevronLeft, Video, FileText, Clock, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

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
  const [activePreviewTab, setActivePreviewTab] = useState<'overview' | 'curriculum' | 'instructor'>('overview');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Sample preview content that would come from the API in a real implementation
  const previewContent = {
    curriculum: [
      {
        title: "Bevezetés és alapfogalmak",
        description: "A modul áttekintést nyújt a kurzus témájáról és bemutatja az alapvető fogalmakat.",
        lessons: [
          { title: "A terület áttekintése és történelmi fejlődése", duration: 20, isPreview: true },
          { title: "Kulcsfogalmak és definíciók tisztázása", duration: 25, isPreview: false },
          { title: "A modul gyakorlati alkalmazásai a való életben", duration: 30, isPreview: false }
        ]
      },
      {
        title: "Alapvető koncepciók és technikák",
        description: "Ebben a modulban megismerkedünk az alapvető technikákkal és módszerekkel.",
        lessons: [
          { title: "Az alapelvek részletes vizsgálata", duration: 35, isPreview: false },
          { title: "Gyakorlati készségek fejlesztése valós feladatokon", duration: 40, isPreview: false }
        ]
      }
    ],
    previewVideos: [
      {
        title: "Kurzus bemutató",
        duration: "3:45",
        thumbnail: course.imageUrl
      },
      {
        title: "Az első lecke előzetese",
        duration: "5:20",
        thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500"
      }
    ],
    instructors: [
      {
        name: "Dr. Nagy Zoltán",
        title: "Vezető oktató, Professzor",
        bio: "Dr. Nagy Zoltán több mint 15 éves tapasztalattal rendelkezik a területen, és számos nemzetközileg elismert publikáció szerzője.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
      }
    ],
    testimonials: [
      {
        name: "Kovács Péter",
        role: "Marketing menedzser",
        text: "Ez a kurzus teljesen átalakította a szakmai megközelítésemet. A gyakorlati feladatok és valós példák rendkívül hasznosak voltak.",
        rating: 5
      }
    ]
  };

  // Handle slide navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev < previewContent.previewVideos.length - 1 ? prev + 1 : prev));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 md:p-0 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col my-4 mx-auto"
          >
            {/* Modal header */}
            <div className="relative">
              <div
                className="h-48 sm:h-64 md:h-72 bg-cover bg-center"
                style={{ backgroundImage: `url(${course.imageUrl})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-colors"
                  aria-label="Close preview"
                >
                  <X className="h-5 w-5" />
                </button>
                
                <div className="absolute bottom-0 left-0 p-6 text-white">
                  <h2 className="text-2xl md:text-3xl font-bold">{course.title}</h2>
                  <div className="flex items-center mt-2">
                    <img
                      src={course.universityLogo}
                      alt={course.university}
                      className="h-8 w-8 object-contain bg-white rounded-full mr-2"
                    />
                    <span className="text-white/90 text-sm">{course.university}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal tabs */}
            <div className="border-b border-gray-200">
              <div className="flex overflow-x-auto px-6 pt-4 pb-2 scrollbar-hide">
                {[
                  { id: 'overview', label: 'Áttekintés' },
                  { id: 'curriculum', label: 'Tananyag előzetes' },
                  { id: 'instructor', label: 'Oktatók' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActivePreviewTab(tab.id as any)}
                    className={`px-4 py-2 font-medium text-sm mr-4 whitespace-nowrap border-b-2 transition-colors ${
                      activePreviewTab === tab.id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Overview tab */}
              {activePreviewTab === 'overview' && (
                <div className="space-y-6">
                  <div className="sm:flex sm:items-start">
                    <div className="w-full">
                      <h3 className="text-lg font-semibold text-neutral-800 mb-2">Erről a kurzusról</h3>
                      <p className="text-neutral-600">{course.description}</p>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                        <div className="bg-neutral-50 p-3 rounded-lg">
                          <div className="text-neutral-500 text-sm mb-1">Szint</div>
                          <div className="font-medium">{course.level}</div>
                        </div>
                        <div className="bg-neutral-50 p-3 rounded-lg">
                          <div className="text-neutral-500 text-sm mb-1">Kategória</div>
                          <div className="font-medium">{course.category}</div>
                        </div>
                        <div className="bg-neutral-50 p-3 rounded-lg">
                          <div className="text-neutral-500 text-sm mb-1">Időtartam</div>
                          <div className="font-medium">{course.duration || "8-12 hét"}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preview video carousel */}
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-800 mb-4">Kurzus előzetesek</h3>
                    <div className="relative">
                      <div className="overflow-hidden rounded-xl">
                        <div className="relative aspect-video bg-neutral-900">
                          <img
                            src={previewContent.previewVideos[currentSlide].thumbnail}
                            alt={previewContent.previewVideos[currentSlide].title}
                            className="absolute inset-0 w-full h-full object-cover opacity-60"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <button 
                              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 p-4 rounded-full transition-colors"
                              aria-label="Play preview video"
                            >
                              <Play className="h-10 w-10 text-white" />
                            </button>
                          </div>
                          <div className="absolute bottom-0 left-0 p-4 text-white">
                            <h4 className="font-medium">{previewContent.previewVideos[currentSlide].title}</h4>
                            <div className="flex items-center mt-1 text-sm text-white/80">
                              <Clock className="h-4 w-4 mr-1" />
                              <span>{previewContent.previewVideos[currentSlide].duration}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {previewContent.previewVideos.length > 1 && (
                        <>
                          <button
                            onClick={prevSlide}
                            disabled={currentSlide === 0}
                            className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full ${
                              currentSlide === 0 ? 'opacity-40 cursor-not-allowed' : 'hover:bg-black/70'
                            }`}
                            aria-label="Previous slide"
                          >
                            <ChevronLeft className="h-5 w-5 text-white" />
                          </button>
                          <button
                            onClick={nextSlide}
                            disabled={currentSlide === previewContent.previewVideos.length - 1}
                            className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 p-2 rounded-full ${
                              currentSlide === previewContent.previewVideos.length - 1
                                ? 'opacity-40 cursor-not-allowed'
                                : 'hover:bg-black/70'
                            }`}
                            aria-label="Next slide"
                          >
                            <ChevronRight className="h-5 w-5 text-white" />
                          </button>
                          <div className="absolute bottom-4 right-4 bg-black/60 rounded-full px-2 py-1 text-xs text-white">
                            {currentSlide + 1} / {previewContent.previewVideos.length}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Course highlights */}
                  {course.highlights && (
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-800 mb-4">Mit fog megtanulni</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {course.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-start">
                            <div className="text-green-500 mt-1 mr-2 flex-shrink-0">
                              <Check className="h-5 w-5" />
                            </div>
                            <span className="text-neutral-700">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Requirements */}
                  {course.requirements && (
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-800 mb-4">Előfeltételek</h3>
                      <ul className="list-disc pl-5 space-y-2 text-neutral-700">
                        {course.requirements.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Curriculum tab */}
              {activePreviewTab === 'curriculum' && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-4">Tananyag előzetes</h3>
                  <p className="text-neutral-500 mb-6">
                    Böngéssze a kurzus tartalmát és tekintse meg az ingyenes előzeteseket.
                  </p>

                  <div className="space-y-4">
                    {previewContent.curriculum.map((module, moduleIndex) => (
                      <div key={moduleIndex} className="border border-neutral-200 rounded-lg overflow-hidden">
                        <div className="bg-neutral-50 p-4">
                          <h4 className="font-medium text-neutral-800">
                            {moduleIndex + 1}. {module.title}
                          </h4>
                          <p className="text-sm text-neutral-500 mt-1">{module.description}</p>
                        </div>

                        <div className="divide-y divide-neutral-100">
                          {module.lessons.map((lesson, lessonIndex) => (
                            <div
                              key={lessonIndex}
                              className={`p-4 flex items-center justify-between ${
                                lesson.isPreview ? 'bg-white' : 'bg-neutral-50'
                              }`}
                            >
                              <div className="flex items-start">
                                <div className="text-primary mr-3 flex-shrink-0 mt-0.5">
                                  {lesson.isPreview ? (
                                    <Play className="h-5 w-5" />
                                  ) : (
                                    <Video className="h-5 w-5 text-neutral-400" />
                                  )}
                                </div>
                                <div>
                                  <h5 className={`font-medium ${lesson.isPreview ? 'text-neutral-800' : 'text-neutral-500'}`}>
                                    {moduleIndex + 1}.{lessonIndex + 1} {lesson.title}
                                  </h5>
                                  <div className="flex items-center mt-1 text-sm text-neutral-500">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>{lesson.duration} perc</span>
                                    {lesson.isPreview && (
                                      <span className="ml-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                                        Előzetes
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {lesson.isPreview ? (
                                <Button variant="ghost" size="sm" className="flex-shrink-0">
                                  Előzetes
                                </Button>
                              ) : (
                                <div className="text-sm text-neutral-400">Zárolva</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-center mt-8">
                    <p className="text-neutral-500 mb-4">
                      A kurzus teljes tartalma {previewContent.curriculum.reduce((acc, module) => acc + module.lessons.length, 0)} leckét tartalmaz.
                    </p>
                  </div>
                </div>
              )}

              {/* Instructor tab */}
              {activePreviewTab === 'instructor' && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-800 mb-4">Oktatók</h3>

                  <div className="space-y-6">
                    {previewContent.instructors.map((instructor, index) => (
                      <div key={index} className="flex flex-col sm:flex-row items-start gap-4 p-4 border border-neutral-200 rounded-lg">
                        <img
                          src={instructor.image}
                          alt={instructor.name}
                          className="w-20 h-20 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-medium text-lg text-neutral-800">{instructor.name}</h4>
                          <p className="text-primary">{instructor.title}</p>
                          <p className="text-neutral-600 mt-2">{instructor.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-neutral-800 mb-4">Hallgatói vélemények</h3>
                    
                    <div className="space-y-4">
                      {previewContent.testimonials.map((testimonial, index) => (
                        <div key={index} className="p-4 border border-neutral-200 rounded-lg">
                          <div className="flex items-center mb-3">
                            <div className="font-medium text-neutral-800">{testimonial.name}</div>
                            <span className="mx-2 text-neutral-300">•</span>
                            <div className="text-neutral-500 text-sm">{testimonial.role}</div>
                          </div>
                          <p className="text-neutral-600 italic">"{testimonial.text}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <div className="text-lg font-bold text-neutral-800">
                  {course.isFree ? "Ingyenes" : `${course.price?.toLocaleString() || "38,000"} Ft`}
                </div>
                <div className="text-sm text-neutral-500">Teljes hozzáférés</div>
              </div>
              <div className="w-full sm:w-auto flex space-x-4">
                <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                  Később
                </Button>
                <Link href={`/courses/${course.id}`}>
                  <Button className="w-full sm:w-auto">
                    Iratkozzon fel most
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CoursePreviewModal;