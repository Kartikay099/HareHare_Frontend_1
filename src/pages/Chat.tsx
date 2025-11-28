import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";

const Chat: React.FC = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const navStateGod = location.state?.selectedGod;

  // Stable god state
  const [god, setGod] = useState<any | null>(navStateGod || null);
  const [isInitializing, setIsInitializing] = useState(!navStateGod);

  const STORAGE_KEY = `chat_${god?.id || "default"}`;
  const HISTORY_KEY = `history_${god?.id || "default"}`;
  const SELECTED_GOD_KEY = "selected_god";

  const [messages, setMessages] = useState<any[]>([]);
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [credits, setCredits] = useState(() => {
    const saved = localStorage.getItem("user_credits");
    return saved ? parseInt(saved, 10) : 7;
  });

  useEffect(() => {
    localStorage.setItem("user_credits", credits.toString());
  }, [credits]);
  const [showHistory, setShowHistory] = useState(false);
  const [listening, setListening] = useState(false);
  const [creditPopup, setCreditPopup] = useState<string | null>(null);
  const [isGodTyping, setIsGodTyping] = useState(false);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  /* ---------------- Restore / persist selectedGod ---------------- */
  useEffect(() => {
    try {
      if (navStateGod) {
        setGod(navStateGod);
        localStorage.setItem(SELECTED_GOD_KEY, JSON.stringify(navStateGod));
        setIsInitializing(false);
      } else if (!god) {
        const saved = localStorage.getItem(SELECTED_GOD_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setGod(parsed);
          setIsInitializing(false);
        } else {
          navigate("/app/home", { replace: true });
        }
      }
    } catch {
      navigate("/app/home", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navStateGod]);

  /* ---------------- Speech Recognition ---------------- */
  useEffect(() => {
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SR) return;

    const rec = new SR();
    if (i18n.language === "hi") rec.lang = "hi-IN";
    else if (i18n.language === "te") rec.lang = "te-IN";
    else rec.lang = "en-US";

    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);

    rec.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setInput(text);
    };

    recognitionRef.current = rec;
  }, [i18n.language]);

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    try {
      if (listening) recognitionRef.current.stop();
      else recognitionRef.current.start();
    } catch { }
  };

  /* ---------------- ElevenLabs TTS (male+female) ---------------- */
  const speak = async (text: string) => {
    if (!text) return;

    const ELEVEN_API_KEY = "sk_9d1abc1a579299734ac99dc7dfcbfab0aadbbb2d044682a6"; // <-- yaha apni sk_ wali key daalo

    const MALE_ID = "6bNjXphfWPUDHuFkgDt3";
    const FEMALE_ID = "flHkNRp1BlvT73UL6gyz";

    // Gods with male voice
    const maleGods = ["Shiva", "Hanuman", "Ram", "Krishna", "Ganesh"];

    const gender =
      god?.name?.en === "Saraswati"
        ? "female"
        : maleGods.includes(god?.name?.en)
          ? "male"
          : "male";

    const VOICE_ID = gender === "female" ? FEMALE_ID : MALE_ID;

    console.log("ElevenLabs Request:", {
      voiceId: VOICE_ID,
      textLength: text.length,
      modelId: "eleven_multilingual_v2"
    });

    try {
      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`,
        {
          method: "POST",
          headers: {
            "xi-api-key": ELEVEN_API_KEY,
            "Content-Type": "application/json",
            Accept: "audio/mpeg",
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.35,
              similarity_boost: 0.9,
              style: 0.7,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("ElevenLabs HTTP error:", response.status, response.statusText, errorBody);
        return;
      }

      const audioBlob = await response.blob();
      if (!audioBlob.size) {
        console.error("ElevenLabs empty audio blob");
        return;
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.oncanplaythrough = () => {
        audio.play().catch((err) => {
          console.error("Audio play error:", err);
        });
      };
      audio.onerror = (e) => {
        console.error("Audio load error", e);
      }

    } catch (err) {
      console.error("ElevenLabs TTS Error:", err);
    }
  };

  /* ---------------- Welcome ---------------- */
  const getWelcome = () => {
    const isHindi = i18n.language === "hi";
    const isTelugu = i18n.language === "te";
    const godName = god?.name?.en;

    let text = "";
    if (godName === "Krishna") {
      if (isHindi) {
        text = "आप यहाँ सुरक्षित हैं। निसंकोच अपनी बात कहें, मैं प्रेम पूर्वक सुन रहा हूँ।";
      } else if (isTelugu) {
        text = "మీరు ఇక్కడ సురక్షితంగా ఉన్నారు. స్వేచ్ఛగా మాట్లాడండి, నేను ప్రేమతో వింటున్నాను.";
      } else {
        text = "You are safe here. Speak freely, I am listening with love.";
      }
    } else {
      if (isHindi) {
        text = "आप यहाँ सुरक्षित हैं। कुछ भी साझा करें, मैं आपके साथ हूँ।";
      } else if (isTelugu) {
        text = "మీరు ఇక్కడ సురక్షితంగా ఉన్నారు. ఏదైనా స్వేచ్ఛగా పంచుకోండి, నేను మీతో ఉన్నాను.";
      } else {
        text = "You are safe here. Share anything freely, I am with you.";
      }
    }

    return {
      id: "welcome",
      from: "god",
      text,
      time: Date.now(),
      final: true,
    };
  };

  /* ---------------- Load messages & history ---------------- */
  useEffect(() => {
    if (!STORAGE_KEY) return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const arr = JSON.parse(saved);
        if (Array.isArray(arr) && arr.length) {
          setMessages(arr);
        } else {
          const w = getWelcome();
          setMessages([w]);
          speak(w.text);
        }
      } else {
        const w = getWelcome();
        setMessages([w]);
        speak(w.text);
      }
    } catch {
      const w = getWelcome();
      setMessages([w]);
      speak(w.text);
    }

    try {
      const histRaw = localStorage.getItem(HISTORY_KEY);
      if (histRaw) {
        const parsed = JSON.parse(histRaw);
        if (Array.isArray(parsed)) setHistoryList(parsed);
        else setHistoryList([]);
      } else {
        setHistoryList([]);
      }
    } catch {
      setHistoryList([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [STORAGE_KEY, HISTORY_KEY, god?.id]);

  /* ---------------- Persist + Scroll ---------------- */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch { }
    setTimeout(
      () =>
        messagesEndRef.current?.scrollIntoView({
          behavior: "smooth",
        }),
      25
    );
  }, [messages, STORAGE_KEY]);

  /* ---------------- Typewriter effect + TTS ---------------- */
  const godReply = async (finalText: string) => {
    const replyId = Date.now() + Math.floor(Math.random() * 1000);
    const placeholder = {
      id: replyId,
      from: "god",
      text: "",
      time: Date.now(),
      composing: true,
    };
    setMessages((p) => [...p, placeholder]);
    setIsGodTyping(true);

    await new Promise((r) => setTimeout(r, 500));

    for (let i = 0; i <= finalText.length; i++) {
      const slice = finalText.slice(0, i);
      setMessages((prev) =>
        prev.map((m) => (m.id === replyId ? { ...m, text: slice } : m))
      );
      await new Promise((r) => setTimeout(r, i < 10 ? 30 : 18));
    }

    setMessages((prev) =>
      prev.map((m) =>
        m.id === replyId ? { ...m, composing: false, final: true } : m
      )
    );
    setIsGodTyping(false);

    // Play voice after full text done
    speak(finalText);
  };

  /* ---------------- Send Message ---------------- */
  const sendMessage = (override?: string) => {
    const text = (override ?? input).trim();
    if (!text) return;

    if (credits <= 0) {
      setCreditPopup("No credits left. Please subscribe 🙏");
      setTimeout(() => setCreditPopup(null), 1800);
      return;
    }

    const userMsg = {
      id: Date.now(),
      from: "user",
      text,
      time: Date.now(),
      final: true,
    };
    setMessages((p) => [...p, userMsg]);
    setInput("");
    setCredits((c) => c - 1);

    try {
      const hist = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      const updated = Array.isArray(hist) ? [...hist, userMsg] : [userMsg];
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      setHistoryList(updated);
    } catch {
      const updated = [userMsg];
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch { }
      setHistoryList(updated);
    }

    const godName = i18n.language === "hi" ? god?.name?.hi : i18n.language === "te" ? god?.name?.te : god?.name?.en;
    let finalText = "";

    if (i18n.language === "hi") {
      finalText = `🌼 आशीर्वाद — ${godName || "दिव्य शक्ति"} आपके साथ है।`;
    } else if (i18n.language === "te") {
      finalText = `🌼 ఆశీర్వాదాలు — ${godName || "దివ్య శక్తి"} మీతో ఉంది.`;
    } else {
      finalText = `🌼 Blessings — ${godName || "Divine presence"} is with you.`;
    }

    setTimeout(() => godReply(finalText), 400);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewChat = () => {
    const w = getWelcome();
    setMessages([w]);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([w]));
      localStorage.removeItem(HISTORY_KEY);
    } catch { }
    setHistoryList([]);
    speak(w.text);
  };

  /* ---------------- UI ---------------- */
  if (!god && !isInitializing) {
    return null;
  }

  return (
    <div
      className="min-h-screen flex flex-col relative bg-orange-50"
      style={{ paddingBottom: "70px" }}
    >
      {/* Background */}
      <div className="fixed inset-0 opacity-30 pointer-events-none flex items-center justify-center">
        <img
          src={god?.image || "/applogo.png"}
          className="w-full h-full object-cover"
          alt="bg"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/applogo.png";
          }}
        />
      </div>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-orange-50">
        <div
          className="w-full bg-white shadow-md flex items-center justify-between px-4 py-3"
          style={{ height: 60 }}
        >
          <button
            onClick={() => navigate(-1)}
            className="text-orange-700 text-lg font-bold"
          >
            ←
          </button>

          <h1 className="text-orange-700 font-bold text-lg truncate max-w-[180px]">
            {i18n.language === "hi" ? god?.name?.hi : i18n.language === "te" ? god?.name?.te : god?.name?.en || "Divine Chat"}
          </h1>

          <div
            onClick={() => {
              setCreditPopup(`You have ${credits} credits`);
              setTimeout(() => setCreditPopup(null), 1800);
            }}
            className="bg-orange-200 px-3 py-1 rounded-full text-xs text-orange-800 font-semibold cursor-pointer shadow-sm hover:scale-105 transition"
          >
            {credits} credits
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-4 pt-3 pb-3 flex gap-3 bg-orange-50">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex-1 bg-white shadow py-2 rounded-lg text-orange-700"
          >
            {showHistory ? "Hide Chats ▲" : "View Chats ▼"}
          </button>

          <button
            onClick={startNewChat}
            className="bg-orange-600 text-white px-4 py-2 rounded-lg"
          >
            New Chat
          </button>
        </div>

        {/* History */}
        {showHistory && (
          <div className="mx-4 bg-white rounded-lg shadow p-3 max-h-40 overflow-y-auto z-10 mb-3">
            {historyList.length === 0 ? (
              <p className="text-sm text-gray-500 text-center">
                No previous chats yet.
              </p>
            ) : (
              historyList.map((h: any, i: number) => (
                <div key={i} className="border-b pb-2 mb-2">
                  <p className="text-sm text-orange-800">{h.text}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(h.time).toLocaleString()}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Credit popup */}
      {
        creditPopup && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-xl backdrop-blur-md z-[9999] animate-scaleFade">
            {creditPopup}
          </div>
        )
      }

      {/* Chat area */}
      <div className="px-4 pt-[80px] pb-3 mt-40">
        <div className="space-y-3">
          {messages.map((m, idx) => (
            <div
              key={m.id ?? idx}
              className={`flex ${m.from === "user" ? "justify-end" : "justify-start"
                } animate-fadeSlide`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm shadow-lg
                  ${m.from === "user"
                    ? "bg-orange-600 text-white rounded-br-none"
                    : "bg-white text-orange-700 border border-orange-200 rounded-bl-none godBubbleGlow"
                  }
                `}
              >
                <span>{m.text}</span>
                {m.composing && (
                  <span className="ml-1 inline-block w-1 h-4 align-middle bg-transparent animate-blinkCaret"></span>
                )}
              </div>
            </div>
          ))}

          {/* Typing */}
          {isGodTyping && (
            <div className="flex justify-start">
              <div className="px-3 py-2 rounded-2xl bg-white border border-orange-200 text-orange-700 shadow-sm typingBubble">
                <div className="flex items-center gap-1">
                  <span className="dot" />
                  <span className="dot delay1" />
                  <span className="dot delay2" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="fixed bottom-16 left-0 right-0 px-4 z-30 bg-orange-50 pb-3">
        <div className="mx-auto max-w-3xl">
          <div className="bg-white border border-orange-300 shadow-xl rounded-full px-3 h-12 flex items-center gap-2">
            <button
              onClick={toggleMic}
              className={`relative w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 ${listening
                ? "bg-orange-500 text-white pulse-ring"
                : "bg-orange-100 text-orange-700"
                }`}
            >
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Speak or type your message..."
              className="flex-1 outline-none text-sm px-2 py-2 bg-transparent"
            />

            <button
              onClick={() => sendMessage()}
              className="bg-orange-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow min-w-[55px]"
            >
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        .animate-fadeSlide { animation: fadeSlide 0.32s ease both; }
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .godBubbleGlow {
          box-shadow: 0 0 18px rgba(255, 165, 0, 0.18);
          animation: godGlow 2.4s infinite alternate ease-in-out;
        }
        @keyframes godGlow {
          from { box-shadow: 0 0 10px rgba(255,165,0,0.18); }
          to   { box-shadow: 0 0 22px rgba(255,165,0,0.36); }
        }

        .typingBubble .dot {
          width: 8px; height: 8px; background: #ea580c; 
          border-radius: 9999px; display: inline-block; 
          opacity: 0.15;
          animation: typingDot 1s infinite ease-in-out;
        }
        .delay1 { animation-delay: 0.12s; opacity: 0.4; }
        .delay2 { animation-delay: 0.24s; opacity: 0.7; }

        @keyframes typingDot {
          0% { transform: translateY(0); opacity: 0.2; }
          50% { transform: translateY(-6px); opacity: 1; }
          100% { transform: translateY(0); opacity: 0.2; }
        }

        .animate-blinkCaret { animation: blinkCaret 1s steps(1) infinite; }
        @keyframes blinkCaret {
          0% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 1; }
        }

        .animate-scaleFade { animation: scaleFade 0.45s cubic-bezier(.2,.9,.3,1) forwards; }
        @keyframes scaleFade {
          0% { opacity: 0; transform: translateY(6px) scale(.96); }
          60% { opacity: 1; transform: translateY(-4px) scale(1.04); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        .pulse-ring::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          border: 2px solid rgba(249, 115, 22, 0.6);
          border-radius: 50%;
          animation: pulseRing 1.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
        }

        @keyframes pulseRing {
          0% { transform: scale(0.8); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.5; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>
    </div >
  );
};

export default Chat;
