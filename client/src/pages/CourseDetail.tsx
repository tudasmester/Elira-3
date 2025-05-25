import React from "react";
import { useParams } from "wouter";
import { courses } from "@/data/courses";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Users, Award, BookOpen } from "lucide-react";
import { Link } from "wouter";

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const courseId = parseInt(id || "1");
  
  // Find the course with the matching ID
  const course = courses.find(course => course.id === courseId);
  
  if (!course) {
    return <div className="max-w-7xl mx-auto py-16 px-4 text-center">Kurzus nem található</div>;
  }

  return (
    <div className="bg-white">
      {/* Course Header */}
      <div className="bg-gradient-to-r from-primary to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex items-center mb-6">
            <Link href="/">
              <Button variant="ghost" className="text-white hover:bg-white/20 p-2">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Vissza a főoldalra
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                {course.title}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg mb-6"
              >
                {course.description}
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center mb-8"
              >
                <img 
                  src={course.universityLogo} 
                  alt={course.university} 
                  className="h-10 mr-3 bg-white p-1 rounded"
                />
                <span>{course.university}</span>
              </motion.div>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>6-8 hét</span>
                </div>
                <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                  <Users className="h-5 w-5 mr-2" />
                  <span>152,483 tanuló</span>
                </div>
                <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                  <Award className="h-5 w-5 mr-2" />
                  <span>{course.level}</span>
                </div>
                <div className="flex items-center bg-white/20 px-4 py-2 rounded-full">
                  <BookOpen className="h-5 w-5 mr-2" />
                  <span>{course.category}</span>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-lg overflow-hidden shadow-xl"
              >
                <img 
                  src={course.imageUrl} 
                  alt={course.title} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-primary">
                      {course.isFree ? "Ingyenes" : "38,000 Ft"}
                    </span>
                    {!course.isFree && (
                      <span className="text-neutral-500 line-through">54,000 Ft</span>
                    )}
                  </div>
                  
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white mb-3">
                      Iratkozzon fel most
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/5">
                      Próbálja ki ingyenesen
                    </Button>
                  </motion.div>
                  
                  <div className="mt-4 text-center text-sm text-neutral-600">
                    30 napos pénzvisszafizetési garancia
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6 text-primary-900">Mit fog tanulni</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
              {[
                "A kurzus fő témáinak alapos megértése",
                "Gyakorlati készségek a valós problémák megoldásához",
                "Szakértői ismeretek a legújabb technikákról",
                "Hatékony módszerek a mindennapokban való alkalmazáshoz",
                "Világos fogalmi keretek és elméleti alapok",
                "A területhez kapcsolódó kritikus gondolkodás"
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <div className="text-primary mr-3 pt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p>{item}</p>
                </div>
              ))}
            </div>
            
            <h2 className="text-2xl font-bold mb-6 text-primary-900">A kurzus tartalma</h2>
            
            <div className="space-y-4 mb-12">
              {[
                {
                  week: 1,
                  title: "Bevezetés és alapfogalmak",
                  lessons: 5,
                  duration: "1 óra 30 perc"
                },
                {
                  week: 2,
                  title: "Alapvető koncepciók és technikák",
                  lessons: 7,
                  duration: "2 óra 15 perc"
                },
                {
                  week: 3,
                  title: "Haladó megközelítések",
                  lessons: 6,
                  duration: "1 óra 45 perc"
                },
                {
                  week: 4,
                  title: "Gyakorlati alkalmazások",
                  lessons: 8,
                  duration: "2 óra 30 perc"
                },
                {
                  week: 5,
                  title: "Esettanulmányok és projektek",
                  lessons: 4,
                  duration: "3 óra"
                }
              ].map((module, index) => (
                <div key={index} className="border border-neutral-200 rounded-lg overflow-hidden">
                  <div className="flex justify-between items-center p-4 bg-neutral-50 border-b border-neutral-200">
                    <h3 className="font-medium">{module.week}. hét: {module.title}</h3>
                    <div className="text-sm text-neutral-600">
                      {module.lessons} lecke · {module.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="flex items-center">
                          <div className="text-primary mr-3">
                            <BookOpen className="h-4 w-4" />
                          </div>
                          <p className="text-sm">Lecke {i + 1}: Példa lecke cím</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 text-center">
                      <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/5">
                        További leckék megtekintése
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <h2 className="text-2xl font-bold mb-6 text-primary-900">Oktatók</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {[
                {
                  name: "Dr. Nagy Zoltán",
                  title: "Vezető oktató, Professzor",
                  bio: "Dr. Nagy Zoltán több mint 15 éves tapasztalattal rendelkezik a területen, és számos nemzetközileg elismert publikáció szerzője.",
                  image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
                },
                {
                  name: "Dr. Kovács Eszter",
                  title: "Társoktató, Adjunktus",
                  bio: "Dr. Kovács Eszter kutatási területe a modern módszertanok alkalmazása. Korábban vezető pozíciókat töltött be az iparágban.",
                  image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200"
                }
              ].map((instructor, index) => (
                <div key={index} className="flex gap-4 p-4 border border-neutral-200 rounded-lg">
                  <img 
                    src={instructor.image} 
                    alt={instructor.name} 
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold">{instructor.name}</h3>
                    <p className="text-sm text-neutral-600 mb-2">{instructor.title}</p>
                    <p className="text-sm">{instructor.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-neutral-50 p-6 rounded-lg border border-neutral-200 sticky top-8">
              <h3 className="text-lg font-bold mb-4">Erről a kurzusról</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Nyelv</span>
                  <span className="font-medium">Magyar</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Feliratok</span>
                  <span className="font-medium">Magyar, Angol</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Szint</span>
                  <span className="font-medium">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Időigény</span>
                  <span className="font-medium">6-8 hét, heti 4-6 óra</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Igazolás</span>
                  <span className="font-medium">Befejeztési igazolás</span>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-medium mb-2">Előfeltételek</h4>
                <ul className="list-disc list-inside text-sm space-y-1 text-neutral-600">
                  <li>Alapvető ismeretek a témában</li>
                  <li>Hozzáférés számítógéphez és internethez</li>
                  <li>Alap számítógépes ismeretek</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Mit fog kapni</h4>
                <ul className="list-disc list-inside text-sm space-y-1 text-neutral-600">
                  <li>30+ órányi videóanyag</li>
                  <li>50+ gyakorló feladat</li>
                  <li>15+ letölthető erőforrás</li>
                  <li>Teljes élettartamú hozzáférés</li>
                  <li>Mobilos és TV-s hozzáférés</li>
                  <li>Befejeztési igazolás</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;