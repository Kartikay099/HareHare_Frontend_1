import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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

import useEmblaCarousel from 'embla-carousel-react';
import { useCallback } from 'react';

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

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [currentSlide, setCurrentSlide] = useState(0);

  const { logout } = useAuth();
  const { i18n } = useTranslation();

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: any) => {
    setCurrentSlide(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

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
            let msg = 'Not authenticated — please login again.';
            if (i18n.language === 'hi') msg = 'प्रमाणित नहीं — कृपया फिर से लॉगिन करें।';
            if (i18n.language === 'te') msg = 'ప్రమాణీకరించబడలేదు — దయచేసి మళ్లీ లాగిన్ చేయండి.';
            toast.error(msg);
            navigate('/auth/login');
          } else if (res.status === 404) {
            let msg = 'Profile not found. Please complete registration.';
            if (i18n.language === 'hi') msg = 'प्रोफ़ाइल नहीं मिली। कृपया पंजीकरण पूरा करें।';
            if (i18n.language === 'te') msg = 'ప్రొఫైల్ కనుగొనబడలేదు. దయచేసి నమోదు పూర్తి చేయండి.';
            toast.error(msg);
          } else {
            let msg = 'Failed to load profile';
            if (i18n.language === 'hi') msg = 'प्रोफ़ाइल लोड करने में विफल';
            if (i18n.language === 'te') msg = 'ప్రొఫైల్ లోడ్ చేయడంలో విఫలమైంది';
            toast.error(msg);
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
    let msg = 'Referral link copied!';
    if (i18n.language === 'hi') msg = 'रेफरल लिंक कॉपी किया गया!';
    if (i18n.language === 'te') msg = 'రెఫరల్ లింక్ కాపీ చేయబడింది!';
    toast.success(msg);
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
    let msg = 'Logged out successfully';
    if (i18n.language === 'hi') msg = 'सफलतापूर्वक लॉगआउट हो गए';
    if (i18n.language === 'te') msg = 'విజయవంతంగా లాగ్ అవుట్ అయ్యారు';
    toast.success(msg);
    navigate('/auth/login');
    setShowLogoutConfirm(false);
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
    let msg = 'Logout cancelled';
    if (i18n.language === 'hi') msg = 'लॉगआउट रद्द किया गया';
    if (i18n.language === 'te') msg = 'లాగ్ అవుట్ రద్దు చేయబడింది';
    toast.info(msg);
  };

  const sevaLevels = [
    {
      id: 'basic',
      name: { en: 'Dharma Seeker', hi: 'धर्म साधक', te: 'ధర్మ సాధకుడు' },
      amount: { en: 'Free', hi: 'निःशुल्क', te: 'ఉచితం' },
      period: { en: 'Always available', hi: 'सदैव उपलब्ध', te: 'ఎల్లప్పుడూ అందుబాటులో ఉంటుంది' },
      description: { en: 'Continue your journey', hi: 'अपनी यात्रा जारी रखें', te: 'మీ ప్రయాణాన్ని కొనసాగించండి' },
      icon: Flower,
      blessings: [
        { en: 'Daily spiritual guidance', hi: 'दैनिक आध्यात्मिक मार्गदर्शन', te: 'రోజువారీ ఆధ్యాత్మిక మార్గదర్శకత్వం' },
        { en: 'Basic meditation content', hi: 'मूल ध्यान सामग्री', te: 'ప్రాథమిక ధ్యాన కంటెంట్' },
        { en: 'Community prayers', hi: 'सामुदायिक प्रार्थनाएं', te: 'సామూహిక ప్రార్థనలు' },
        { en: 'Divine blessings', hi: 'दिव्य आशीर्वाद', te: 'దివ్య ఆశీర్వాదాలు' },
      ],
      current: currentSeva === 'basic',
      message: { en: 'Continue with gratitude', hi: 'कृतज्ञता के साथ जारी रखें', te: 'కృతజ్ఞతతో కొనసాగించండి' },
    },
    {
      id: 'weekly',
      name: { en: 'Weekly Seva', hi: 'साप्ताहिक सेवा', te: 'వారపు సేవ' },
      amount: { en: '₹108', hi: '₹108', te: '₹108' },
      period: { en: 'Weekly offering', hi: 'साप्ताहिक योगदान', te: 'వారపు కానుక' },
      description: { en: 'Support the mission', hi: 'मिशन का समर्थन करें', te: 'మిషన్‌కు మద్దతు ఇవ్వండి' },
      icon: Heart,
      blessings: [
        { en: 'All basic blessings', hi: 'सभी मूल आशीर्वाद', te: 'అన్ని ప్రాథమిక ఆశీర్వాదాలు' },
        { en: 'Weekly special pujas', hi: 'साप्ताहिक विशेष पूजाएं', te: 'వారపు ప్రత్యేక పూజలు' },
        { en: 'Personal spiritual guidance', hi: 'व्यक्तिगत मार्गदर्शन', te: 'వ్యక్తిగత ఆధ్యాత్మిక మార్గదర్శకత్వం' },
        { en: 'Karma cleansing', hi: 'कर्म शुद्धि', te: 'కర్మ ప్రక్షాళన' },
        { en: 'Your name in prayers', hi: 'प्रार्थनाओं में आपका नाम', te: 'ప్రార్థనలలో మీ పేరు' },
      ],
      current: currentSeva === 'weekly',
      message: { en: 'Your support nourishes us', hi: 'आपका समर्थन हमें पोषित करता है', te: 'మీ మద్దతు మాకు బలాన్నిస్తుంది' },
    },
    {
      id: 'monthly',
      name: { en: 'Monthly Seva', hi: 'मासिक सेवा', te: 'నెలవారీ సేవ' },
      amount: { en: '₹501', hi: '₹501', te: '₹501' },
      period: { en: 'Monthly devotion', hi: 'मासिक भक्ति', te: 'నెలవారీ భక్తి' },
      description: { en: 'Deepen commitment', hi: 'प्रतिबद्धता गहरी करें', te: 'నిబద్ధతను పెంచుకోండి' },
      icon: Star,
      blessings: [
        { en: 'All weekly blessings', hi: 'सभी साप्ताहिक आशीर्वाद', te: 'అన్ని వారపు ఆశీర్వాదాలు' },
        { en: 'Monthly ceremonies', hi: 'मासिक समारोह', te: 'నెలవారీ వేడుకలు' },
        { en: '1-on-1 guidance', hi: 'एक-पर-एक मार्गदर्शन', te: '1-పై-1 మార్గదర్శకత్వం' },
        { en: 'Exclusive content', hi: 'विशेष सामग्री', te: 'ప్రత్యేక కంటెంట్' },
        { en: 'Priority prayers', hi: 'प्राथमिकता प्रार्थनाएं', te: 'ప్రాధాన్యత ప్రార్థనలు' },
      ],
      current: currentSeva === 'monthly',
      message: { en: 'Monthly devotion grows you', hi: 'मासिक भक्ति विकास लाती है', te: 'నెలవారీ భక్తి మిమ్మల్ని వృద్ధి చేస్తుంది' },
    },
    {
      id: 'yearly',
      name: { en: 'Annual Seva', hi: 'वार्षिक सेवा', te: 'వార్షిక సేవ' },
      amount: { en: '₹5001', hi: '₹5001', te: '₹5001' },
      period: { en: 'Yearly offering', hi: 'वार्षिक योगदान', te: 'వార్షిక కానుక' },
      description: { en: 'Complete partnership', hi: 'पूर्ण साझेदारी', te: 'పూర్తి భాగస్వామ్యం' },
      icon: Sparkles,
      blessings: [
        { en: 'All monthly blessings', hi: 'सभी मासिक आशीर्वाद', te: 'అన్ని నెలవారీ ఆశీర్వాదాలు' },
        { en: 'Year-round pujas', hi: 'सालभर पूजा', te: 'ఏడాది పొడవునా పూజలు' },
        { en: 'Personal mentor', hi: 'व्यक्तिगत गुरु', te: 'వ్యక్తిగత గురువు' },
        { en: 'Master courses', hi: 'मास्टर कोर्स', te: 'మాస్టర్ కోర్సులు' },
        { en: 'VIP access', hi: 'वीआईपी पहुंच', te: 'VIP యాక్సెస్' },
      ],
      current: currentSeva === 'yearly',
      message: { en: 'Your devotion sustains all', hi: 'आपकी भक्ति सब सम्भालती है', te: 'మీ భక్తి అందరినీ నిలబెడుతుంది' },
    },
  ];

  const getLocalizedText = (text: { en: string; hi: string; te?: string }) => {
    if (i18n.language === 'hi') return text.hi;
    if (i18n.language === 'te') return text.te || text.en;
    return text.en;
  };

  const offerSeva = (sevaLevel: string) => {
    setCurrentSeva(sevaLevel);
    let msg = '';
    if (i18n.language === 'hi') {
      msg = `आपकी ${sevaLevel} सेवा के लिए धन्यवाद!`;
    } else if (i18n.language === 'te') {
      msg = `మీ ${sevaLevel} సేవకు ధన్యవాదాలు!`;
    } else {
      msg = `Thank you for your ${sevaLevel} seva!`;
    }
    toast.success(msg);
  };



  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');

  const AVATARS = [
    { name: 'Ganesh Ji', src: '/Ganesh_ji.jpg' },
    { name: 'Krishna Ji', src: '/Krishna_ji.png' },
    { name: 'Ram Ji', src: '/Ram_ji.jpg' },
    { name: 'Shiv Ji', src: '/Shiv_ji.jpg' },
    { name: 'Hanuman Ji', src: '/Hanuman_ji.jpg' },
    { name: 'Saraswati Ji', src: '/Saraswati_ji.jpg' },
  ];

  useEffect(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      setSelectedAvatar(savedAvatar);
    } else {
      const randomAvatar = AVATARS[Math.floor(Math.random() * AVATARS.length)].src;
      setSelectedAvatar(randomAvatar);
      localStorage.setItem('userAvatar', randomAvatar);
    }
  }, []);

  const handleAvatarSelect = (avatarSrc: string) => {
    setSelectedAvatar(avatarSrc);
    localStorage.setItem('userAvatar', avatarSrc);
    setIsAvatarDialogOpen(false);
    toast.success(i18n.language === 'hi' ? 'प्रोफ़ाइल तस्वीर अपडेट की गई' : 'Profile picture updated');
  };

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
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-amber-100 shadow-lg relative bg-amber-50">
            {selectedAvatar ? (
              <img
                src={selectedAvatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="h-12 w-12 text-amber-300" />
              </div>
            )}
          </div>
          <button
            onClick={() => setIsAvatarDialogOpen(true)}
            className="absolute bottom-0 right-0 bg-amber-600 text-white p-1.5 rounded-full hover:bg-amber-700 transition-colors shadow-md"
          >
            <Settings className="h-4 w-4" />
          </button>
          {isSubscribed && (
            <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm">
              <BadgeCheck className="h-6 w-6 text-green-500" />
            </div>
          )}
        </div>

        <h1 className="text-4xl font-bold mb-2">{t('profile.title')}</h1>
        <p className="text-muted-foreground">
          {i18n.language === 'hi' ? 'आपकी व्यक्तिगत आध्यात्मिक पहचान' : i18n.language === 'te' ? 'మీ వ్యక్తిగత ఆధ్యాత్మిక గుర్తింపు' : 'Your personal spiritual identity'}
        </p>

        {isSubscribed && (
          <div className="mt-2 inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
            <BadgeCheck className="h-4 w-4" />
            {i18n.language === 'hi' ? 'प्रीमियम ग्राहक' : i18n.language === 'te' ? 'ప్రీమియం చందాదారుడు' : 'Premium Subscriber'}
          </div>
        )}
      </div>

      <div className="sacred-card p-8 space-y-5">
        <div className="space-y-1">
          <Label>{i18n.language === 'hi' ? 'नाम' : i18n.language === 'te' ? 'పేరు' : 'Name'}</Label>
          <Input value={name} readOnly disabled className="bg-gray-100 font-medium" />
        </div>

        <div className="space-y-1">
          <Label>{i18n.language === 'hi' ? 'ईमेल' : i18n.language === 'te' ? 'ఇమెయిల్' : 'Email'}</Label>
          <Input value={email} readOnly disabled className="bg-gray-100 font-medium" />
        </div>

        <div className="space-y-1">
          <Label>{i18n.language === 'hi' ? 'फ़ोन' : i18n.language === 'te' ? 'ఫోన్' : 'Phone'}</Label>
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
              {i18n.language === 'hi' ? 'सदस्यता स्थिति' : i18n.language === 'te' ? 'చందా స్థితి' : 'Subscription Status'}
            </h2>
            <p className="text-xs text-muted-foreground">
              {i18n.language === 'hi' ? 'आपकी वर्तमान आध्यात्मिक योजना' : i18n.language === 'te' ? 'మీ ప్రస్తుత ఆధ్యాత్మిక ప్రణాళిక' : 'Your current spiritual plan'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg border bg-amber-50/60 border-amber-200">
            <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground mb-1">
              <Clock className="h-3 w-3 text-amber-600" />
              {i18n.language === 'hi' ? 'योजना' : i18n.language === 'te' ? 'ప్రణాళిక' : 'Plan'}
            </p>
            <p className="text-sm font-semibold">
              {isSubscribed
                ? i18n.language === 'hi' ? 'प्रीमियम सदस्यता' : i18n.language === 'te' ? 'ప్రీమియం చందా' : 'Premium Subscription'
                : i18n.language === 'hi' ? 'मूल योजना' : i18n.language === 'te' ? 'ప్రాథమిక ప్రణాళిక' : 'Basic Plan'}
            </p>
          </div>

          <div className="p-3 rounded-lg border bg-amber-50/60 border-amber-200">
            <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground mb-1">
              <AlertCircle className="h-3 w-3 text-amber-600" />
              {i18n.language === 'hi' ? 'स्थिति' : i18n.language === 'te' ? 'స్థితి' : 'Status'}
            </p>
            <p
              className={`text-sm font-semibold ${isSubscribed ? 'text-green-700' : 'text-amber-700'
                }`}
            >
              {isSubscribed
                ? i18n.language === 'hi' ? 'सक्रिय' : i18n.language === 'te' ? 'యాక్టివ్' : 'Active'
                : i18n.language === 'hi' ? 'मूल पहुंच' : i18n.language === 'te' ? 'ప్రాథమిక యాక్సెస్' : 'Basic Access'}
            </p>
          </div>

          <div className="p-3 rounded-lg border bg-amber-50/60 border-amber-200 col-span-2">
            <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground mb-1">
              <Heart className="h-3 w-3 text-purple-600" />
              {i18n.language === 'hi' ? 'सेवा स्तर' : i18n.language === 'te' ? 'సేవా స్థాయి' : 'Seva Level'}
            </p>
            <p className="text-sm font-semibold text-purple-700">
              {getLocalizedText(sevaLevels.find((s) => s.id === currentSeva)?.name || {
                en: 'Basic',
                hi: 'मूल',
                te: 'ప్రాథమిక'
              })}
            </p>
          </div>
        </div>

        <div className="mt-3 text-xs text-muted-foreground">
          {isSubscribed
            ? (i18n.language === 'hi' ? '✨ प्रीमियम लाभ सक्रिय' : i18n.language === 'te' ? '✨ ప్రీమియం ప్రయోజనాలు యాక్టివ్‌గా ఉన్నాయి' : '✨ Premium benefits active')
            : (i18n.language === 'hi' ? '✨ मूल पहुंच सक्षम' : i18n.language === 'te' ? '✨ ప్రాథమిక యాక్సెస్ ప్రారంభించబడింది' : '✨ Basic access enabled')}
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
              ? 'सदस्यता'
              : i18n.language === 'te'
                ? 'చందాలు'
                : 'Subscriptions'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {i18n.language === 'hi'
              ? 'आपका योगदान मंदिर रखरखाव और आध्यात्मिक सामग्री में सहायता करता है।'
              : i18n.language === 'te'
                ? 'మీ సహకారం ఆలయ నిర్వహణ మరియు ఆధ్యాత్మిక కంటెంట్‌కు సహాయపడుతుంది.'
                : 'Your support helps maintain the temple and spiritual content.'}
          </p>
        </div>

        <div className="relative">
          <div className="flex justify-between items-center mb-6">
            <Button
              onClick={scrollPrev}
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
                  onClick={() => emblaApi && emblaApi.scrollTo(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-amber-600' : 'bg-amber-300'
                    }`}
                />
              ))}
            </div>

            <Button
              onClick={scrollNext}
              variant="outline"
              size="icon"
              className="w-10 h-10 rounded-full border-amber-200 text-amber-700 hover:bg-amber-50"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex touch-pan-y">
              {sevaLevels.map((seva) => {
                const Icon = seva.icon;
                return (
                  <div key={seva.id} className="flex-[0_0_100%] min-w-0 px-4">
                    <div
                      className={`border rounded-xl p-6 ${seva.current
                        ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                        : 'border-amber-200 bg-amber-50 hover:border-amber-300'
                        }`}
                    >
                      <div className="text-center mb-4">
                        <div
                          className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${seva.current ? 'bg-green-100' : 'bg-amber-100'
                            }`}
                        >
                          <Icon
                            className={`h-6 w-6 ${seva.current ? 'text-green-600' : 'text-amber-600'
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
                            : i18n.language === 'te'
                              ? 'మీరు పొందే ఆశీర్వాదాలు:'
                              : 'Blessings you receive:'}
                        </div>
                        {seva.blessings.map((bless, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <div
                              className={`w-2 h-2 rounded-full mt-1.5 ${seva.current ? 'bg-green-500' : 'bg-amber-500'
                                }`}
                            />
                            <span>{getLocalizedText(bless)}</span>
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={() => offerSeva(seva.id)}
                        className={`w-full ${seva.current
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-amber-600 hover:bg-amber-700'
                          } text-white`}
                        disabled={seva.current}
                      >
                        {seva.current
                          ? i18n.language === 'hi'
                            ? '🙏 वर्तमान में यह सेवा अर्पित कर रहे हैं'
                            : i18n.language === 'te'
                              ? '🙏 ప్రస్తుతం ఈ సేవను అర్పిస్తున్నారు'
                              : '🙏 Currently Offering This Seva'
                          : i18n.language === 'hi'
                            ? `${getLocalizedText(seva.name)} सेवा अर्पित करें`
                            : i18n.language === 'te'
                              ? `${getLocalizedText(seva.name)} అర్పించండి`
                              : `Offer ${getLocalizedText(seva.name)} Seva`}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>


      </div>

      <div className="sacred-card p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">
          {i18n.language === 'hi' ? 'खाता' : i18n.language === 'te' ? 'ఖాతా' : 'Account'}
        </h2>
        <Button
          onClick={handleLogoutClick}
          variant="outline"
          className="w-full flex items-center justify-center gap-2 border-red-200 text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-5 w-5" />
          <span>{i18n.language === 'hi' ? 'साइन आउट' : i18n.language === 'te' ? 'సైన్ అవుట్' : 'Sign Out'}</span>
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
                  : i18n.language === 'te'
                    ? 'మీరు ఖచ్చితంగా సైన్ అవుట్ చేయాలనుకుంటున్నారా?'
                    : 'Are you sure you want to sign out?'}
              </h3>
              <p className="text-muted-foreground text-sm">
                {i18n.language === 'hi'
                  ? 'फिर से प्रवेश करना होगा।'
                  : i18n.language === 'te'
                    ? 'మీరు మళ్లీ సైన్ ఇన్ చేయాల్సి ఉంటుంది.'
                    : 'You will need to sign in again.'}
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={cancelLogout}
                variant="outline"
                className="flex-1 border-amber-200 text-amber-700 hover:bg-amber-50"
              >
                {i18n.language === 'hi' ? 'नहीं' : i18n.language === 'te' ? 'వద్దు' : 'Cancel'}
              </Button>
              <Button
                onClick={confirmLogout}
                className="flex-1 bg-red-600 text-white hover:bg-red-700"
              >
                {i18n.language === 'hi' ? 'हाँ' : i18n.language === 'te' ? 'అవును' : 'Sign Out'}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose Avatar</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-4">
            {AVATARS.map((avatar) => (
              <button
                key={avatar.name}
                onClick={() => handleAvatarSelect(avatar.src)}
                className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedAvatar === avatar.src
                  ? 'border-amber-600 ring-2 ring-amber-200'
                  : 'border-transparent hover:border-amber-300'
                  }`}
              >
                <img
                  src={avatar.src}
                  alt={avatar.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] py-1 text-center truncate px-1">
                  {avatar.name}
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;