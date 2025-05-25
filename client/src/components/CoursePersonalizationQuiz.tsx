import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronRight, ArrowRight, Sparkles, Zap, User, BookOpen, Award } from "lucide-react";

// Course suggestions based on user preferences
const courseSuggestions = {
  techBeginner: {
    id: 101,
    title: "Bevezetés a programozásba Python nyelven",
    description: "Tanulja meg a programozás alapjait a világ egyik legnépszerűbb nyelvével.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    category: "Technológia",
    level: "Kezdő",
    university: "Budapesti Műszaki és Gazdaságtudományi Egyetem",
    universityLogo: "/assets/bme.png",
    rating: 4.9,
    enrollmentCount: 12540,
    isFree: true,
    type: "Tanfolyam"
  },
  techIntermediate: {
    id: 102,
    title: "Adatelemzés és vizualizáció Pythonnal",
    description: "Mélyüljön el az adatelemzés technikáiban és készítsen hatásos vizualizációkat.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    category: "Adatelemzés",
    level: "Középhaladó",
    university: "Corvinus Egyetem",
    universityLogo: "/assets/corvinus_logo_angol_sz_transparent.png",
    rating: 4.8,
    enrollmentCount: 8650,
    isFree: true,
    type: "Tanfolyam"
  },
  businessBeginner: {
    id: 103,
    title: "Üzleti alapismeretek kezdőknek",
    description: "Ismerje meg a vállalkozások működésének és a menedzsment alapjait.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    category: "Üzlet",
    level: "Kezdő",
    university: "Corvinus Egyetem",
    universityLogo: "/assets/corvinus_logo_angol_sz_transparent.png",
    rating: 4.7,
    enrollmentCount: 9870,
    isFree: true,
    type: "Tanfolyam"
  },
  businessIntermediate: {
    id: 104,
    title: "Projektmenedzsment a gyakorlatban",
    description: "Sajátítsa el a sikeres projektvezetés módszereit és eszközeit.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    category: "Üzlet",
    level: "Középhaladó",
    university: "Budapesti Gazdasági Egyetem",
    universityLogo: "/assets/bme.png",
    rating: 4.8,
    enrollmentCount: 7320,
    isFree: true,
    type: "Tanfolyam"
  },
  languageBeginner: {
    id: 105,
    title: "Angol üzleti nyelv alapjai",
    description: "Alapvető angol nyelvtudás elsajátítása üzleti környezetben való használatra.",
    image: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    category: "Nyelv",
    level: "Kezdő",
    university: "Eötvös Loránd Tudományegyetem",
    universityLogo: "/assets/ELTE.png",
    rating: 4.9,
    enrollmentCount: 15230,
    isFree: true,
    type: "Tanfolyam"
  },
  languageIntermediate: {
    id: 106,
    title: "Üzleti kommunikáció és tárgyalástechnika angolul",
    description: "Fejlessze angol nyelvű kommunikációs képességeit üzleti környezetben.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    category: "Nyelv",
    level: "Középhaladó",
    university: "Eötvös Loránd Tudományegyetem",
    universityLogo: "/assets/ELTE.png",
    rating: 4.7,
    enrollmentCount: 6840,
    isFree: true,
    type: "Tanfolyam"
  },
  marketingBeginner: {
    id: 107,
    title: "Digitális marketing alapok",
    description: "Ismerkedjen meg a digitális marketing alapjaival és eszközeivel.",
    image: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    category: "Marketing",
    level: "Kezdő",
    university: "Budapesti Gazdasági Egyetem",
    universityLogo: "/assets/bme.png",
    rating: 4.8,
    enrollmentCount: 11420,
    isFree: true,
    type: "Tanfolyam"
  },
  marketingIntermediate: {
    id: 108,
    title: "Közösségi média marketing stratégiák",
    description: "Tanulja meg a hatékony közösségi média kampányok tervezését és végrehajtását.",
    image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    category: "Marketing",
    level: "Középhaladó",
    university: "Corvinus Egyetem",
    universityLogo: "/assets/corvinus_logo_angol_sz_transparent.png",
    rating: 4.7,
    enrollmentCount: 8970,
    isFree: true,
    type: "Tanfolyam"
  }
};

