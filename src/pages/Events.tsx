import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getUpcomingEvents, Event } from '@/services/api';
import { Calendar, MapPin, Clock, Star, Users, Info, X, Moon, Sun, Droplets, Flame, BookOpen, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface LocalizedString {
  en: string;
  hi: string;
  te: string;
}

interface LocalizedArray {
  en: string[];
  hi: string[];
  te: string[];
}

interface FestivalDetails {
  id: string;
  significance: LocalizedString;
  rituals: LocalizedArray;
  duration: LocalizedString;
  bestTime: LocalizedString;
  benefits: LocalizedArray;
  mantra: string;
  custom: LocalizedString;
  preparation: LocalizedArray;
  spiritualMeaning: LocalizedString;
  pujaItems: LocalizedArray;
}

// Extended Event type used locally in this file to include computed fields
interface ExtendedEvent extends Omit<Event, 'description'> {
  description: string | LocalizedString;
  isUpcoming?: boolean;
  daysUntil?: number;
  shortDescription?: LocalizedString;
}

const Events: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState<ExtendedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<ExtendedEvent | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentYear] = useState(new Date().getFullYear());

  const getText = (obj: any): string => {
    if (!obj) return '';
    if (typeof obj === 'string') return obj;
    if (i18n.language === 'hi') return obj.hi || obj.en;
    if (i18n.language === 'te') return obj.te || obj.en;
    return obj.en;
  };

  const getList = (obj: LocalizedArray): string[] => {
    if (!obj) return [];
    if (i18n.language === 'hi') return obj.hi || obj.en;
    if (i18n.language === 'te') return obj.te || obj.en;
    return obj.en;
  };

  // Dynamic festival dates for different years
  const getFestivalDate = (festivalName: string, year: number): string => {
    const festivalDates: Record<string, Record<number, string>> = {
      'Maha Shivaratri': {
        2024: '2024-03-08',
        2025: '2025-02-26',
        2026: '2026-02-15',
        2027: '2027-03-06'
      },
      'Holi': {
        2024: '2024-03-25',
        2025: '2025-03-14',
        2026: '2026-03-03',
        2027: '2027-03-22'
      },
      'Diwali': {
        2024: '2024-10-31',
        2025: '2025-10-20',
        2026: '2026-11-08',
        2027: '2027-10-29'
      },
      'Navratri': {
        2024: '2024-10-03',
        2025: '2025-09-22',
        2026: '2026-09-11',
        2027: '2027-09-30'
      },
      'Ganesh Chaturthi': {
        2024: '2024-09-07',
        2025: '2025-08-27',
        2026: '2026-09-15',
        2027: '2027-09-04'
      },
      'Janmashtami': {
        2024: '2024-08-26',
        2025: '2025-08-15',
        2026: '2026-09-04',
        2027: '2027-08-24'
      },
      'Raksha Bandhan': {
        2024: '2024-08-19',
        2025: '2025-08-09',
        2026: '2026-08-28',
        2027: '2027-08-17'
      },
      'Makar Sankranti': {
        2024: '2024-01-14',
        2025: '2025-01-14',
        2026: '2026-01-14',
        2027: '2027-01-14'
      },
      'Ram Navami': {
        2024: '2024-04-17',
        2025: '2025-04-06',
        2026: '2026-03-27',
        2027: '2027-04-15'
      },
      'Hanuman Jayanti': {
        2024: '2024-04-23',
        2025: '2025-04-12',
        2026: '2026-04-01',
        2027: '2027-04-20'
      }
    };

    return festivalDates[festivalName]?.[year] || `${year}-01-01`;
  };

  // Festival details data - COMPLETE for all festivals
  const festivalDetails: Record<string, FestivalDetails> = {
    'Maha Shivaratri': {
      id: '1',
      significance: {
        en: 'The Great Night of Shiva, one of the most significant Hindu festivals dedicated to Lord Shiva. It marks the convergence of Shiva and Shakti.',
        hi: 'शिव की महान रात्रि, भगवान शिव को समर्पित सबसे महत्वपूर्ण हिंदू त्योहारों में से एक। यह शिव और शक्ति के मिलन का प्रतीक है।',
        te: 'శివుని గొప్ప రాత్రి, శివునికి అంకితం చేయబడిన అత్యంత ముఖ్యమైన హిందూ పండుగలలో ఒకటి. ఇది శివ మరియు శక్తి కలయికను సూచిస్తుంది.'
      },
      rituals: {
        en: ['Day and night fasting', 'Shiva Linga Abhishekam', 'Panchamrit Abhishek', 'Bilva leaves offering', 'Rudra Abhishek', 'All-night vigil'],
        hi: ['दिन और रात का उपवास', 'शिव लिंग अभिषेक', 'पंचामृत अभिषेक', 'बिल्व पत्र अर्पण', 'रुद्र अभिषेक', 'रात्रि जागरण'],
        te: ['పగలు మరియు రాత్రి ఉపవాసం', 'శివ లింగ అభిషేకం', 'పంచామృత అభిషేకం', 'బిల్వ ఆకుల సమర్పణ', 'రుద్ర అభిషేకం', 'రాత్రి జాగరణ']
      },
      duration: { en: '24 hours', hi: '24 घंटे', te: '24 గంటలు' },
      bestTime: { en: 'Midnight (Nishita Kaal)', hi: 'मध्यरात्रि (निशिता काल)', te: 'అర్ధరాత్రి (నిశిత కాలం)' },
      benefits: {
        en: ['Moksha', 'Marital bliss', 'Removal of sins', 'Fulfillment of wishes', 'Protection', 'Enlightenment'],
        hi: ['मोक्ष', 'वैवाहिक सुख', 'पापों का नाश', 'इच्छाओं की पूर्ति', 'सुरक्षा', 'आत्मज्ञान'],
        te: ['మోక్షం', 'వైవాహిక ఆనందం', 'పాపాల తొలగింపు', 'కోరికల నెరవేర్పు', 'రక్షణ', 'జ్ఞానోదయం']
      },
      mantra: 'ॐ नमः शिवाय',
      custom: {
        en: 'Wearing Rudraksha beads and applying sacred ash (Vibhuti)',
        hi: 'रुद्राक्ष की माला पहनना और पवित्र भस्म (विभूति) लगाना',
        te: 'రుద్రాక్ష మాల ధరించడం మరియు పవిత్ర భస్మం (విభూతి) ధరించడం'
      },
      preparation: {
        en: ['Early morning bath', 'Prepare Panchamrit', 'Clean puja area', 'Prepare fruits', 'Meditation'],
        hi: ['सुबह जल्दी स्नान', 'पंचामृत तैयार करें', 'पूजा क्षेत्र की सफाई', 'फल तैयार करें', 'ध्यान'],
        te: ['ఉదయాన్నే స్నానం', 'పంచామృతం తయారీ', 'పూజ గది శుభ్రం', 'పండ్లు సిద్ధం', 'ధ్యానం']
      },
      spiritualMeaning: {
        en: 'Overcoming darkness and ignorance in life.',
        hi: 'जीवन में अंधकार और अज्ञान पर विजय प्राप्त करना।',
        te: 'జీవితంలో చీకటి మరియు అజ్ఞానాన్ని జయించడం.'
      },
      pujaItems: {
        en: ['Shiva Linga', 'Bilva leaves', 'Milk, Yogurt, Honey', 'Dhatura flowers', 'Rudraksha'],
        hi: ['शिव लिंग', 'बिल्व पत्र', 'दूध, दही, शहद', 'धतूरा के फूल', 'रुद्राक्ष'],
        te: ['శివ లింగం', 'బిల్వ ఆకులు', 'పాలు, పెరుగు, తేనె', 'ధతురా పువ్వులు', 'రుద్రాక్ష']
      }
    },
    'Holi': {
      id: '2',
      significance: {
        en: 'Festival of colors celebrating the victory of good over evil and the arrival of spring.',
        hi: 'रंगों का त्योहार जो बुराई पर अच्छाई की जीत और वसंत के आगमन का जश्न मनाता है।',
        te: 'చెడుపై మంచి విజయం మరియు వసంత రాకను జరుపుకునే రంగుల పండుగ.'
      },
      rituals: {
        en: ['Holika Dahan', 'Playing with colors', 'Visiting friends', 'Traditional songs', 'Bhang preparations'],
        hi: ['होलिका दहन', 'रंगों से खेलना', 'दोस्तों से मिलना', 'पारंपरिक गीत', 'भांग की तैयारी'],
        te: ['హోలికా దహనం', 'రంగులతో ఆడుకోవడం', 'స్నేహితులను కలవడం', 'సాంప్రదాయ పాటలు', 'భాంగ్ తయారీ']
      },
      duration: { en: '2 days', hi: '2 दिन', te: '2 రోజులు' },
      bestTime: { en: 'Morning to afternoon', hi: 'सुबह से दोपहर तक', te: 'ఉదయం నుండి మధ్యాహ్నం వరకు' },
      benefits: {
        en: ['Destroys negativity', 'Social harmony', 'Joy and stress relief', 'Forgiveness', 'Unity'],
        hi: ['नकारात्मकता का नाश', 'सामाजिक सद्भाव', 'आनंद और तनाव मुक्ति', 'क्षमा', 'एकता'],
        te: ['ప్రతికూలతను నాశనం చేస్తుంది', 'సామాజిక సామరస్యం', 'ఆనందం మరియు ఒత్తిడి ఉపశమనం', 'క్షమాపణ', 'ఐక్యత']
      },
      mantra: 'ॐ प्रह्लादाय नमः',
      custom: {
        en: 'Wearing white clothes, exchanging sweets like Gujiya',
        hi: 'सफेद कपड़े पहनना, गुजिया जैसी मिठाइयों का आदान-प्रदान',
        te: 'తెల్లని బట్టలు ధరించడం, గుజియా వంటి స్వీట్లు పంచుకోవడం'
      },
      preparation: {
        en: ['Collect organic colors', 'Prepare Holika', 'Make sweets', 'Arrange music'],
        hi: ['जैविक रंग इकट्ठा करें', 'होलिका तैयार करें', 'मिठाई बनाएं', 'संगीत की व्यवस्था'],
        te: ['సేంద్రీయ రంగులు సేకరించడం', 'హోలికా తయారీ', 'స్వీట్లు చేయడం', 'సంగీతం ఏర్పాటు']
      },
      spiritualMeaning: {
        en: 'Burning of ego and embracing divine love.',
        hi: 'अहंकार का दहन और दिव्य प्रेम को अपनाना।',
        te: 'అహంకారాన్ని దహనం చేయడం మరియు దివ్య ప్రేమను స్వీకరించడం.'
      },
      pujaItems: {
        en: ['Wood for Holika', 'Organic colors', 'Sweets', 'Flowers', 'Incense'],
        hi: ['होलिका के लिए लकड़ी', 'जैविक रंग', 'मिठाई', 'फूल', 'अगरबत्ती'],
        te: ['హోలికా కోసం కర్రలు', 'సేంద్రీయ రంగులు', 'స్వీట్లు', 'పువ్వులు', 'ధూపం']
      }
    },
    'Diwali': {
      id: '3',
      significance: {
        en: 'Festival of Lights celebrating the victory of light over darkness.',
        hi: 'प्रकाश का त्योहार जो अंधकार पर प्रकाश की जीत का जश्न मनाता है।',
        te: 'చీకటిపై కాంతి విజయాన్ని జరుపుకునే దీపాల పండుగ.'
      },
      rituals: {
        en: ['Lakshmi-Ganesh Puja', 'Lighting diyas', 'Fireworks', 'Exchanging gifts', 'Cleaning homes'],
        hi: ['लक्ष्मी-गणेश पूजा', 'दीये जलाना', 'आतिशबाजी', 'उपहारों का आदान-प्रदान', 'घर की सफाई'],
        te: ['లక్ష్మీ-గణేశ పూజ', 'దీపాలు వెలిగించడం', 'బాణాసంచా', 'బహుమతుల మార్పిడి', 'ఇంటి శుభ్రత']
      },
      duration: { en: '5 days', hi: '5 दिन', te: '5 రోజులు' },
      bestTime: { en: 'Evening', hi: 'शाम', te: 'సాయంత్రం' },
      benefits: {
        en: ['Wealth', 'Enlightenment', 'Harmony', 'Positivity', 'Success'],
        hi: ['धन', 'आत्मज्ञान', 'सद्भाव', 'सकारात्मकता', 'सफलता'],
        te: ['సంపద', 'జ్ఞానోదయం', 'సామరస్యం', 'సానుకూలత', 'విజయం']
      },
      mantra: 'ॐ महालक्ष्म्यै च विद्महे',
      custom: {
        en: 'Wearing new clothes, decorating with rangoli',
        hi: 'नए कपड़े पहनना, रंगोली से सजाना',
        te: 'కొత్త బట్టలు ధరించడం, రంగోలితో అలంకరించడం'
      },
      preparation: {
        en: ['Deep cleaning', 'Shopping', 'Sweets preparation', 'Decoration'],
        hi: ['गहरी सफाई', 'खरीदारी', 'मिठाई की तैयारी', 'सजावट'],
        te: ['డీప్ క్లీనింగ్', 'షాపింగ్', 'స్వీట్ల తయారీ', 'అలంకరణ']
      },
      spiritualMeaning: {
        en: 'Inner light protecting from spiritual darkness.',
        hi: 'आंतरिक प्रकाश आध्यात्मिक अंधकार से रक्षा करता है।',
        te: 'ఆధ్యాత్మిక చీకటి నుండి రక్షించే అంతర్గత కాంతి.'
      },
      pujaItems: {
        en: ['Idols', 'Diyas', 'Rangoli colors', 'Sweets', 'Flowers'],
        hi: ['मूर्तियां', 'दीये', 'रंगोली के रंग', 'मिठाई', 'फूल'],
        te: ['విగ్రహాలు', 'దీపాలు', 'రంగోలి రంగులు', 'స్వీట్లు', 'పువ్వులు']
      }
    },
    'Navratri': {
      id: '4',
      significance: {
        en: 'Nine nights dedicated to Goddess Durga.',
        hi: 'देवी दुर्गा को समर्पित नौ रातें।',
        te: 'దుర్గా దేవికి అంకితం చేయబడిన తొమ్మిది రాత్రులు.'
      },
      rituals: {
        en: ['Ghatasthapana', 'Durga worship', 'Garba/Dandiya', 'Fasting', 'Kanya Pujan'],
        hi: ['घटस्थापना', 'दुर्गा पूजा', 'गरबा/डांडिया', 'उपवास', 'कन्या पूजन'],
        te: ['ఘటస్థాపన', 'దుర్గా పూజ', 'గర్బా/దాండియా', 'ఉపవాసం', 'కన్యా పూజ']
      },
      duration: { en: '9 nights', hi: '9 रातें', te: '9 రాత్రులు' },
      bestTime: { en: 'Morning & Evening', hi: 'सुबह और शाम', te: 'ఉదయం మరియు సాయంత్రం' },
      benefits: {
        en: ['Protection', 'Power', 'Prosperity', 'Destruction of evil', 'Desire fulfillment'],
        hi: ['सुरक्षा', 'शक्ति', 'समृद्धि', 'बुराई का नाश', 'इच्छा पूर्ति'],
        te: ['రక్షణ', 'శక్తి', 'శ్రేయస్సు', 'చెడు నాశనం', 'కోరిక నెరవేర్పు']
      },
      mantra: 'ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे',
      custom: {
        en: 'Color-specific dresses, fasting',
        hi: 'रंग-विशिष्ट कपड़े, उपवास',
        te: 'రంగు-నిర్దిష్ట దుస్తులు, ఉపవాసం'
      },
      preparation: {
        en: ['Altar setup', 'Puja schedule', 'Fasting food', 'Garba arrangements'],
        hi: ['वेदी की स्थापना', 'पूजा अनुसूची', 'उपवास का भोजन', 'गरबा की व्यवस्था'],
        te: ['పూజా వేదిక ఏర్పాటు', 'పూజ షెడ్యూల్', 'ఉపవాస ఆహారం', 'గర్బా ఏర్పాట్లు']
      },
      spiritualMeaning: {
        en: 'Victory of divine energy over negativity.',
        hi: 'नकारात्मकता पर दिव्य ऊर्जा की जीत।',
        te: 'ప్రతికూలతపై దివ్య శక్తి విజయం.'
      },
      pujaItems: {
        en: ['Durga idol', 'Kalash', 'Flowers', 'Fruits', 'Incense'],
        hi: ['दुर्गा मूर्ति', 'कलश', 'फूल', 'फल', 'अगरबत्ती'],
        te: ['దుర్గా విగ్రహం', 'కలశం', 'పువ్వులు', 'పండ్లు', 'ధూపం']
      }
    },
    'Ganesh Chaturthi': {
      id: '5',
      significance: {
        en: 'Celebration of Lord Ganesha\'s birth.',
        hi: 'भगवान गणेश के जन्म का उत्सव।',
        te: 'గణేశుడి పుట్టినరోజు వేడుక.'
      },
      rituals: {
        en: ['Idol installation', 'Modak offering', 'Aarti', 'Visarjan', 'Community feasts'],
        hi: ['मूर्ति स्थापना', 'मोदक अर्पण', 'आरती', 'विसर्जन', 'सामुदायिक भोज'],
        te: ['విగ్రహ ప్రతిష్టాపన', 'మోదక సమర్పణ', 'హారతి', 'నిమజ్జనం', 'సామూహిక విందులు']
      },
      duration: { en: '10 days', hi: '10 दिन', te: '10 రోజులు' },
      bestTime: { en: 'Midday', hi: 'दोपहर', te: 'మధ్యాహ్నం' },
      benefits: {
        en: ['Obstacle removal', 'Success', 'Wisdom', 'Protection', 'Prosperity'],
        hi: ['बाधा निवारण', 'सफलता', 'ज्ञान', 'सुरक्षा', 'समृद्धि'],
        te: ['అడ్డంకుల తొలగింపు', 'విజయం', 'జ్ఞానం', 'రక్షణ', 'శ్రేయస్సు']
      },
      mantra: 'ॐ गं गणपतये नमः',
      custom: {
        en: 'Making Modaks, wearing red/yellow',
        hi: 'मोदक बनाना, लाल/पीला पहनना',
        te: 'మోదకాలు చేయడం, ఎరుపు/పసుపు ధరించడం'
      },
      preparation: {
        en: ['Idol purchase', 'Food preparation', 'Decoration', 'Visarjan planning'],
        hi: ['मूर्ति खरीद', 'भोजन की तैयारी', 'सजावट', 'विसर्जन की योजना'],
        te: ['విగ్రహం కొనుగోలు', 'ఆహార తయారీ', 'అలంకరణ', 'నిమజ్జనం ప్రణాళిక']
      },
      spiritualMeaning: {
        en: 'New beginnings and removing obstacles.',
        hi: 'नई शुरुआत और बाधाओं को दूर करना।',
        te: 'కొత్త ప్రారంభాలు మరియు అడ్డంకులను తొలగించడం.'
      },
      pujaItems: {
        en: ['Ganesha idol', 'Modak', 'Durva grass', 'Red flowers', 'Sandalwood'],
        hi: ['गणेश मूर्ति', 'मोदक', 'दूर्वा घास', 'लाल फूल', 'चंदन'],
        te: ['గణేశ విగ్రహం', 'మోదకం', 'గరిక', 'ఎర్రని పువ్వులు', 'గంధం']
      }
    },
    'Raksha Bandhan': {
      id: '6',
      significance: {
        en: 'Celebration of sibling bond.',
        hi: 'भाई-बहन के बंधन का उत्सव।',
        te: 'తోబుట్టువుల బంధం వేడుక.'
      },
      rituals: {
        en: ['Tying Rakhi', 'Gift exchange', 'Aarti', 'Sweets', 'Prayers'],
        hi: ['राखी बांधना', 'उपहार का आदान-प्रदान', 'आरती', 'मिठाई', 'प्रार्थना'],
        te: ['రాఖీ కట్టడం', 'బహుమతుల మార్పిడి', 'హారతి', 'స్వీట్లు', 'ప్రార్థనలు']
      },
      duration: { en: '1 day', hi: '1 दिन', te: '1 రోజు' },
      bestTime: { en: 'Afternoon', hi: 'दोपहर', te: 'మధ్యాహ్నం' },
      benefits: {
        en: ['Stronger bonds', 'Harmony', 'Protection', 'Love', 'Respect'],
        hi: ['मजबूत बंधन', 'सद्भाव', 'सुरक्षा', 'प्रेम', 'सम्मान'],
        te: ['బలమైన బంధాలు', 'సామరస్యం', 'రక్షణ', 'ప్రేమ', 'గౌరవం']
      },
      mantra: 'येन बद्धो बली राजा',
      custom: {
        en: 'Sisters prepare thali, brothers give gifts',
        hi: 'बहनें थाली तैयार करती हैं, भाई उपहार देते हैं',
        te: 'సోదరీమణులు పళ్ళెం సిద్ధం చేస్తారు, సోదరులు బహుమతులు ఇస్తారు'
      },
      preparation: {
        en: ['Buy Rakhi', 'Prepare sweets', 'Arrange thali', 'Family gathering'],
        hi: ['राखी खरीदें', 'मिठाई तैयार करें', 'थाली सजाएं', 'पारिवारिक मिलन'],
        te: ['రాఖీ కొనడం', 'స్వీట్లు తయారీ', 'పళ్ళెం ఏర్పాటు', 'కుటుంబ కలయిక']
      },
      spiritualMeaning: {
        en: 'Pure bond of love and protection.',
        hi: 'प्रेम और सुरक्षा का शुद्ध बंधन।',
        te: 'ప్రేమ మరియు రక్షణ యొక్క స్వచ్ఛమైన బంధం.'
      },
      pujaItems: {
        en: ['Rakhi', 'Roli', 'Rice', 'Sweets', 'Diya'],
        hi: ['राखी', 'रोली', 'चावल', 'मिठाई', 'दीया'],
        te: ['రాఖీ', 'కుంకుమ', 'బియ్యం', 'స్వీట్లు', 'దీపం']
      }
    },
    'Makar Sankranti': {
      id: '7',
      significance: {
        en: 'Harvest festival dedicated to Sun God.',
        hi: 'सूर्य देव को समर्पित फसल उत्सव।',
        te: 'సూర్య భగవానుడికి అంకితం చేయబడిన పంట పండుగ.'
      },
      rituals: {
        en: ['Holy dip', 'Kite flying', 'Eating til-gud', 'Donation', 'Bonfires'],
        hi: ['पवित्र स्नान', 'पतंग उड़ाना', 'तिल-गुड़ खाना', 'दान', 'अलाव'],
        te: ['పవిత్ర స్నానం', 'గాలిపటాలు ఎగురవేయడం', 'నువ్వులు-బెల్లం తినడం', 'దానం', 'భోగి మంటలు']
      },
      duration: { en: '1 day', hi: '1 दिन', te: '1 రోజు' },
      bestTime: { en: 'Morning', hi: 'सुबह', te: 'ఉదయం' },
      benefits: {
        en: ['Prosperity', 'Health', 'Enlightenment', 'Removal of sins', 'Solar energy'],
        hi: ['समृद्धि', 'स्वास्थ्य', 'आत्मज्ञान', 'पापों का नाश', 'सौर ऊर्जा'],
        te: ['శ్రేయస్సు', 'ఆరోగ్యం', 'జ్ఞానోదయం', 'పాపాల తొలగింపు', 'సౌర శక్తి']
      },
      mantra: 'ॐ सूर्याय नमः',
      custom: {
        en: 'Wearing black, kite competitions',
        hi: 'काला पहनना, पतंग प्रतियोगिताएं',
        te: 'నలుపు ధరించడం, గాలిపటాల పోటీలు'
      },
      preparation: {
        en: ['Buy kites', 'Prepare sweets', 'River bath plan', 'Donation plan'],
        hi: ['पतंग खरीदें', 'मिठाई तैयार करें', 'नदी स्नान योजना', 'दान योजना'],
        te: ['గాలిపటాలు కొనడం', 'స్వీట్లు తయారీ', 'నది స్నాన ప్రణాళిక', 'దాన ప్రణాళిక']
      },
      spiritualMeaning: {
        en: 'Movement from darkness to light.',
        hi: 'अंधकार से प्रकाश की ओर गति।',
        te: 'చీకటి నుండి వెలుగు వైపు ప్రయాణం.'
      },
      pujaItems: {
        en: ['Sesame seeds', 'Jaggery', 'Kites', 'Flowers', 'Sweets'],
        hi: ['तिल', 'गुड़', 'पतंग', 'फूल', 'मिठाई'],
        te: ['నువ్వులు', 'బెల్లం', 'గాలిపటాలు', 'పువ్వులు', 'స్వీట్లు']
      }
    },
    'Janmashtami': {
      id: '8',
      significance: {
        en: 'Celebration of Lord Krishna\'s birth.',
        hi: 'भगवान कृष्ण के जन्म का उत्सव।',
        te: 'శ్రీకృష్ణుని జన్మాష్టమి వేడుక.'
      },
      rituals: {
        en: ['Fasting', 'Dahi Handi', 'Bhajans', 'Krishna puja', 'Jhulan'],
        hi: ['उपवास', 'दही हांडी', 'भजन', 'कृष्ण पूजा', 'झूला'],
        te: ['ఉపవాసం', 'దహి హండి', 'భజనలు', 'కృష్ణ పూజ', 'ఊయల సేవ']
      },
      duration: { en: '1 day', hi: '1 दिन', te: '1 రోజు' },
      bestTime: { en: 'Midnight', hi: 'मध्यरात्रि', te: 'అర్ధరాత్రి' },
      benefits: {
        en: ['Divine love', 'Wisdom', 'Protection', 'Moksha', 'Fear removal'],
        hi: ['दिव्य प्रेम', 'ज्ञान', 'सुरक्षा', 'मोक्ष', 'भय निवारण'],
        te: ['దివ్య ప్రేమ', 'జ్ఞానం', 'రక్షణ', 'మోక్షం', 'భయం తొలగింపు']
      },
      mantra: 'ॐ कृष्णाय नमः',
      custom: {
        en: 'Dressing as Krishna/Radha',
        hi: 'कृष्ण/राधा के रूप में तैयार होना',
        te: 'కృష్ణ/రాధా వేషధారణ'
      },
      preparation: {
        en: ['Food preparation', 'Decoration', 'Dahi Handi setup', 'Bhajan practice'],
        hi: ['भोजन की तैयारी', 'सजावट', 'दही हांडी की व्यवस्था', 'भजन अभ्यास'],
        te: ['ఆహార తయారీ', 'అలంకరణ', 'దహి హండి ఏర్పాటు', 'భజన సాధన']
      },
      spiritualMeaning: {
        en: 'Descent of divine consciousness.',
        hi: 'दिव्य चेतना का अवतरण।',
        te: 'దివ్య చైతన్యం అవతరించడం.'
      },
      pujaItems: {
        en: ['Krishna idol', 'Butter', 'Flute', 'Food items', 'Flowers'],
        hi: ['कृष्ण मूर्ति', 'मक्खन', 'बांसुरी', 'खाद्य पदार्थ', 'फूल'],
        te: ['కృష్ణ విగ్రహం', 'వెన్న', 'ఫ్లూట్', 'ఆహార పదార్థాలు', 'పువ్వులు']
      }
    },
    'Ram Navami': {
      id: '9',
      significance: {
        en: 'Celebration of Lord Rama\'s birth.',
        hi: 'भगवान राम के जन्म का उत्सव।',
        te: 'శ్రీరాముని జన్మదిన వేడుక.'
      },
      rituals: {
        en: ['Fasting', 'Temple visits', 'Bhajans', 'Puja', 'Reading Ramayana'],
        hi: ['उपवास', 'मंदिर दर्शन', 'भजन', 'पूजा', 'रामायण पाठ'],
        te: ['ఉపవాసం', 'ఆలయ దర్శనం', 'భజనలు', 'పూజ', 'రామాయణ పఠనం']
      },
      duration: { en: '1 day', hi: '1 दिन', te: '1 రోజు' },
      bestTime: { en: 'Midday', hi: 'दोपहर', te: 'మధ్యాహ్నం' },
      benefits: {
        en: ['Victory', 'Righteousness', 'Harmony', 'Wisdom', 'Protection'],
        hi: ['विजय', 'धर्म', 'सद्भाव', 'ज्ञान', 'सुरक्षा'],
        te: ['విజయం', 'ధర్మం', 'సామరస్యం', 'జ్ఞానం', 'రక్షణ']
      },
      mantra: 'श्री राम जय राम जय जय राम',
      custom: {
        en: 'Reading Ramayana, charity',
        hi: 'रामायण पढ़ना, दान',
        te: 'రామాయణం చదవడం, దానం'
      },
      preparation: {
        en: ['Cleaning', 'Prasad preparation', 'Reading arrangement', 'Temple plan'],
        hi: ['सफाई', 'प्रसाद की तैयारी', 'पढ़ने की व्यवस्था', 'मंदिर योजना'],
        te: ['శుభ్రం చేయడం', 'ప్రసాదం తయారీ', 'పఠన ఏర్పాటు', 'ఆలయ ప్రణాళిక']
      },
      spiritualMeaning: {
        en: 'Victory of righteousness.',
        hi: 'धर्म की जीत।',
        te: 'ధర్మ విజయం.'
      },
      pujaItems: {
        en: ['Idols', 'Flowers', 'Ramayana book', 'Sweets', 'Incense'],
        hi: ['मूर्तियां', 'फूल', 'रामायण पुस्तक', 'मिठाई', 'अगरबत्ती'],
        te: ['విగ్రహాలు', 'పువ్వులు', 'రామాయణ పుస్తకం', 'స్వీట్లు', 'ధూపం']
      }
    },
    'Hanuman Jayanti': {
      id: '10',
      significance: {
        en: 'Celebration of Lord Hanuman\'s birth.',
        hi: 'भगवान हनुमान के जन्म का उत्सव।',
        te: 'హనుమంతుని జన్మదిన వేడుక.'
      },
      rituals: {
        en: ['Pujas', 'Hanuman Chalisa', 'Sindoor offering', 'Langar', 'Reading stories'],
        hi: ['पूजा', 'हनुमान चालीसा', 'सिंदूर अर्पण', 'लंगर', 'कहानियां पढ़ना'],
        te: ['పూజలు', 'హనుమాన్ చాలీసా', 'సింధూర సమర్పణ', 'అన్నదానం', 'కథలు చదవడం']
      },
      duration: { en: '1 day', hi: '1 दिन', te: '1 రోజు' },
      bestTime: { en: 'Morning', hi: 'सुबह', te: 'ఉదయం' },
      benefits: {
        en: ['Strength', 'Obstacle removal', 'Protection', 'Devotion', 'Success'],
        hi: ['शक्ति', 'बाधा निवारण', 'सुरक्षा', 'भक्ति', 'सफलता'],
        te: ['బలం', 'అడ్డంకుల తొలగింపు', 'రక్షణ', 'భక్తి', 'విజయం']
      },
      mantra: 'ॐ हनुमते नमः',
      custom: {
        en: 'Applying sindoor, reading Chalisa',
        hi: 'सिंदूर लगाना, चालीसा पढ़ना',
        te: 'సింధూరం ధరించడం, చాలీసా చదవడం'
      },
      preparation: {
        en: ['Clean temple', 'Prepare laddoos', 'Chanting setup', 'Donation plan'],
        hi: ['मंदिर की सफाई', 'लड्डू तैयार करें', 'जाप की व्यवस्था', 'दान योजना'],
        te: ['ఆలయం శుభ్రం', 'లడ్డూల తయారీ', 'జప ఏర్పాటు', 'దాన ప్రణాళిక']
      },
      spiritualMeaning: {
        en: 'Perfect devotion and selfless service.',
        hi: 'पूर्ण भक्ति और निस्वार्थ सेवा।',
        te: 'సంపూర్ణ భక్తి మరియు నిస్వార్థ సేవ.'
      },
      pujaItems: {
        en: ['Hanuman idol', 'Sindoor', 'Laddoos', 'Red flowers', 'Incense'],
        hi: ['हनुमान मूर्ति', 'सिंदूर', 'लड्डू', 'लाल फूल', 'अगरबत्ती'],
        te: ['హనుమాన్ విగ్రహం', 'సింధూరం', 'లడ్డూలు', 'ఎర్రని పువ్వులు', 'ధూపం']
      }
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getUpcomingEvents();

        // If API returns data, use it. Otherwise create sample events for ALL festivals
        if (data && data.length > 0) {
          const enhancedEvents = data.map(event => {
            const festivalDate = getFestivalDate(event.name, currentYear);
            return {
              ...event,
              date: festivalDate,
              shortDescription: getShortDescription(event.name)
            };
          });
          setEvents(enhancedEvents);
        } else {
          // Create sample events for ALL festivals
          const allFestivalNames = Object.keys(festivalDetails);
          const today = new Date();

          const sampleEvents: ExtendedEvent[] = allFestivalNames.map((name, index) => {
            const festivalDate = new Date(getFestivalDate(name, currentYear));
            const isUpcoming = festivalDate >= today;

            return {
              id: (index + 1).toString(),
              name,
              description: festivalDetails[name].significance,
              date: getFestivalDate(name, currentYear),
              category: 'Hindu Festival',
              shortDescription: getShortDescription(name),
              isUpcoming: isUpcoming,
              daysUntil: Math.ceil((festivalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
            };
          });

          // Filter only upcoming festivals and sort by date
          const upcomingEvents = sampleEvents
            .filter(event => event.isUpcoming)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

          setEvents(upcomingEvents);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
        // Fallback to sample events with ALL festivals
        const allFestivalNames = Object.keys(festivalDetails);
        const today = new Date();

        const sampleEvents: ExtendedEvent[] = allFestivalNames.map((name, index) => {
          const festivalDate = new Date(getFestivalDate(name, currentYear));
          const isUpcoming = festivalDate >= today;

          return {
            id: (index + 1).toString(),
            name,
            description: festivalDetails[name].significance,
            date: getFestivalDate(name, currentYear),
            category: 'Hindu Festival',
            shortDescription: getShortDescription(name),
            isUpcoming: isUpcoming,
            daysUntil: Math.ceil((festivalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
          };
        });

        // Filter only upcoming festivals and sort by date
        const upcomingEvents = sampleEvents
          .filter(event => event.isUpcoming)
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        setEvents(upcomingEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentYear]);

  const getShortDescription = (eventName: string): LocalizedString => {
    const descriptions: Record<string, LocalizedString> = {
      'Maha Shivaratri': {
        en: 'The Great Night of Shiva - Powerful fasting and night vigil for spiritual enlightenment',
        hi: 'शिव की महान रात्रि - आध्यात्मिक ज्ञान के लिए शक्तिशाली उपवास और रात्रि जागरण',
        te: 'శివుని గొప్ప రాత్రి - ఆధ్యాత్మిక జ్ఞానోదయం కోసం శక్తివంతమైన ఉపవాసం మరియు రాత్రి జాగరణ'
      },
      'Holi': {
        en: 'Festival of Colors - Celebration of good over evil with vibrant colors and joy',
        hi: 'रंगों का त्योहार - जीवंत रंगों और खुशी के साथ बुराई पर अच्छाई का जश्न',
        te: 'రంగుల పండుగ - శక్తివంతమైన రంగులు మరియు ఆనందంతో చెడుపై మంచి విజయోత్సవం'
      },
      'Diwali': {
        en: 'Festival of Lights - Victory of light over darkness with diyas and Lakshmi Puja',
        hi: 'प्रकाश का त्योहार - दीयों और लक्ष्मी पूजा के साथ अंधकार पर प्रकाश की जीत',
        te: 'దీపాల పండుగ - దీపాలు మరియు లక్ష్మీ పూజతో చీకటిపై కాంతి విజయం'
      },
      'Navratri': {
        en: 'Nine Nights - Goddess Durga worship with fasting, Garba, and spiritual practices',
        hi: 'नौ रातें - उपवास, गरबा और आध्यात्मिक प्रथाओं के साथ देवी दुर्गा की पूजा',
        te: 'తొమ్మిది రాత్రులు - ఉపవాసం, గర్బా మరియు ఆధ్యాత్మిక ఆచారాలతో దుర్గా దేవి ఆరాధన'
      },
      'Ganesh Chaturthi': {
        en: 'Ganesha Birthday - Wisdom and obstacle removal with Modak offerings',
        hi: 'गणेश जन्मदिन - मोदक प्रसाद के साथ ज्ञान और बाधा निवारण',
        te: 'గణేశ పుట్టినరోజు - మోదక నైవేద్యాలతో జ్ఞానం మరియు అడ్డంకుల తొలగింపు'
      },
      'Janmashtami': {
        en: 'Krishna Birthday - Fasting and celebrations for divine love and protection',
        hi: 'कृष्ण जन्मदिन - दिव्य प्रेम और सुरक्षा के लिए उपवास और उत्सव',
        te: 'కృష్ణ పుట్టినరోజు - దివ్య ప్రేమ మరియు రక్షణ కోసం ఉపవాసం మరియు వేడుకలు'
      },
      'Raksha Bandhan': {
        en: 'Sibling Bond - Sacred thread ceremony for protection and love',
        hi: 'भाई-बहन का बंधन - सुरक्षा और प्रेम के लिए पवित्र धागा समारोह',
        te: 'తోబుట్టువుల బంధం - రక్షణ మరియు ప్రేమ కోసం పవిత్ర దార వేడుక'
      },
      'Makar Sankranti': {
        en: 'Harvest Festival - Sun God worship with kite flying and sweets',
        hi: 'फसल उत्सव - पतंग उड़ाने और मिठाई के साथ सूर्य देव की पूजा',
        te: 'పంట పండుగ - గాలిపటాలు ఎగురవేయడం మరియు స్వీట్లతో సూర్య భగవానుడి ఆరాధన'
      },
      'Ram Navami': {
        en: 'Rama Birthday - Righteous living and dharma with prayers and fasting',
        hi: 'राम जन्मदिन - प्रार्थना और उपवास के साथ धार्मिक जीवन और धर्म',
        te: 'రామ పుట్టినరోజు - ప్రార్థనలు మరియు ఉపవాసంతో ధర్మబద్ధమైన జీవనం'
      },
      'Hanuman Jayanti': {
        en: 'Hanuman Birthday - Strength and devotion with special pujas',
        hi: 'हनुमान जन्मदिन - विशेष पूजा के साथ शक्ति और भक्ति',
        te: 'హనుమాన్ పుట్టినరోజు - ప్రత్యేక పూజలతో బలం మరియు భక్తి'
      }
    };
    return descriptions[eventName] || {
      en: 'Sacred Hindu festival for divine blessings and spiritual growth',
      hi: 'दिव्य आशीर्वाद और आध्यात्मिक विकास के लिए पवित्र हिंदू त्योहार',
      te: 'దివ్య ఆశీర్వాదాలు మరియు ఆధ్యాత్మిక వృద్ధి కోసం పవిత్ర హిందూ పండుగ'
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysUntil = (dateString: string): string => {
    const today = new Date();
    const eventDate = new Date(dateString);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays < 7) return `In ${diffDays} days`;
    if (diffDays < 30) return `In ${Math.ceil(diffDays / 7)} weeks`;
    return `In ${Math.ceil(diffDays / 30)} months`;
  };

  const handleViewDetails = (event: ExtendedEvent) => {
    setSelectedEvent(event);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedEvent(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative">
          <div className="text-6xl text-amber-600">ॐ</div>
        </div>

        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-amber-700 animate-pulse">
            ॐ शान्ति शान्ति शान्तिः
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          {t('events.title') || (i18n.language === 'hi' ? 'आगामी त्योहार' : i18n.language === 'te' ? 'రాబోయే పండుగలు' : 'Upcoming Festivals')}
        </h1>
        <p className="text-muted-foreground text-sm">
          {i18n.language === 'hi' ? `हिंदू त्योहार ${currentYear} - दिव्य उत्सव` : i18n.language === 'te' ? `హిందూ పండుగలు ${currentYear} - దివ్య వేడుకలు` : `Hindu Festivals ${currentYear} - Divine Celebrations`}
        </p>
        <div className="mt-2 text-xs text-amber-600 bg-amber-50 inline-block px-3 py-1 rounded-full border border-amber-200">
          {i18n.language === 'hi' ? `${events.length} आगामी त्योहार दिखाए जा रहे हैं` : i18n.language === 'te' ? `${events.length} రాబోయే పండుగలు చూపబడుతున్నాయి` : `Showing ${events.length} upcoming festivals`}
        </div>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => (
          <div
            key={event.id}
            className="bg-white rounded-xl shadow-sm border border-amber-100 p-4 hover:shadow-md transition-shadow"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="flex-1">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex flex-col items-center justify-center text-white shadow-lg">
                    <span className="text-lg font-bold">
                      {new Date(event.date).getDate()}
                    </span>
                    <span className="text-[10px]">
                      {new Date(event.date).toLocaleDateString(i18n.language === 'hi' ? 'hi-IN' : i18n.language === 'te' ? 'te-IN' : 'en-US', { month: 'short' })}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg md:text-xl font-semibold text-foreground">
                        {event.name}
                      </h3>
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full border border-green-200">
                        {getDaysUntil(event.date)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                      {getText(event.shortDescription)}
                    </p>
                    <div className="flex items-center space-x-3 text-xs md:text-sm">
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 md:h-4 md:w-4 text-amber-600" />
                        <span className="text-amber-600 font-medium">{event.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 md:mt-0 md:ml-4">
                <Button
                  onClick={() => handleViewDetails(event)}
                  className="w-full md:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-4 py-2 rounded-lg text-sm shadow-sm shadow-amber-200 flex items-center"
                >
                  <Info className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                  {i18n.language === 'hi' ? 'विवरण देखें' : i18n.language === 'te' ? 'వివరాలు చూడండి' : 'View Details'}
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {i18n.language === 'hi' ? 'कोई आगामी त्योहार नहीं मिला' : i18n.language === 'te' ? 'రాబోయే పండుగలు ఏవీ కనుగొనబడలేదు' : 'No upcoming festivals found'}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {i18n.language === 'hi' ? 'आगामी त्योहार की तारीखों के लिए बाद में देखें' : i18n.language === 'te' ? 'రాబోయే పండుగ తేదీల కోసం తర్వాత తనిఖీ చేయండి' : 'Check back later for upcoming festival dates'}
            </p>
          </div>
        )}
      </div>

      {/* Event Details Modal - Mobile Optimized */}
      {showDetails && selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white w-full md:max-w-2xl md:rounded-2xl max-h-[90vh] md:max-h-[85vh] overflow-y-auto animate-slide-up">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-amber-200 p-4 md:p-6 flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl md:text-2xl font-bold text-foreground truncate">
                  {selectedEvent.name}
                </h2>
                <p className="text-amber-600 text-sm mt-1">
                  {formatDate(selectedEvent.date)} • {getDaysUntil(selectedEvent.date)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCloseDetails}
                className="h-8 w-8 md:h-10 md:w-10 text-gray-500 hover:bg-amber-100 flex-shrink-0 ml-2"
              >
                <X className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              {/* Quick Overview */}
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-amber-600" />
                  <h3 className="font-semibold text-amber-900 text-sm">
                    {i18n.language === 'hi' ? 'त्वरित अवलोकन' : i18n.language === 'te' ? 'త్వరిత అవలోకనం' : 'Quick Overview'}
                  </h3>
                </div>
                <p className="text-amber-800 text-xs md:text-sm leading-relaxed">
                  {getText(selectedEvent.shortDescription)}
                </p>
              </div>

              {/* Significance */}
              {festivalDetails[selectedEvent.name] && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-amber-600" />
                    <h3 className="font-semibold text-foreground text-sm">
                      {i18n.language === 'hi' ? 'महत्व' : i18n.language === 'te' ? 'ప్రాముఖ్యత' : 'Significance'}
                    </h3>
                  </div>
                  <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                    {getText(festivalDetails[selectedEvent.name].significance)}
                  </p>
                </div>
              )}

              {/* Spiritual Meaning */}
              {festivalDetails[selectedEvent.name]?.spiritualMeaning && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-purple-600" />
                    <h3 className="font-semibold text-foreground text-sm">
                      {i18n.language === 'hi' ? 'आध्यात्मिक अर्थ' : i18n.language === 'te' ? 'ఆధ్యాత్మిక అర్థం' : 'Spiritual Meaning'}
                    </h3>
                  </div>
                  <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                    {getText(festivalDetails[selectedEvent.name].spiritualMeaning)}
                  </p>
                </div>
              )}

              {/* Key Rituals */}
              {festivalDetails[selectedEvent.name] && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-amber-600" />
                    <h3 className="font-semibold text-foreground text-sm">
                      {i18n.language === 'hi' ? 'मुख्य अनुष्ठान' : i18n.language === 'te' ? 'ముఖ్యమైన ఆచారాలు' : 'Key Rituals'}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {getList(festivalDetails[selectedEvent.name].rituals).map((ritual, index) => (
                      <div key={index} className="flex items-start gap-2 text-xs md:text-sm text-gray-700">
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                        <span>{ritual}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Duration & Timing */}
              {festivalDetails[selectedEvent.name] && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="h-3 w-3 text-gray-600" />
                      <h4 className="font-semibold text-gray-900 text-xs">Duration</h4>
                    </div>
                    <p className="text-gray-700 text-xs">{getText(festivalDetails[selectedEvent.name].duration)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar className="h-3 w-3 text-gray-600" />
                      <h4 className="font-semibold text-gray-900 text-xs">Best Time</h4>
                    </div>
                    <p className="text-gray-700 text-xs">{getText(festivalDetails[selectedEvent.name].bestTime)}</p>
                  </div>
                </div>
              )}

              {/* Benefits */}
              {festivalDetails[selectedEvent.name] && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sun className="h-4 w-4 text-orange-500" />
                    <h3 className="font-semibold text-foreground text-sm">
                      {i18n.language === 'hi' ? 'लाभ' : i18n.language === 'te' ? 'ప్రయోజనాలు' : 'Benefits'}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {getList(festivalDetails[selectedEvent.name].benefits).map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs md:text-sm text-gray-700 bg-orange-50 p-2 rounded">
                        <div className="h-1 w-1 rounded-full bg-orange-400 flex-shrink-0" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mantra */}
              {festivalDetails[selectedEvent.name]?.mantra && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 border border-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-amber-600" />
                    <h3 className="font-semibold text-amber-900 text-sm">
                      {i18n.language === 'hi' ? 'पवित्र मंत्र' : i18n.language === 'te' ? 'పవిత్ర మంత్రం' : 'Sacred Mantra'}
                    </h3>
                  </div>
                  <p className="text-base md:text-lg text-amber-800 font-medium text-center leading-relaxed mb-2">
                    {festivalDetails[selectedEvent.name].mantra}
                  </p>
                  <p className="text-xs text-amber-600 text-center">
                    Chant this mantra during the festival for enhanced divine blessings
                  </p>
                </div>
              )}

              {/* Puja Items */}
              {festivalDetails[selectedEvent.name]?.pujaItems && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Droplets className="h-4 w-4 text-blue-600" />
                    <h3 className="font-semibold text-foreground text-sm">
                      {i18n.language === 'hi' ? 'आवश्यक पूजा सामग्री' : i18n.language === 'te' ? 'అవసరమైన పూజా సామాగ్రి' : 'Essential Puja Items'}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {getList(festivalDetails[selectedEvent.name].pujaItems).map((item, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs border border-blue-200">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Notes */}
              {festivalDetails[selectedEvent.name]?.custom && (
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Info className="h-4 w-4 text-blue-600" />
                    <h3 className="font-semibold text-blue-900 text-sm">
                      {i18n.language === 'hi' ? 'विशेष नोट्स' : i18n.language === 'te' ? 'ప్రత్యేక గమనికలు' : 'Special Notes'}
                    </h3>
                  </div>
                  <p className="text-blue-800 text-xs md:text-sm leading-relaxed">
                    {getText(festivalDetails[selectedEvent.name].custom)}
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-white border-t border-amber-200 p-4">
              <Button
                onClick={handleCloseDetails}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-lg text-sm font-medium"
              >
                Close Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;