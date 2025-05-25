import elteImage from "../assets/ELTE.png";
import bmeImage from "../assets/bme.png";
import debreceniImage from "../assets/debreceni.png";
import corvinusImage from "../assets/corvinus_logo_angol_sz_transparent.png";

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
    category: "Üzlet és Menedzsment",
    price: 45000,
    duration: "8 hét",
    students: 1243,
    rating: 4.7,
    tags: ["Pénzügy", "Befektetés", "Tőzsde"]
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
    category: "Statisztika",
    price: 0,
    duration: "6 hét",
    students: 2518,
    rating: 4.8,
    tags: ["Statisztika", "Adatelemzés", "Excel"]
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
    category: "Nyelvek",
    price: 0,
    duration: "10 hét",
    students: 3421,
    rating: 4.9,
    tags: ["Angol", "Üzleti nyelv", "Kommunikáció"]
  },
  {
    id: 4,
    title: "Üzleti analitika Excel segítségével: Alapfokútól a haladóig",
    description: "Sajátítsa el az Excel alapvető és haladó technikáit az üzleti elemzések hatékony elvégzéséhez. Ez a kurzus gyakorlati példákon keresztül mutatja be, hogyan válhat az adatelemzés stratégiai előnnyé a vállalatok számára a mindennapi döntéshozatalban.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    university: "Corvinus Egyetem",
    universityLogo: corvinusImage,
    isFree: false,
    level: "Minden szint",
    category: "Üzlet és Menedzsment",
    price: 39000,
    duration: "8 hét",
    students: 1876,
    rating: 4.6,
    tags: ["Excel", "Adatelemzés", "Üzleti intelligencia", "Adatvizualizáció", "Pivot táblák", "Power BI"],
    highlights: [
      "Interaktív Excel workshopok valós üzleti adatokkal",
      "Pivot táblák mesterszintű használata és komplex elemzések",
      "Automatizálás makrókkal és VBA programozással",
      "Power BI integráció dinamikus dashboardok létrehozásához",
      "Gyakorlati esettanulmányok vezető magyar vállalatoktól (OTP, MOL, Telekom)"
    ],
    requirements: [
      "Alapvető számítógépes ismeretek",
      "Microsoft Excel 2016 vagy újabb verzió (Office 365 ajánlott)",
      "Alapfokú Excel ismeretek előnyt jelentenek, de nem kötelezőek"
    ],
    targetAudience: [
      "Üzleti elemzők és kontrolling szakemberek",
      "Vezetők, akik adatvezérelt döntéshozatalt szeretnének alkalmazni",
      "Pályakezdők, akik versenyképes adatelemzési készségeket szeretnének",
      "Kisvállalkozások tulajdonosai, akik hatékonyabban szeretnék elemezni üzleti adataikat"
    ],
    partnerCompanies: ["OTP Bank", "Magyar Telekom", "MOL Csoport"],
    skills: ["Excel haladó függvények", "Dinamikus kimutatások", "Adattisztítás", "Üzleti modellezés", "Előrejelzés és trendanalízis"]
  },
  {
    id: 5,
    title: "Python programozás adattudósoknak",
    description: "Sajátítsa el a Python programozási nyelv alapjait, és használja fel adatelemzéshez és vizualizációhoz. Modern adatelemzési módszerek, gépi tanulási algoritmusok és hatékony adatvizualizációs technikák elsajátítása valós projekteken keresztül.",
    imageUrl: "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    university: "Budapesti Műszaki és Gazdaságtudományi Egyetem",
    universityLogo: bmeImage,
    isFree: false,
    level: "Középhaladó",
    category: "Informatika és Programozás",
    price: 52000,
    duration: "12 hét",
    students: 2134,
    rating: 4.9,
    tags: ["Python", "Adattudomány", "Programozás", "Pandas", "Matplotlib", "Scikit-learn"],
    highlights: [
      "Gyakorlatorientált Python programozás valós adatokkal",
      "Adatelemzési módszerek és gépi tanulási alapok elsajátítása",
      "Interaktív dashboardok és vizualizációk készítése",
      "Ipari szakértők által összeállított projektportfólió",
      "Állásinterjúkra felkészítő anyagok és karriertanácsok"
    ],
    requirements: [
      "Alapvető programozási ismeretek (bármely nyelven)",
      "Alapfokú statisztikai ismeretek",
      "Saját számítógép (Windows, Mac vagy Linux)"
    ],
    targetAudience: [
      "Adatelemzők, akik bővíteni szeretnék programozási készségeiket",
      "Szoftverfejlesztők, akik az adattudomány felé orientálódnának",
      "Egyetemi hallgatók, akik adattudományi karriert terveznek",
      "Kutatók, akik adatelemzési módszereket keresnek"
    ]
  },
  {
    id: 6,
    title: "Digitális marketing alapok",
    description: "Ismerje meg a digitális marketing alapelveit, a közösségi média marketinget és a keresőoptimalizálást.",
    imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    university: "Corvinus Egyetem",
    universityLogo: corvinusImage,
    isFree: false,
    level: "Kezdő",
    category: "Üzlet és Menedzsment",
    price: 42000,
    duration: "6 hét",
    students: 1532,
    rating: 4.7,
    tags: ["Marketing", "Digitális", "SEO"]
  },
  {
    id: 7,
    title: "Gépi tanulás mérnököknek",
    description: "Ismerje meg a gépi tanulás matematikai alapjait és alkalmazásait mérnöki problémákra. Ez a kurzus a mesterséges intelligencia legmodernebb algoritmusait és azok mérnöki gyakorlatban történő alkalmazását mutatja be, a valós ipari kihívások megoldására fókuszálva.",
    imageUrl: "https://images.unsplash.com/photo-1580894732930-0babd100d356?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    university: "Budapesti Műszaki és Gazdaságtudományi Egyetem",
    universityLogo: bmeImage,
    isFree: false,
    level: "Haladó",
    category: "Adattudomány",
    price: 58000,
    duration: "14 hét",
    students: 873,
    rating: 4.8,
    tags: ["Gépi tanulás", "AI", "Adattudomány", "Neurális hálók", "Deep Learning", "TensorFlow"],
    highlights: [
      "Mélyreható matematikai alapok és algoritmusok részletes elemzése",
      "Valós ipari esettanulmányok a BMW, Bosch és Siemens vállalatoktól",
      "Gyakorlati modellépítés TensorFlow és PyTorch könyvtárakkal",
      "Kutatási szintű problémák megoldása és publikálási lehetőségek",
      "Szakértői konzultáció vezető AI kutatókkal"
    ],
    requirements: [
      "Erős matematikai háttér (lineáris algebra, valószínűségszámítás)",
      "Python programozási tapasztalat",
      "Alapszintű adatelemzési ismeretek"
    ],
    targetAudience: [
      "Mérnökök, akik mély gépi tanulási szaktudást szeretnének szerezni",
      "Adattudósok, akik mérnöki alkalmazásokra specializálódnának",
      "Kutatók, akik az elméleti hátteret és gyakorlati alkalmazást egyaránt megértenék",
      "MSc és PhD hallgatók mérnöki és informatikai területekről"
    ],
    certifications: ["BME hivatalos tanúsítvány", "IEEE Machine Learning szakértői minősítés"]
  },
  {
    id: 8,
    title: "Modern web fejlesztés: React alapok",
    description: "Tanuljon meg modern webalkalmazásokat fejleszteni a React keretrendszerrel. A kurzus során megismerheti a JavaScript-alapú fejlesztés legújabb trendjeit, a komponens-alapú architektúrát és a modern UI/UX gyakorlatokat, melyek nélkülözhetetlenek a mai webfejlesztésben.",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    university: "Eötvös Loránd Tudományegyetem",
    universityLogo: elteImage,
    isFree: false,
    level: "Középhaladó",
    category: "Informatika és Programozás",
    price: 49000,
    duration: "10 hét",
    students: 1245,
    rating: 4.7,
    tags: ["React", "JavaScript", "Web fejlesztés", "Next.js", "TypeScript", "Redux"],
    highlights: [
      "Modern React fejlesztési környezet kialakítása (Node.js, npm, Create React App, Vite)",
      "Komponens-alapú fejlesztés és állapotkezelési stratégiák (hooks, context, Redux)",
      "Frontend optimalizáció és teljesítményhangolás",
      "Interaktív projektmunka: teljes webalkalmazás fejlesztése React és Firebase használatával",
      "Ipari standardoknak megfelelő kódszervezés és tesztelési gyakorlatok"
    ],
    requirements: [
      "HTML, CSS és JavaScript alapismeretek",
      "Git verziókezelő rendszer alapszintű ismerete",
      "Alapvető programozási koncepciók megértése"
    ],
    targetAudience: [
      "Frontend fejlesztők, akik modern keretrendszerre váltanának",
      "Webfejlesztők, akik mélyebb JavaScript tudást szeretnének",
      "UI/UX tervezők, akik kódolási képességeiket fejlesztenék",
      "Informatika szakos hallgatók és friss diplomások"
    ],
    projects: [
      "Személyes portfólió weboldal",
      "Időjárás-előrejelző alkalmazás API integrációval",
      "E-commerce termékoldal bevásárlókosárral",
      "Közösségi média dashboard valós idejű frissítésekkel",
      "Saját projekt a hallgató érdeklődési köre szerint"
    ],
    toolsUsed: ["React", "Next.js", "TypeScript", "Redux", "Firebase", "Material UI"]
  },
  {
    id: 9,
    title: "Egészségügyi adatelemzés",
    description: "Ismerje meg az egészségügyi adatok elemzésének módszereit és eszközeit. A kurzus bemutatja, hogyan használhatók fel a digitális egészségügyi adatok a betegellátás javítására, klinikai döntéstámogatásra és az egészségügyi rendszerek hatékonyságának növelésére.",
    imageUrl: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    university: "Debreceni Egyetem",
    universityLogo: debreceniImage,
    isFree: false,
    level: "Középhaladó",
    category: "Egészségügy",
    price: 45000,
    duration: "8 hét",
    students: 743,
    rating: 4.6,
    tags: ["Egészségügy", "Adatelemzés", "Orvostudomány", "Biostatisztika", "Epidemiológia", "R programozás"],
    highlights: [
      "Egészségügyi információs rendszerek és adatstruktúrák megismerése",
      "Klinikai döntéstámogató rendszerek fejlesztési alapjai",
      "Biostatisztikai módszerek alkalmazása egészségügyi adatokon",
      "Epidemiológiai modellezés és járványelemzés",
      "Adatvédelmi és etikai szempontok az egészségügyi adatelemzésben"
    ],
    requirements: [
      "Alapvető statisztikai ismeretek",
      "Alapszintű adatkezelési és elemzési tapasztalat",
      "Alapfokú Excel ismeret"
    ],
    targetAudience: [
      "Egészségügyi szakemberek (orvosok, ápolók, egészségügyi menedzserek)",
      "Egészségügyi informatikusok és rendszerüzemeltetők",
      "Egészségtudományi hallgatók és kutatók",
      "Egészségügyi startupok munkatársai"
    ],
    topics: [
      "Elektronikus egészségügyi nyilvántartások (EHR) elemzése",
      "Betegpályák és erőforrás-optimalizálás",
      "Prediktív modellek fejlesztése a betegellátásban",
      "Képalkotó diagnosztika adatainak feldolgozása",
      "Egészségügyi rendszerek teljesítményértékelése"
    ],
    partnerIntézmények: ["Klinikai Központ Debrecen", "Nemzeti Egészségbiztosítási Alapkezelő", "ÁEEK"]
  },
  {
    id: 10,
    title: "Tantervfejlesztés a modern oktatásban",
    description: "Tanuljon meg hatékony tanterveket fejleszteni a modern oktatási módszerek alkalmazásával. A kurzus a kompetencia-alapú oktatás, a differenciált tanulás és a digitális pedagógia legújabb eredményeit ötvözi, hogy inspiráló és hatékony oktatási tartalmakat hozhasson létre.",
    imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    university: "Eötvös Loránd Tudományegyetem",
    universityLogo: elteImage,
    isFree: true,
    level: "Haladó",
    category: "Oktatás",
    price: 0,
    duration: "6 hét",
    students: 912,
    rating: 4.5,
    tags: ["Oktatás", "Tanterv", "Pedagógia", "Digitális oktatás", "Kompetencia-fejlesztés", "Differenciált tanulás"],
    highlights: [
      "Kompetencia-alapú tanterv tervezése és értékelése",
      "Differenciált oktatási módszerek integrálása a tananyagba",
      "Digitális eszközök és platformok hatékony használata",
      "Tanulói aktivitást ösztönző módszertani megoldások",
      "Kollaboratív szakmai közösség a folyamatos fejlődésért"
    ],
    requirements: [
      "Pedagógiai alapismeretek",
      "Legalább 1 év oktatási tapasztalat",
      "Nyitottság az innovatív oktatási módszerek iránt"
    ],
    targetAudience: [
      "Gyakorló pedagógusok és oktatók",
      "Oktatási intézmények vezetői és tananyagfejlesztői",
      "Oktatási szakértők és tanácsadók",
      "Pedagógushallgatók és kezdő tanárok mentorral"
    ],
    learningOutcomes: [
      "A tanulói igényekhez illeszkedő differenciált tanterv készítése",
      "Hatékony digitális tananyagok és értékelési rendszerek kialakítása",
      "Tanulói reflektív gondolkodás és kritikus szemlélet fejlesztése",
      "Tantervi innovációk és pedagógiai módszertani újítások alkalmazása",
      "Együttműködési technikák beépítése a tantervbe"
    ],
    collaboratingInstitutions: ["Magyar Pedagógiai Társaság", "Digitális Pedagógiai Módszertani Központ"]
  },
  {
    id: 11,
    title: "Matematikai módszerek a fizikában",
    description: "Ismerje meg a fizikai problémák megoldásához szükséges matematikai eszközöket. Ez a kurzus a modern fizika által igényelt fejlett matematikai módszereket tárgyalja, különös tekintettel a differenciálegyenletekre, variációszámításra és csoportelméletre, amelyek nélkülözhetetlenek a kvantummechanika, relatívitáselmélet és részecskefizika megértéséhez.",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    university: "Budapesti Műszaki és Gazdaságtudományi Egyetem",
    universityLogo: bmeImage,
    isFree: false,
    level: "Haladó",
    category: "Matematika",
    price: 48000,
    duration: "12 hét",
    students: 632,
    rating: 4.8,
    tags: ["Matematika", "Fizika", "Differenciálegyenletek", "Funkcionálanalízis", "Csoportelmélet", "Numerikus módszerek"],
    highlights: [
      "Parciális differenciálegyenletek fizikai alkalmazásai (hullámegyenlet, hővezetési egyenlet)",
      "Variációs elvek és Lagrange-mechanika matematikai háttere",
      "Lineáris operátorok és Hilbert-terek a kvantummechanikában",
      "Csoportelmélet és szimmetriák a modern fizikában",
      "Számítógépes módszerek fizikai problémák megoldására"
    ],
    requirements: [
      "Többváltozós analízis és lineáris algebra alapos ismerete",
      "Alapszintű közönséges differenciálegyenletek ismerete",
      "Alapvető mechanikai és elektrodinamikai ismeretek",
      "Javasolt: programozási alapismeretek (Python vagy MATLAB)"
    ],
    targetAudience: [
      "Fizika és mérnöki tudományok MSc és PhD hallgatói",
      "Elméleti fizika iránt érdeklődő kutatók",
      "Matematikai módszereket alkalmazó mérnökök",
      "Tudományos modellezéssel foglalkozó szakemberek"
    ],
    keyTopics: [
      "Sturm-Liouville elmélet és sajátfüggvény-kifejtések",
      "Green-függvény módszer és alkalmazásai",
      "Lie-csoportok és Lie-algebrák a fizikában",
      "Funkcionálanalízis alapjai és kvantummechanikai alkalmazások",
      "Numerikus módszerek komplex fizikai rendszerekhez"
    ],
    teachingMethod: [
      "Interaktív elméleti előadások élő példákkal",
      "Számítógépes laborgyakorlatok (Python és Mathematica)",
      "Heti konzultációs lehetőségek és online támogatás",
      "Féléves projektmunka valós fizikai problémán"
    ]
  },
  {
    id: 12,
    title: "Német nyelv üzleti környezetben",
    description: "Fejlessze német nyelvtudását és sajátítsa el az üzleti terminológiát.",
    imageUrl: "https://images.unsplash.com/photo-1599789201689-c8ba6aa7637f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
    university: "Corvinus Egyetem",
    universityLogo: corvinusImage,
    isFree: false,
    level: "Középhaladó",
    category: "Nyelvek",
    price: 42000,
    duration: "10 hét",
    students: 854,
    rating: 4.6,
    tags: ["Német", "Üzleti nyelv", "Kommunikáció"]
  }
];
