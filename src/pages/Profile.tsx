import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  User,
  BadgeCheck,
  Settings,
  Share2,
  Copy,
  LogOut,
  Heart,
  Flower,
  Star,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate, Link } from 'react-router-dom';

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const user = (auth as any).user as any;
  const navigate = useNavigate();

  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [referralCode, setReferralCode] = useState('');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [currentSeva, setCurrentSeva] = useState('basic');
  const [currentSlide, setCurrentSlide] = useState(0);
  const { logout } = useAuth();
  const { i18n } = useTranslation();

  const generateFallbackCode = () => {
    const base =
      (user?.id || user?.email || user?.name || 'USER')
        .toString()
        .replace(/[^a-zA-Z0-9]/g, '');
    const prefix = base.substring(0, 4).toUpperCase().padEnd(4, 'X');
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${randomPart}`;
  };

  useEffect(() => {
    const saved = localStorage.getItem('referralCode');
    if (saved) {
      setReferralCode(saved);
    } else {
      const newCode = generateFallbackCode();
      setReferralCode(newCode);
      localStorage.setItem('referralCode', newCode);
    }
  }, [user]);

  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1200);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function fetchProfile() {
      try {
        let token = undefined;
        const maybeGetId = (auth as any).getIdToken;
        if (typeof maybeGetId === 'function') {
          token = await maybeGetId();
        } else if (user && user.token) {
          token = user.token;
        }

        const res = await fetch('/api/auth/profile/me', {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            toast.error('Not authenticated — please login again.');
            navigate('/auth/login');
          } else if (res.status === 404) {
            toast.error('Profile not found. Please complete registration.');
          } else {
            toast.error('Failed to load profile');
          }
          setProfile(null);
        } else {
          const data = await res.json();
          if (mounted) setProfile(data);
        }
      } catch (err) {
        console.error('fetchProfile error', err);
      }
    }

    fetchProfile();
    return () => {
      mounted = false;
    };
  }, [user]);

  const name = profile?.name || user?.name || 'N/A';
  const email = profile?.email || user?.email || 'N/A';
  const phone = profile?.phone || user?.phone || 'N/A';
  const isSubscribed = profile?.is_premium ?? false;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Join me!',
        text: 'Register using my referral link',
        url: referralLink,
      });
    } else {
      handleCopy();
    }
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

  const sevaLevels = [
    {
      id: 'basic',
      name: { en: 'Dharma Seeker', hi: 'धर्म साधक' },
      amount: { en: 'Free', hi: 'निःशुल्क' },
      period: { en: 'Always available', hi: 'सदैव उपलब्ध' },
      description: { en: 'Continue your journey', hi: 'अपनी यात्रा जारी रखें' },
      icon: Flower,
      blessings: [
        { en: 'Daily spiritual guidance', hi: 'दैनिक आध्यात्मिक मार्गदर्शन' },
        { en: 'Basic meditation content', hi: 'मूल ध्यान सामग्री' },
        { en: 'Community prayers', hi: 'सामुदायिक प्रार्थनाएं' },
        { en: 'Divine blessings', hi: 'दिव्य आशीर्वाद' },
      ],
      current: currentSeva === 'basic',
      message: { en: 'Continue with gratitude', hi: 'कृतज्ञता के साथ जारी रखें' },
    },
    {
      id: 'weekly',
      name: { en: 'Weekly Seva', hi: 'साप्ताहिक सेवा' },
      amount: { en: '₹108', hi: '₹108' },
      period: { en: 'Weekly offering', hi: 'साप्ताहिक योगदान' },
      description: { en: 'Support the mission', hi: 'मिशन का समर्थन करें' },
      icon: Heart,
      blessings: [
        { en: 'All basic blessings', hi: 'सभी मूल आशीर्वाद' },
        { en: 'Weekly special pujas', hi: 'साप्ताहिक विशेष पूजाएं' },
        { en: 'Personal spiritual guidance', hi: 'व्यक्तिगत मार्गदर्शन' },
        { en: 'Karma cleansing', hi: 'कर्म शुद्धि' },
        { en: 'Your name in prayers', hi: 'प्रार्थनाओं में आपका नाम' },
      ],
      current: currentSeva === 'weekly',
      message: { en: 'Your support nourishes us', hi: 'आपका समर्थन हमें पोषित करता है' },
    },
    {
      id: 'monthly',
      name: { en: 'Monthly Seva', hi: 'मासिक सेवा' },
      amount: { en: '₹501', hi: '₹501' },
      period: { en: 'Monthly devotion', hi: 'मासिक भक्ति' },
      description: { en: 'Deepen commitment', hi: 'प्रतिबद्धता गहरी करें' },
      icon: Star,
      blessings: [
        { en: 'All weekly blessings', hi: 'सभी साप्ताहिक आशीर्वाद' },
        { en: 'Monthly ceremonies', hi: 'मासिक समारोह' },
        { en: '1-on-1 guidance', hi: 'एक-पर-एक मार्गदर्शन' },
        { en: 'Exclusive content', hi: 'विशेष सामग्री' },
        { en: 'Priority prayers', hi: 'प्राथमिकता प्रार्थनाएं' },
      ],
      current: currentSeva === 'monthly',
      message: { en: 'Monthly devotion grows you', hi: 'मासिक भक्ति विकास लाती है' },
    },
    {
      id: 'yearly',
      name: { en: 'Annual Seva', hi: 'वार्षिक सेवा' },
      amount: { en: '₹5001', hi: '₹5001' },
      period: { en: 'Yearly offering', hi: 'वार्षिक योगदान' },
      description: { en: 'Complete partnership', hi: 'पूर्ण साझेदारी' },
      icon: Sparkles,
      blessings: [
        { en: 'All monthly blessings', hi: 'सभी मासिक आशीर्वाद' },
        { en: 'Year-round pujas', hi: 'सालभर पूजा' },
        { en: 'Personal mentor', hi: 'व्यक्तिगत गुरु' },
        { en: 'Master courses', hi: 'मास्टर कोर्स' },
        { en: 'VIP access', hi: 'वीआईपी पहुंच' },
      ],
      current: currentSeva === 'yearly',
      message: { en: 'Your devotion sustains all', hi: 'आपकी भक्ति सब सम्भालती है' },
    },
  ];

  const getLocalizedText = (text: { en: string; hi: string }) => {
    return i18n.language === 'hi' ? text.hi : text.en;
  };

  const offerSeva = (sevaLevel: string) => {
    setCurrentSeva(sevaLevel);
    const msg =
      i18n.language === 'hi'
        ? `आपकी ${sevaLevel} सेवा के लिए धन्यवाद!`
        : `Thank you for your ${sevaLevel} seva!`;
    toast.success(msg);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sevaLevels.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sevaLevels.length) % sevaLevels.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sevaLevels.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="text-6xl text-amber-600">ॐ</div>
        <p className="text-lg font-semibold text-amber-700 animate-pulse">
          ॐ शान्ति शान्ति शान्तिः
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="inline-block p-4 bg-primary/10 rounded-full mb-4 relative">
          <User className="h-16 w-16 text-primary" />
          {isSubscribed && (
            <div className="absolute -top-1 -right-1 bg-background rounded-full p-1">
              <BadgeCheck className="h-6 w-6 text-green-500" />
            </div>
          )}
        </div>

        <h1 className="text-4xl font-bold mb-2">{t('profile.title')}</h1>
        <p className="text-muted-foreground">Your personal spiritual identity</p>

        {isSubscribed && (
          <div className="mt-2 inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
            <BadgeCheck className="h-4 w-4" />
            Premium Subscriber
          </div>
        )}
      </div>

      <div className="sacred-card p-8 space-y-5">
        <div className="space-y-1">
          <Label>Name</Label>
          <Input value={name} readOnly disabled className="bg-gray-100 font-medium" />
        </div>

        <div className="space-y-1">
          <Label>Email</Label>
          <Input value={email} readOnly disabled className="bg-gray-100 font-medium" />
        </div>

        <div className="space-y-1">
          <Label>Phone</Label>
          <Input value={phone} readOnly disabled className="bg-gray-100 font-medium" />
        </div>
      </div>

      {/* MINIMALIST SUBSCRIPTION STATUS */}
      <div className="sacred-card p-5 mt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <BadgeCheck className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              {i18n.language === 'hi' ? 'सदस्यता स्थिति' : 'Subscription Status'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {i18n.language === 'hi' ? 'आपकी वर्तमान आध्यात्मिक योजना' : 'Your current spiritual plan'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg border bg-amber-50/60 border-amber-200">
            <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground mb-1">
              <Clock className="h-3 w-3 text-amber-600" />
              {i18n.language === 'hi' ? 'योजना' : 'Plan'}
            </p>
            <p className="text-sm font-semibold">
              {isSubscribed
                ? i18n.language === 'hi' ? 'प्रीमियम सदस्यता' : 'Premium Subscription'
                : i18n.language === 'hi' ? 'मूल योजना' : 'Basic Plan'}
            </p>
          </div>

          <div className="p-3 rounded-lg border bg-amber-50/60 border-amber-200">
            <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground mb-1">
              <AlertCircle className="h-3 w-3 text-amber-600" />
              {i18n.language === 'hi' ? 'स्थिति' : 'Status'}
            </p>
            <p
              className={`text-sm font-semibold ${
                isSubscribed ? 'text-green-700' : 'text-amber-700'
              }`}
            >
              {isSubscribed
                ? i18n.language === 'hi' ? 'सक्रिय' : 'Active'
                : i18n.language === 'hi' ? 'मूल पहुंच' : 'Basic Access'}
            </p>
          </div>

          <div className="p-3 rounded-lg border bg-amber-50/60 border-amber-200 col-span-2">
            <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground mb-1">
              <Heart className="h-3 w-3 text-purple-600" />
              {i18n.language === 'hi' ? 'सेवा स्तर' : 'Seva Level'}
            </p>
            <p className="text-sm font-semibold text-purple-700">
              {getLocalizedText(sevaLevels.find((s) => s.id === currentSeva)?.name || {
                en: 'Basic',
                hi: 'मूल',
              })}
            </p>
          </div>
        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          {isSubscribed
            ? '✨ Premium benefits active'
            : '✨ Basic access enabled'}
        </div>
      </div>

      {/* Seva Slider */}
      <div className="sacred-card p-6 mt-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <Heart className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">
            {i18n.language === 'hi'
              ? 'सेवा अर्पित करें और समर्थन करें'
              : 'Offer Seva & Support Our Mission'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {i18n.language === 'hi'
              ? 'आपका योगदान मंदिर रखरखाव और आध्यात्मिक सामग्री में सहायता करता है।'
              : 'Your support helps maintain the temple and spiritual content.'}
          </p>
        </div>

        <div className="relative">
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
                  className={`w-3 h-3 rounded-full ${
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

          <div className="relative overflow-hidden rounded-xl">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {sevaLevels.map((seva) => {
                const Icon = seva.icon;
                return (
                  <div key={seva.id} className="w-full flex-shrink-0 px-4">
                    <div
                      className={`border rounded-xl p-6 ${
                        seva.current
                          ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                          : 'border-amber-200 bg-amber-50 hover:border-amber-300'
                      }`}
                    >
                      <div className="text-center mb-4">
                        <div
                          className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                            seva.current ? 'bg-green-100' : 'bg-amber-100'
                          }`}
                        >
                          <Icon
                            className={`h-6 w-6 ${
                              seva.current ? 'text-green-600' : 'text-amber-600'
                            }`}
                          />
                        </div>
                        <h3 className="font-semibold text-lg">
                          {getLocalizedText(seva.name)}
                        </h3>
                        <div className="mt-2">
                          <span className="text-2xl font-bold">
                            {getLocalizedText(seva.amount)}
                          </span>
                          <span className="text-xs block text-muted-foreground">
                            {getLocalizedText(seva.period)}
                          </span>
                        </div>
                        <p className="text-sm italic mt-2 text-muted-foreground">
                          {getLocalizedText(seva.message)}
                        </p>
                      </div>

                      <div className="space-y-2 mb-6">
                        <div className="text-sm font-medium mb-2">
                          {i18n.language === 'hi'
                            ? 'आपको मिलने वाले आशीर्वाद:'
                            : 'Blessings you receive:'}
                        </div>
                        {seva.blessings.map((bless, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <div
                              className={`w-2 h-2 rounded-full mt-1.5 ${
                                seva.current ? 'bg-green-500' : 'bg-amber-500'
                              }`}
                            />
                            <span>{getLocalizedText(bless)}</span>
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
                        {seva.current
                          ? i18n.language === 'hi'
                            ? '🙏 वर्तमान में यह सेवा अर्पित कर रहे हैं'
                            : '🙏 Currently Offering This Seva'
                          : i18n.language === 'hi'
                          ? `${getLocalizedText(seva.name)} सेवा अर्पित करें`
                          : `Offer ${getLocalizedText(seva.name)} Seva`}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 text-center text-sm">
          {i18n.language === 'hi'
            ? '💫 सभी योगदान मंदिर और समुदाय की सेवा के लिए उपयोग किए जाते हैं।'
            : '💫 All contributions support the temple and community.'}
        </div>
      </div>

      <div className="sacred-card p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">
          {i18n.language === 'hi' ? 'खाता' : 'Account'}
        </h2>
        <Button
          onClick={handleLogoutClick}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          <span>{i18n.language === 'hi' ? 'साइन आउट' : 'Sign Out'}</span>
        </Button>
      </div>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>
          <Link to="/terms" className="text-amber-600 hover:underline mr-3">
            Terms & Conditions
          </Link>
          <Link to="/privacy" className="text-amber-600 hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full shadow-lg border border-amber-200">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <LogOut className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                {i18n.language === 'hi'
                  ? 'क्या आप वाकई साइन आउट करना चाहते हैं?'
                  : 'Are you sure you want to sign out?'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {i18n.language === 'hi'
                  ? 'फिर से प्रवेश करना होगा।'
                  : 'You will need to sign in again.'}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={cancelLogout}
                variant="outline"
                className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50"
              >
                {i18n.language === 'hi' ? 'नहीं' : 'Cancel'}
              </Button>
              <Button
                onClick={confirmLogout}
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
              >
                {i18n.language === 'hi' ? 'हाँ' : 'Sign Out'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
