import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

type Message = {
  id: string;
  from: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: Date;
};

type God = {
  id: string;
  name: {
    en: string;
    hi: string;
  };
  description: {
    en: string;
    hi: string;
  };
  color: string;
};

const gods: God[] = [
  {
    id: 'krishna',
    name: {
      en: 'Krishna',
      hi: 'कृष्ण'
    },
    description: {
      en: 'Divine Guide',
      hi: 'दिव्य मार्गदर्शक'
    },
    color: 'bg-blue-500'
  },
  {
    id: 'shiva',
    name: {
      en: 'Shiva',
      hi: 'शिव'
    },
    description: {
      en: 'The Transformer',
      hi: 'परिवर्तनकारी'
    },
    color: 'bg-gray-600'
  },
  {
    id: 'vishnu',
    name: {
      en: 'Vishnu',
      hi: 'विष्णु'
    },
    description: {
      en: 'The Preserver',
      hi: 'पालनहार'
    },
    color: 'bg-sky-600'
  },
  {
    id: 'lakshmi',
    name: {
      en: 'Lakshmi',
      hi: 'लक्ष्मी'
    },
    description: {
      en: 'Wealth & Prosperity',
      hi: 'धन और समृद्धि'
    },
    color: 'bg-yellow-500'
  },
  {
    id: 'saraswati',
    name: {
      en: 'Saraswati',
      hi: 'सरस्वती'
    },
    description: {
      en: 'Knowledge & Arts',
      hi: 'ज्ञान और कला'
    },
    color: 'bg-white border border-gray-300 text-gray-800'
  },
  {
    id: 'ganesha',
    name: {
      en: 'Ganesha',
      hi: 'गणेश'
    },
    description: {
      en: 'Obstacle Remover',
      hi: 'विघ्नहर्ता'
    },
    color: 'bg-orange-400'
  },
  {
    id: 'hanuman',
    name: {
      en: 'Hanuman',
      hi: 'हनुमान'
    },
    description: {
      en: 'Strength & Devotion',
      hi: 'शक्ति और भक्ति'
    },
    color: 'bg-red-500'
  },
  {
    id: 'durga',
    name: {
      en: 'Durga',
      hi: 'दुर्गा'
    },
    description: {
      en: 'Power & Protection',
      hi: 'शक्ति और सुरक्षा'
    },
    color: 'bg-red-600'
  }
];

const supportsSpeechRecognition = (): boolean => {
  return typeof window !== 'undefined' && (!!(window as any).webkitSpeechRecognition || !!(window as any).SpeechRecognition);
};

const Home: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [selectedGod, setSelectedGod] = useState<God>(gods[6]); // Default to Hanuman
  const [isGodDropdownOpen, setIsGodDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const recognitionRef = useRef<null | any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMessages([
        { 
          id: 'm1', 
          from: 'system', 
          text: i18n.language === 'hi' 
            ? 'नमस्ते! अपनी वार्तालाप शुरू करने के लिए एक देवता चुनें।'
            : 'Namaste! Choose a deity to begin your conversation.',
          timestamp: new Date()
        },
      ]);
      setIsLoading(false);
    };

    loadInitialData();
  }, [i18n.language]);

  useEffect(() => {
    if (!supportsSpeechRecognition()) return;
    
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
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
  }, [i18n.language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getLocalizedText = (text: { en: string; hi: string }) => {
    return i18n.language === 'hi' ? text.hi : text.en;
  };

  const startNewChat = () => {
    setMessages([
      { 
        id: 'm1', 
        from: 'system', 
        text: i18n.language === 'hi'
          ? `अब आप ${getLocalizedText(selectedGod.name)} से बात कर रहे हैं। ${getLocalizedText(selectedGod.description)}। मैं आपका मार्गदर्शन कैसे कर सकता हूं?`
          : `You are now speaking with ${getLocalizedText(selectedGod.name)}. ${getLocalizedText(selectedGod.description)}. How may I guide you?`,
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
    
    const responses: Record<string, { en: string[]; hi: string[] }> = {
      hanuman: {
        en: [
          `Jai Bajrangbali! Your question about "${prompt}" requires strength and devotion. Serve with unwavering faith.`,
          `With devotion to Ram, all is possible. "${prompt}" - let your heart guide your actions with courage.`,
          `Your query shows sincere seeking. Regarding "${prompt}", remember true strength comes from devotion.`
        ],
        hi: [
          `जय बजरंगबली! "${prompt}" के बारे में आपके प्रश्न के लिए शक्ति और भक्ति की आवश्यकता है। अटूट विश्वास के साथ सेवा करें।`,
          `राम के प्रति भक्ति के साथ, सब कुछ संभव है। "${prompt}" - अपने हृदय को साहस के साथ अपने कार्यों का मार्गदर्शन करने दें।`,
          `आपकी जिज्ञासा ईमानदार खोज दर्शाती है। "${prompt}" के संबंध में, याद रखें कि वास्तविक शक्ति भक्ति से आती है।`
        ]
      },
      krishna: {
        en: [
          `I hear your question: "${prompt}". Remember, perform your duty without attachment to the results.`,
          `The flute plays for you. Regarding "${prompt}", know that whatever happened, happened for good.`
        ],
        hi: [
          `मैं आपका प्रश्न सुनता हूं: "${prompt}"। याद रखें, परिणामों से लगाव के बिना अपना कर्तव्य निभाएं।`,
          `बांसुरी आपके लिए बजती है। "${prompt}" के संबंध में, जान लें कि जो भी हुआ, अच्छे के लिए हुआ।`
        ]
      },
      shiva: {
        en: [
          `Om Namah Shivaya! "${prompt}" - meditate upon this and find the truth within your consciousness.`,
          `In the cosmic dance, all questions find their rhythm. Seek stillness for your answer.`
        ],
        hi: [
          `ॐ नमः शिवाय! "${prompt}" - इस पर ध्यान करें और अपनी चेतना के भीतर सत्य खोजें।`,
          `ब्रह्मांडीय नृत्य में, सभी प्रश्नों को अपनी लय मिलती है। अपने उत्तर के लिए शांति खोजें।`
        ]
      },
      vishnu: {
        en: [
          `I preserve the cosmic order. Your concern about "${prompt}" is noted. Dharma shall prevail.`,
          `Have faith in the divine plan. "${prompt}" will resolve through righteous action.`
        ],
        hi: [
          `मैं ब्रह्मांडीय व्यवस्था को संरक्षित करता हूं। "${prompt}" के बारे में आपकी चिंता नोट कर ली गई है। धर्म की जीत होगी।`,
          `दिव्य योजना में विश्वास रखें। "${prompt}" धार्मिक कार्यों के माध्यम से हल हो जाएगा।`
        ]
      },
      lakshmi: {
        en: [
          `May prosperity bless your life! Regarding "${prompt}", remember true wealth lies in contentment.`,
          `Where there is righteousness, there I reside. Focus on dharma and abundance will follow.`
        ],
        hi: [
          `समृद्धि आपके जीवन को आशीर्वाद दे! "${prompt}" के संबंध में, याद रखें कि वास्तविक धन संतोष में निहित है।`,
          `जहां धर्म है, वहां मैं निवास करती हूं। धर्म पर ध्यान केंद्रित करें और प्रचुरता आपका अनुसरण करेगी।`
        ]
      },
      saraswati: {
        en: [
          `Knowledge illuminates the path. "${prompt}" - seek wisdom through study and contemplation.`,
          `True knowledge leads to liberation. Your question shows your thirst for learning.`
        ],
        hi: [
          `ज्ञान मार्ग को प्रकाशित करता है। "${prompt}" - अध्ययन और चिंतन के माध्यम से ज्ञान प्राप्त करें।`,
          `सच्चा ज्ञान मोक्ष की ओर ले जाता है। आपका प्रश्न सीखने की आपकी प्यास दर्शाता है।`
        ]
      },
      ganesha: {
        en: [
          `Om Gam Ganapataye Namaha! I remove obstacles from your path. "${prompt}" - begin with pure intention.`,
          `With determination and wisdom, no obstacle is too great. Your path will clear.`
        ],
        hi: [
          `ॐ गं गणपतये नमः! मैं आपके मार्ग से बाधाएं दूर करता हूं। "${prompt}" - शुद्ध इरादे से शुरुआत करें।`,
          `दृढ़ संकल्प और ज्ञान के साथ, कोई भी बाधा बहुत बड़ी नहीं है। आपका मार्ग साफ हो जाएगा।`
        ]
      },
      durga: {
        en: [
          `Face challenges with courage. "${prompt}" requires inner strength and virtuous action.`,
          `The divine mother protects her children. Have courage in facing this situation.`
        ],
        hi: [
          `साहस के साथ चुनौतियों का सामना करें। "${prompt}" के लिए आंतरिक शक्ति और पुण्य कार्य की आवश्यकता है।`,
          `दिव्य माता अपने बच्चों की रक्षा करती है। इस स्थिति का सामना करने में साहस रखें।`
        ]
      }
    };

    const godResponses = responses[god.id] || responses.hanuman;
    const langResponses = i18n.language === 'hi' ? godResponses.hi : godResponses.en;
    return langResponses[Math.floor(Math.random() * langResponses.length)];
  };

  const startListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
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
      utter.lang = i18n.language === 'hi' ? 'hi-IN' : 'en-US';
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

  // PAGE LOADING SCREEN
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative">
          <div className="text-6xl text-amber-600">ॐ</div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-amber-700 animate-pulse">
            {i18n.language === 'hi' ? 'ॐ शान्ति शान्ति शान्तिः' : 'Om Shanti Shanti Shantih'}
          </p>
        </div>
      </div>
    );
  }

  // MAIN CHAT INTERFACE
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 py-4 px-4">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-orange-50 h-screen flex flex-col">
        {/* Header */}
        <div className="text-center mb-4 px-2">
          <h1 className="text-2xl font-bold text-slate-800 mb-1">
            {i18n.language === 'hi' ? 'दिव्य संवाद' : 'Divine Dialogue'}
          </h1>
          <p className="text-sm text-slate-600">
            {i18n.language === 'hi' ? 'हिंदू देवताओं से मार्गदर्शन प्राप्त करें' : 'Seek guidance from Hindu deities'}
          </p>
        </div>

        {/* God Selection & Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4 px-2">
          <div className="relative flex-1">
            <button
              onClick={() => setIsGodDropdownOpen(!isGodDropdownOpen)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-lg ${selectedGod.color} text-white font-medium shadow-sm transition-colors`}
            >
              <span className="flex items-center gap-2">
                <span>{getLocalizedText(selectedGod.name)}</span>
                <span className="text-xs opacity-90">({getLocalizedText(selectedGod.description)})</span>
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
                      <div className="font-medium text-slate-800">{getLocalizedText(god.name)}</div>
                      <div className="text-xs text-slate-500">{getLocalizedText(god.description)}</div>
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
            {i18n.language === 'hi' ? 'नया चैट' : 'New Chat'}
          </button>
        </div>

        {/* Chat Container */}
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
                      <span className="font-medium text-slate-700 text-sm">{getLocalizedText(selectedGod.name)}</span>
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
                placeholder={
                  i18n.language === 'hi' 
                    ? `${getLocalizedText(selectedGod.name)} से पूछें...`
                    : `Ask ${getLocalizedText(selectedGod.name)}...`
                }
                className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 max-w-[90%]"
              />

              <button
                onClick={() => handleSend()}
                disabled={!input.trim()}
                className="px-4 py-2 bg-primary hover:opacity-95 disabled:bg-muted text-primary-foreground rounded-lg font-medium transition-colors text-sm whitespace-nowrap"
              >
                {i18n.language === 'hi' ? 'भेजें' : 'Send'}
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
                  {i18n.language === 'hi' ? 'सुन रहा हूं...' : 'Listening...'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-orange-500 px-2 pb-2">
          {i18n.language === 'hi' 
            ? `${getLocalizedText(selectedGod.name)} से दिव्य ज्ञान प्राप्त करने के लिए बोलें या टाइप करें`
            : `Speak or type to receive divine wisdom from ${getLocalizedText(selectedGod.name)}`
          }
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