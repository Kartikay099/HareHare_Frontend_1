import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type God = {
  id: string;
  name: { en: string; hi: string };
  description: { en: string; hi: string };
  color: string;
  image: string;
};

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

  const getText = (obj: { en: string; hi: string }) =>
    i18n.language === "hi" ? obj.hi : obj.en;

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
          <div className="relative mb-6">
            <h1 className="text-4xl font-bold text-orange-800 mb-2 tracking-wide">
              {i18n.language === "hi" ? "दिव्य संवाद" : "Divine Guidance"}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full mx-auto shadow-lg" />
          </div>

          {/* Description Text */}
          <p className="text-orange-700/90 text-base max-w-md leading-relaxed font-medium mb-8 px-4">
            {i18n.language === "hi"
              ? "भगवान आपकी बात सुनने के लिए तैयार हैं। उस भगवान को चुनें जिनसे आपका दिल सबसे ज्यादा जुड़ाव महसूस करता है।"
              : "The divine is ready to listen. Choose the God your heart feels most connected to."}
          </p>

          {/* Selected God Badge */}
          {selectedGod && (
            <div className="mt-4 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-200 to-amber-200 text-orange-900 font-semibold shadow-lg border border-orange-300/50 backdrop-blur-sm">
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
      `}</style>
    </div>
  );
};

export default Home;