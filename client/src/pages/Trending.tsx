import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowRight, Clock, Users, Star, TrendingUp, Zap, Award } from "lucide-react";

// Trending courses data with a focus on Hungarian market trends
const trendingCourses = [
  {
    id: 101,
    title: "Mesterséges Intelligencia a gyakorlatban",
    description: "Sajátítsa el az AI alapelveit és alkalmazását valós üzleti problémák megoldására. A kurzus bemutatja a ChatGPT, a gépi tanulás és a generatív AI eszközök hatékony használatát a magyar piacon.",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    university: "Budapesti Műszaki és Gazdaságtudományi Egyetem",
    universityLogo: "/attached_assets/bme.png",
    category: "Informatika",
    level: "Középhaladó",
    students: 2840,
    duration: "10 hét",
    tags: ["AI", "Technológia", "Innováció"],
    rating: 4.9,
    isFree: false,
    price: 49000,
    trending: {
      position: 1,
      growthPercent: 415,
      label: "Leggyorsabban növekvő"
    }
  },
  {
    id: 102,
    title: "Digitális Marketing és Social Media Stratégia",
    description: "Tanulja meg a modern digitális marketing eszközöket és a közösségi média stratégiákat, amelyek különösen hatékonyak a magyar piacon. Tartalommarketing, SEO és fizetett hirdetések optimalizálása.",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    university: "Corvinus Egyetem",
    universityLogo: "/attached_assets/corvinus_logo_angol_sz_transparent.png",
    category: "Marketing",
    level: "Kezdő",
    students: 3150,
    duration: "8 hét",
    tags: ["Marketing", "Digitális", "Közösségi média"],
    rating: 4.8,
    isFree: false,
    price: 42000,
    trending: {
      position: 2,
      growthPercent: 320,
      label: "Népszerű szakemberek körében"
    }
  },
  {
    id: 103,
    title: "Fenntartható Üzleti Gyakorlatok és ESG",
    description: "Ismerje meg a környezeti, társadalmi és irányítási (ESG) alapelveket és azok alkalmazását a magyar vállalati környezetben. A kurzus felkészíti a résztvevőket az EU új fenntarthatósági jelentéstételi követelményeire.",
    image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    university: "Corvinus Egyetem",
    universityLogo: "/attached_assets/corvinus_logo_angol_sz_transparent.png",
    category: "Üzlet",
    level: "Haladó",
    students: 1980,
    duration: "6 hét",
    tags: ["Fenntarthatóság", "ESG", "Üzleti stratégia"],
    rating: 4.7,
    isFree: false,
    price: 46000,
    trending: {
      position: 3,
      growthPercent: 280,
      label: "Aktuális EU szabályozás miatt keresett"
    }
  },
  {
    id: 104,
    title: "Adatvezérelt Döntéshozatal Python-nal",
    description: "Fejlessze adatelemzési készségeit Python programozással. Ez a gyakorlatorientált kurzus bemutatja a pandas, numpy és matplotlib könyvtárak használatát valós magyar üzleti adatokon.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    university: "Eötvös Loránd Tudományegyetem",
    universityLogo: "/attached_assets/ELTE.png",
    category: "Adattudomány",
    level: "Kezdő",
    students: 2450,
    duration: "12 hét",
    tags: ["Python", "Adatelemzés", "Üzleti intelligencia"],
    rating: 4.9,
    isFree: false,
    price: 54000,
    trending: {
      position: 4,
      growthPercent: 260,
      label: "Piaci előnyt biztosít"
    }
  },
  {
    id: 105,
    title: "IT Biztonság és Kibervédelem",
    description: "Tanuljon meg hatékony védelmi stratégiákat a legújabb kiberfenyegetések ellen. Ez a kurzus a legfrissebb európai adatvédelmi és biztonsági jogszabályokat is ismerteti.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    university: "Budapesti Műszaki és Gazdaságtudományi Egyetem",
    universityLogo: "/attached_assets/bme.png",
    category: "Informatika",
    level: "Középhaladó",
    students: 1850,
    duration: "8 hét",
    tags: ["Kiberbiztonság", "Adatvédelem", "GDPR"],
    rating: 4.8,
    isFree: false,
    price: 51000,
    trending: {
      position: 5,
      growthPercent: 240,
      label: "Kritikus készség a mai munkaerőpiacon"
    }
  },
  {
    id: 106,
    title: "E-kereskedelem és Digitális Értékesítés",
    description: "Építsen sikeres online üzletet a magyar piacon. A kurzus bemutatja a webáruházak optimalizálását, a fizetési megoldásokat, és a hatékony logisztikai stratégiákat.",
    image: "https://images.unsplash.com/photo-1556745753-b2904692b3cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=300",
    university: "Budapesti Gazdasági Egyetem",
    universityLogo: "/attached_assets/bme.png",
    category: "Üzlet",
    level: "Kezdő",
    students: 2120,
    duration: "6 hét",
    tags: ["E-kereskedelem", "Webáruház", "Digitális értékesítés"],
    rating: 4.7,
    isFree: true,
    price: 0,
    trending: {
      position: 6,
      growthPercent: 210,
      label: "Ingyenes és értékes"
    }
  }
];

