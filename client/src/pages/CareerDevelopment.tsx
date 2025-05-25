import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Briefcase,
  GraduationCap,
  LineChart,
  Shield,
  PenTool,
  Zap,
  ChevronRight,
  DollarSign,
  Clock,
  Award,
  Star
} from 'lucide-react';
import { Link } from 'wouter';
import Layout from '@/components/Layout';
import { courses } from '@/data/courses';
import { useIsMobile } from '@/hooks/use-mobile';
import CoursePreviewModal from '@/components/CoursePreviewModal';

// Define career paths
const careerPaths = [
  {
    id: 'data-analyst',
    title: 'Adatelemző',
    icon: <LineChart className="h-6 w-6 text-blue-500" />,
    description: 'Adatelemzők adatokat gyűjtenek, tisztítanak és értelmeznek, hogy támogassák az üzleti döntéshozatalt. Python, SQL és adatvizualizációs eszközök használatával dolgoznak.',
    averageSalary: '800,000 - 1,200,000 Ft/hó',
    jobOutlook: 'Magas',
    growthRate: '+27%',
    timeToComplete: '6 hónap',
    difficulty: 'Közepes',
    prerequisites: ['Alapvető számítógépes ismeretek', 'Logikus gondolkodás', 'Angol nyelvtudás'],
    skills: ['SQL', 'Python', 'Excel', 'Adatvizualizáció', 'Statisztika'],
    roadmap: [
      {
        stage: 1,
        title: 'Alapok',
        courses: [
          { id: 10, title: 'Bevezetés az adatelemzésbe', duration: '4 hét' },
          { id: 11, title: 'SQL alapok', duration: '3 hét' }
        ]
      },
      {
        stage: 2,
        title: 'Eszközök',
        courses: [
          { id: 12, title: 'Python az adatelemzésben', duration: '6 hét' },
          { id: 13, title: 'Adatvizualizáció eszközei', duration: '4 hét' }
        ]
      },
      {
        stage: 3,
        title: 'Haladó technikák',
        courses: [
          { id: 14, title: 'Statisztikai elemzés', duration: '5 hét' },
          { id: 15, title: 'Gépi tanulás alapjai', duration: '6 hét' }
        ]
      },
      {
        stage: 4,
        title: 'Gyakorlati projekt',
        courses: [
          { id: 16, title: 'Adatelemző portfólió projekt', duration: '4 hét' }
        ]
      }
    ],
    testimonial: {
      name: 'Kovács Bence',
      role: 'Adatelemző, OTP Bank',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80',
      quote: 'Az Academion platform segítségével 6 hónap alatt váltottam karriert. Az adatelemző kurzusok gyakorlatiasak voltak, és a valós projekteken keresztül tanultam a legtöbbet.'
    }
  },
  {
    id: 'digital-marketer',
    title: 'Digitális Marketing Specialista',
    icon: <TrendingUp className="h-6 w-6 text-green-500" />,
    description: 'Digitális marketing szakemberek online kampányokat terveznek és hajtanak végre különböző platformokon, analitikával mérik a teljesítményt és optimalizálják a stratégiákat.',
    averageSalary: '700,000 - 1,100,000 Ft/hó',
    jobOutlook: 'Nagyon magas',
    growthRate: '+32%',
    timeToComplete: '5 hónap',
    difficulty: 'Kezdő-barát',
    prerequisites: ['Kreativitás', 'Kommunikációs készség', 'Alapvető számítógépes ismeretek'],
    skills: ['SEO', 'Google Analytics', 'Közösségi média marketing', 'PPC hirdetések', 'Tartalommarketing'],
    roadmap: [
      {
        stage: 1,
        title: 'Alapok',
        courses: [
          { id: 20, title: 'Digitális marketing alapelvek', duration: '3 hét' },
          { id: 21, title: 'Tartalommarketing stratégiák', duration: '3 hét' }
        ]
      },
      {
        stage: 2,
        title: 'Csatornák',
        courses: [
          { id: 22, title: 'Közösségi média marketing', duration: '4 hét' },
          { id: 23, title: 'SEO és keresőmarketing', duration: '4 hét' }
        ]
      },
      {
        stage: 3,
        title: 'Elemzés és optimalizálás',
        courses: [
          { id: 24, title: 'Google Analytics és adatvezérelt marketing', duration: '4 hét' },
          { id: 25, title: 'PPC hirdetések és remarketing', duration: '3 hét' }
        ]
      },
      {
        stage: 4,
        title: 'Kampány',
        courses: [
          { id: 26, title: 'Teljes digitális marketing kampány', duration: '4 hét' }
        ]
      }
    ],
    testimonial: {
      name: 'Nagy Eszter',
      role: 'Marketing menedzser, MediaMarkt',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80',
      quote: 'A digitális marketing képzés nemcsak elméleti tudást adott, hanem valós kampányokat is készítettünk. Három hónappal a kurzusok befejezése után már új pozícióban dolgoztam.'
    }
  },
  {
    id: 'ux-designer',
    title: 'UX/UI Designer',
    icon: <PenTool className="h-6 w-6 text-purple-500" />,
    description: 'UX/UI tervezők a felhasználói élményt és felületet tervezik, kutatást végeznek, prototípusokat készítenek, és a felhasználók visszajelzései alapján finomítják a termékeket.',
    averageSalary: '800,000 - 1,300,000 Ft/hó',
    jobOutlook: 'Magas',
    growthRate: '+24%',
    timeToComplete: '7 hónap',
    difficulty: 'Közepes',
    prerequisites: ['Vizuális érzék', 'Empátia', 'Alapvető számítógépes ismeretek'],
    skills: ['Felhasználói kutatás', 'Wireframing', 'Prototyping', 'Figma', 'UI Design'],
    roadmap: [
      {
        stage: 1,
        title: 'Alapok',
        courses: [
          { id: 30, title: 'UX tervezés alapjai', duration: '4 hét' },
          { id: 31, title: 'Design thinking', duration: '3 hét' }
        ]
      },
      {
        stage: 2,
        title: 'Kutatás és tervezés',
        courses: [
          { id: 32, title: 'Felhasználói kutatás módszerei', duration: '4 hét' },
          { id: 33, title: 'Wireframing és információs architektúra', duration: '3 hét' }
        ]
      },
      {
        stage: 3,
        title: 'Vizuális design és prototípus',
        courses: [
          { id: 34, title: 'UI design alapelvek', duration: '4 hét' },
          { id: 35, title: 'Prototyping Figmával', duration: '4 hét' }
        ]
      },
      {
        stage: 4,
        title: 'Portfólió',
        courses: [
          { id: 36, title: 'UX/UI Design portfólió projekt', duration: '5 hét' }
        ]
      }
    ],
    testimonial: {
      name: 'Szabó Gergely',
      role: 'Senior UX Designer, Emarsys',
      image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80',
      quote: 'Az Academion UX/UI képzése valódi projekteken alapult. A kurzusok végére erős portfóliót építettem, ami segített állásom megszerzésében. Az oktatók visszajelzései különösen értékesek voltak.'
    }
  },
  {
    id: 'cybersecurity',
    title: 'Kiberbiztonsági Specialista',
    icon: <Shield className="h-6 w-6 text-red-500" />,
    description: 'Kiberbiztonsági szakemberek védik a szervezetek rendszereit és adatait a digitális fenyegetésektől, biztonsági protokollokat fejlesztenek és incidenseket kezelnek.',
    averageSalary: '900,000 - 1,500,000 Ft/hó',
    jobOutlook: 'Nagyon magas',
    growthRate: '+35%',
    timeToComplete: '8 hónap',
    difficulty: 'Haladó',
    prerequisites: ['IT alapismeretek', 'Hálózati ismeretek', 'Logikus gondolkodás'],
    skills: ['Hálózati biztonság', 'Etikus hackelés', 'Incidenskezelés', 'Kockázatelemzés', 'Biztonsági eszközök'],
    roadmap: [
      {
        stage: 1,
        title: 'Alapok',
        courses: [
          { id: 40, title: 'Kiberbiztonság alapjai', duration: '4 hét' },
          { id: 41, title: 'Hálózati biztonság', duration: '4 hét' }
        ]
      },
      {
        stage: 2,
        title: 'Támadás és védelem',
        courses: [
          { id: 42, title: 'Etikus hackelés és sebezhetőség tesztelés', duration: '5 hét' },
          { id: 43, title: 'Biztonsági rendszerek és tűzfalak', duration: '4 hét' }
        ]
      },
      {
        stage: 3,
        title: 'Incidenskezelés',
        courses: [
          { id: 44, title: 'Biztonsági incidensek kezelése', duration: '4 hét' },
          { id: 45, title: 'Digitális forensics', duration: '5 hét' }
        ]
      },
      {
        stage: 4,
        title: 'Gyakorlat',
        courses: [
          { id: 46, title: 'Kiberbiztonsági gyakorlati projekt', duration: '4 hét' }
        ]
      }
    ],
    testimonial: {
      name: 'Horváth Péter',
      role: 'Kiberbiztonsági elemző, Magyar Telekom',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&h=256&q=80',
      quote: 'A kiberbiztonsági karrierem az Academion platformon kezdődött. A gyakorlati megközelítés és a valós forgatókönyveken alapuló oktatás segített fejleszteni a kritikus gondolkodásomat és technikai készségeimet.'
    }
  }
];