const questions = [
  {
    id: 1,
    question: "Milyen területen szeretne fejlődni?",
    options: [
      { id: "tech", text: "Technológia és programozás" },
      { id: "business", text: "Üzlet és menedzsment" },
      { id: "language", text: "Nyelvtanulás" },
      { id: "marketing", text: "Marketing" }
    ]
  },
  {
    id: 2,
    question: "Milyen szintű ismeretekkel rendelkezik ezen a területen?",
    options: [
      { id: "beginner", text: "Kezdő - még nem foglalkoztam ezzel a területtel" },
      { id: "intermediate", text: "Középhaladó - vannak alapismereteim" }
    ]
  },
  {
    id: 3,
    question: "Milyen időbeosztással tudna tanulni?",
    options: [
      { id: "flexible", text: "Rugalmas időbeosztással, amikor van időm" },
      { id: "structured", text: "Rendszeres, tervezett időpontokban" }
    ]
  },
  {
    id: 4,
    question: "Mi a célja a tanulással?",
    options: [
      { id: "career", text: "Karrierváltás vagy előrelépés" },
      { id: "personal", text: "Személyes érdeklődés és fejlődés" },
      { id: "specific", text: "Specifikus készség elsajátítása" }
    ]
  }
];

const CoursePersonalizationQuiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [recommendedCourse, setRecommendedCourse] = useState<any>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);

  const handleAnswer = (questionId: number, answerId: string) => {
    setIsAnimating(true);
    
    // Update answers
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerId
    }));
    
    // Move to the next question or finish the quiz
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        // Quiz completed - determine course recommendation
        const courseKey = determineRecommendation();
        setRecommendedCourse(courseSuggestions[courseKey as keyof typeof courseSuggestions]);
        setQuizCompleted(true);
      }
      setIsAnimating(false);
    }, 500);
  };

  const determineRecommendation = () => {
    const fieldAnswer = answers[1] || "tech";
    const levelAnswer = answers[2] || "beginner";
    
    // Combine the field and level to get the appropriate course
    return `${fieldAnswer}${levelAnswer.charAt(0).toUpperCase() + levelAnswer.slice(1)}`;
  };

  const startOver = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setQuizCompleted(false);
    setRecommendedCourse(null);
  };

  const viewCourse = () => {
    if (recommendedCourse) {
      window.location.href = `/course/${recommendedCourse.id}`;
    }
  };

  const progressPercentage = (currentQuestionIndex / questions.length) * 100;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <section className="py-16 relative overflow-hidden mt-[-6rem]">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 z-0"></div>
      <div className="absolute top-40 right-10 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-40 left-10 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-5xl mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
            Fedezze fel a tökéletes kurzust
          </h2>
          <p className="text-neutral-600 text-lg max-w-3xl mx-auto">
            Válaszoljon néhány kérdésre, és megtaláljuk az Önnek legmegfelelőbb ingyenes kurzust
          </p>
        </motion.div>

        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden border border-indigo-100">
          {!quizStarted && !quizCompleted ? (
            <div className="p-8 md:p-12">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-10"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
                  className="w-24 h-24 mx-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-6"
                >
                  <Zap className="h-12 w-12 text-white" />
                </motion.div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
                  Tegye meg az első lépést karrierje fejlesztése felé!
                </h3>
                <p className="text-neutral-600 text-lg max-w-3xl mx-auto mb-6">
                  Fedezze fel az Önnek leginkább megfelelő tanulási utat mindössze néhány kérdés megválaszolásával. 
                  Személyre szabott ajánlatunk segít időt és energiát megtakarítani.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-xl text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2 text-indigo-800">Személyre szabott</h4>
                  <p className="text-neutral-600">
                    Az Ön igényeire és tanulási céljára optimalizált kurzusajánlatok
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-xl text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2 text-purple-800">Ingyenes tanfolyamok</h4>
                  <p className="text-neutral-600">
                    Fedezze fel a legjobb ingyenes kurzusokat hazai egyetemektől
                  </p>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-gradient-to-br from-blue-50 to-teal-50 p-6 rounded-xl text-center"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="text-lg font-semibold mb-2 text-blue-800">Elismert képesítések</h4>
                  <p className="text-neutral-600">
                    Szerezzen értékes tudást és növelje karrierlehetőségeit
                  </p>
                </motion.div>
              </div>
              
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 blur-lg opacity-70 rounded-full transform scale-110"></div>
                  <Button
                    onClick={() => setQuizStarted(true)}
                    className="relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg py-6 px-10 rounded-full shadow-lg"
                  >
                    Fedezze fel a legjobb kurzust
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
                <p className="text-neutral-500 text-sm mt-4">
                  Csak 30 másodpercet vesz igénybe, és teljesen ingyenes!
                </p>
              </motion.div>
            </div>
          ) : !quizCompleted ? (
            <div className="p-6 md:p-8">
              {/* Progress bar */}
              <div className="w-full h-2 bg-neutral-200 rounded-full mb-8 overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500"
                  initial={{ width: `${(currentQuestionIndex / questions.length) * 100}%` }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestionIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-xl md:text-2xl font-semibold text-neutral-800 mb-6">
                    {currentQuestion.question}
                  </h3>
                  
                  <div className="space-y-4">
                    {currentQuestion.options.map((option) => (
                      <motion.div
                        key={option.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <button
                          onClick={() => !isAnimating && handleAnswer(currentQuestion.id, option.id)}
                          className={`w-full text-left p-4 rounded-xl border border-indigo-100 hover:border-indigo-300 transition-all duration-300 ${
                            answers[currentQuestion.id] === option.id 
                              ? "bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-300" 
                              : "bg-white hover:bg-indigo-50/50"
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                              answers[currentQuestion.id] === option.id
                                ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                                : "border border-indigo-200"
                            }`}>
                              {answers[currentQuestion.id] === option.id && (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </div>
                            <span className="text-lg font-medium">{option.text}</span>
                          </div>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
              
              <div className="mt-8 flex justify-between">
                <Button
                  variant="outline"
                  onClick={startOver}
                  className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
                >
                  Újrakezdés
                </Button>
                
                {currentQuestionIndex > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                    className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
                  >
                    Vissza
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="p-6 md:p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-center mb-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-20 h-20 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mb-6"
                  >
                    <Sparkles className="h-10 w-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600">
                    Megtaláltuk az Önnek tökéletes kurzust!
                  </h3>
                  <p className="text-neutral-600">
                    A válaszai alapján ezt a népszerű, ingyenes kurzust ajánljuk Önnek:
                  </p>
                </div>
                
                {recommendedCourse && (
                  <motion.div 
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-xl overflow-hidden shadow-md"
                  >
                    <div className="relative h-48 md:h-56">
                      <img 
                        src={recommendedCourse.image}
                        alt={recommendedCourse.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/60 to-transparent"></div>
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        Trending
                      </div>
                      <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        Ingyenes
                      </div>
                      
                      <div className="absolute bottom-4 left-4 flex items-center">
                        <img 
                          src={recommendedCourse.universityLogo}
                          alt={recommendedCourse.university}
                          className="h-8 w-8 object-contain bg-white p-1 rounded-full mr-2"
                        />
                        <span className="text-white text-sm font-medium">{recommendedCourse.university}</span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-medium px-2 py-1 rounded-full mb-2">
                            {recommendedCourse.category}
                          </span>
                          <span className="inline-block bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full ml-2 mb-2">
                            {recommendedCourse.level}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium text-indigo-800 mr-1">{recommendedCourse.rating}</span>
                          <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                          </svg>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-neutral-800 mb-2">{recommendedCourse.title}</h3>
                      <p className="text-neutral-600 mb-4">{recommendedCourse.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-neutral-500">
                          <span className="text-indigo-700 font-semibold">{recommendedCourse.enrollmentCount.toLocaleString()}</span> fő tanul
                        </div>
                        <div className="text-sm text-neutral-500">
                          {recommendedCourse.type}
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                        <motion.div
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="flex-1"
                        >
                          <Button 
                            onClick={viewCourse}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                          >
                            Kurzus megtekintése
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </motion.div>
                        <Button 
                          variant="outline"
                          onClick={startOver}
                          className="border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300"
                        >
                          Újrakezdés
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="mt-8 text-center"
                >
                  <p className="text-neutral-500 text-sm">
                    Ez a kurzus leginkább az Ön preferenciáihoz illeszkedik, de természetesen további kurzusokat is felfedezhet.
                  </p>
                  <Button 
                    variant="ghost" 
                    className="mt-2 text-indigo-600 hover:bg-indigo-50"
                    onClick={() => window.location.href = '/courses'}
                  >
                    Összes kurzus böngészése
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CoursePersonalizationQuiz;