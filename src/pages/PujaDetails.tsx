import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  Star, 
  Heart, 
  CheckCircle, 
  Phone, 
  User, 
  Mail,
  ChevronDown,
  ChevronUp,
  Play,
  Shield,
  Gift,
  Sparkles,
  X,
  IndianRupee,
  Award,
  ShieldCheck,
  Zap,
  BookOpen,
  MapPin,
  Video
} from 'lucide-react';
import { toast } from 'sonner';

const PujaDetails: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPackage, setSelectedPackage] = useState('family');
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [callbackData, setCallbackData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  // Package data
  const packages = [
    {
      id: 'single',
      name: {
        en: 'Single Person',
        hi: 'एक व्यक्ति'
      },
      description: {
        en: 'Perfect for individual spiritual needs',
        hi: 'व्यक्तिगत आध्यात्मिक आवश्यकताओं के लिए उपयुक्त'
      },
      price: 4999,
      originalPrice: 6999,
      savings: 2000,
      features: [
        { en: 'Personalized prayers', hi: 'व्यक्तिगत प्रार्थनाएं' },
        { en: 'Single person blessings', hi: 'एक व्यक्ति के लिए आशीर्वाद' },
        { en: 'Digital prasadam', hi: 'डिजिटल प्रसाद' },
        { en: 'Live streaming access', hi: 'लाइव स्ट्रीमिंग पहुंच' }
      ],
      recommended: false,
      icon: User,
      color: 'blue'
    },
    {
      id: 'couple',
      name: {
        en: 'Couple',
        hi: 'जोड़ा'
      },
      description: {
        en: 'Blessings for you and your partner',
        hi: 'आप और आपके साथी के लिए आशीर्वाद'
      },
      price: 7999,
      originalPrice: 9999,
      savings: 2000,
      features: [
        { en: 'Couple specific prayers', hi: 'जोड़े के लिए विशेष प्रार्थनाएं' },
        { en: 'Relationship blessings', hi: 'संबंधों के लिए आशीर्वाद' },
        { en: 'Double prasadam', hi: 'दोहरा प्रसाद' },
        { en: 'Live streaming access', hi: 'लाइव स्ट्रीमिंग पहुंच' },
        { en: 'Priority prayers', hi: 'प्राथमिकता प्रार्थनाएं' }
      ],
      recommended: false,
      icon: Users,
      color: 'purple'
    },
    {
      id: 'family',
      name: {
        en: 'Family Pack',
        hi: 'परिवार पैक'
      },
      description: {
        en: 'Complete family blessings and prosperity',
        hi: 'संपूर्ण परिवार के लिए आशीर्वाद और समृद्धि'
      },
      price: 12999,
      originalPrice: 15999,
      savings: 3000,
      features: [
        { en: 'Complete family prayers', hi: 'संपूर्ण परिवार की प्रार्थनाएं' },
        { en: 'Health & prosperity blessings', hi: 'स्वास्थ्य और समृद्धि आशीर्वाद' },
        { en: 'Family prasadam pack', hi: 'परिवार प्रसाद पैक' },
        { en: 'Live streaming access', hi: 'लाइव स्ट्रीमिंग पहुंच' },
        { en: 'Priority prayers', hi: 'प्राथमिकता प्रार्थनाएं' },
        { en: 'Digital certificate', hi: 'डिजिटल प्रमाणपत्र' },
        { en: '1-year blessings', hi: '1-वर्ष का आशीर्वाद' }
      ],
      recommended: true,
      icon: Award,
      color: 'orange'
    }
  ];

  // Puja data
  const pujaData = {
    id: 'satyanarayan',
    name: 'Satyanarayan Pooja',
    description: 'Weekly pooja for family harmony and success with full family participation',
    fullDescription: `Satyanarayan Pooja is performed to seek the blessings of Lord Vishnu for family harmony, success, and overall well-being. This sacred ritual brings peace and prosperity to the entire household. The ceremony involves chanting of sacred mantras, offering prayers, and performing rituals that create positive energy and divine blessings for your family.`,
    duration: '2 hours',
    rating: 4.8,
    reviews: 287,
    features: ['Live Streaming', 'Prasad Delivery', 'Certified Priests', 'Family Participation', 'Digital Certificate'],
    badge: 'Family Favorite',
    location: 'Varanasi, India',
    language: 'Sanskrit & Hindi'
  };

  // How it works steps
  const howItWorks = [
    {
      step: 1,
      title: { en: 'Select Package', hi: 'पैकेज चुनें' },
      description: { en: 'Choose the perfect package for your spiritual journey', hi: 'अपनी आध्यात्मिक यात्रा के लिए सही पैकेज चुनें' },
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      step: 2,
      title: { en: 'Provide Details', hi: 'विवरण दें' },
      description: { en: 'Share names and specific prayer requests', hi: 'नाम और विशेष प्रार्थना अनुरोध साझा करें' },
      icon: User,
      color: 'from-purple-500 to-pink-500'
    },
    {
      step: 3,
      title: { en: 'Live Ceremony', hi: 'लाइव समारोह' },
      description: { en: 'Watch the sacred ritual live from anywhere', hi: 'कहीं से भी पवित्र अनुष्ठान लाइव देखें' },
      icon: Play,
      color: 'from-green-500 to-emerald-500'
    },
    {
      step: 4,
      title: { en: 'Receive Blessings', hi: 'आशीर्वाद प्राप्त करें' },
      description: { en: 'Get divine blessings and sacred prasadam', hi: 'दिव्य आशीर्वाद और पवित्र प्रसाद प्राप्त करें' },
      icon: Sparkles,
      color: 'from-orange-500 to-amber-500'
    }
  ];

  // Benefits data
  const benefits = [
    {
      icon: ShieldCheck,
      title: { en: 'Family Harmony', hi: 'पारिवारिक सद्भाव' },
      description: { en: 'Strengthen family bonds and resolve conflicts', hi: 'पारिवारिक बंधन मजबूत करें और संघर्षों का समाधान करें' },
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: Gift,
      title: { en: 'Success & Prosperity', hi: 'सफलता और समृद्धि' },
      description: { en: 'Attract success in career and financial growth', hi: 'करियर और वित्तीय विकास में सफलता आकर्षित करें' },
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: Heart,
      title: { en: 'Health & Well-being', hi: 'स्वास्थ्य और कल्याण' },
      description: { en: 'Improve physical health and mental peace', hi: 'शारीरिक स्वास्थ्य और मानसिक शांति में सुधार' },
      color: 'text-pink-600 bg-pink-100'
    },
    {
      icon: Zap,
      title: { en: 'Spiritual Growth', hi: 'आध्यात्मिक विकास' },
      description: { en: 'Accelerate your spiritual journey and inner peace', hi: 'अपनी आध्यात्मिक यात्रा और आंतरिक शांति को गति दें' },
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  // FAQ data
  const faqs = [
    {
      question: { en: 'How long does the puja take?', hi: 'पूजा में कितना समय लगता है?' },
      answer: { en: 'The complete ritual takes approximately 2 hours, including preparation and main ceremony. You will receive a detailed schedule after booking.', hi: 'संपूर्ण अनुष्ठान में तैयारी और मुख्य समारोह सहित लगभग 2 घंटे लगते हैं। बुकिंग के बाद आपको विस्तृत समय सारणी प्राप्त होगी।' }
    },
    {
      question: { en: 'Can I watch the puja live?', hi: 'क्या मैं पूजा लाइव देख सकता हूं?' },
      answer: { en: 'Yes! All packages include secure live streaming access. You will receive a private link to watch the ceremony from anywhere.', hi: 'हां! सभी पैकेजों में सुरक्षित लाइव स्ट्रीमिंग पहुंच शामिल है। आपको कहीं से भी समारोह देखने के लिए एक निजी लिंक प्राप्त होगा।' }
    },
    {
      question: { en: 'When will I receive prasadam?', hi: 'मुझे प्रसाद कब मिलेगा?' },
      answer: { en: 'Prasadam is carefully prepared and dispatched within 3-5 business days after the puja completion. We provide tracking details.', hi: 'प्रसाद सावधानीपूर्वक तैयार किया जाता है और पूजा पूरी होने के 3-5 कार्यदिवसों के भीतर भेज दिया जाता है। हम ट्रैकिंग विवरण प्रदान करते हैं।' }
    },
    {
      question: { en: 'What is your cancellation policy?', hi: 'आपकी कैंसिलेशन पॉलिसी क्या है?' },
      answer: { en: 'You can cancel up to 24 hours before the scheduled puja for a full refund. We understand that plans may change.', hi: 'निर्धारित पूजा से 24 घंटे पहले तक आप पूर्ण धनवापसी के लिए रद्द कर सकते हैं। हम समझते हैं कि योजनाएं बदल सकती हैं।' }
    }
  ];

  const getLocalizedText = (text: { en: string; hi: string }) => {
    return i18n.language === 'hi' ? text.hi : text.en;
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
    toast.success(getLocalizedText({ 
      en: 'Package selected!', 
      hi: 'पैकेज चयनित!' 
    }));
  };

  const handleFaqToggle = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(
      i18n.language === 'hi' 
        ? 'हम जल्द ही आपसे संपर्क करेंगे! 🙏' 
        : 'We will contact you shortly! 🙏'
    );
    setShowCallbackForm(false);
    setCallbackData({ name: '', phone: '', email: '', message: '' });
  };

  const handleInputChange = (field: string, value: string) => {
    setCallbackData(prev => ({ ...prev, [field]: value }));
  };

  const handleBookNow = () => {
    setIsBooking(true);
    const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);
    
    setTimeout(() => {
      toast.success(getLocalizedText({
        en: 'Booking initiated! 🎉',
        hi: 'बुकिंग प्रारंभ! 🎉'
      }));
      setIsBooking(false);
    }, 1500);
  };

  const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-cyan-500',
      purple: 'from-purple-500 to-pink-500',
      orange: 'from-orange-500 to-amber-500',
      green: 'from-green-500 to-emerald-500'
    };
    return colors[color as keyof typeof colors] || colors.orange;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Button
              onClick={handleBackClick}
              variant="ghost"
              size="icon"
              className="h-10 w-10 text-slate-700 hover:bg-slate-100 rounded-xl"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-slate-900">
                {i18n.language === 'hi' ? 'पूजा विवरण' : 'Puja Details'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {i18n.language === 'hi' ? 'दिव्य अनुभव की ओर' : 'Towards divine experience'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pb-28">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-6 py-6">
            {/* Badge and Rating */}
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm text-xs">
                {pujaData.badge}
              </Badge>
              <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                <Star className="h-3 w-3 fill-current" />
                <span className="text-sm font-medium">{pujaData.rating}</span>
                <span className="text-white/80 text-sm">({pujaData.reviews})</span>
              </div>
            </div>

            {/* Puja Title and Description */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 leading-tight">{pujaData.name}</h2>
              <p className="text-white/90 text-sm leading-relaxed">{pujaData.description}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20">
              <div className="text-center">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                  <Clock className="h-5 w-5" />
                </div>
                <p className="text-white/80 text-xs mb-1">{i18n.language === 'hi' ? 'अवधि' : 'Duration'}</p>
                <p className="font-semibold text-sm">{pujaData.duration}</p>
              </div>

              <div className="text-center">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                  <Video className="h-5 w-5" />
                </div>
                <p className="text-white/80 text-xs mb-1">{i18n.language === 'hi' ? 'लाइव' : 'Live'}</p>
                <p className="font-semibold text-sm">Streaming</p>
              </div>

              <div className="text-center">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-2 backdrop-blur-sm">
                  <Award className="h-5 w-5" />
                </div>
                <p className="text-white/80 text-xs mb-1">{i18n.language === 'hi' ? 'प्रमाणित' : 'Certified'}</p>
                <p className="font-semibold text-sm">Priests</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="sticky top-16 z-40 bg-white border-b border-slate-200 shadow-sm">
          <div className="flex overflow-x-auto gap-1 px-4 py-3 scrollbar-hide">
            {[
              { id: 'overview', label: { en: 'Overview', hi: 'अवलोकन' }, icon: BookOpen },
              { id: 'packages', label: { en: 'Packages', hi: 'पैकेज' }, icon: Gift },
              { id: 'how-it-works', label: { en: 'How It Works', hi: 'कैसे काम करता है' }, icon: Play },
              { id: 'benefits', label: { en: 'Benefits', hi: 'लाभ' }, icon: Heart },
              { id: 'faq', label: { en: 'FAQ', hi: 'सवाल-जवाब' }, icon: Shield }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap text-sm transition-all flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-orange-500 text-white shadow-sm shadow-orange-200'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  {getLocalizedText(tab.label)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 py-6 space-y-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-orange-500" />
                  {i18n.language === 'hi' ? 'पूजा के बारे में' : 'About This Puja'}
                </h3>
                <p className="text-slate-700 leading-relaxed text-sm">
                  {pujaData.fullDescription}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                    <MapPin className="h-4 w-4 text-slate-600" />
                    <div>
                      <p className="text-xs text-slate-500">{i18n.language === 'hi' ? 'स्थान' : 'Location'}</p>
                      <p className="text-sm font-medium text-slate-800">{pujaData.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                    <Users className="h-4 w-4 text-slate-600" />
                    <div>
                      <p className="text-xs text-slate-500">{i18n.language === 'hi' ? 'भाषा' : 'Language'}</p>
                      <p className="text-sm font-medium text-slate-800">{pujaData.language}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  {i18n.language === 'hi' ? 'शामिल सेवाएं' : 'What\'s Included'}
                </h3>
                <div className="grid gap-3">
                  {pujaData.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-slate-800 font-medium text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Packages Tab */}
          {activeTab === 'packages' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {i18n.language === 'hi' ? 'अपना पैकेज चुनें' : 'Choose Your Package'}
                </h3>
                <p className="text-slate-600 text-sm">
                  {i18n.language === 'hi' 
                    ? 'अपनी आवश्यकताओं के अनुरूप सही पैकेज चुनें'
                    : 'Select the perfect package for your spiritual needs'}
                </p>
              </div>

              <div className="space-y-4">
                {packages.map((pkg) => {
                  const IconComponent = pkg.icon;
                  const isSelected = selectedPackage === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      className={`relative rounded-2xl p-5 border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50 shadow-lg shadow-orange-200'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      } ${pkg.recommended ? 'ring-2 ring-orange-400 ring-opacity-50' : ''}`}
                      onClick={() => handlePackageSelect(pkg.id)}
                    >
                      {pkg.recommended && (
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1 text-xs border-0 shadow-sm">
                            {i18n.language === 'hi' ? 'सर्वाधिक लोकप्रिय' : 'Most Popular'}
                          </Badge>
                        </div>
                      )}

                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 bg-gradient-to-r ${getColorClasses(pkg.color)} rounded-xl flex items-center justify-center shadow-sm`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-lg">{getLocalizedText(pkg.name)}</h4>
                            <p className="text-slate-600 text-sm">{getLocalizedText(pkg.description)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-end justify-between mb-4">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-slate-900">₹{pkg.price}</span>
                            <span className="text-sm text-slate-500 line-through">₹{pkg.originalPrice}</span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                              Save ₹{pkg.savings}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        {pkg.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span className="text-slate-700 text-sm">{getLocalizedText(feature)}</span>
                          </div>
                        ))}
                      </div>

                      <Button
                        className={`w-full font-semibold ${
                          isSelected
                            ? 'bg-orange-500 hover:bg-orange-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isSelected
                          ? (i18n.language === 'hi' ? '✓ चयनित' : '✓ Selected')
                          : (i18n.language === 'hi' ? 'चुनें' : 'Select')}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* How It Works Tab */}
          {activeTab === 'how-it-works' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {i18n.language === 'hi' ? 'सरल प्रक्रिया' : 'Simple Process'}
                </h3>
                <p className="text-slate-600 text-sm">
                  {i18n.language === 'hi' 
                    ? 'केवल 4 आसान चरणों में दिव्य अनुभव प्राप्त करें'
                    : 'Experience divinity in just 4 easy steps'}
                </p>
              </div>

              <div className="space-y-4">
                {howItWorks.map((step, index) => {
                  const IconComponent = step.icon;
                  return (
                    <div key={step.step} className="flex items-start gap-4">
                      <div className="relative flex-shrink-0">
                        <div className={`w-14 h-14 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white border-2 border-slate-200 text-slate-700 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                          {step.step}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 pt-1">
                        <h4 className="font-bold text-slate-900 mb-1 text-sm">
                          {getLocalizedText(step.title)}
                        </h4>
                        <p className="text-slate-600 text-xs leading-relaxed">
                          {getLocalizedText(step.description)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Benefits Tab */}
          {activeTab === 'benefits' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {i18n.language === 'hi' ? 'आशीर्वाद और लाभ' : 'Divine Blessings & Benefits'}
                </h3>
                <p className="text-slate-600 text-sm">
                  {i18n.language === 'hi' 
                    ? 'इस पवित्र अनुष्ठान से प्राप्त होने वाले आध्यात्मिक लाभ'
                    : 'Spiritual benefits you receive from this sacred ritual'}
                </p>
              </div>

              <div className="grid gap-4">
                {benefits.map((benefit, index) => {
                  const IconComponent = benefit.icon;
                  return (
                    <div key={index} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                      <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 ${benefit.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 mb-1 text-sm">
                            {getLocalizedText(benefit.title)}
                          </h4>
                          <p className="text-slate-600 text-xs leading-relaxed">
                            {getLocalizedText(benefit.description)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* FAQ Tab */}
          {activeTab === 'faq' && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {i18n.language === 'hi' ? 'सामान्य प्रश्न' : 'Common Questions'}
                </h3>
                <p className="text-slate-600 text-sm">
                  {i18n.language === 'hi' 
                    ? 'आपके मन में उठने वाले सवालों के जवाब'
                    : 'Answers to questions you might have'}
                </p>
              </div>
              
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <button
                      className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-50 transition-colors"
                      onClick={() => handleFaqToggle(index)}
                    >
                      <span className="font-semibold text-slate-900 text-sm flex-1 mr-3 leading-relaxed">
                        {getLocalizedText(faq.question)}
                      </span>
                      {expandedFaq === index ? (
                        <ChevronUp className="h-4 w-4 text-slate-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-500 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFaq === index && (
                      <div className="p-4 bg-slate-50 border-t border-slate-200">
                        <p className="text-slate-700 text-sm leading-relaxed">{getLocalizedText(faq.answer)}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Action Buttons - Improved Layout */}
      <div className="fixed bottom-16 sm:bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-2xl p-4">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between gap-3">
            {/* Package Info */}
            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-600 mb-1">
                {i18n.language === 'hi' ? 'चयनित पैकेज' : 'Selected Package'}
              </div>
              <div className="font-bold text-slate-900 text-sm truncate">
                {selectedPkg ? getLocalizedText(selectedPkg.name) : ''}
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-bold text-slate-900">₹{selectedPkg?.price}</span>
                <span className="text-slate-500 text-sm line-through">₹{selectedPkg?.originalPrice}</span>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2 flex-shrink-0">
              <Button
                onClick={() => setShowCallbackForm(true)}
                variant="outline"
                size="sm"
                className="border-slate-300 text-slate-700 hover:bg-slate-100 h-11 px-3 rounded-xl flex items-center gap-2"
              >
                <Phone className="h-4 w-4" />
                <span className="text-xs hidden sm:inline">{i18n.language === 'hi' ? 'कॉल बैक' : 'Call'}</span>
              </Button>
              
              <Button
                onClick={handleBookNow}
                disabled={isBooking}
                size="sm"
                className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white h-11 px-4 rounded-xl shadow-lg shadow-orange-200 flex items-center gap-2 min-w-24"
              >
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-semibold">
                  {isBooking 
                    ? (i18n.language === 'hi' ? '...' : '...')
                    : (i18n.language === 'hi' ? 'बुक करें' : 'Book')
                  }
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Callback Form Modal */}
      {showCallbackForm && (
        <div className="fixed bottom-32 inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {i18n.language === 'hi' ? 'कॉल बैक अनुरोध' : 'Request Call Back'}
                </h3>
                <p className="text-slate-600 text-sm mt-1">
                  {i18n.language === 'hi' 
                    ? 'हम 24 घंटे में आपसे संपर्क करेंगे'
                    : 'We\'ll contact you within 24 hours'}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowCallbackForm(false)}
                className="h-8 w-8 text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleCallbackSubmit} className="p-4 space-y-4">
              <div>
                <Label htmlFor="name" className="text-slate-900 text-sm font-medium">
                  {i18n.language === 'hi' ? 'आपका नाम' : 'Your Name'} *
                </Label>
                <Input
                  id="name"
                  value={callbackData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                  className="mt-2 border-slate-300 focus:border-orange-500 text-sm rounded-lg h-12"
                  placeholder={i18n.language === 'hi' ? 'अपना पूरा नाम दर्ज करें' : 'Enter your full name'}
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-slate-900 text-sm font-medium">
                  {i18n.language === 'hi' ? 'मोबाइल नंबर' : 'Mobile Number'} *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={callbackData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                  className="mt-2 border-slate-300 focus:border-orange-500 text-sm rounded-lg h-12"
                  placeholder={i18n.language === 'hi' ? 'अपना मोबाइल नंबर दर्ज करें' : 'Enter your mobile number'}
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-slate-900 text-sm font-medium">
                  {i18n.language === 'hi' ? 'ईमेल' : 'Email'}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={callbackData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="mt-2 border-slate-300 focus:border-orange-500 text-sm rounded-lg h-12"
                  placeholder={i18n.language === 'hi' ? 'अपना ईमेल दर्ज करें' : 'Enter your email address'}
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-slate-900 text-sm font-medium">
                  {i18n.language === 'hi' ? 'अतिरिक्त जानकारी' : 'Additional Information'}
                </Label>
                <Textarea
                  id="message"
                  value={callbackData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="mt-2 border-slate-300 focus:border-orange-500 text-sm rounded-lg"
                  placeholder={i18n.language === 'hi' ? 'कोई विशेष अनुरोध या प्रश्न...' : 'Any special requests or questions...'}
                  rows={3}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-sm font-semibold py-3 rounded-lg shadow-lg shadow-orange-200"
              >
                <Phone className="h-4 w-4 mr-2" />
                {i18n.language === 'hi' ? 'कॉल बैक अनुरोध भेजें' : 'Request Call Back'}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PujaDetails;