const CareerDevelopment: React.FC = () => {
  const [selectedCareer, setSelectedCareer] = useState(careerPaths[0].id);
  const [selectedStage, setSelectedStage] = useState(1);
  const [previewCourse, setPreviewCourse] = useState<any | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const activeCareer = careerPaths.find(career => career.id === selectedCareer) || careerPaths[0];
  
  const handleCareerChange = (careerId: string) => {
    setSelectedCareer(careerId);
    setSelectedStage(1);
  };
  
  const handleCoursePreview = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      setPreviewCourse(course);
      setIsPreviewOpen(true);
    }
  };
  
  return (
    <Layout>
      <section className="pt-12 pb-8 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 px-3 py-1 bg-primary/10 text-primary border-primary/20">
              Karrierfejlesztés
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-neutral-900">
              Fedezze fel új karrierlehetőségeit
            </h1>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Az Academion segítségével elsajátíthatja a keresett készségeket, és magabiztosan indulhat el új karrierútján. Szakértőink által összeállított útitervek lépésről lépésre vezetik végig a tanulási folyamaton.
            </p>
          </motion.div>

          {/* Career Paths Tabs */}
          <Tabs 
            defaultValue={selectedCareer} 
            value={selectedCareer} 
            onValueChange={handleCareerChange}
            className="mb-12"
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-transparent h-auto p-1">
              {careerPaths.map(career => (
                <TabsTrigger 
                  key={career.id} 
                  value={career.id}
                  className={`flex items-center gap-2 py-3 px-4 border rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:border-primary`}
                >
                  {career.icon}
                  <span className={isMobile ? "hidden" : ""}>{career.title}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {careerPaths.map(career => (
              <TabsContent key={career.id} value={career.id} className="mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Career Overview */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="col-span-1"
                  >
                    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-full bg-neutral-100">
                          {career.icon}
                        </div>
                        <h2 className="text-2xl font-bold text-neutral-900">{career.title}</h2>
                      </div>
                      
                      <p className="text-neutral-600 mb-6">{career.description}</p>
                      
                      <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-500 flex items-center">
                            <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                            Átlagos fizetés
                          </span>
                          <span className="font-semibold">{career.averageSalary}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-500 flex items-center">
                            <TrendingUp className="h-4 w-4 mr-2 text-blue-500" />
                            Munkaerőpiaci kilátások
                          </span>
                          <span className="font-semibold flex items-center">
                            {career.jobOutlook}
                            <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-200">
                              {career.growthRate}
                            </Badge>
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-500 flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-orange-500" />
                            Képzés időtartama
                          </span>
                          <span className="font-semibold">{career.timeToComplete}</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-500 flex items-center">
                            <GraduationCap className="h-4 w-4 mr-2 text-purple-500" />
                            Nehézségi szint
                          </span>
                          <span className="font-semibold">{career.difficulty}</span>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="font-semibold mb-3 text-neutral-800">Előfeltételek</h3>
                        <ul className="space-y-2">
                          {career.prerequisites.map((prereq, index) => (
                            <li key={index} className="flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                              <span className="text-neutral-600">{prereq}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold mb-3 text-neutral-800">Megszerezhető készségek</h3>
                        <div className="flex flex-wrap gap-2">
                          {career.skills.map((skill, index) => (
                            <Badge key={index} className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Career Roadmap */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="col-span-1 lg:col-span-2"
                  >
                    <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm h-full">
                      <h2 className="text-2xl font-bold mb-6 text-neutral-900">Tanulási útiterv</h2>
                      
                      {/* Progress Bar */}
                      <div className="mb-8">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-neutral-500">Haladás az útiterven</span>
                          <span className="text-sm font-semibold">{selectedStage}/4</span>
                        </div>
                        <Progress value={selectedStage * 25} className="h-2" />
                      </div>
                      
                      {/* Stage Selector */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                        {career.roadmap.map((stage) => (
                          <button
                            key={stage.stage}
                            onClick={() => setSelectedStage(stage.stage)}
                            className={`p-3 rounded-lg border ${
                              selectedStage === stage.stage 
                                ? 'bg-primary text-white border-primary' 
                                : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                            } transition-colors duration-200`}
                          >
                            <div className="text-lg font-semibold mb-1">Szint {stage.stage}</div>
                            <div className={`text-sm ${selectedStage === stage.stage ? 'text-white/90' : 'text-neutral-500'}`}>
                              {stage.title}
                            </div>
                          </button>
                        ))}
                      </div>
                      
                      {/* Courses for Selected Stage */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold mb-4">
                          {selectedStage}. szint: {career.roadmap[selectedStage-1]?.title}
                        </h3>
                        
                        {career.roadmap[selectedStage-1]?.courses.map((course, index) => (
                          <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="border border-neutral-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-semibold text-neutral-800 mb-1">{course.title}</h4>
                                <p className="text-sm text-neutral-500 flex items-center">
                                  <Clock className="h-3.5 w-3.5 mr-1" />
                                  {course.duration}
                                </p>
                              </div>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-primary border-primary hover:bg-primary/10"
                                onClick={() => handleCoursePreview(course.id)}
                              >
                                Előnézet
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                        
                        <div className="flex justify-between items-center pt-4">
                          {selectedStage > 1 && (
                            <Button
                              variant="outline"
                              onClick={() => setSelectedStage(prev => Math.max(prev - 1, 1))}
                            >
                              Előző szint
                            </Button>
                          )}
                          
                          {selectedStage < 4 ? (
                            <Button 
                              className="ml-auto"
                              onClick={() => setSelectedStage(prev => Math.min(prev + 1, 4))}
                            >
                              Következő szint
                            </Button>
                          ) : (
                            <Button className="ml-auto bg-primary hover:bg-primary/90">
                              Kezdje el a képzést
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                {/* Testimonial */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-8"
                >
                  <div className="bg-gradient-to-r from-neutral-50 to-blue-50 rounded-xl p-6 md:p-8 border border-neutral-200">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="md:w-1/4 flex-shrink-0">
                        <img 
                          src={career.testimonial.image} 
                          alt={career.testimonial.name} 
                          className="rounded-xl w-full max-w-[180px] md:max-w-full aspect-square object-cover shadow-md"
                        />
                      </div>
                      <div className="md:w-3/4">
                        <div className="flex items-center mb-2">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star key={star} className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                          ))}
                        </div>
                        <blockquote className="text-lg italic text-neutral-700 mb-4">
                          "{career.testimonial.quote}"
                        </blockquote>
                        <div className="flex items-center">
                          <div>
                            <div className="font-semibold text-neutral-900">{career.testimonial.name}</div>
                            <div className="text-sm text-neutral-500">{career.testimonial.role}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
          
          {/* Call to Action Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-primary text-white rounded-xl p-8 md:p-12 mt-16"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Induljon el karrierváltása útján még ma</h2>
                <p className="text-white/90 mb-6">
                  Strukturált tanulási útitervünk segítségével lépésről lépésre haladhat egy jól fizető, keresett új karrier felé. A kurzusok gyakorlati projektjei valós munkatapasztalatot biztosítanak.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Személyre szabott tanulási út',
                    'Gyakorlati projektek valós tapasztalattal',
                    'Mentor támogatás és karriertanácsadás',
                    'Elismert tanúsítványok'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-white mr-2" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-white text-primary hover:bg-white/90">
                    Kezdje el most
                    <Zap className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="text-white border-white hover:bg-white/10">
                    Tanácsadás kérése
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400&q=80" 
                  alt="Karrierfejlesztés" 
                  className="rounded-xl shadow-lg"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Course Preview Modal */}
      {previewCourse && (
        <CoursePreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          course={previewCourse}
        />
      )}
    </Layout>
  );
};

export default CareerDevelopment;