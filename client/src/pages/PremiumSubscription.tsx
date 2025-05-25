import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  X, 
  Sparkles, 
  Trophy, 
  Users, 
  Calendar, 
  Briefcase, 
  Clock, 
  ChevronDown,
  ChevronUp,
  Star,
  Shield,
  Zap,
  BarChart,
  Bookmark,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassmorphicCard, PremiumCard } from '@/components/ui/design-system/GlassmorphicCard';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { motion } from 'framer-motion';

const PremiumSubscription = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('monthly');
  const [expandedTier, setExpandedTier] = useState<string | null>(null);
  
  const toggleExpandTier = (tier: string) => {
    setExpandedTier(expandedTier === tier ? null : tier);
  };
  
  const isPlanExpanded = (tier: string) => expandedTier === tier;

  const monthlyPrices = {
    basic: 'Ingyenes',
    premium: '9 900 Ft',
    premiumPlus: '19 900 Ft',
  };
  
  const annualPrices = {
    basic: 'Ingyenes',
    premium: '7 900 Ft/hó',
    premiumPlus: '15 900 Ft/hó',
  };

  const prices = billingPeriod === 'monthly' ? monthlyPrices : annualPrices;
  const annualDiscount = {
    premium: '20% megtakarítás',
    premiumPlus: '20% megtakarítás',
  };

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  // Track scroll position for parallax effects
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-100 to-white dark:from-neutral-900 dark:to-neutral-800 overflow-x-hidden">
      {/* Hero Section */}
      <div className="w-full bg-premium-gradient-1 bg-pattern-dots relative overflow-hidden">
        {/* Decorative Elements */}
        <div 
          className="absolute w-64 h-64 rounded-full bg-secondary/30 blur-3xl -top-20 -left-20"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        />
        <div 
          className="absolute w-96 h-96 rounded-full bg-accent/20 blur-3xl -bottom-40 -right-20"
          style={{ transform: `translateY(${scrollY * -0.1}px)` }}
        />
        <div 
          className="absolute top-10 right-10 w-20 h-20 rounded-full bg-white/5 backdrop-blur-md border border-white/10"
          style={{ transform: `rotate(${scrollY * 0.05}deg)` }}
        />
        
        <div className="container mx-auto px-4 py-24 relative z-10">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 blur-xl rounded-full transform scale-150"></div>
                <div className="relative bg-gradient-to-r from-primary to-accent px-6 py-2 rounded-full inline-flex items-center">
                  <Star className="h-4 w-4 text-white mr-2" />
                  <span className="text-sm font-semibold text-white">Új Prémium Szolgáltatások</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Academion <span className="text-premium-gradient">Prémium</span> Előfizetés
            </h1>
            
            <p className="text-white/90 text-lg md:text-xl mb-8 leading-relaxed">
              Bontsa ki karrierje teljes potenciálját fejlett tanulási lehetőségekkel, 
              szakértői mentorálással és személyre szabott karriertámogatással
            </p>
            
            <div className="inline-flex p-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-12 shadow-lg">
              <button 
                className={`px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 ${billingPeriod === 'monthly' ? 'bg-white text-primary shadow-md' : 'text-white hover:bg-white/10'}`}
                onClick={() => setBillingPeriod('monthly')}
              >
                Havi
              </button>
              <button 
                className={`px-8 py-3 rounded-full text-sm font-medium transition-all duration-300 ${billingPeriod === 'annually' ? 'bg-white text-primary shadow-md' : 'text-white hover:bg-white/10'}`}
                onClick={() => setBillingPeriod('annually')}
              >
                Éves
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-8 mt-12">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-white/80 text-sm">7 napos garancia</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-white/80 text-sm">Azonnali hozzáférés</span>
              </div>
              
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mr-3">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <span className="text-white/80 text-sm">Elégedettségi garancia</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-neutral-100 to-transparent dark:from-neutral-900"></div>
      </div>
      
      {/* Pricing Cards */}
      <div className="container mx-auto px-4 py-16 -mt-10 relative z-20">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Basic Plan */}
          <motion.div 
            className={`rounded-xl overflow-hidden transition-all duration-300 ${isPlanExpanded('basic') ? 'ring-2 ring-primary/20' : ''}`}
            variants={itemVariants}
          >
            <GlassmorphicCard
              blurIntensity="subtle"
              borderStyle="light"
              backgroundOpacity="medium"
              className="h-full"
              hoverEffect
            >
              <div className="p-8">
                <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                  <Bookmark className="h-6 w-6 text-neutral-600 dark:text-neutral-400" />
                </div>
                
                <h3 className="text-2xl font-bold mb-2">Alap</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6 text-sm">
                  Kezdje el tanulási útját
                </p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold">{prices.basic}</span>
                </div>
                
                <Button className="w-full mb-8 py-6 text-base">
                  Regisztráció
                </Button>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="rounded-full p-1 bg-primary/10 flex-shrink-0 mt-0.5 mr-3">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">Korlátozott kurzus hozzáférés</span>
                  </div>
                  <div className="flex items-start">
                    <div className="rounded-full p-1 bg-primary/10 flex-shrink-0 mt-0.5 mr-3">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">Alapszintű karrierértékelés</span>
                  </div>
                  <div className="flex items-start">
                    <div className="rounded-full p-1 bg-primary/10 flex-shrink-0 mt-0.5 mr-3">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">Közösségi fórum hozzáférés</span>
                  </div>
                  <div className="flex items-start">
                    <div className="rounded-full p-1 bg-neutral-200 dark:bg-neutral-800 flex-shrink-0 mt-0.5 mr-3">
                      <X className="h-4 w-4 text-neutral-400" />
                    </div>
                    <span className="text-sm text-neutral-500">Egyéni tanulási útvonal</span>
                  </div>
                  <div className="flex items-start">
                    <div className="rounded-full p-1 bg-neutral-200 dark:bg-neutral-800 flex-shrink-0 mt-0.5 mr-3">
                      <X className="h-4 w-4 text-neutral-400" />
                    </div>
                    <span className="text-sm text-neutral-500">Karrier mentorálás</span>
                  </div>
                </div>
                
                <button 
                  className="text-primary text-sm flex items-center justify-center w-full py-2 rounded-lg hover:bg-primary/5 transition-colors"
                  onClick={() => toggleExpandTier('basic')}
                >
                  {isPlanExpanded('basic') ? (
                    <>Kevesebb <ChevronUp className="h-4 w-4 ml-1" /></>
                  ) : (
                    <>Részletek <ChevronDown className="h-4 w-4 ml-1" /></>
                  )}
                </button>
                
                {isPlanExpanded('basic') && (
                  <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                    <h4 className="font-semibold mb-3">Az Alap csomag tartalmazza:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span>Hozzáférés az ingyenes kurzusokhoz</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span>Alapszintű karrierértékelés (15 kérdés)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span>Heti frissülő ingyenes tartalmak</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span>Közösségi fórum olvasási jogosultság</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span>E-mail értesítések új kurzusokról</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </GlassmorphicCard>
          </motion.div>
          
          {/* Premium Plan */}
          <motion.div 
            className={`rounded-xl overflow-hidden transition-all duration-300 transform scale-105 z-10 ${isPlanExpanded('premium') ? 'ring-2 ring-primary scale-[1.07]' : ''}`}
            variants={itemVariants}
          >
            <PremiumCard className="h-full relative">
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <div className="bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold px-4 py-1 rounded-full shadow-lg">
                  Népszerű választás
                </div>
              </div>
              <div className="p-8 pt-10">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                
                <h3 className="text-2xl font-bold mb-2">Prémium</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6 text-sm">
                  Teljes hozzáférés a prémium szolgáltatásokhoz
                </p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold">{prices.premium}</span>
                  <span className="text-sm text-neutral-500 ml-2">/hó</span>
                  {billingPeriod === 'annually' && (
                    <div className="mt-2">
                      <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                        {annualDiscount.premium}
                      </span>
                    </div>
                  )}
                </div>
                
                <Button className="w-full bg-primary hover:bg-primary/90 mb-8 py-6 text-base relative overflow-hidden group">
                  <span className="relative z-10">7 napos próbaidőszak</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary via-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Button>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="rounded-full p-1 bg-primary/10 flex-shrink-0 mt-0.5 mr-3">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">Korlátlan kurzus hozzáférés</span>
                  </div>
                  <div className="flex items-start">
                    <div className="rounded-full p-1 bg-primary/10 flex-shrink-0 mt-0.5 mr-3">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">Bővített karrierértékelés</span>
                  </div>
                  <div className="flex items-start">
                    <div className="rounded-full p-1 bg-primary/10 flex-shrink-0 mt-0.5 mr-3">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">Egyéni tanulási útvonal</span>
                  </div>
                  <div className="flex items-start">
                    <div className="rounded-full p-1 bg-primary/10 flex-shrink-0 mt-0.5 mr-3">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">Havi 1 mentorálás</span>
                  </div>
                  <div className="flex items-start">
                    <div className="rounded-full p-1 bg-neutral-200 dark:bg-neutral-800 flex-shrink-0 mt-0.5 mr-3">
                      <X className="h-4 w-4 text-neutral-400" />
                    </div>
                    <span className="text-sm text-neutral-500">Álláskeresési garancia</span>
                  </div>
                </div>
                
                <button 
                  className="text-primary text-sm flex items-center justify-center w-full py-2 rounded-lg hover:bg-primary/5 transition-colors"
                  onClick={() => toggleExpandTier('premium')}
                >
                  {isPlanExpanded('premium') ? (
                    <>Kevesebb <ChevronUp className="h-4 w-4 ml-1" /></>
                  ) : (
                    <>Részletek <ChevronDown className="h-4 w-4 ml-1" /></>
                  )}
                </button>
                
                {isPlanExpanded('premium') && (
                  <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                    <h4 className="font-semibold mb-3">A Prémium csomag tartalmazza:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span>Korlátlan hozzáférés minden kurzushoz</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span>Részletes karrierértékelés (50+ kérdés)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span>Negyedéves újraértékelés</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span>AI által generált személyre szabott tanulási útvonal</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span>Havi 1 alkalommal 30 perces virtuális mentorálás</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span>Önéletrajz átnézés és optimalizálás</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span>Prioritás az új kurzusokhoz</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </PremiumCard>
          </motion.div>
          
          {/* Premium Plus Plan */}
          <motion.div 
            className={`rounded-xl overflow-hidden transition-all duration-300 ${isPlanExpanded('premiumPlus') ? 'ring-2 ring-primary/20' : ''}`}
            variants={itemVariants}
          >
            <GlassmorphicCard
              premium
              blurIntensity="medium"
              borderStyle="gradient"
              backgroundOpacity="light"
              className="h-full"
              hoverEffect
            >
              <div className="p-8">
                <div className="w-12 h-12 bg-gradient-to-br from-tertiary to-accent rounded-full flex items-center justify-center mb-6">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-2">Prémium Plusz</h3>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6 text-sm">
                  Teljes körű karriertámogatás garantált eredményekkel
                </p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold">{prices.premiumPlus}</span>
                  <span className="text-sm text-neutral-500 ml-2">/hó</span>
                  {billingPeriod === 'annually' && (
                    <div className="mt-2">
                      <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                        {annualDiscount.premiumPlus}
                      </span>
                    </div>
                  )}
                </div>
                
                <Button className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 mb-8 py-6 text-base animate-subtle-pulse">
                  7 napos próbaidőszak
                </Button>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="rounded-full p-1 bg-primary/10 flex-shrink-0 mt-0.5 mr-3">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">Minden Prémium funkció</span>
                  </div>
                  <div className="flex items-start">
                    <div className="rounded-full p-1 bg-primary/10 flex-shrink-0 mt-0.5 mr-3">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">Heti 1 mentorálás</span>
                  </div>
                  <div className="flex items-start">
                    <div className="rounded-full p-1 bg-primary/10 flex-shrink-0 mt-0.5 mr-3">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">Munkáltatói kapcsolatok</span>
                  </div>
                  <div className="flex items-start">
                    <div className="rounded-full p-1 bg-primary/10 flex-shrink-0 mt-0.5 mr-3">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">Portfólió fejlesztés</span>
                  </div>
                  <div className="flex items-start">
                    <div className="rounded-full p-1 bg-primary/10 flex-shrink-0 mt-0.5 mr-3">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span className="text-sm">Álláskeresési garancia*</span>
                  </div>
                </div>
                
                <button 
                  className="text-primary text-sm flex items-center justify-center w-full py-2 rounded-lg hover:bg-primary/5 transition-colors"
                  onClick={() => toggleExpandTier('premiumPlus')}
                >
                  {isPlanExpanded('premiumPlus') ? (
                    <>Kevesebb <ChevronUp className="h-4 w-4 ml-1" /></>
                  ) : (
                    <>Részletek <ChevronDown className="h-4 w-4 ml-1" /></>
                  )}
                </button>
                
                {isPlanExpanded('premiumPlus') && (
                  <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                    <h4 className="font-semibold mb-3">A Prémium Plusz csomag tartalmazza:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span>Minden Prémium csomag funkciót</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span>Heti 1 alkalommal 60 perces virtuális mentorálás</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span>Közvetlen kapcsolat munkáltatói partnereinkkel</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span>Szakértői segítség portfóliója fejlesztéséhez</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span>Gyakorló interjúk visszajelzéssel</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span>Álláskeresési garancia* válogatott karrierutakra</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                        <span>Elsőbbségi ügyfélszolgálat</span>
                      </li>
                    </ul>
                    <p className="mt-4 text-xs text-neutral-500">
                      * Az álláskeresési garancia feltételekhez kötött. A program befejezése után 6 hónapon belül állásajánlatot garantálunk, vagy visszatérítjük az előfizetési díjat.
                    </p>
                  </div>
                )}
              </div>
            </GlassmorphicCard>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Premium Features */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Prémium Előnyök</h2>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Az Academion Prémium előfizetés kiemelkedő tanulási élményt biztosít, személyre szabott 
            támogatással a karrierfejlesztés minden szakaszában.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <GlassmorphicCard 
            blurIntensity="subtle" 
            borderStyle="light" 
            hoverEffect
            className="p-6"
          >
            <div className="mb-4 rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Bővített Karrierértékelés</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              Részletes, 50+ kérdésből álló személyiség- és készségprofil elemzés, 
              amely feltárja erősségeit és fejlesztendő területeit.
            </p>
          </GlassmorphicCard>
          
          <GlassmorphicCard 
            blurIntensity="subtle" 
            borderStyle="light" 
            hoverEffect
            className="p-6"
          >
            <div className="mb-4 rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Személyre Szabott Tanulási Út</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              AI által generált, egyedi tanulási útvonal, amely alkalmazkodik előrehaladásához 
              és tanulási stílusához.
            </p>
          </GlassmorphicCard>
          
          <GlassmorphicCard 
            blurIntensity="subtle" 
            borderStyle="light" 
            hoverEffect
            className="p-6"
          >
            <div className="mb-4 rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Szakértői Mentorálás</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              Rendszeres 1:1 virtuális mentorálás iparági szakértőkkel, 
              akik személyre szabott iránymutatást nyújtanak.
            </p>
          </GlassmorphicCard>
          
          <GlassmorphicCard 
            blurIntensity="subtle" 
            borderStyle="light" 
            hoverEffect
            className="p-6"
          >
            <div className="mb-4 rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Negyedéves Újraértékelés</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              Rendszeres készségfelmérés és karrierút-elemzés a fejlődés nyomon követésére 
              és a célok frissítésére.
            </p>
          </GlassmorphicCard>
          
          <GlassmorphicCard 
            blurIntensity="subtle" 
            borderStyle="light" 
            hoverEffect
            className="p-6"
          >
            <div className="mb-4 rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Munkáltatói Kapcsolatok</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              Közvetlen kapcsolat partnervállalatokkal, valamint álláskeresési támogatás 
              és elhelyezkedési garancia a Prémium Plusz előfizetőknek.
            </p>
          </GlassmorphicCard>
          
          <GlassmorphicCard 
            blurIntensity="subtle" 
            borderStyle="light" 
            hoverEffect
            className="p-6"
          >
            <div className="mb-4 rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Elsőbbségi Hozzáférés</h3>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              Korai hozzáférés új kurzusokhoz, tanulási anyagokhoz és 
              eseményekhez, valamint elsőbbségi ügyfélszolgálat.
            </p>
          </GlassmorphicCard>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Gyakori Kérdések</h2>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Mi a különbség az Alap és a Prémium előfizetés között?</AccordionTrigger>
              <AccordionContent>
                Az Alap (ingyenes) csomag korlátozott hozzáférést biztosít a kurzusokhoz és egy egyszerűbb karrierértékelést. 
                A Prémium előfizetéssel korlátlan hozzáférést kap minden kurzushoz, részletes karrierértékelést, személyre szabott 
                tanulási útvonalat és havi mentorálást karriercéljai eléréséhez.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>Hogyan működik a 7 napos próbaidőszak?</AccordionTrigger>
              <AccordionContent>
                A Prémium és Prémium Plusz előfizetésekhez 7 napos ingyenes próbaidőszakot kínálunk. 
                Ez idő alatt teljes hozzáférést kap az összes prémium funkcióhoz. Ha a 7 nap során bármikor 
                lemondja előfizetését, nem kerül terhelésre a bankkártyája. A próbaidőszak után automatikusan 
                aktiválódik a választott előfizetés.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>Mit jelent az álláskeresési garancia?</AccordionTrigger>
              <AccordionContent>
                A Prémium Plusz csomagban elérhető álláskeresési garancia azt jelenti, hogy ha a program 
                befejezése után 6 hónapon belül nem kap legalább egy állásajánlatot a tanult szakterületen, 
                visszatérítjük az előfizetési díját. Ez a garancia feltételekhez kötött: a program összes elemét 
                teljesítenie kell, beleértve a mentorálásokat, gyakorlati feladatokat és a portfolió elkészítését.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>Lemondhatom az előfizetést bármikor?</AccordionTrigger>
              <AccordionContent>
                Igen, mindkét prémium előfizetés bármikor lemondható, további kötelezettség nélkül. 
                Az előfizetés a már kifizetett időszak végéig marad aktív. Éves előfizetés esetén a fel nem használt 
                hónapokra időarányos visszatérítést biztosítunk, ha a lemondás az előfizetés kezdetétől számított 
                30 napon túl történik.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>Hogyan működik a mentorálási program?</AccordionTrigger>
              <AccordionContent>
                A mentorálási program során iparági szakértőkkel találkozhat virtuálisan. A Prémium előfizetők 
                havonta egy 30 perces, a Prémium Plusz előfizetők hetente egy 60 perces mentorálásra jogosultak. 
                A mentorálások során személyre szabott tanácsadást, karriertervet és álláskeresési stratégiákat kap, 
                valamint lehetősége van konkrét kérdések megvitatására és gyakorlati feladatok áttekintésére.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="rounded-xl overflow-hidden bg-premium-gradient-1 bg-pattern-dots">
          <div className="p-8 md:p-12 backdrop-blur-sm">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Fejlessze karrierjét az Academion Prémiummal
              </h2>
              <p className="text-white/90 text-lg mb-8">
                Csatlakozzon ma és tapasztalja meg a különbséget, amit a személyre szabott 
                karriertámogatás nyújthat. Kezdje el 7 napos ingyenes próbaidőszakkal!
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button className="bg-white text-primary hover:bg-white/90" size="lg">
                  Prémium Próbaidőszak
                </Button>
                <Button variant="outline" className="border-white text-white hover:bg-white/10" size="lg">
                  Tovább az Összehasonlításhoz
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumSubscription;