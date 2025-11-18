import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings as SettingsIcon, LogOut, Heart, Flower, Star, Sparkles, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  
  const [language, setLanguage] = useState(i18n.language);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Simple state for seva - not dependent on user object
  const [currentSeva, setCurrentSeva] = useState('basic');
  const [sevaStatus, setSevaStatus] = useState('active');

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
    toast.success(i18n.language === 'hi' ? 'भाषा अपडेट हो गई' : 'Language updated');
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    toast.success(i18n.language === 'hi' ? 'सफलतापूर्वक लॉगआउट हो गए' : 'Logged out successfully');
    navigate('/auth/login');
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
    toast.info(i18n.language === 'hi' ? 'लॉगआउट रद्द किया गया' : 'Logout cancelled');
  };

  const offerSeva = (sevaLevel: string) => {
    setCurrentSeva(sevaLevel);
    setSevaStatus('active');
    const message = i18n.language === 'hi' 
      ? `आपकी ${getSevaName(sevaLevel)} सेवा के लिए धन्यवाद! 🙏`
      : `Thank you for your ${getSevaName(sevaLevel)} seva! 🙏`;
    toast.success(message);
  };

  const getSevaName = (sevaId: string) => {
    const sevaNames: { [key: string]: { en: string; hi: string } } = {
      basic: { en: 'basic', hi: 'मूल' },
      weekly: { en: 'weekly', hi: 'साप्ताहिक' },
      monthly: { en: 'monthly', hi: 'मासिक' },
      yearly: { en: 'yearly', hi: 'वार्षिक' }
    };
    return i18n.language === 'hi' ? sevaNames[sevaId].hi : sevaNames[sevaId].en;
  };

  const sevaLevels = [
    {
      id: 'basic',
      name: {
        en: 'Dharma Seeker',
        hi: 'धर्म साधक'
      },
      amount: {
        en: 'Free',
        hi: 'निःशुल्क'
      },
      period: {
        en: 'Always available',
        hi: 'सदैव उपलब्ध'
      },
      description: {
        en: 'Continue your spiritual journey with basic access',
        hi: 'मूल पहुंच के साथ अपनी आध्यात्मिक यात्रा जारी रखें'
      },
      icon: Flower,
      blessings: [
        {
          en: 'Daily spiritual guidance',
          hi: 'दैनिक आध्यात्मिक मार्गदर्शन'
        },
        {
          en: 'Basic meditation content',
          hi: 'मूल ध्यान सामग्री'
        },
        {
          en: 'Community prayers',
          hi: 'सामुदायिक प्रार्थनाएं'
        },
        {
          en: 'Divine blessings',
          hi: 'दिव्य आशीर्वाद'
        }
      ],
      current: currentSeva === 'basic',
      message: {
        en: 'Continue your journey with gratitude',
        hi: 'कृतज्ञता के साथ अपनी यात्रा जारी रखें'
      }
    },
    {
      id: 'weekly',
      name: {
        en: 'Weekly Seva',
        hi: 'साप्ताहिक सेवा'
      },
      amount: {
        en: '₹108',
        hi: '₹108'
      },
      period: {
        en: 'Weekly offering',
        hi: 'साप्ताहिक योगदान'
      },
      description: {
        en: 'Support our mission with weekly contributions',
        hi: 'साप्ताहिक योगदान के साथ हमारे मिशन का समर्थन करें'
      },
      icon: Heart,
      blessings: [
        {
          en: 'All basic blessings',
          hi: 'सभी मूल आशीर्वाद'
        },
        {
          en: 'Weekly special pujas',
          hi: 'साप्ताहिक विशेष पूजाएं'
        },
        {
          en: 'Personalized spiritual guidance',
          hi: 'व्यक्तिगत आध्यात्मिक मार्गदर्शन'
        },
        {
          en: 'Karma cleansing sessions',
          hi: 'कर्म शुद्धि सत्र'
        },
        {
          en: 'Your name in temple prayers',
          hi: 'मंदिर की प्रार्थनाओं में आपका नाम'
        }
      ],
      current: currentSeva === 'weekly',
      message: {
        en: 'Your weekly support nourishes our spiritual family',
        hi: 'आपका साप्ताहिक समर्थन हमारे आध्यात्मिक परिवार को पोषित करता है'
      }
    },
    {
      id: 'monthly',
      name: {
        en: 'Monthly Seva',
        hi: 'मासिक सेवा'
      },
      amount: {
        en: '₹501',
        hi: '₹501'
      },
      period: {
        en: 'Monthly devotion',
        hi: 'मासिक भक्ति'
      },
      description: {
        en: 'Deepen your spiritual commitment',
        hi: 'अपनी आध्यात्मिक प्रतिबद्धता को गहरा करें'
      },
      icon: Star,
      blessings: [
        {
          en: 'All weekly blessings',
          hi: 'सभी साप्ताहिक आशीर्वाद'
        },
        {
          en: 'Monthly special ceremonies',
          hi: 'मासिक विशेष समारोह'
        },
        {
          en: '1-on-1 spiritual guidance',
          hi: 'एक-पर-एक आध्यात्मिक मार्गदर्शन'
        },
        {
          en: 'Exclusive sacred content',
          hi: 'विशेष पवित्र सामग्री'
        },
        {
          en: 'Priority prayer requests',
          hi: 'प्राथमिकता प्रार्थना अनुरोध'
        },
        {
          en: 'Digital prasadam',
          hi: 'डिजिटल प्रसाद'
        }
      ],
      current: currentSeva === 'monthly',
      message: {
        en: 'Monthly devotion brings continuous spiritual growth',
        hi: 'मासिक भक्ति निरंतर आध्यात्मिक विकास लाती है'
      }
    },
    {
      id: 'yearly',
      name: {
        en: 'Annual Seva',
        hi: 'वार्षिक सेवा'
      },
      amount: {
        en: '₹5,001',
        hi: '₹5,001'
      },
      period: {
        en: 'Yearly commitment',
        hi: 'वार्षिक प्रतिबद्धता'
      },
      description: {
        en: 'Embrace complete spiritual partnership',
        hi: 'पूर्ण आध्यात्मिक साझेदारी को अपनाएं'
      },
      icon: Sparkles,
      blessings: [
        {
          en: 'All monthly blessings',
          hi: 'सभी मासिक आशीर्वाद'
        },
        {
          en: 'Year-round special pujas',
          hi: 'साल भर विशेष पूजाएं'
        },
        {
          en: 'Personal spiritual mentor',
          hi: 'व्यक्तिगत आध्यात्मिक गुरु'
        },
        {
          en: 'Master spiritual courses',
          hi: 'मास्टर आध्यात्मिक पाठ्यक्रम'
        },
        {
          en: 'Early access to all content',
          hi: 'सभी सामग्री तक प्रारंभिक पहुंच'
        },
        {
          en: 'VIP community access',
          hi: 'वीआईपी समुदाय पहुंच'
        },
        {
          en: 'Special blessings from guruji',
          hi: 'गुरुजी से विशेष आशीर्वाद'
        }
      ],
      current: currentSeva === 'yearly',
      message: {
        en: 'Annual commitment supports sustained spiritual service',
        hi: 'वार्षिक प्रतिबद्धता निरंतर आध्यात्मिक सेवा का समर्थन करती है'
      }
    }
  ];

  const getLocalizedText = (text: { en: string; hi: string }) => {
    return i18n.language === 'hi' ? text.hi : text.en;
  };

  const getCurrentSevaBadge = () => {
    if (currentSeva === 'basic') return null;
    
    const currentSevaData = sevaLevels.find(seva => seva.id === currentSeva);
    const IconComponent = currentSevaData?.icon || Heart;
    
    return (
      <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm mb-4 border border-green-200">
        <IconComponent className="h-4 w-4" />
        <span>
          {i18n.language === 'hi' ? 'वर्तमान सेवा:' : 'Current Seva:'} {getLocalizedText(currentSevaData?.name || { en: '', hi: '' })}
        </span>
      </div>
    );
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sevaLevels.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sevaLevels.length) % sevaLevels.length);
  };

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sevaLevels.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Back Button - Top Left */}
      <div className="mb-6">
        <Button
          onClick={handleBackClick}
          variant="ghost"
          className="flex items-center gap-2 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
        >
          <ArrowLeft className="h-4 w-4" />
          {i18n.language === 'hi' ? 'वापस' : 'Back'}
        </Button>
      </div>

      <div className="text-center mb-8">
        <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
          <SettingsIcon className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          {i18n.language === 'hi' ? 'आध्यात्मिक सेटिंग्स' : 'Spiritual Settings'}
        </h1>
        <p className="text-muted-foreground">
          {i18n.language === 'hi' ? 'अपनी आध्यात्मिक यात्रा को अनुकूलित करें' : 'Customize your spiritual journey'}
        </p>
        {getCurrentSevaBadge()}
      </div>

      <div className="space-y-6">
        {/* Language Settings */}
        <div className="sacred-card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <SettingsIcon className="h-5 w-5" />
            {i18n.language === 'hi' ? 'भाषा' : 'Language'}
          </h2>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger>
              <SelectValue placeholder={i18n.language === 'hi' ? 'भाषा चुनें' : 'Select language'} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">हिंदी</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Seva Offering Section - Slider */}
        <div className="sacred-card p-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Heart className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {i18n.language === 'hi' ? 'सेवा अर्पित करें और हमारे मिशन का समर्थन करें' : 'Offer Seva & Support Our Mission'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {i18n.language === 'hi' 
                ? 'आपका उदार समर्थन हमें इस पवित्र स्थान को बनाए रखने, दैनिक प्रार्थनाएं आयोजित करने और दुनिया भर के साधकों के लिए अधिक आध्यात्मिक सामग्री बनाने में मदद करता है। प्रत्येक योगदान एक आशीर्वाद है।'
                : 'Your generous support helps us maintain this sacred space, conduct daily prayers, and create more spiritual content for seekers worldwide. Every contribution is a blessing.'}
            </p>
          </div>

          {/* Slider Container */}
          <div className="relative">
            {/* Slider Controls */}
            <div className="flex justify-between items-center mb-6">
              <Button
                onClick={prevSlide}
                variant="outline"
                size="icon"
                className="w-10 h-10 rounded-full border-amber-200 text-amber-700 hover:bg-amber-50"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <div className="flex space-x-2">
                {sevaLevels.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentSlide ? 'bg-amber-600' : 'bg-amber-300'
                    }`}
                  />
                ))}
              </div>
              
              <Button
                onClick={nextSlide}
                variant="outline"
                size="icon"
                className="w-10 h-10 rounded-full border-amber-200 text-amber-700 hover:bg-amber-50"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>

            {/* Slider Content */}
            <div className="relative overflow-hidden rounded-xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {sevaLevels.map((seva) => {
                  const IconComponent = seva.icon;
                  return (
                    <div
                      key={seva.id}
                      className="w-full flex-shrink-0 px-4"
                    >
                      <div className={`border rounded-xl p-6 transition-all ${
                        seva.current
                          ? 'border-green-500 bg-green-50/50 dark:bg-green-900/20 ring-2 ring-green-200'
                          : 'border-amber-200 bg-amber-50/30 dark:bg-amber-900/10 hover:border-amber-300'
                      }`}>
                        <div className="text-center mb-4">
                          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                            seva.current ? 'bg-green-100' : 'bg-amber-100'
                          }`}>
                            <IconComponent className={`h-6 w-6 ${
                              seva.current ? 'text-green-600' : 'text-amber-600'
                            }`} />
                          </div>
                          <h3 className="font-semibold text-foreground text-lg">{getLocalizedText(seva.name)}</h3>
                          <div className="mt-2">
                            <span className="text-2xl font-bold text-foreground">{getLocalizedText(seva.amount)}</span>
                            <span className="text-muted-foreground text-sm block">{getLocalizedText(seva.period)}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 italic">{getLocalizedText(seva.message)}</p>
                        </div>

                        <div className="space-y-2 mb-6">
                          <div className="text-sm font-medium text-foreground mb-2">
                            {i18n.language === 'hi' ? 'आपको मिलने वाले आशीर्वाद:' : 'Blessings you receive:'}
                          </div>
                          {seva.blessings.map((blessing, index) => (
                            <div key={index} className="flex items-start gap-2 text-sm">
                              <div className={`w-2 h-2 rounded-full mt-1.5 ${
                                seva.current ? 'bg-green-500' : 'bg-amber-500'
                              }`} />
                              <span>{getLocalizedText(blessing)}</span>
                            </div>
                          ))}
                        </div>

                        <Button
                          onClick={() => offerSeva(seva.id)}
                          className={`w-full ${
                            seva.current
                              ? 'bg-green-600 hover:bg-green-700'
                              : 'bg-amber-600 hover:bg-amber-700'
                          } text-white`}
                          disabled={seva.current}
                        >
                          {seva.current ? (
                            <>🙏 {i18n.language === 'hi' ? 'वर्तमान में यह सेवा अर्पित कर रहे हैं' : 'Currently Offering This Seva'}</>
                          ) : seva.id === 'basic' ? (
                            <>{i18n.language === 'hi' ? 'मूल पहुंच के साथ जारी रखें' : 'Continue with Basic Access'}</>
                          ) : (
                            <>{i18n.language === 'hi' ? `${getLocalizedText(seva.name)} सेवा अर्पित करें` : `Offer ${getLocalizedText(seva.name)} Seva`}</>
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
            <p className="text-center text-sm text-blue-800 dark:text-blue-200">
              {i18n.language === 'hi' 
                ? '💫 सभी योगदान मंदिर रखरखाव, दैनिक प्रार्थनाओं, आध्यात्मिक सामग्री निर्माण और समुदाय की सेवा के लिए उपयोग किए जाते हैं। आपकी सेवा इसे संभव बनाती है। 🙏'
                : '💫 All contributions are used for temple maintenance, daily prayers, spiritual content creation, and serving the community. Your seva makes this possible. 🙏'}
            </p>
          </div>
        </div>

        {/* Account Settings */}
        <div className="sacred-card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            {i18n.language === 'hi' ? 'खाता' : 'Account'}
          </h2>
          <Button
            onClick={handleLogoutClick}
            variant="outline"
            className="w-full flex items-center justify-center space-x-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-5 w-5" />
            <span>{i18n.language === 'hi' ? 'साइन आउट' : 'Sign Out'}</span>
          </Button>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg border border-amber-200">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <LogOut className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {i18n.language === 'hi' 
                  ? 'क्या आप वाकई साइन आउट करना चाहते हैं?'
                  : 'Are you sure you want to sign out?'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {i18n.language === 'hi'
                  ? 'अपनी आध्यात्मिक यात्रा तक पहुंचने के लिए आपको फिर से साइन इन करना होगा।'
                  : 'You will need to sign in again to access your spiritual journey.'}
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={cancelLogout}
                variant="outline"
                className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50"
              >
                {i18n.language === 'hi' ? 'नहीं, साइन इन रहें' : 'No, Stay Signed In'}
              </Button>
              <Button
                onClick={confirmLogout}
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
              >
                {i18n.language === 'hi' ? 'हाँ, साइन आउट करें' : 'Yes, Sign Out'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;