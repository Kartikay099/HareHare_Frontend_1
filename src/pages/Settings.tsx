import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Settings as SettingsIcon, LogOut, Heart, Flower, Star, Sparkles, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  
  const [language, setLanguage] = useState(i18n.language);
  const [fontSize, setFontSize] = useState(localStorage.getItem('fontSize') || 'normal');
  const [reduceMotion, setReduceMotion] = useState(
    localStorage.getItem('reduceMotion') === 'true'
  );
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Simple state for seva - not dependent on user object
  const [currentSeva, setCurrentSeva] = useState('basic');
  const [sevaStatus, setSevaStatus] = useState('active');

  useEffect(() => {
    document.documentElement.style.fontSize = fontSize === 'large' ? '18px' : '16px';
  }, [fontSize]);

  useEffect(() => {
    if (reduceMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [reduceMotion]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
    toast.success('Language updated');
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    localStorage.setItem('fontSize', size);
    toast.success('Font size updated');
  };

  const handleMotionChange = (checked: boolean) => {
    setReduceMotion(checked);
    localStorage.setItem('reduceMotion', String(checked));
    toast.success(checked ? 'Animations reduced' : 'Animations enabled');
  };

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/auth/login');
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
    toast.info('Logout cancelled');
  };

  const offerSeva = (sevaLevel: string) => {
    setCurrentSeva(sevaLevel);
    setSevaStatus('active');
    toast.success(`Thank you for your ${sevaLevel} seva! 🙏`);
  };

  const sevaLevels = [
    {
      id: 'basic',
      name: 'Dharma Seeker',
      amount: 'Free',
      period: 'Always available',
      description: 'Continue your spiritual journey with basic access',
      icon: Flower,
      blessings: [
        'Daily spiritual guidance',
        'Basic meditation content',
        'Community prayers',
        'Divine blessings'
      ],
      current: currentSeva === 'basic',
      message: 'Continue your journey with gratitude'
    },
    {
      id: 'weekly',
      name: 'Weekly Seva',
      amount: '₹108',
      period: 'Weekly offering',
      description: 'Support our mission with weekly contributions',
      icon: Heart,
      blessings: [
        'All basic blessings',
        'Weekly special pujas',
        'Personalized spiritual guidance',
        'Karma cleansing sessions',
        'Your name in temple prayers'
      ],
      current: currentSeva === 'weekly',
      message: 'Your weekly support nourishes our spiritual family'
    },
    {
      id: 'monthly',
      name: 'Monthly Seva',
      amount: '₹501',
      period: 'Monthly devotion',
      description: 'Deepen your spiritual commitment',
      icon: Star,
      blessings: [
        'All weekly blessings',
        'Monthly special ceremonies',
        '1-on-1 spiritual guidance',
        'Exclusive sacred content',
        'Priority prayer requests',
        'Digital prasadam'
      ],
      current: currentSeva === 'monthly',
      message: 'Monthly devotion brings continuous spiritual growth'
    },
    {
      id: 'yearly',
      name: 'Annual Seva',
      amount: '₹5,001',
      period: 'Yearly commitment',
      description: 'Embrace complete spiritual partnership',
      icon: Sparkles,
      blessings: [
        'All monthly blessings',
        'Year-round special pujas',
        'Personal spiritual mentor',
        'Master spiritual courses',
        'Early access to all content',
        'VIP community access',
        'Special blessings from guruji'
      ],
      current: currentSeva === 'yearly',
      message: 'Annual commitment supports sustained spiritual service'
    }
  ];

  const getCurrentSevaBadge = () => {
    if (currentSeva === 'basic') return null;
    
    const currentSevaData = sevaLevels.find(seva => seva.id === currentSeva);
    const IconComponent = currentSevaData?.icon || Heart;
    
    return (
      <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm mb-4 border border-green-200">
        <IconComponent className="h-4 w-4" />
        <span>Current Seva: {currentSevaData?.name}</span>
      </div>
    );
  };

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
          Back
        </Button>
      </div>

      <div className="text-center mb-8">
        <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
          <SettingsIcon className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          Spiritual Settings
        </h1>
        <p className="text-muted-foreground">
          Customize your spiritual journey
        </p>
        {getCurrentSevaBadge()}
      </div>

      <div className="space-y-6">
        {/* Personal Settings First */}
        <div className="space-y-4">
          {/* Language Settings */}
          <div className="sacred-card p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Language & Display
            </h2>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
                <SelectItem value="sa">संस्कृत</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Display Settings */}
          <div className="sacred-card p-6 space-y-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Accessibility
            </h2>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="fontSize" className="mb-2 block">
                  Text Size
                </Label>
                <Select value={fontSize} onValueChange={handleFontSizeChange}>
                  <SelectTrigger id="fontSize">
                    <SelectValue placeholder="Select text size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Comfortable</SelectItem>
                    <SelectItem value="large">Larger (Easier to read)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="reduceMotion" className="block">
                    Reduce Animations
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    For a more focused experience
                  </p>
                </div>
                <Switch
                  id="reduceMotion"
                  checked={reduceMotion}
                  onCheckedChange={handleMotionChange}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Seva Offering Section */}
        <div className="sacred-card p-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Heart className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Offer Seva & Support Our Mission
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your generous support helps us maintain this sacred space, conduct daily prayers, 
              and create more spiritual content for seekers worldwide. Every contribution is a blessing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sevaLevels.map((seva) => {
              const IconComponent = seva.icon;
              return (
                <div
                  key={seva.id}
                  className={`border rounded-xl p-6 transition-all ${
                    seva.current
                      ? 'border-green-500 bg-green-50/50 dark:bg-green-900/20 ring-2 ring-green-200'
                      : 'border-amber-200 bg-amber-50/30 dark:bg-amber-900/10 hover:border-amber-300'
                  }`}
                >
                  <div className="text-center mb-4">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                      seva.current ? 'bg-green-100' : 'bg-amber-100'
                    }`}>
                      <IconComponent className={`h-6 w-6 ${
                        seva.current ? 'text-green-600' : 'text-amber-600'
                      }`} />
                    </div>
                    <h3 className="font-semibold text-foreground text-lg">{seva.name}</h3>
                    <div className="mt-2">
                      <span className="text-2xl font-bold text-foreground">{seva.amount}</span>
                      <span className="text-muted-foreground text-sm block">{seva.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 italic">{seva.message}</p>
                  </div>

                  <div className="space-y-2 mb-6">
                    <div className="text-sm font-medium text-foreground mb-2">Blessings you receive:</div>
                    {seva.blessings.map((blessing, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <div className={`w-2 h-2 rounded-full mt-1.5 ${
                          seva.current ? 'bg-green-500' : 'bg-amber-500'
                        }`} />
                        <span>{blessing}</span>
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
                      <>🙏 Currently Offering This Seva</>
                    ) : seva.id === 'basic' ? (
                      <>Continue with Basic Access</>
                    ) : (
                      <>Offer {seva.name} Seva</>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200">
            <p className="text-center text-sm text-blue-800 dark:text-blue-200">
              💫 <strong>All contributions</strong> are used for temple maintenance, daily prayers, 
              spiritual content creation, and serving the community. Your seva makes this possible. 🙏
            </p>
          </div>
        </div>

        {/* Account Settings */}
        <div className="sacred-card p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Account
          </h2>
          <Button
            onClick={handleLogoutClick}
            variant="outline"
            className="w-full flex items-center justify-center space-x-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
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
                Are you sure you want to sign out?
              </h3>
              <p className="text-muted-foreground text-sm">
                You will need to sign in again to access your spiritual journey.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={cancelLogout}
                variant="outline"
                className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50"
              >
                No, Stay Signed In
              </Button>
              <Button
                onClick={confirmLogout}
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
              >
                Yes, Sign Out
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;