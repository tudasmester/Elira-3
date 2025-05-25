import elteImage from "../assets/ELTE.png";
import bmeImage from "../assets/bme.png";
import debreceniImage from "../assets/debreceni.png";

export const courses = [
  {
    id: 1,
    title: "Pénzügyi piacok",
    description: "Átfogó kurzus a pénzügyi piacok működéséről és a sikeres befektetési stratégiákról.",
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    university: "Eötvös Loránd Tudományegyetem",
    universityLogo: elteImage,
    isFree: true,
    level: "Kezdő",
    category: "Pénzügy"
  },
  {
    id: 2,
    title: "Bevezetés a statisztikába",
    description: "Alapvető statisztikai koncepciók és módszerek, gyakorlati alkalmazásokkal.",
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    university: "Budapesti Műszaki és Gazdaságtudományi Egyetem",
    universityLogo: bmeImage,
    isFree: true,
    level: "Kezdő",
    category: "Adattudomány"
  },
  {
    id: 3,
    title: "Angol a karrierfejlesztésért",
    description: "Fejlessze angol nyelvtudását és kommunikációs készségeit a szakmai előmenetelhez.",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    university: "Debreceni Egyetem",
    universityLogo: debreceniImage,
    isFree: true,
    level: "Kezdő",
    category: "Nyelv"
  },
  {
    id: 4,
    title: "Üzleti analitika Excel segítségével: Alapfokútól a haladóig",
    description: "Sajátítsa el az Excel alapvető és haladó technikáit az üzleti elemzések hatékony elvégzéséhez.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    university: "Corvinus Egyetem",
    universityLogo: elteImage, // Using ELTE image temporarily
    isFree: true,
    level: "Minden szint",
    category: "Üzlet"
  }
];
