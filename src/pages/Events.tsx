import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getUpcomingEvents, Event } from '@/services/api';
import { Calendar, MapPin, Clock, Star, Users, Info, X, Moon, Sun, Droplets, Flame, BookOpen, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FestivalDetails {
  id: string;
  significance: string;
  rituals: string[];
  duration: string;
  bestTime: string;
  benefits: string[];
  mantra: string;
  custom: string;
  preparation: string[];
  spiritualMeaning: string;
  pujaItems: string[];
}

// Extended Event type used locally in this file to include computed fields
interface ExtendedEvent extends Event {
  isUpcoming?: boolean;
  daysUntil?: number;
  shortDescription?: string;
}

const Events: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [events, setEvents] = useState<ExtendedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [currentYear] = useState(new Date().getFullYear());

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
      significance: 'The Great Night of Shiva, one of the most significant Hindu festivals dedicated to Lord Shiva. It marks the convergence of Shiva and Shakti, symbolizing the marriage of consciousness and energy.',
      rituals: [
        'Day and night fasting with Vrat (abstaining from food)',
        'Sixteen-step Shiva Linga Abhishekam with sacred items',
        'Panchamrit Abhishek (milk, yogurt, honey, ghee, sugar)',
        'Bilva leaves offering throughout the night',
        'Rudra Abhishek and Mahamrityunjaya Jaap',
        'All-night vigil with Shiva mantras and bhajans'
      ],
      duration: '24 hours (sunrise to next sunrise)',
      bestTime: 'Nishita Kaal (midnight) for main puja',
      benefits: [
        'Moksha (liberation from cycle of rebirth)',
        'Marital bliss and harmony',
        'Destruction of past sins and negative karma',
        'Fulfillment of wishes and desires',
        'Protection from negative energies',
        'Spiritual enlightenment and self-realization'
      ],
      mantra: 'ॐ नमः शिवाय',
      custom: 'Wearing Rudraksha beads and applying sacred ash (Vibhuti). Traditional colors: White and Royal Blue',
      preparation: [
        'Take early morning bath and wear clean clothes',
        'Prepare Panchamrit and other Abhishek items',
        'Clean puja area and arrange Shiva Linga',
        'Prepare fruits and prasad for offering',
        'Mental preparation with Shiva meditation'
      ],
      spiritualMeaning: 'Maha Shivaratri represents overcoming darkness and ignorance in life. The all-night vigil symbolizes the awakening of consciousness and victory over the darkness of the material world.',
      pujaItems: [
        'Shiva Linga',
        'Bilva leaves (Bel patra)',
        'Milk, Yogurt, Honey, Ghee, Sugar',
        'Dhatura flowers and fruits',
        'Rudraksha mala',
        'Sandalwood paste',
        'Incense sticks and diya'
      ]
    },
    'Holi': {
      id: '2',
      significance: 'Festival of colors celebrating the victory of good over evil and the arrival of spring. Honors the divine love of Radha and Krishna.',
      rituals: [
        'Holika Dahan (bonfire night before)',
        'Playing with organic colors and water',
        'Visiting friends and family with sweets',
        'Traditional songs and dances',
        'Special bhang preparations in some regions'
      ],
      duration: '2 days (Holika Dahan and Color play)',
      bestTime: 'Morning to afternoon for color play',
      benefits: [
        'Destroys negativity and evil thoughts',
        'Strengthens relationships and social harmony',
        'Brings joy and removes stress',
        'Promotes forgiveness and new beginnings',
        'Cultural unity and community bonding'
      ],
      mantra: 'ॐ प्रह्लादाय नमः',
      custom: 'Wearing white clothes, exchanging sweets like Gujiya. Traditional colors: All vibrant colors',
      preparation: [
        'Collect organic colors and pichkaris',
        'Prepare Holika for Dahan',
        'Make traditional sweets',
        'Arrange music and celebration items'
      ],
      spiritualMeaning: 'Symbolizes the burning of ego and material desires (Holika) and embracing divine love and joy (colors).',
      pujaItems: [
        'Wood for Holika',
        'Organic colors',
        'Sweets and snacks',
        'Flowers and coconuts',
        'Incense and diya'
      ]
    },
    'Diwali': {
      id: '3',
      significance: 'Festival of Lights celebrating the victory of light over darkness, knowledge over ignorance, and good over evil. Marks Lord Rama return to Ayodhya.',
      rituals: [
        'Lakshmi-Ganesh Puja during Mahurat',
        'Lighting diyas and decorating with rangoli',
        'Fireworks and family gatherings',
        'Exchanging gifts and sweets',
        'Cleaning and decorating homes'
      ],
      duration: '5 days (Dhanteras to Bhai Dooj)',
      bestTime: 'Evening during Lakshmi Puja Mahurat',
      benefits: [
        'Wealth and prosperity',
        'Spiritual enlightenment',
        'Family harmony and unity',
        'Removes darkness and negativity',
        'Success in new ventures'
      ],
      mantra: 'ॐ महालक्ष्म्यै च विद्महे विष्णु पत्न्यै च धीमहि तन्नो लक्ष्मी प्रचोदयात्',
      custom: 'Wearing new clothes, gambling for prosperity. Traditional colors: Red, Gold, Yellow',
      preparation: [
        'Deep home cleaning',
        'Shopping for new items',
        'Preparing sweets and snacks',
        'Decorating with lights and rangoli'
      ],
      spiritualMeaning: 'The inner light of higher knowledge protecting from spiritual darkness, signifying the victory of good over evil.',
      pujaItems: [
        'Lakshmi-Ganesh idols',
        'Diyas and candles',
        'Rangoli colors',
        'Sweets and fruits',
        'Incense and flowers'
      ]
    },
    'Navratri': {
      id: '4',
      significance: 'Nine nights dedicated to the worship of Goddess Durga in her nine different forms. Celebrates the victory of good over evil.',
      rituals: [
        'Daily Ghatasthapana and Kalash Sthapana',
        'Nine forms of Durga worship each day',
        'Garba and Dandiya Raas dances',
        'Fasting and special prayers',
        'Kanya Pujan on eighth or ninth day'
      ],
      duration: '9 nights and 10 days',
      bestTime: 'Early morning for puja, evening for Garba',
      benefits: [
        'Divine protection and strength',
        'Spiritual power and energy',
        'Wealth and prosperity',
        'Destruction of evil and negativity',
        'Fulfillment of desires'
      ],
      mantra: 'ॐ ऐं ह्रीं क्लीं चामुण्डायै विच्चे',
      custom: 'Color-specific dresses each day, fasting rules. Traditional colors: Different each day',
      preparation: [
        'Set up Durga altar',
        'Plan nine-day puja schedule',
        'Prepare fasting foods',
        'Arrange Garba venue and music'
      ],
      spiritualMeaning: 'The nine nights represent the battle between divine energy and negative forces, culminating in victory of good.',
      pujaItems: [
        'Durga idol or picture',
        'Kalash and coconut',
        'Nine different flowers',
        'Fruits and sweets',
        'Incense and lamps'
      ]
    },
    'Ganesh Chaturthi': {
      id: '5',
      significance: 'Celebrates the birth of Lord Ganesha, the remover of obstacles and god of wisdom and new beginnings.',
      rituals: [
        'Ganesha idol installation at home',
        'Daily puja with Modak offering',
        'Aarti and chanting of Ganesha mantras',
        'Visarjan (immersion) on final day',
        'Cultural programs and community feasts'
      ],
      duration: '1.5 to 11 days',
      bestTime: 'Madhyahna (midday) for puja',
      benefits: [
        'Removes obstacles from life',
        'Success in endeavors and new ventures',
        'Wisdom and knowledge',
        'Business and academic success',
        'Protection from negative influences'
      ],
      mantra: 'ॐ गं गणपतये नमः',
      custom: 'Modak preparation, red flowers. Traditional colors: Red, Yellow',
      preparation: [
        'Bring Ganesha idol home',
        'Prepare Modak and other prasad',
        'Decorate puja area',
        'Arrange for Visarjan'
      ],
      spiritualMeaning: 'Welcoming divine consciousness to remove obstacles from spiritual path and material life.',
      pujaItems: [
        'Ganesha idol',
        'Modak and laddu',
        'Durva grass',
        'Red flowers',
        'Sandalwood paste'
      ]
    },
    'Raksha Bandhan': {
      id: '6',
      significance: 'Celebrates the sacred bond between brothers and sisters. Sisters tie rakhi on brothers wrists praying for their protection.',
      rituals: [
        'Sisters tie sacred thread (rakhi) on brothers wrist',
        'Brothers give gifts and promise protection',
        'Aarti ceremony for brothers',
        'Sweets exchange and family feast',
        'Prayers for each others well-being'
      ],
      duration: '1 day',
      bestTime: 'Aparahna (afternoon) time',
      benefits: [
        'Strengthens sibling bonds',
        'Family harmony and unity',
        'Mutual protection and care',
        'Removes negative energies',
        'Promotes love and respect'
      ],
      mantra: 'येन बद्धो बली राजा दानवेन्द्रो महाबलः',
      custom: 'Sisters prepare thali with rakhi, rice, diya, and sweets. Traditional colors: Red, Golden',
      preparation: [
        'Buy or make beautiful rakhis',
        'Prepare sweets and gifts',
        'Arrange thali with puja items',
        'Plan family gathering'
      ],
      spiritualMeaning: 'Symbolizes the pure bond of love and protection between siblings, reflecting divine relationships.',
      pujaItems: [
        'Rakhi thread',
        'Roli (vermilion)',
        'Akshat (rice)',
        'Sweets and fruits',
        'Diya and incense'
      ]
    },
    'Makar Sankranti': {
      id: '7',
      significance: 'Harvest festival marking the Sun transition into Capricorn (Makar Rashi). Dedicated to Sun God Surya, celebrating the end of winter.',
      rituals: [
        'Holy dip in sacred rivers like Ganga',
        'Flying kites as sun worship',
        'Eating til-gud (sesame and jaggery) sweets',
        'Donating food and clothes to needy',
        'Bonfires and community celebrations'
      ],
      duration: '1 day (celebrated over 2-4 days in some regions)',
      bestTime: 'Early morning for holy dip, day for kite flying',
      benefits: [
        'Prosperity and abundance',
        'Good health and vitality',
        'Spiritual enlightenment',
        'Removal of sins and negative karma',
        'Solar energy blessings'
      ],
      mantra: 'ॐ सूर्याय नमः',
      custom: 'Wearing black clothes, kite flying competitions. Traditional colors: Black, Yellow, Orange',
      preparation: [
        'Buy kites and manjha (thread)',
        'Prepare til-gud laddoos',
        'Arrange for river bath if possible',
        'Plan donation activities'
      ],
      spiritualMeaning: 'Represents the movement from darkness to light, ignorance to knowledge, and material to spiritual consciousness.',
      pujaItems: [
        'Til (sesame seeds)',
        'Gud (jaggery)',
        'Kites and threads',
        'Flowers for Sun God',
        'Sweets for prasad'
      ]
    },
    'Janmashtami': {
      id: '8',
      significance: 'Celebrates the birth of Lord Krishna, the eighth avatar of Vishnu and supreme personality of Godhead.',
      rituals: [
        'Fasting until midnight (birth time)',
        'Dahi Handi (pot breaking) ceremony',
        'Bhajans and kirtans throughout day',
        'Krishna puja with 56 bhogs',
        'Jhulan (swing) decoration and celebration'
      ],
      duration: '1 day (fasting from sunrise to midnight)',
      bestTime: 'Nishita Kaal (midnight) for main puja',
      benefits: [
        'Divine love and devotion',
        'Spiritual wisdom and knowledge',
        'Protection from evil forces',
        'Moksha and liberation',
        'Removes fear and anxiety'
      ],
      mantra: 'ॐ कृष्णाय नमः',
      custom: 'Dressing as Krishna and Radha, making butter treats. Traditional colors: Blue, Yellow, White',
      preparation: [
        'Prepare 56 different food items',
        'Decorate Jhulan and cradle',
        'Arrange Dahi Handi event',
        'Practice bhajans and kirtans'
      ],
      spiritualMeaning: 'Celebrates the descent of divine consciousness to establish dharma and spread love.',
      pujaItems: [
        'Krishna idol or picture',
        'Makhan (butter) and mishri',
        'Flute and peacock feather',
        '56 different food items',
        'Flowers and fruits'
      ]
    },
    'Ram Navami': {
      id: '9',
      significance: 'Celebrates the birth of Lord Rama, the seventh avatar of Vishnu and hero of the epic Ramayana.',
      rituals: [
        'Fasting and prayers throughout day',
        'Temple visits and Rama Katha recitation',
        'Bhajans and kirtans in praise of Rama',
        'Special puja and aarti',
        'Reading Ramayana scriptures'
      ],
      duration: '1 day',
      bestTime: 'Madhyahna (midday) for main puja',
      benefits: [
        'Victory over evil and injustice',
        'Righteous living and dharma',
        'Family harmony and values',
        'Spiritual growth and wisdom',
        'Protection from negative influences'
      ],
      mantra: 'श्री राम जय राम जय जय राम',
      custom: 'Reading Ramayana, fasting, charity. Traditional colors: Red, Yellow',
      preparation: [
        'Clean and decorate puja area',
        'Prepare fruits and prasad',
        'Arrange Ramayana reading',
        'Plan temple visit'
      ],
      spiritualMeaning: 'Represents the victory of righteousness over evil and the ideal way of living.',
      pujaItems: [
        'Rama-Sita-Lakshman-Hanuman idols',
        'Flowers and fruits',
        'Ramayana book',
        'Sweets and panchamrit',
        'Incense and lamps'
      ]
    },
    'Hanuman Jayanti': {
      id: '10',
      significance: 'Celebrates the birth of Lord Hanuman, the greatest devotee of Lord Rama and symbol of strength and devotion.',
      rituals: [
        'Special pujas and abhishekam',
        'Hanuman Chalisa recitation 108 times',
        'Sindoor offerings and laddoo prasad',
        'Serving food to needy (langar)',
        'Reading Sunderkand and Hanuman stories'
      ],
      duration: '1 day',
      bestTime: 'Early morning or sunset time',
      benefits: [
        'Strength and courage',
        'Removes obstacles and difficulties',
        'Protection from evil spirits',
        'Devotional growth and bhakti',
        'Success in endeavors'
      ],
      mantra: 'ॐ हनुमते नमः',
      custom: 'Applying sindoor, reading Hanuman Chalisa. Traditional colors: Red, Orange',
      preparation: [
        'Clean Hanuman temple or altar',
        'Prepare besan laddoos',
        'Arrange for collective chanting',
        'Plan food donation'
      ],
      spiritualMeaning: 'Embodies perfect devotion, selfless service, and unwavering commitment to righteousness.',
      pujaItems: [
        'Hanuman idol or picture',
        'Sindoor (vermilion)',
        'Laddoos and fruits',
        'Red flowers',
        'Incense and ghee lamp'
      ]
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

  const getShortDescription = (eventName: string): string => {
    const descriptions: Record<string, string> = {
      'Maha Shivaratri': 'The Great Night of Shiva - Powerful fasting and night vigil for spiritual enlightenment',
      'Holi': 'Festival of Colors - Celebration of good over evil with vibrant colors and joy',
      'Diwali': 'Festival of Lights - Victory of light over darkness with diyas and Lakshmi Puja',
      'Navratri': 'Nine Nights - Goddess Durga worship with fasting, Garba, and spiritual practices',
      'Ganesh Chaturthi': 'Ganesha Birthday - Wisdom and obstacle removal with Modak offerings',
      'Janmashtami': 'Krishna Birthday - Fasting and celebrations for divine love and protection',
      'Raksha Bandhan': 'Sibling Bond - Sacred thread ceremony for protection and love',
      'Makar Sankranti': 'Harvest Festival - Sun God worship with kite flying and sweets',
      'Ram Navami': 'Rama Birthday - Righteous living and dharma with prayers and fasting',
      'Hanuman Jayanti': 'Hanuman Birthday - Strength and devotion with special pujas'
    };
    return descriptions[eventName] || 'Sacred Hindu festival for divine blessings and spiritual growth';
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

  const handleViewDetails = (event: Event) => {
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
          {t('events.title') || 'Upcoming Festivals'}
        </h1>
        <p className="text-muted-foreground text-sm">
          Hindu Festivals {currentYear} - Divine Celebrations
        </p>
        <div className="mt-2 text-xs text-amber-600 bg-amber-50 inline-block px-3 py-1 rounded-full border border-amber-200">
          Showing {events.length} upcoming festivals
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
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
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
                      {(event as any).shortDescription}
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
                  View Details
                  <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No upcoming festivals found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Check back later for upcoming festival dates
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
                  <h3 className="font-semibold text-amber-900 text-sm">Quick Overview</h3>
                </div>
                <p className="text-amber-800 text-xs md:text-sm leading-relaxed">
                  {(selectedEvent as any).shortDescription}
                </p>
              </div>

              {/* Significance */}
              {festivalDetails[selectedEvent.name] && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="h-4 w-4 text-amber-600" />
                    <h3 className="font-semibold text-foreground text-sm">Significance</h3>
                  </div>
                  <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                    {festivalDetails[selectedEvent.name].significance}
                  </p>
                </div>
              )}

              {/* Spiritual Meaning */}
              {festivalDetails[selectedEvent.name]?.spiritualMeaning && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-purple-600" />
                    <h3 className="font-semibold text-foreground text-sm">Spiritual Meaning</h3>
                  </div>
                  <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                    {festivalDetails[selectedEvent.name].spiritualMeaning}
                  </p>
                </div>
              )}

              {/* Key Rituals */}
              {festivalDetails[selectedEvent.name] && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-amber-600" />
                    <h3 className="font-semibold text-foreground text-sm">Key Rituals</h3>
                  </div>
                  <div className="space-y-2">
                    {festivalDetails[selectedEvent.name].rituals.map((ritual, index) => (
                      <div key={index} className="flex items-start gap-2 text-xs md:text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span className="leading-relaxed">{ritual}</span>
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
                    <p className="text-gray-700 text-xs">{festivalDetails[selectedEvent.name].duration}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="flex items-center gap-1 mb-1">
                      <Calendar className="h-3 w-3 text-gray-600" />
                      <h4 className="font-semibold text-gray-900 text-xs">Best Time</h4>
                    </div>
                    <p className="text-gray-700 text-xs">{festivalDetails[selectedEvent.name].bestTime}</p>
                  </div>
                </div>
              )}

              {/* Benefits */}
              {festivalDetails[selectedEvent.name]?.benefits && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-amber-600" />
                    <h3 className="font-semibold text-foreground text-sm">Divine Benefits</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {festivalDetails[selectedEvent.name].benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-gray-700 bg-amber-50 rounded-lg p-2">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0"></div>
                        <span className="leading-relaxed">{benefit}</span>
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
                    <h3 className="font-semibold text-amber-900 text-sm">Sacred Mantra</h3>
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
                    <h3 className="font-semibold text-foreground text-sm">Essential Puja Items</h3>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {festivalDetails[selectedEvent.name].pujaItems.map((item, index) => (
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
                    <h3 className="font-semibold text-blue-900 text-sm">Special Notes</h3>
                  </div>
                  <p className="text-blue-800 text-xs md:text-sm">{festivalDetails[selectedEvent.name].custom}</p>
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