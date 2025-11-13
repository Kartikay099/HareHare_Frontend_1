import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Chat: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedGod = location.state?.selectedGod;

  // Storage Keys
  const STORAGE_KEY = `chat_${selectedGod?.id}`;
  const HISTORY_KEY = `history_${selectedGod?.id}`;

  // States
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [credits, setCredits] = useState(25);
  const [showHistory, setShowHistory] = useState(false);
  const [listening, setListening] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // ------------------- SPEECH RECOGNITION -------------------
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);

    recognition.onend = () => {
      setListening(false);
      // When mic stops → send the recorded text
      if (input.trim()) sendMessage(input);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };

    recognitionRef.current = recognition;
  }, [input]);

  // Toggle mic
  const toggleMic = () => {
    if (listening) {
      recognitionRef.current?.stop();
    } else {
      try {
        recognitionRef.current?.start();
      } catch {}
    }
  };

  // ------------------- TEXT TO SPEECH -------------------
  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "hi-IN";
    utter.rate = 0.92;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  // ------------------- WELCOME MESSAGE -------------------
  const getWelcomeMessage = () => ({
    from: "god",
    text:
      selectedGod?.name?.en === "Krishna"
        ? "You are safe here. Speak freely, I am listening with love."
        : "You are safe here. Share anything freely. I am here with you.",
    time: Date.now(),
  });

  // Load existing chat
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved && JSON.parse(saved).length > 0) {
      setMessages(JSON.parse(saved));
    } else {
      const welcome = getWelcomeMessage();
      setMessages([welcome]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([welcome]));
      speak(welcome.text);
    }
  }, []);

  // Auto scroll + save
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ------------------- SEND MESSAGE -------------------
  const sendMessage = (overrideText?: string) => {
    const text = overrideText || input;
    if (!text.trim()) return;

    const newMsg = { from: "user", text, time: Date.now() };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // Save to history
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
    history.push(newMsg);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));

    // God reply
    setTimeout(() => {
      const reply = {
        from: "god",
        text: `🌼 Blessings — ${selectedGod?.name?.en} is with you.`,
        time: Date.now(),
      };
      setMessages((prev) => [...prev, reply]);
      speak(reply.text);
    }, 500);
  };

  // Enter Key
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  // ------------------- NEW CHAT -------------------
  const startNewChat = () => {
    const welcome = getWelcomeMessage();
    setMessages([welcome]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([welcome]));
    localStorage.removeItem(HISTORY_KEY);
    speak(welcome.text);
  };

  // History
  const historyList =
    JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]") || [];

  return (
    <div className="min-h-screen flex flex-col relative bg-orange-50">

      {/* ------------ FIXED BACKGROUND IMAGE (non-scroll) ------------ */}
      <div className="fixed inset-0 opacity-[0.08] pointer-events-none flex items-center justify-center">
        <img
          src="/demo-god.png"
          className="w-[70%] max-w-[350px] object-contain"
          alt="god-bg"
        />
      </div>

      {/* ------------ HEADER ------------ */}
      <div className="w-full bg-white shadow-md flex items-center justify-between px-4 py-3 z-20">
        <button
          onClick={() => navigate(-1)}
          className="text-orange-700 text-lg font-bold"
        >
          ←
        </button>

        <h1 className="text-orange-700 font-bold truncate max-w-[150px]">
          {selectedGod?.name?.en || "Divine Chat"}
        </h1>

        <div className="bg-orange-200 px-3 py-1 rounded-full text-xs text-orange-800 font-semibold">
          {credits} credits
        </div>
      </div>

      {/* ------------ HISTORY + NEW CHAT ------------ */}
      <div className="px-4 py-2 flex gap-2 bg-orange-50 z-20 sticky top-[60px]">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="w-1/2 bg-white p-3 rounded-lg shadow text-orange-700 font-medium"
        >
          {showHistory ? "Hide Chats ▲" : "View Chats ▼"}
        </button>

        <button
          onClick={startNewChat}
          className="w-1/2 bg-orange-600 text-white p-3 rounded-lg shadow font-medium"
        >
          New Chat
        </button>
      </div>

      {/* ------------ SHOW HISTORY ------------ */}
      {showHistory && (
        <div className="mx-4 bg-white rounded-lg shadow p-3 max-h-40 overflow-y-auto z-10">
          {historyList.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">No previous chats yet.</p>
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

      {/* ------------ CHAT SCROLL AREA ------------ */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-[170px]">

        {/* messages */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-3 flex ${
              msg.from === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm shadow ${
                msg.from === "user"
                  ? "bg-orange-600 text-white"
                  : "bg-white border border-orange-200 text-orange-700"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* ------------ INPUT BAR ------------ */}
      <div className="fixed bottom-[110px] left-0 w-full px-4 z-20">
        <div className="flex items-center gap-3 bg-white shadow-xl p-3 rounded-full border border-orange-300">

          {/* MIC BUTTON */}
          <button
            onClick={toggleMic}
            className={`relative w-10 h-10 flex items-center justify-center rounded-full ${
              listening
                ? "bg-red-100 text-red-600"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            🎤

            {listening && (
              <span className="absolute w-14 h-14 rounded-full border-2 border-red-400 animate-ping opacity-70"></span>
            )}
          </button>

          {/* INPUT */}
          <input
            value={input}
            onKeyDown={handleKeyDown}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Speak or type your message..."
            className="flex-1 px-3 py-2 text-sm outline-none"
          />

          {/* SEND */}
          <button
            onClick={() => sendMessage()}
            className="px-4 py-2 bg-orange-600 text-white rounded-full text-sm font-semibold"
          >
            Send
          </button>
        </div>
      </div>

      <div className="h-40"></div>
    </div>
  );
};

export default Chat;
