import elteImage from "../assets/ELTE.png";
import bmeImage from "../assets/bme.png";
import debreceniImage from "../assets/debreceni.png";
import corvinusImage from "../assets/corvinus_logo_angol_sz_transparent.png";

export const degrees = [
  {
    id: 1,
    name: "BSc Gazdasági informatika",
    description: "Gyakorlatorientált informatikai és gazdasági ismeretek egy programban. Ez a képzés az üzleti problémák informatikai megoldására készíti fel a hallgatókat, erős programozási és adatelemzési alapokkal.",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    universityId: 1,
    level: "bachelor",
    duration: "6 félév",
    credits: 180,
    studentCount: 1245,
    rating: 4.7,
    price: 350000,
    subjects: ["Programozási alapok", "Adatbázisrendszerek", "Adatelemzés", "Üzleti intelligencia", "Projektmenedzsment", "Vállalatgazdaságtan"]
  },
  {
    id: 2,
    name: "BSc Programtervező informatikus",
    description: "Átfogó szoftverfejlesztési és programozási ismeretek a modern alkalmazásfejlesztéshez. A képzés során a hallgatók elsajátítják a fejlesztési módszertanokat és a legmodernebb programozási nyelveket és keretrendszereket.",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    universityId: 2,
    level: "bachelor",
    duration: "6 félév",
    credits: 180,
    studentCount: 1876,
    rating: 4.8,
    price: 375000,
    subjects: ["Programozási nyelvek", "Algoritmusok és adatszerkezetek", "Szoftvertechnológia", "Mesterséges intelligencia", "Webes alkalmazások fejlesztése", "Adatbázisok"]
  },
  {
    id: 3,
    name: "BSc Marketing",
    description: "Modern marketingstratégiák és -eszközök a digitális korban. A képzés felkészíti a hallgatókat a digitális marketing kihívásaira, a fogyasztói magatartás elemzésére és marketingstratégiák kidolgozására.",
    imageUrl: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    universityId: 3,
    level: "bachelor",
    duration: "6 félév",
    credits: 180,
    studentCount: 1543,
    rating: 4.6,
    price: 385000,
    subjects: ["Marketingkutatás", "Digitális marketing", "Fogyasztói magatartás", "Marketingkommunikáció", "Márkamenedzsment", "Reklámstratégia"]
  },
  {
    id: 4,
    name: "MSc Vállalkozásmenedzsment",
    description: "Üzleti vezetői készségek és vállalkozásfejlesztés haladó szinten. A mesterképzés célja olyan szakemberek képzése, akik képesek vállalkozásokat vezetni, stratégiát alkotni és hatékonyan irányítani a különböző vállalati funkciókat.",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    universityId: 4,
    level: "master",
    duration: "4 félév",
    credits: 120,
    studentCount: 876,
    rating: 4.9,
    price: 425000,
    subjects: ["Stratégiai menedzsment", "Változásmenedzsment", "Vezetői számvitel", "Innovációmenedzsment", "Szervezetfejlesztés", "Emberi erőforrás menedzsment"]
  },
  {
    id: 5,
    name: "MSc Adattudomány",
    description: "Adatelemzés, gépi tanulás és üzleti intelligencia mesterfokon. A képzés során a hallgatók elsajátítják a nagy adathalmazok elemzésének módszereit és az adatvezérelt döntéshozatal alapelveit.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    universityId: 1,
    level: "master",
    duration: "4 félév",
    credits: 120,
    studentCount: 743,
    rating: 4.8,
    price: 450000,
    subjects: ["Gépi tanulás", "Nagy adathalmazok kezelése", "Statisztikai módszerek", "Adatvizualizáció", "Prediktív modellek", "Mély tanulás"]
  },
  {
    id: 6,
    name: "PhD Informatikai Tudományok",
    description: "Elmélyült kutatási lehetőség az informatika legújabb területein. A doktori képzés során a hallgatók önálló kutatást végeznek és hozzájárulnak az informatika tudományterületének fejlődéséhez.",
    imageUrl: "https://images.unsplash.com/photo-1580894732930-0babd100d356?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    universityId: 1,
    level: "phd",
    duration: "8 félév",
    credits: 240,
    studentCount: 124,
    rating: 4.9,
    price: 500000,
    subjects: ["Kutatásmódszertan", "Tudományos publikálás", "Speciális informatikai területek", "Kutatószeminárium", "Önálló kutatómunka"]
  },
  {
    id: 7,
    name: "Specializáció: Projektmenedzsment",
    description: "Projektvezetési ismeretek gyakorlati szempontból, munka mellett végezhető formában. A képzés célja a projektmenedzsment módszertanok és eszközök gyakorlati alkalmazásának elsajátítása.",
    imageUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    universityId: 3,
    level: "specialization",
    duration: "2 félév",
    credits: 60,
    studentCount: 321,
    rating: 4.5,
    price: 295000,
    subjects: ["Projektvezetés", "Agilis módszertanok", "Kockázatmenedzsment", "Csapatvezetés", "Projekttervezés"]
  },
  {
    id: 8,
    name: "Felsőoktatási szakképzés: Gazdálkodás és menedzsment",
    description: "Gyakorlatorientált gazdasági alapismeretek rövidebb képzési idővel. A képzés gyakorlati tudást nyújt a vállalati működés alapvető területein.",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    universityId: 3,
    level: "advanced-vocational",
    duration: "4 félév",
    credits: 120,
    studentCount: 567,
    rating: 4.4,
    price: 280000,
    subjects: ["Vállalati pénzügyek", "Marketing alapok", "Számvitel", "Gazdasági jog", "Vezetési ismeretek"]
  }
];
