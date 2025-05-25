import elteImage from "../assets/ELTE.png";
import bmeImage from "../assets/bme.png";
import debreceniImage from "../assets/debreceni.png";
import corvinusImage from "../assets/corvinus_logo_angol_sz_transparent.png";

export const universities = [
  {
    id: 1,
    name: "Budapesti Műszaki és Gazdaságtudományi Egyetem",
    description: "Magyarország vezető műszaki egyeteme, ahol a mérnöki és természettudományos oktatás mellett gazdasági és menedzsment képzések is elérhetők. A BME kutatási tevékenysége nemzetközileg is elismert.",
    logoUrl: bmeImage,
    country: "Magyarország",
    location: "Budapest",
    foundedYear: 1782,
    website: "https://www.bme.hu",
    studentsCount: 21000,
    facultiesCount: 8,
    programsCount: 120,
    ranking: 1,
    accreditation: "Magyar Akkreditációs Bizottság"
  },
  {
    id: 2,
    name: "Eötvös Loránd Tudományegyetem",
    description: "Magyarország egyik legrégebbi és legrangosabb egyeteme, ahol természettudományi, bölcsészeti, jogi, társadalomtudományi és informatikai képzések széles skálája érhető el.",
    logoUrl: elteImage,
    country: "Magyarország",
    location: "Budapest",
    foundedYear: 1635,
    website: "https://www.elte.hu",
    studentsCount: 26000,
    facultiesCount: 9,
    programsCount: 140,
    ranking: 2,
    accreditation: "Magyar Akkreditációs Bizottság"
  },
  {
    id: 3,
    name: "Corvinus Egyetem",
    description: "Vezető üzleti és gazdasági képzéseket nyújtó intézmény, amely a közgazdaságtan, gazdálkodás és társadalomtudományok területén kínál magas színvonalú oktatást.",
    logoUrl: corvinusImage,
    country: "Magyarország",
    location: "Budapest",
    foundedYear: 1948,
    website: "https://www.uni-corvinus.hu",
    studentsCount: 11000,
    facultiesCount: 5,
    programsCount: 80,
    ranking: 3,
    accreditation: "Magyar Akkreditációs Bizottság"
  },
  {
    id: 4,
    name: "Debreceni Egyetem",
    description: "Széles képzési kínálattal rendelkező egyetem, amely különösen az orvostudományi, agrártudományi és természettudományi területeken nyújt kiemelkedő képzéseket.",
    logoUrl: debreceniImage,
    country: "Magyarország",
    location: "Debrecen",
    foundedYear: 1538,
    website: "https://www.unideb.hu",
    studentsCount: 25000,
    facultiesCount: 14,
    programsCount: 160,
    ranking: 4,
    accreditation: "Magyar Akkreditációs Bizottság"
  },
  {
    id: 5,
    name: "Szegedi Tudományegyetem",
    description: "Kiváló kutatási és oktatási központ, amely különösen a biológia, fizika és informatika területein ér el jelentős nemzetközi sikereket.",
    logoUrl: bmeImage, // Placeholder
    country: "Magyarország",
    location: "Szeged",
    foundedYear: 1872,
    website: "https://www.u-szeged.hu",
    studentsCount: 20000,
    facultiesCount: 12,
    programsCount: 130,
    ranking: 5,
    accreditation: "Magyar Akkreditációs Bizottság"
  },
  {
    id: 6,
    name: "Pécsi Tudományegyetem",
    description: "Magyarország első egyeteme, amely különösen az orvostudományi, jogi és bölcsészettudományi képzésekben nyújt magas színvonalú oktatást.",
    logoUrl: elteImage, // Placeholder
    country: "Magyarország",
    location: "Pécs",
    foundedYear: 1367,
    website: "https://www.pte.hu",
    studentsCount: 18000,
    facultiesCount: 10,
    programsCount: 115,
    ranking: 6,
    accreditation: "Magyar Akkreditációs Bizottság"
  }
];
