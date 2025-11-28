import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search, Star, ChevronLeft, ChevronRight, Filter, BookOpen, Users, Clock, Shield, Sparkles, ExternalLink, Heart, Eye, Flame, Calendar, IndianRupee } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SpiritualStore: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sidebarPosition, setSidebarPosition] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const poojServices = [
    {
      id: 'pooja-1',
      name: { en: 'Maha Rudrabhishek', hi: 'महा रुद्राभिषेक', te: 'మహా రుద్రాభిషేకం' },
      description: {
        en: 'Complete Vedic rituals for peace and prosperity performed by certified priests',
        hi: 'प्रमाणित पुजारियों द्वारा शांति और समृद्धि के लिए पूर्ण वैदिक अनुष्ठान',
        te: 'ధృవీకరించబడిన పూజారులచే శాంతి మరియు శ్రేయస్సు కోసం పూర్తి వేద ఆచారాలు'
      },
      fullDescription: {
        en: 'Maha Rudrabhishek is one of the most sacred and powerful Vedic rituals performed to honor Lord Shiva. This ancient ritual involves the worship of Shiva Lingam with various sacred substances while chanting powerful Vedic mantras.',
        hi: 'महा रुद्राभिषेक भगवान शिव के सम्मान में किया जाने वाला सबसे पवित्र और शक्तिशाली वैदिक अनुष्ठानों में से एक है।',
        te: 'మహా రుద్రాభిషేకం శివుని గౌరవార్థం చేసే అత్యంత పవిత్రమైన మరియు శక్తివంతమైన వేద ఆచారాలలో ఒకటి.'
      },
      duration: { en: '3 hours', hi: '3 घंटे', te: '3 గంటలు' },
      price: 4999,
      originalPrice: 6999,
      rating: 4.9,
      reviews: 342,
      features: {
        en: ['Live Streaming', 'Prasad Delivery', 'Certified Priests', 'Vedic Chants'],
        hi: ['लाइव स्ट्रीमिंग', 'प्रसाद वितरण', 'प्रमाणित पुजारी', 'वैदिक मंत्र'],
        te: ['లైవ్ స్ట్రీమింగ్', 'ప్రసాదం డెలివరీ', 'ధృవీకరించబడిన పూజారులు', 'వేద మంత్రాలు']
      },
      icon: 'Flame',
      color: 'from-orange-50 to-red-100',
      badge: { en: 'Most Popular', hi: 'सबसे लोकप्रिय', te: 'అత్యంత ప్రజాదరణ పొందినది' }
    },
    {
      id: 'pooja-2',
      name: { en: 'Satyanarayan Pooja', hi: 'सत्यनारायण पूजा', te: 'సత్యనారాయణ పూజ' },
      description: {
        en: 'Weekly pooja for family harmony and success with full family participation',
        hi: 'पारिवारिक सद्भाव और सफलता के लिए साप्ताहिक पूजा',
        te: 'కుటుంబ సామరస్యం మరియు విజయం కోసం వారంవారీ పూజ'
      },
      fullDescription: {
        en: 'Satyanarayan Pooja is performed to seek the blessings of Lord Vishnu for family harmony, success, and overall well-being.',
        hi: 'सत्यनारायण पूजा भगवान विष्णु का आशीर्वाद लेने के लिए की जाती है।',
        te: 'కుటుంబ సామరస్యం మరియు విజయం కోసం విష్ణువు ఆశీర్వాదాలను కోరుతూ సత్యనారాయణ పూజ నిర్వహిస్తారు.'
      },
      duration: { en: '2 hours', hi: '2 घंटे', te: '2 గంటలు' },
      price: 1999,
      originalPrice: 2499,
      rating: 4.8,
      reviews: 287,
      features: {
        en: ['Family Participation', 'Online Booking', 'Pooja Kit', 'Live Guidance'],
        hi: ['पारिवारिक भागीदारी', 'ऑनलाइन बुकिंग', 'पूजा किट', 'लाइव मार्गदर्शन'],
        te: ['కుటుంబ భాగస్వామ్యం', 'ఆన్‌లైన్ బుకింగ్', 'పూజ కిట్', 'లైవ్ గైడెన్స్']
      },
      icon: 'Users',
      color: 'from-blue-50 to-cyan-100',
      badge: { en: 'Family Favorite', hi: 'परिवार पसंदीदा', te: 'కుటుంబ ఇష్టమైనది' }
    },
    {
      id: 'pooja-3',
      name: { en: 'Ganesh Chaturthi', hi: 'गणेश चतुर्थी', te: 'గణేష్ చతుర్థి' },
      description: {
        en: 'Special Ganesha worship for new beginnings and obstacle removal',
        hi: 'नई शुरुआत और बाधा निवारण के लिए विशेष गणेश पूजा',
        te: 'కొత్త ప్రారంభాలు మరియు అడ్డంకుల తొలగింపు కోసం ప్రత్యేక గణేశ పూజ'
      },
      fullDescription: {
        en: 'Ganesh Chaturthi is a special worship dedicated to Lord Ganesha, the remover of obstacles.',
        hi: 'गणेश चतुर्थी भगवान गणेश को समर्पित एक विशेष पूजा है।',
        te: 'గణేష్ చతుర్థి విఘ్నేశ్వరుడైన గణేశుడికి అంకితం చేయబడిన ప్రత్యేక పూజ.'
      },
      duration: { en: '4 hours', hi: '4 घंटे', te: '4 గంటలు' },
      price: 2999,
      originalPrice: 3999,
      rating: 4.7,
      reviews: 156,
      features: {
        en: ['108 Modak Offering', 'Vedic Chants', 'Live Darshan', 'Prasad'],
        hi: ['108 मोदक अर्पण', 'वैदिक मंत्र', 'लाइव दर्शन', 'प्रसाद'],
        te: ['108 మోదక సమర్పణ', 'వేద మంత్రాలు', 'లైవ్ దర్శనం', 'ప్రసాదం']
      },
      icon: 'Sparkles',
      color: 'from-yellow-50 to-amber-100',
      badge: { en: 'Festival Special', hi: 'त्योहार विशेष', te: 'పండుగ ప్రత్యేకం' }
    }
  ];

  const categories = [
    { id: 'all', name: { en: 'All Items', hi: 'सभी वस्तुएं', te: 'అన్ని అంశాలు' }, icon: Sparkles, count: 314, color: 'from-amber-500 to-orange-500' },
    { id: 'books', name: { en: 'Sacred Texts', hi: 'पवित्र ग्रंथ', te: 'పవిత్ర గ్రంథాలు' }, icon: BookOpen, count: 45, color: 'from-blue-500 to-cyan-500' },
    { id: 'murti', name: { en: 'Divine Idols', hi: 'दिव्य मूर्तियां', te: 'దివ్య విగ్రహాలు' }, icon: Users, count: 67, color: 'from-purple-500 to-pink-500' },
    { id: 'yantra', name: { en: 'Sacred Yantras', hi: 'पवित्र यंत्र', te: 'పవిత్ర యంత్రాలు' }, icon: Shield, count: 34, color: 'from-green-500 to-emerald-500' },
    { id: 'accessories', name: { en: 'Accessories', hi: 'सामग्री', te: 'సామగ్రి' }, icon: Star, count: 89, color: 'from-red-500 to-orange-500' },
    { id: 'courses', name: { en: 'Spiritual Courses', hi: 'आध्यात्मिक पाठ्यक्रम', te: 'ఆధ్యాత్మిక కోర్సులు' }, icon: BookOpen, count: 56, color: 'from-indigo-500 to-blue-500' }
  ];

  const sampleProducts = [
    {
      id: '1',
      name: { en: 'Bhagavad Gita Hard Cover', hi: 'भगवद गीता हार्ड कवर', te: 'భగవద్గీత హార్డ్ కవర్' },
      description: {
        en: 'Authentic Sanskrit text with Hindi translation and detailed commentary',
        hi: 'हिंदी अनुवाद और विस्तृत टिप्पणी के साथ प्रामाणिक संस्कृत पाठ',
        te: 'హిందీ అనువాదం మరియు వివరణాత్మక వ్యాఖ్యానంతో ప్రామాణికమైన సంస్కృత వచనం'
      },
      category: 'Sacred Texts',
      price: 499,
      originalPrice: 699,
      rating: 4.8,
      reviews: 289,
      discount: 28,
      amazonLink: '#',
      imageColor: 'from-blue-50 to-cyan-100',
      tag: { en: 'Bestseller', hi: 'सर्वाधिक बिकाऊ', te: 'బెస్ట్ సెల్లర్' },
      tagColor: 'bg-amber-500'
    },
    {
      id: '2',
      name: { en: 'Brass Ganesha Idol', hi: 'पीतल गणेश मूर्ति', te: 'ఇత్తడి గణేశ విగ్రహం' },
      description: {
        en: 'Handcrafted brass idol with intricate detailing for home temple',
        hi: 'घर के मंदिर के लिए जटिल विवरण के साथ हस्तनिर्मित पीतल की मूर्ति',
        te: 'ఇంటి ఆలయం కోసం క్లిష్టమైన వివరాలతో చేతితో తయారు చేసిన ఇత్తడి విగ్రహం'
      },
      category: 'Divine Idols',
      price: 2999,
      originalPrice: 3999,
      rating: 4.7,
      reviews: 134,
      discount: 25,
      amazonLink: '#',
      imageColor: 'from-amber-50 to-yellow-100',
      tag: { en: 'Popular', hi: 'लोकप्रिय', te: 'ప్రసిద్ధ' },
      tagColor: 'bg-blue-500'
    },
    {
      id: '3',
      name: { en: 'Copper Shri Yantra', hi: 'तांबा श्री यंत्र', te: 'రాగి శ్రీ యంత్రం' },
      description: {
        en: 'Authentic copper yantra for prosperity and spiritual growth',
        hi: 'समृद्धि और आध्यात्मिक विकास के लिए प्रामाणिक तांबा यंत्र',
        te: 'శ్రేయస్సు మరియు ఆధ్యాత్మిక వృద్ధి కోసం ప్రామాణికమైన రాగి యంత్రం'
      },
      category: 'Sacred Yantras',
      price: 1599,
      originalPrice: 1999,
      rating: 4.6,
      reviews: 89,
      discount: 20,
      amazonLink: '#',
      imageColor: 'from-rose-50 to-pink-100',
      tag: { en: 'New', hi: 'नया', te: 'కొత్త' },
      tagColor: 'bg-green-500'
    },
    {
      id: '4',
      name: { en: 'Rudraksha Mala', hi: 'रुद्राक्ष माला', te: 'రుద్రాక్ష మాల' },
      description: {
        en: '108 bead genuine rudraksha mala for meditation practice',
        hi: 'ध्यान अभ्यास के लिए 108 मनके की असली रुद्राक्ष माला',
        te: 'ధ్యాన సాధన కోసం 108 పూసల నిజమైన రుద్రాక్ష మాల'
      },
      category: 'Accessories',
      price: 899,
      originalPrice: 1299,
      rating: 4.5,
      reviews: 203,
      discount: 30,
      amazonLink: '#',
      imageColor: 'from-teal-50 to-cyan-100',
      tag: { en: 'Bestseller', hi: 'सर्वाधिक बिकाऊ', te: 'బెస్ట్ సెల్లర్' },
      tagColor: 'bg-amber-500'
    }
  ];

  // Icon mapping for string to component
  const iconMap = {
    Flame,
    Users,
    Sparkles,
    BookOpen,
    Shield,
    Star,
    Heart,
    Clock
  };

  // Touch gesture handlers for slider
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextPooja();
    } else if (isRightSwipe) {
      prevPooja();
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSidebarPosition((prev) => (prev + 1) % poojServices.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextPooja = () => {
    setSidebarPosition((prev) => (prev + 1) % poojServices.length);
  };

  const prevPooja = () => {
    setSidebarPosition((prev) => (prev - 1 + poojServices.length) % poojServices.length);
  };

  const viewPoojaDetails = (service: any) => {
    // Create a clean, serializable object without React components
    const cleanService = {
      ...service,
      // Remove any non-serializable properties
      icon: service.icon // This is now a string, so it's safe
    };

    console.log('Navigating to puja details:', cleanService);
    navigate('/app/puja-details', {
      state: {
        puja: cleanService
      }
    });
  };

  const getText = (obj: any) => {
    if (!obj) return '';
    if (i18n.language === 'hi') return obj.hi || obj.en;
    if (i18n.language === 'te') return obj.te || obj.en;
    return obj.en;
  };

  const filteredProducts = activeCategory === 'all'
    ? sampleProducts
    : sampleProducts.filter((p) => {
      const catName = categories.find((c) => c.id === activeCategory)?.name;
      return p.category === (catName ? (catName as any).en : '');
    });

  const viewProduct = (p: any) => window.open(p.amazonLink, '_blank');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30">

      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-gray-200/60 px-4 py-4 shadow-sm sticky top-0 z-50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-br from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {i18n.language === 'hi' ? 'हरे हरे' : i18n.language === 'te' ? 'హరే హరే' : 'Hare Hare'}
              </h1>
              <p className="text-xs text-gray-500 -mt-1">
                {i18n.language === 'hi' ? 'आध्यात्मिक आवश्यकताएं' : i18n.language === 'te' ? 'ఆధ్యాత్మిక అవసరాలు' : 'Spiritual Essentials'}
              </p>
            </div>
          </div>

          <div className="hidden md:block w-80 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={i18n.language === 'hi' ? 'आध्यात्मिक उत्पाद खोजें...' : i18n.language === 'te' ? 'ఆధ్యాత్మిక ఉత్పత్తులను వెతకండి...' : 'Search spiritual products...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 rounded-xl border-gray-300 bg-white/80 backdrop-blur-sm"
            />
          </div>
        </div>
      </div>

      {/* Pooja Services Slider */}
      <div className="px-4 py-8 bg-gradient-to-r from-orange-50 to-amber-50/70 border-y border-orange-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <Flame className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {i18n.language === 'hi' ? 'लाइव पूजा सेवाएं' : i18n.language === 'te' ? 'లైవ్ పూజ సేవలు' : 'Live Pooja Services'}
                </h2>
                <p className="text-sm text-gray-600">
                  {i18n.language === 'hi' ? 'प्रामाणिक वैदिक अनुष्ठान ऑनलाइन बुक करें' : i18n.language === 'te' ? 'ప్రామాణికమైన వేద ఆచారాలను ఆన్‌లైన్‌లో బుక్ చేయండి' : 'Book authentic Vedic rituals online'}
                </p>
              </div>
            </div>

            <div className="hidden md:flex gap-2">
              <Button variant="outline" size="sm" onClick={prevPooja} className="w-10 h-10 p-0 rounded-lg border-orange-300 hover:bg-orange-50">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={nextPooja} className="w-10 h-10 p-0 rounded-lg border-orange-300 hover:bg-orange-50">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div
            ref={sliderRef}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-200/50 overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${sidebarPosition * 100}%)` }}
            >
              {poojServices.map((service) => {
                // Get the icon component from the mapping
                const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Flame;
                return (
                  <div key={service.id} className="w-full flex-shrink-0">
                    <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Badge className="bg-green-500 text-white border-0 px-3 py-1.5 text-sm font-medium">
                            {getText({ en: 'Live Booking', hi: 'लाइव बुकिंग', te: 'లైవ్ బుకింగ్' })}
                          </Badge>
                          <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 font-medium">
                            {getText(service.badge)}
                          </Badge>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                          {getText(service.name)}
                        </h3>
                        <p className="text-gray-600 leading-relaxed text-base">
                          {getText(service.description)}
                        </p>

                        <div className="flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-orange-500" />
                            <span className="text-gray-700 font-medium">{getText(service.duration)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="font-semibold text-gray-900">{service.rating}</span>
                            <span className="text-gray-500">({service.reviews} {getText({ en: 'reviews', hi: 'समीक्षाएं', te: 'సమీక్షలు' })})</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl md:text-3xl font-bold text-gray-900">
                              ₹{service.price.toLocaleString()}
                            </span>
                            <span className="text-lg text-gray-500 line-through">
                              ₹{service.originalPrice.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {getText(service.features).map((feature: any, index: number) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-medium"
                            >
                              {feature}
                            </Badge>
                          ))}
                        </div>

                        {/* Only View Details Button */}
                        <Button
                          onClick={() => viewPoojaDetails(service)}
                          className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white px-8 py-3 rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-300 transform hover:scale-105"
                        >
                          <Eye className="mr-2 h-5 w-5" />
                          {getText({ en: 'View Details', hi: 'विवरण देखें', te: 'వివరాలు చూడండి' })}
                        </Button>
                      </div>

                      <div className={`hidden md:flex items-center justify-center p-8 rounded-2xl bg-gradient-to-br ${service.color} h-64`}>
                        <div className="w-24 h-24 bg-white/90 rounded-2xl shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                          <IconComponent className="h-12 w-12 text-orange-600" />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pooja Slider Dots */}
            <div className="flex justify-center gap-2 pb-6">
              {poojServices.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSidebarPosition(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === sidebarPosition
                    ? 'bg-orange-600 scale-125'
                    : 'bg-orange-300 hover:bg-orange-400'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Spiritual Products Store Heading */}
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {getText({ en: 'DivineStore', hi: 'दिव्य स्टोर', te: 'దివ్య స్టోర్' })}
            </h2>
            <p className="text-gray-600 font-medium">
              {getText({ en: 'Spiritual Essentials', hi: 'आध्यात्मिक आवश्यकताएं', te: 'ఆధ్యాత్మిక అవసరాలు' })}
            </p>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {getText({ en: 'Spiritual Products', hi: 'आध्यात्मिक उत्पाद', te: 'ఆధ్యాత్మిక ఉత్పత్తులు' })}
        </h3>
        <p className="text-gray-600 mb-6">
          {getText({
            en: 'Curated sacred items and spiritual essentials for your journey',
            hi: 'आपकी यात्रा के लिए क्यूरेटेड पवित्र वस्तुएं और आध्यात्मिक आवश्यकताएं',
            te: 'మీ ప్రయాణం కోసం క్యూరేటెడ్ పవిత్ర వస్తువులు మరియు ఆధ్యాత్మిక అవసరాలు'
          })}
        </p>
      </div>

      {/* Product Grid */}
      <div className="px-4 pb-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="p-4">

                {/* IMAGE */}
                <div className="relative mb-3">
                  <div
                    className={`aspect-square rounded-lg bg-gradient-to-br ${product.imageColor}
                                flex items-center justify-center overflow-hidden`}
                  >
                    <div className="w-12 h-12 bg-white/80 rounded-lg flex items-center justify-center shadow">
                      <Sparkles className="h-6 w-6 text-amber-600" />
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-2 left-2 flex gap-1">
                    {product.tag && (
                      <Badge className={`${product.tagColor} text-white border-0 text-[10px] px-2 py-0.5`}>
                        {getText(product.tag)}
                      </Badge>
                    )}
                  </div>

                  {product.discount && (
                    <Badge className="absolute top-2 right-2 bg-red-500 text-white border-0 text-[10px] px-2 py-0.5">
                      {product.discount}% OFF
                    </Badge>
                  )}
                </div>

                {/* CATEGORY + RATING */}
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-gray-100 text-gray-700 border-0 text-[10px] px-2 py-0.5">
                    {product.category}
                  </Badge>

                  <div className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-[11px] font-semibold">{product.rating}</span>
                    <span className="text-[10px] text-gray-400">({product.reviews})</span>
                  </div>
                </div>

                {/* NAME */}
                <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-1 line-clamp-2">
                  {getText(product.name)}
                </h3>

                {/* DESCRIPTION */}
                <p className="text-gray-600 text-[11px] leading-relaxed mb-2 line-clamp-2">
                  {getText(product.description)}
                </p>

                {/* PRICE */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* BUTTON */}
                <Button
                  onClick={() => viewProduct(product)}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 rounded-lg text-[13px] flex items-center justify-center gap-1"
                >
                  <ExternalLink className="h-4 w-4" />
                  {getText({ en: 'View on Amazon', hi: 'अमेज़न पर देखें', te: 'అమెజాన్‌లో చూడండి' })}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpiritualStore;