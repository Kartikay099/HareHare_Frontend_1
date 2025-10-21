import React, { useEffect, useRef, useState } from 'react';

type Message = {
  id: string;
  from: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: Date;
};

type God = {
  id: string;
  name: string;
  description: string;
  color: string;
};

const gods: God[] = [
  {
    id: 'krishna',
    name: 'Krishna',
    description: 'Divine Guide',
    color: 'bg-blue-500'
  },
  {
    id: 'shiva',
    name: 'Shiva',
    description: 'The Transformer',
    color: 'bg-gray-600'
  },
  {
    id: 'vishnu',
    name: 'Vishnu',
    description: 'The Preserver',
    color: 'bg-sky-600'
  },
  {
    id: 'lakshmi',
    name: 'Lakshmi',
    description: 'Wealth & Prosperity',
    color: 'bg-yellow-500'
  },
  {
    id: 'saraswati',
    name: 'Saraswati',
    description: 'Knowledge & Arts',
    color: 'bg-white border border-gray-300 text-gray-800'
  },
  {
    id: 'ganesha',
    name: 'Ganesha',
    description: 'Obstacle Remover',
    color: 'bg-orange-400'
  },
  {
    id: 'hanuman',
    name: 'Hanuman',
    description: 'Strength & Devotion',
    color: 'bg-red-500'
  },
  {
    id: 'durga',
    name: 'Durga',
    description: 'Power & Protection',
    color: 'bg-red-600'
  }
];

const supportsSpeechRecognition = (): boolean => {
  return typeof window !== 'undefined' && (!!(window as any).webkitSpeechRecognition || !!(window as any).SpeechRecognition);
};

const Home: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'm1', 
      from: 'system', 
      text: 'Namaste! Choose a deity to begin your conversation.',
      timestamp: new Date()
    },
  ]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [selectedGod, setSelectedGod] = useState<God>(gods[6]); // Default to Hanuman
  const [isGodDropdownOpen, setIsGodDropdownOpen] = useState(false);
  const recognitionRef = useRef<null | any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!supportsSpeechRecognition()) return;
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      handleSend(text);
      setListening(false);
    };

    recognition.onerror = (e: any) => {
      console.error('Speech recognition error', e);
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startNewChat = () => {
    setMessages([
      { 
        id: 'm1', 
        from: 'system', 
        text: `You are now speaking with ${selectedGod.name}. ${selectedGod.description}. How may I guide you?`,
        timestamp: new Date()
      },
    ]);
  };

  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;

    const userMsg: Message = { 
      id: String(Date.now()), 
      from: 'user', 
      text: content,
      timestamp: new Date()
    };
    setMessages((m) => [...m, userMsg]);
    setInput('');

    const assistantText = await generateDivineResponse(content, selectedGod);
    const assistantMsg: Message = { 
      id: String(Date.now() + 1), 
      from: 'assistant', 
      text: assistantText,
      timestamp: new Date()
    };
    setMessages((m) => [...m, assistantMsg]);
    speakText(assistantText);
  };

  const generateDivineResponse = async (prompt: string, god: God): Promise<string> => {
    await new Promise((r) => setTimeout(r, 600));
    
    const responses: Record<string, string[]> = {
      hanuman: [
        `Jai Bajrangbali! Your question about "${prompt}" requires strength and devotion. Serve with unwavering faith.`,
        `With devotion to Ram, all is possible. "${prompt}" - let your heart guide your actions with courage.`,
        `Your query shows sincere seeking. Regarding "${prompt}", remember true strength comes from devotion.`
      ],
      krishna: [
        `I hear your question: "${prompt}". Remember, perform your duty without attachment to the results.`,
        `The flute plays for you. Regarding "${prompt}", know that whatever happened, happened for good.`
      ],
      shiva: [
        `Om Namah Shivaya! "${prompt}" - meditate upon this and find the truth within your consciousness.`,
        `In the cosmic dance, all questions find their rhythm. Seek stillness for your answer.`
      ],
      vishnu: [
        `I preserve the cosmic order. Your concern about "${prompt}" is noted. Dharma shall prevail.`,
        `Have faith in the divine plan. "${prompt}" will resolve through righteous action.`
      ],
      lakshmi: [
        `May prosperity bless your life! Regarding "${prompt}", remember true wealth lies in contentment.`,
        `Where there is righteousness, there I reside. Focus on dharma and abundance will follow.`
      ],
      saraswati: [
        `Knowledge illuminates the path. "${prompt}" - seek wisdom through study and contemplation.`,
        `True knowledge leads to liberation. Your question shows your thirst for learning.`
      ],
      ganesha: [
        `Om Gam Ganapataye Namaha! I remove obstacles from your path. "${prompt}" - begin with pure intention.`,
        `With determination and wisdom, no obstacle is too great. Your path will clear.`
      ],
      durga: [
        `Face challenges with courage. "${prompt}" requires inner strength and virtuous action.`,
        `The divine mother protects her children. Have courage in facing this situation.`
      ]
    };

    const godResponses = responses[god.id] || responses.hanuman;
    return godResponses[Math.floor(Math.random() * godResponses.length)];
  };

  const startListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch (e) {
      console.error('Could not start recognition', e);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
    } catch (e) {
      // ignore
    }
    setListening(false);
  };

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      utter.rate = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    } catch (e) {
      console.error('SpeechSynthesis error', e);
    }
  };

  const handleGodSelect = (god: God) => {
    setSelectedGod(god);
    setIsGodDropdownOpen(false);
    startNewChat();
  };

  return (
    <div className="min-h-screen bg-orange-25 to-slate-100 py-4 px-4">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        
        {/* Header */}
        <div className="text-center mb-4 px-2">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">Divine Dialogue</h1>
          <p className="text-sm text-slate-600">Seek guidance from Hindu deities</p>
        </div>

        {/* God Selection & Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4 px-2">
          <div className="relative flex-1">
            <button
              onClick={() => setIsGodDropdownOpen(!isGodDropdownOpen)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-lg ${selectedGod.color} text-white font-medium shadow-sm transition-colors`}
            >
              <span className="flex items-center gap-2">
                <span>{selectedGod.name}</span>
                <span className="text-xs opacity-90">({selectedGod.description})</span>
              </span>
              <span className="text-sm">▼</span>
            </button>

            {isGodDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg z-10 border border-slate-200 max-h-60 overflow-y-auto">
                {gods.map((god) => (
                  <button
                    key={god.id}
                    onClick={() => handleGodSelect(god)}
                    className={`flex items-center gap-3 w-full p-3 border-b border-slate-100 last:border-b-0 hover:bg-slate-50 transition-colors ${
                      selectedGod.id === god.id ? 'bg-slate-100' : ''
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full ${god.color}`}></div>
                    <div className="text-left flex-1">
                      <div className="font-medium text-slate-800">{god.name}</div>
                      <div className="text-xs text-slate-500">{god.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={startNewChat}
            className="px-4 py-3 bg-primary hover:opacity-95 text-primary-foreground rounded-lg font-medium transition-colors shadow-sm whitespace-nowrap"
          >
            New Chat
          </button>
        </div>

  {/* Chat Container (reduced height) */}
  <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col mb-4 max-h-[60vh] sm:max-h-[55vh]">
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div 
                key={m.id} 
                className={`flex ${m.from === 'user' ? 'justify-end' : m.from === 'assistant' ? 'justify-start' : 'justify-center'}`}
              >
                <div 
                  className={`max-w-[85%] rounded-lg p-3 ${
                    m.from === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : m.from === 'assistant' 
                      ? 'bg-amber-50 text-amber-800 border-l-4 border-amber-300'
                      : 'bg-muted text-muted-foreground text-sm'
                  }`}
                >
                  {m.from === 'assistant' && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${selectedGod.color}`}></div>
                      <span className="font-medium text-slate-700 text-sm">{selectedGod.name}</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-sm">{m.text}</div>
                  <div className={`text-xs mt-1 ${m.from === 'user' ? 'text-blue-100' : 'text-slate-500'}`}>
                    {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) handleSend(); }}
                placeholder={`Ask ${selectedGod.name}...`}
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />

              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="px-4 py-2 bg-primary hover:opacity-95 disabled:bg-muted text-primary-foreground rounded-lg font-medium transition-colors text-sm whitespace-nowrap"
              >
                Send
              </button>

              {supportsSpeechRecognition() && (
                <button
                  onClick={() => (listening ? stopListening() : startListening())}
                  className={`p-2 rounded-lg transition-colors ${
                    listening 
                      ? 'bg-destructive text-destructive-foreground' 
                      : 'bg-accent text-accent-foreground'
                  }`}
                >
                  {listening ? '⏹' : '🎤'}
                </button>
              )}
            </div>
            
            {/* Voice Status */}
            {listening && (
              <div className="text-center mt-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
                  Listening...
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-slate-500 px-2 pb-2">
          Speak or type to receive divine wisdom from {selectedGod.name}
        </div>
      </div>

      {/* Close dropdown when clicking outside */}
      {isGodDropdownOpen && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => setIsGodDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default Home;