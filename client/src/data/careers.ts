// Career paths data for Academion platform

// Career paths categorization 
export const careerCategories = {
  tech: { name: 'Technológia', color: 'bg-blue-100 text-blue-800' },
  marketing: { name: 'Marketing', color: 'bg-green-100 text-green-800' },
  design: { name: 'Design', color: 'bg-purple-100 text-purple-800' },
  business: { name: 'Üzlet', color: 'bg-amber-100 text-amber-800' },
  education: { name: 'Oktatás', color: 'bg-red-100 text-red-800' },
  finance: { name: 'Pénzügy', color: 'bg-emerald-100 text-emerald-800' },
  healthcare: { name: 'Egészségügy', color: 'bg-rose-100 text-rose-800' }
};

// Difficulty levels
export const difficultyLevels = {
  'Kezdő-barát': { name: 'Kezdő-barát', color: 'bg-green-100 text-green-800' },
  'Közepes': { name: 'Közepes', color: 'bg-blue-100 text-blue-800' },
  'Haladó': { name: 'Haladó', color: 'bg-purple-100 text-purple-800' }
};

// Define career paths
export const careerPaths = [
  {
    id: 'data-analyst',
    title: 'Adatelemző',
    iconType: 'lineChart',
    iconColor: 'text-blue-500',
    description: 'Adatelemzők adatokat gyűjtenek, tisztítanak és értelmeznek, hogy támogassák az üzleti döntéshozatalt. Python, SQL és adatvizualizációs eszközök használatával dolgoznak.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    averageSalary: '800,000 - 1,200,000 Ft/hó',
    jobOutlook: 'Magas',
    growthRate: '+27%',
    timeToComplete: '6 hónap',
    difficulty: 'Közepes',
    rating: 4.8,
    students: 1250,
    isPopular: true,
    isTrending: true,
    category: 'tech',
    yearlyGrowth: [
      { year: 2022, jobs: 3200 },
      { year: 2023, jobs: 3800 },
      { year: 2024, jobs: 4500 },
      { year: 2025, jobs: 5200 },
    ],
    skills: ['SQL', 'Python', 'Excel', 'Adatvizualizáció', 'Statisztika', 'Tableau', 'R', 'Pandas'],
    recommendedCourses: [10, 11, 12, 13],
    topCompanies: ['OTP Bank', 'Vodafone', 'Mol Group', 'Telekom'],
    certifications: ['Microsoft Data Analyst', 'IBM Data Science', 'Google Data Analytics'],
    highlights: [
      'Az adatelemzők a legkeresettebb szakemberek közé tartoznak',
      'Rugalmas munkalehetőségek távmunkával is',
      'Számos iparágban szükség van adatelemzőkre',
      'A karrierváltók számára ideális kezdő pozíció'
    ]
  },
  {
    id: 'digital-marketer',
    title: 'Digitális Marketing Specialista',
    iconType: 'trendingUp',
    iconColor: 'text-green-500',
    description: 'Digitális marketing szakemberek online kampányokat terveznek és hajtanak végre különböző platformokon, analitikával mérik a teljesítményt és optimalizálják a stratégiákat.',
    imageUrl: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    averageSalary: '700,000 - 1,100,000 Ft/hó',
    jobOutlook: 'Nagyon magas',
    growthRate: '+32%',
    timeToComplete: '5 hónap',
    difficulty: 'Kezdő-barát',
    rating: 4.7,
    students: 1850,
    isPopular: true,
    isTrending: true,
    category: 'marketing',
    yearlyGrowth: [
      { year: 2022, jobs: 2700 },
      { year: 2023, jobs: 3200 },
      { year: 2024, jobs: 4100 },
      { year: 2025, jobs: 4800 },
    ],
    skills: ['SEO', 'Google Analytics', 'Közösségi média', 'PPC hirdetések', 'Tartalommarketing', 'Email marketing', 'Konverzió optimalizálás', 'Copywriting'],
    recommendedCourses: [20, 21, 22, 23],
    topCompanies: ['Wavemaker', 'Google Hungary', 'GroupM', 'Httpool'],
    certifications: ['Google Ads', 'Facebook Blueprint', 'HubSpot Marketing'],
    highlights: [
      'A leggyorsabban növekvő karrierpálya Magyarországon',
      'Alacsony belépési küszöb karrierváltóknak',
      'Kreatív és adatvezérelt munka kombinációja',
      'Könnyen szerezhető nemzetközi tanúsítványok'
    ]
  },
  {
    id: 'ux-designer',
    title: 'UX/UI Designer',
    iconType: 'penTool',
    iconColor: 'text-purple-500',
    description: 'UX/UI tervezők a felhasználói élményt és felületet tervezik, kutatást végeznek, prototípusokat készítenek, és a felhasználók visszajelzései alapján finomítják a termékeket.',
    imageUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    averageSalary: '800,000 - 1,300,000 Ft/hó',
    jobOutlook: 'Magas',
    growthRate: '+24%',
    timeToComplete: '7 hónap',
    difficulty: 'Közepes',
    rating: 4.9,
    students: 980,
    isPopular: true,
    isTrending: false,
    category: 'design',
    yearlyGrowth: [
      { year: 2022, jobs: 1800 },
      { year: 2023, jobs: 2100 },
      { year: 2024, jobs: 2400 },
      { year: 2025, jobs: 2800 },
    ],
    skills: ['Felhasználói kutatás', 'Wireframing', 'Prototyping', 'Figma', 'UI Design', 'Adobe XD', 'Interakciós design', 'Információs architektúra'],
    recommendedCourses: [30, 31, 32, 33],
    topCompanies: ['EPAM Systems', 'LogMeIn', 'Prezi', 'Emarsys'],
    certifications: ['Google UX Design Professional', 'Nielsen Norman Group UX Certification', 'Interaction Design Foundation'],
    highlights: [
      'Kreatív munka erős technikai háttérrel',
      'A hazai startupok egyik legkeresettebb pozíciója',
      'Portfólió-központú karrierlehetőségek',
      'Távmunka és nemzetközi lehetőségek'
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Kiberbiztonsági Specialista',
    iconType: 'shield',
    iconColor: 'text-red-500',
    description: 'Kiberbiztonsági szakemberek védik a szervezetek rendszereit és adatait a digitális fenyegetésektől, biztonsági protokollokat fejlesztenek és incidenseket kezelnek.',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    averageSalary: '900,000 - 1,500,000 Ft/hó',
    jobOutlook: 'Nagyon magas',
    growthRate: '+35%',
    timeToComplete: '8 hónap',
    difficulty: 'Haladó',
    rating: 4.8,
    students: 720,
    isPopular: false,
    isTrending: true,
    category: 'tech',
    yearlyGrowth: [
      { year: 2022, jobs: 1200 },
      { year: 2023, jobs: 1500 },
      { year: 2024, jobs: 1900 },
      { year: 2025, jobs: 2300 },
    ],
    skills: ['Hálózati biztonság', 'Etikus hackelés', 'Incidenskezelés', 'Kockázatelemzés', 'Biztonsági eszközök', 'Penetrációs tesztelés', 'SIEM rendszerek', 'Kriptográfia'],
    recommendedCourses: [40, 41, 42, 43],
    topCompanies: ['Magyar Telekom', 'OTP Bank', 'Deloitte Hungary', 'IBM Hungary'],
    certifications: ['CompTIA Security+', 'Certified Ethical Hacker (CEH)', 'Certified Information Systems Security Professional (CISSP)'],
    highlights: [
      'A legmagasabb fizetések a tech szektorban',
      'Kritikus szakemberhiány az iparágban',
      'Védett szakma gazdasági visszaesések idején is',
      'Nemzetközi tanúsítványokkal globális karrierlehetőségek'
    ]
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    iconType: 'barChart',
    iconColor: 'text-indigo-500',
    description: 'Az adattudósok fejlett analitikai, statisztikai és programozási ismeretekkel elemzik a komplex adatokat, hogy előrejelzéseket készítsenek és értéket teremtsenek a vállalatok számára.',
    imageUrl: 'https://images.unsplash.com/photo-1456428746267-a1756408f782?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    averageSalary: '1,000,000 - 1,700,000 Ft/hó',
    jobOutlook: 'Magas',
    growthRate: '+30%',
    timeToComplete: '9 hónap',
    difficulty: 'Haladó',
    rating: 4.9,
    students: 650,
    isPopular: false,
    isTrending: true,
    category: 'tech',
    yearlyGrowth: [
      { year: 2022, jobs: 900 },
      { year: 2023, jobs: 1100 },
      { year: 2024, jobs: 1350 },
      { year: 2025, jobs: 1700 },
    ],
    skills: ['Python', 'Gépi tanulás', 'Mély tanulás', 'Statisztika', 'TensorFlow', 'R', 'SQL', 'Big Data technológiák'],
    recommendedCourses: [50, 51, 52, 53],
    topCompanies: ['Morgan Stanley', 'Ericsson', 'Continental', 'Bosch'],
    certifications: ['IBM Data Science Professional', 'Microsoft Certified: Azure Data Scientist', 'Google Professional Data Engineer'],
    highlights: [
      'Az egyik legnagyobb presztízsű tech pozíció',
      'Mély matematikai és informatikai tudás kombinációja',
      'Kimagasló fizetések már junior szinten is',
      'Kutatás-fejlesztési projektek és innovatív technológiák'
    ]
  },
  {
    id: 'frontend-developer',
    title: 'Frontend Fejlesztő',
    iconType: 'code',
    iconColor: 'text-yellow-500',
    description: 'A frontend fejlesztők weboldalak és alkalmazások felhasználói felületét tervezik és fejlesztik modern technológiákkal, mint a React, Angular és Vue.js.',
    imageUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    averageSalary: '700,000 - 1,300,000 Ft/hó',
    jobOutlook: 'Magas',
    growthRate: '+23%',
    timeToComplete: '6 hónap',
    difficulty: 'Közepes',
    rating: 4.7,
    students: 1450,
    isPopular: true,
    isTrending: false,
    category: 'tech',
    yearlyGrowth: [
      { year: 2022, jobs: 2800 },
      { year: 2023, jobs: 3100 },
      { year: 2024, jobs: 3500 },
      { year: 2025, jobs: 3900 },
    ],
    skills: ['JavaScript', 'React', 'HTML', 'CSS', 'TypeScript', 'Reszponzív design', 'Git', 'Frontend tesztelés'],
    recommendedCourses: [60, 61, 62, 63],
    topCompanies: ['EPAM Systems', 'Cognizant', 'Accenture', 'Emarsys'],
    certifications: ['Meta Front-End Developer', 'JavaScript Institute Certification', 'W3Schools Front End Developer'],
    highlights: [
      'Ideális karrierváltási lehetőség kreatív embereknek',
      'A legkeresettebb fejlesztői pozíciók egyike Magyarországon',
      'Bőséges junior pozíciók karrierváltóknak',
      'Folyamatos szakmai fejlődési lehetőségek'
    ]
  },
  {
    id: 'business-analyst',
    title: 'Üzleti Elemző',
    iconType: 'barChart',
    iconColor: 'text-amber-500',
    description: 'Az üzleti elemzők az üzleti folyamatokat, követelményeket és rendszereket elemzik, hogy megoldást találjanak az üzleti problémákra és segítsék a vállalatok növekedését.',
    imageUrl: 'https://images.unsplash.com/photo-1664575196644-808978af9b1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    averageSalary: '750,000 - 1,200,000 Ft/hó',
    jobOutlook: 'Magas',
    growthRate: '+25%',
    timeToComplete: '5 hónap',
    difficulty: 'Közepes',
    rating: 4.6,
    students: 1120,
    isPopular: true,
    isTrending: false,
    category: 'business',
    yearlyGrowth: [
      { year: 2022, jobs: 2200 },
      { year: 2023, jobs: 2500 },
      { year: 2024, jobs: 2900 },
      { year: 2025, jobs: 3300 },
    ],
    skills: ['Adatelemzés', 'Folyamatmodellezés', 'SQL', 'Excel', 'Prezentációs készségek', 'Üzleti követelmények elemzése', 'Projektmenedzsment alapok', 'Power BI'],
    recommendedCourses: [70, 71, 72, 73],
    topCompanies: ['K&H Bank', 'Deloitte', 'KPMG', 'Vodafone'],
    certifications: ['IIBA Certified Business Analysis Professional (CBAP)', 'PMI Professional in Business Analysis (PMI-PBA)', 'IREB Certified Professional for Requirements Engineering'],
    highlights: [
      'Hidat képez az üzleti és technológiai csapatok között',
      'Kiváló belépési lehetőség más üzleti területekre',
      'Analitikus és kommunikációs készségek kombinációja',
      'Magas elhelyezkedési arány karrierváltók számára is'
    ]
  },
  {
    id: 'hr-specialist',
    title: 'HR és Toborzási Specialista',
    iconType: 'users',
    iconColor: 'text-teal-500',
    description: 'A HR specialisták felelősek a vállalat emberi erőforrásainak kezeléséért, beleértve a toborzást, képzést, teljesítményértékelést és a munkavállalói kapcsolatokat.',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    averageSalary: '600,000 - 1,000,000 Ft/hó',
    jobOutlook: 'Stabil',
    growthRate: '+18%',
    timeToComplete: '4 hónap',
    difficulty: 'Kezdő-barát',
    rating: 4.5,
    students: 980,
    isPopular: true,
    isTrending: false,
    category: 'business',
    yearlyGrowth: [
      { year: 2022, jobs: 1800 },
      { year: 2023, jobs: 2000 },
      { year: 2024, jobs: 2200 },
      { year: 2025, jobs: 2500 },
    ],
    skills: ['Toborzás és kiválasztás', 'Munkajogi alapismeretek', 'HR-rendszerek kezelése', 'Teljesítményértékelés', 'Munkavállalói kapcsolatok', 'Ösztönzési rendszerek', 'HR analitika', 'Soft skillek fejlesztése'],
    recommendedCourses: [80, 81, 82, 83],
    topCompanies: ['Randstad', 'Hays', 'HR Partner', 'Adecco'],
    certifications: ['SHRM Certified Professional (SHRM-CP)', 'HR Certification Institute (HRCI)', 'Talent Acquisition Certification'],
    highlights: [
      'Jó karrierlehetőség emberközpontú szakembereknek',
      'Sok területen alkalmazható tudás és készségek',
      'Rugalmas munkalehetőségek, távmunka opciók',
      'Kulcsfontosságú szerep a vállalati kultúra alakításában'
    ]
  }
];

// Export categorization information
export const careerCategoryInfo = {
  categoryLabels: careerCategories,
  difficultyLabels: difficultyLevels
};