const TrendingPage: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-neutral-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="bg-orange-100 text-orange-800 mb-4 px-3 py-1.5">
              <TrendingUp className="h-3.5 w-3.5 mr-1.5" />
              Legkeresettebb kurzusok 2025-ben
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 leading-tight">
              Legyen naprakész a <span className="text-primary">magyar munkaerőpiacon</span>
            </h1>
            <p className="text-neutral-600 text-lg md:text-xl max-w-3xl mx-auto mb-8">
              Fedezze fel a legkeresettebb készségeket és a leggyorsabban növekvő területeket Magyarországon. 
              Ezek a kurzusok segítenek versenyképes maradni a folyamatosan változó munkaerőpiacon.
            </p>
          </motion.div>
        </div>

        {/* Trending Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: <Zap className="h-6 w-6 text-orange-500" />,
              title: "415%",
              description: "Az AI tanfolyamok iránti kereslet növekedése az elmúlt évben"
            },
            {
              icon: <Users className="h-6 w-6 text-primary" />,
              title: "78%",
              description: "A munkáltatók digitális készségeket keresnek az új alkalmazottaknál"
            },
            {
              icon: <Award className="h-6 w-6 text-purple-500" />,
              title: "3.2x",
              description: "Magasabb fizetés a mesterséges intelligencia szaktudással rendelkezőknek"
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-neutral-100 flex flex-col items-center text-center"
            >
              <div className="p-3 rounded-full bg-neutral-50 mb-4">
                {stat.icon}
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-2">{stat.title}</h3>
              <p className="text-neutral-600">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Trending Courses */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-neutral-900">
              Legkeresettebb kurzusok
            </h2>
            <Link href="/courses">
              <Button variant="ghost" className="text-primary">
                Összes kurzus megtekintése
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-neutral-100 flex flex-col transition-all duration-300 hover:shadow-md hover:-translate-y-1"
              >
                <div className="relative">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
                  
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <Badge className="bg-orange-500 text-white">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      #{course.trending.position}
                    </Badge>
                    {course.isFree && (
                      <Badge className="bg-emerald-500 text-white">Ingyenes</Badge>
                    )}
                  </div>
                  
                  <div className="absolute bottom-3 left-3 right-3 flex items-center">
                    <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-neutral-900">
                      <TrendingUp className="h-3 w-3 mr-1 text-orange-500" />
                      {course.trending.growthPercent}% növekedés
                    </div>
                    <div className="ml-auto flex space-x-0.5">
                      {Array(5).fill(0).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-3 w-3 ${i < Math.floor(course.rating) ? "text-yellow-500 fill-yellow-500" : "text-neutral-300"}`} 
                        />
                      ))}
                      <span className="ml-1 text-xs text-white font-medium">{course.rating}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-5 flex-grow flex flex-col">
                  <div className="flex items-center mb-3">
                    <div className="flex-shrink-0 w-8 h-8 mr-3 rounded-full overflow-hidden border border-neutral-200 bg-white p-1">
                      <img 
                        src={course.universityLogo} 
                        alt={`${course.university} logó`} 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    <span className="text-sm text-neutral-600 font-medium truncate">
                      {course.university}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-neutral-800 mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  
                  <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4 text-sm text-neutral-500 mt-auto">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-neutral-400" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1 text-neutral-400" />
                      <span>{course.students.toLocaleString('hu-HU')} hallgató</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {course.tags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="bg-neutral-50 text-neutral-700 border-neutral-200">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-neutral-100">
                    <div>
                      {course.isFree ? (
                        <span className="font-bold text-emerald-600">Ingyenes</span>
                      ) : (
                        <span className="font-bold text-neutral-900">{course.price.toLocaleString('hu-HU')} Ft</span>
                      )}
                    </div>
                    <Link href={`/course/${course.id}`}>
                      <Button variant="outline" className="text-primary border-primary hover:bg-primary/5">
                        Részletek
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 md:p-12 mt-12 text-white"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Szerezzen versenyelőnyt a munkaerőpiacon
            </h2>
            <p className="text-white/90 mb-8 text-lg">
              Az Academion kurzusok a legfrissebb piaci igényekre épülnek, és a legjobb magyar egyetemek szakértői által készültek. Kezdje el tanulási útját ma!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-white text-primary hover:bg-white/90 font-medium text-lg py-6 px-8">
                Kezdje el most
              </Button>
              <Button variant="outline" className="border-white text-white hover:bg-white/10 font-medium text-lg py-6 px-8">
                Ingyenes kurzusok böngészése
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TrendingPage;