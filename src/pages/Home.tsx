import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type God = {
  id: string;
  name: { en: string; hi: string };
  description: { en: string; hi: string };
  color: string;
  image: string;
};

// Daily shloks for each day of the week
const dailyShloks = [
  { // Monday
    
    en: "Om Tryambakam Yajamahe Sugandhim Pushtivardhanam | Urvarukamiva Bandhanan Mrityormukshiya Maamritat ||",
    hi: "ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम्। उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय मामृतात्।।"
  },
  { // Tuesday
    en: "Om Aim Hreem Hanumate Shri Ramadutaya Namah ||",
    hi: "ॐ ऐं ह्रीं हनुमते श्री रामदूताय नमः॥"
  },
  { // Wednesday
    en: "Vakratunda Mahakaya, Suryakoti Samaprabha | Nirvighnam Kuru Me Deva, Sarvakaryeshu Sarvada ||",
    hi: "वक्रतुण्ड महाकाय, सूर्यकोटि समप्रभ। निर्विघ्नं कुरु मे देव, सर्वकार्येषु सर्वदा॥"
  },
  { // Thursday
    en: "Om Brim Brihaspataye Namah ||",
    hi: "ॐ बृं बृहस्पतये नमः।।"
  },
  { // Friday
    en: "Om Sarvamangal Mangalye Shive Sarvartha Sadhike | Sharanye Tryambake Gauri Narayani Namostute ||",
    hi: "ॐ सर्वमंगल मांगल्ये शिवे सर्वार्थ साधिके। शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते॥"
  },
  { // Saturday
    en: "Om Bhagabhavaya Vidmahe Mrityurupaya Dheemahi Tanno Shanih Prachodyat ||",
    hi: "ॐ भगभवाय विद्महे मृत्युरुपाय धीमहि तन्नो शनिः प्रचोद्यात्॥"
  },
  { // Sunday
    en: "Om Adityaya Vidmahe Divakaraya Dheemahi Tannah Suryah Prachodayat ||",
    hi: "ऊँ आदित्याय विदमहे दिवाकराय धीमहि तन्न: सूर्य: प्रचोदयात।।"
  }
];

const gods: God[] = [
  {
    id: "shiva",
    name: { en: "Shiva", hi: "शिव" },
    description: { en: "The Transformer", hi: "परिवर्तनकारी" },
    color: "from-gray-700 to-gray-900",
    image: "/Shiv_ji.jpg",
  },
  {
    id: "hanuman",
    name: { en: "Hanuman", hi: "हनुमान" },
    description: { en: "Strength & Devotion", hi: "शक्ति और भक्ति" },
    color: "from-red-600 to-red-800",
    image: "/Hanuman_ji.jpg",
  },
  {
    id: "ram",
    name: { en: "Ram", hi: "राम" },
    description: { en: "Supreme Lord", hi: "परम देव" },
    color: "from-indigo-600 to-indigo-800",
    image: "/Ram_ji.jpg",
  },
  {
    id: "krishna",
    name: { en: "Krishna", hi: "कृष्ण" },
    description: { en: "Divine Guide", hi: "दिव्य मार्गदर्शक" },
    color: "from-blue-500 to-blue-700",
    image: "/Krishna_ji.png",
  },
  {
    id: "ganesha",
    name: { en: "Ganesha", hi: "गणेश" },
    description: { en: "Obstacle Remover", hi: "विघ्नहर्ता" },
    color: "from-orange-500 to-orange-700",
    image: "/Ganesh_ji.jpg",
  },
  {
    id: "saraswati",
    name: { en: "Saraswati", hi: "सरस्वती" },
    description: { en: "Knowledge", hi: "ज्ञान" },
    color: "from-white to-gray-100 border border-gray-300",
    image: "/Saraswati_ji.jpg",
  },
];

const Home: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [selectedGod, setSelectedGod] = useState<God | null>(null);
  const [currentShlokIndex, setCurrentShlokIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [dayName, setDayName] = useState("");

  const getText = (obj: { en: string; hi: string }) =>
    i18n.language === "hi" ? obj.hi : obj.en;

  // Get current shlok based on day of the week
  useEffect(() => {
    const getDailyShlokIndex = () => {
      const today = new Date();
      const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
      return dayOfWeek;
    };

    const dayIndex = getDailyShlokIndex();
    setCurrentShlokIndex(dayIndex);
    
    // Set day name for display
    const days = [
      "Sunday", "Monday", "Tuesday", "Wednesday", 
      "Thursday", "Friday", "Saturday"
    ];
    const hindiDays = [
      "रविवार", "सोमवार", "मंगलवार", "बुधवार", 
      "गुरुवार", "शुक्रवार", "शनिवार"
    ];
    setDayName(i18n.language === "hi" ? hindiDays[dayIndex] : days[dayIndex]);
  }, [i18n.language]);

  // Typing animation for the main message
  useEffect(() => {
    const message = i18n.language === "hi" 
      ? "भगवान आपकी बात सुनने के लिए तैयार हैं। उस भगवान को चुनें जिनसे आपका दिल सबसे ज्यादा जुड़ाव महसूस करता है।"
      : "The divine is ready to listen. Choose the God your heart feels most connected to.";

    if (isTyping && currentIndex < message.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + message[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50); // Adjust typing speed here

      return () => clearTimeout(timer);
    } else if (currentIndex === message.length) {
      setIsTyping(false);
    }
  }, [currentIndex, isTyping, i18n.language]);

  // Reset typing when language changes
  useEffect(() => {
    setDisplayText("");
    setCurrentIndex(0);
    setIsTyping(true);
  }, [i18n.language]);

  const currentShlok = dailyShloks[currentShlokIndex];

  return (
    <div
      className="flex flex-col overflow-hidden relative"
      style={{
        height: "calc(100vh - 64px)",
      }}
    >
      {/* Background Image with Low Opacity */}
      <div
        className="absolute inset-0 opacity-90"
        style={{
          backgroundImage: "url('/main_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      />

      {/* Golden Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-50/80 via-amber-50/70 to-yellow-50/90 z-0" />

      {/* Content Container */}
      <div className="relative z-10 flex flex-col overflow-hidden h-full">
        {/* TOP HALF */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-8">
          {/* Divine Title with Glow */}
          <div className="relative mb-8">
            <h1 className="text-4xl font-bold text-orange-800 mb-2 tracking-wide">
              {i18n.language === "hi" ? "दिव्य संवाद" : "Divine Guidance"}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full mx-auto shadow-lg" />
          </div>

          {/* Today's Shlok Section */}
          <div className="mb-8 max-w-md">
            <div className="text-center">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <h3 className="text-orange-700 font-medium text-sm uppercase tracking-wider">
                    {i18n.language === "hi" ? `${dayName} का श्लोक` : `${dayName}'s Shlok`}
                  </h3>
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                </div>
              </div>
              <p className="text-orange-900/90 text-sm leading-relaxed font-medium">
                {getText(currentShlok)}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent mb-8" />

          {/* Description Text with Typing Animation */}
          <div className="max-w-md">
            <p className="text-orange-700/90 text-base leading-relaxed font-medium min-h-[60px]">
              {displayText}
              {isTyping && (
                <span className="ml-0.5 w-2 h-4 bg-orange-500 inline-block animate-pulse" />
              )}
            </p>
          </div>

          {/* Selected God Badge */}
          {selectedGod && (
            <div className="mt-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-200 to-amber-200 text-orange-900 font-semibold shadow-lg border border-orange-300/50 backdrop-blur-sm">
              {getText(selectedGod.name)} • {getText(selectedGod.description)}
            </div>
          )}
        </div>

        {/* BOTTOM HALF */}
        <div className="flex-1 px-6 pb-8 pt-4">
          {/* Section Title */}
          <div className="text-center mb-8">
            <h2 className="text-orange-800 font-bold text-lg mb-2 tracking-wide">
              {i18n.language === "hi"
                ? "जिस भगवान से बात करना चाहते हैं उन्हें चुनें"
                : "Select the God you want to talk to"}
            </h2>
            <div className="w-16 h-0.5 bg-orange-400/60 rounded-full mx-auto" />
          </div>

          {/* 6 Gods Grid */}
          <div className="grid grid-cols-3 gap-4">
            {gods.map((god) => (
              <div
                key={god.id}
                onClick={() =>
                  navigate("/app/chat", {
                    state: { selectedGod: god },
                  })
                }
                className="flex flex-col items-center cursor-pointer group"
              >
                {/* God Avatar with Gradient Border */}
                <div className="relative">
                  {/* Outer Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-300 to-amber-300 rounded-full blur-sm group-hover:blur-md transition-all duration-300 opacity-0 group-hover:opacity-70" />
                  
                  {/* Main Avatar Container */}
                  <div
                    className={`relative w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-2xl overflow-hidden border-2 border-white/80 bg-gradient-to-br ${god.color} group-hover:scale-110 group-hover:shadow-xl transition-all duration-300 transform`}
                  >
                    <img 
                      src={god.image} 
                      alt={getText(god.name)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Overlay Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-full" />
                  </div>
                  
                  {/* Pulse Animation on Hover */}
                  <div className="absolute inset-0 rounded-full border-2 border-orange-400/0 group-hover:border-orange-400/50 group-hover:animate-ping transition-all duration-300" />
                </div>

                {/* God Name */}
                <span className="text-sm font-semibold text-orange-900 mt-3 group-hover:text-orange-700 transition-colors duration-200 text-center leading-tight">
                  {getText(god.name)}
                </span>
                
                {/* Subtle Description */}
                <span className="text-xs text-orange-600/80 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {getText(god.description)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        .group:hover .transform {
          animation: float 2s ease-in-out infinite;
        }

        /* Custom cursor blink animation */
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .animate-pulse {
          animation: blink 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default Home;