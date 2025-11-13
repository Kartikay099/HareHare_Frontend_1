import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom"; // ⭐ ADD THIS

type God = {
  id: string;
  name: { en: string; hi: string };
  description: { en: string; hi: string };
  color: string;
};

// Only 6 gods for selection 🔥
const gods: God[] = [
  {
    id: "krishna",
    name: { en: "Krishna", hi: "कृष्ण" },
    description: { en: "Divine Guide", hi: "दिव्य मार्गदर्शक" },
    color: "bg-blue-500",
  },
  {
    id: "shiva",
    name: { en: "Shiva", hi: "शिव" },
    description: { en: "The Transformer", hi: "परिवर्तनकारी" },
    color: "bg-gray-600",
  },
  {
    id: "hanuman",
    name: { en: "Hanuman", hi: "हनुमान" },
    description: { en: "Strength & Devotion", hi: "शक्ति और भक्ति" },
    color: "bg-red-500",
  },
  {
    id: "ganesha",
    name: { en: "Ganesha", hi: "गणेश" },
    description: { en: "Obstacle Remover", hi: "विघ्नहर्ता" },
    color: "bg-orange-400",
  },
  {
    id: "lakshmi",
    name: { en: "Lakshmi", hi: "लक्ष्मी" },
    description: { en: "Prosperity", hi: "समृद्धि" },
    color: "bg-yellow-500",
  },
  {
    id: "saraswati",
    name: { en: "Saraswati", hi: "सरस्वती" },
    description: { en: "Knowledge", hi: "ज्ञान" },
    color: "bg-white border border-gray-300 text-gray-800",
  },
];

const Home: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate(); // ⭐ Add this

  const [selectedGod, setSelectedGod] = useState<God | null>(null);

  const getText = (obj: { en: string; hi: string }) =>
    i18n.language === "hi" ? obj.hi : obj.en;

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      
      {/* ---------------- TOP HALF ---------------- */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        
        <h1 className="text-3xl font-bold text-orange-700 mb-3">
          {i18n.language === "hi" ? "दिव्य संवाद" : "Divine Guidance"}
        </h1>

        {/* NEW Updated User-Friendly Indian Message */}
        <p className="text-orange-600 text-sm max-w-md leading-relaxed">
          {i18n.language === "hi"
            ? "भगवान आपकी बात सुनने के लिए तैयार हैं। उस भगवान को चुनें जिनसे आपका दिल सबसे ज्यादा जुड़ाव महसूस करता है।"
            : "The divine is ready to listen. Choose the God your heart feels most connected to."}
        </p>

        {selectedGod && (
          <div className="mt-6 px-5 py-2 rounded-full bg-orange-200 text-orange-800 font-medium shadow">
            {getText(selectedGod.name)} • {getText(selectedGod.description)}
          </div>
        )}
      </div>

      {/* ---------------- BOTTOM HALF (6 Gods) ---------------- */}
      <div className="flex-1 px-6 pb-8">
        
        <h2 className="text-center text-orange-700 font-semibold mb-4">
          {i18n.language === "hi"
            ? "जिस भगवान से बात करना चाहते हैं उन्हें चुनें"
            : "Select the God you want to talk to"}
        </h2>

        {/* GRID of ONLY 6 gods */}
        <div className="grid grid-cols-3 gap-6 mt-4">
          {gods.map((god) => (
            <div
              key={god.id}
              onClick={() =>
                navigate("/app/chat", {
                  state: { selectedGod: god }, // ⭐ Pass selected god
                })
              }
              className={`flex flex-col items-center cursor-pointer transition-all duration-200 hover:scale-105`}
            >
              {/* Placeholder circle — You will put images later */}
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-md ${god.color}`}
              >
                {/* Temporary initial letter */}
                {getText(god.name).charAt(0)}
              </div>

              <span className="text-sm text-orange-800 font-medium mt-2">
                {getText(god.name)}
              </span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Home;
