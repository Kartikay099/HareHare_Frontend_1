// Mock API service - all functions return static data
// Replace with real API calls when backend is ready

export interface Shloka {
  id: string;
  sanskrit: string;
  translation: string;
  meaning: string;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  description: string;
  category: string;
}

export interface PujaGuide {
  id: string;
  name: string;
  duration: string;
  steps: string[];
  description: string;
}

export interface Scripture {
  id: string;
  name: string;
  category: string;
  description: string;
}

// Mock data
export const mockShloka: Shloka = {
  id: '1',
  sanskrit: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्',
  translation: 'Om Bhur Bhuvaḥ Swaḥ Tat-savitur Vareñyaṃ Bhargo Devasya Dhīmahi Dhiyo Yो Naḥ Prachodayāt',
  meaning: 'We meditate on the glory of the Creator who has created the Universe, who is worthy of worship, who is the embodiment of knowledge and light, who is the remover of all sin and ignorance. May he enlighten our intellect.',
};

export const mockEvents: Event[] = [
  {
    id: '1',
    name: 'Maha Shivaratri',
    date: '2025-02-26',
    description: 'The great night of Lord Shiva',
    category: 'Major Festival',
  },
  {
    id: '2',
    name: 'Holi',
    date: '2025-03-14',
    description: 'Festival of colors celebrating spring',
    category: 'Major Festival',
  },
  {
    id: '3',
    name: 'Ram Navami',
    date: '2025-04-06',
    description: 'Birth of Lord Rama',
    category: 'Major Festival',
  },
  {
    id: '4',
    name: 'Janmashtami',
    date: '2025-08-26',
    description: 'Birth of Lord Krishna',
    category: 'Major Festival',
  },
  {
    id: '5',
    name: 'Diwali',
    date: '2025-10-20',
    description: 'Festival of lights',
    category: 'Major Festival',
  },
];

export const mockPujaGuides: PujaGuide[] = [
  {
    id: '1',
    name: 'Daily Morning Puja',
    duration: '15 minutes',
    description: 'Start your day with divine blessings',
    steps: [
      'Clean the puja area',
      'Light the lamp and incense',
      'Offer flowers and water',
      'Chant mantras',
      'Perform aarti',
    ],
  },
  {
    id: '2',
    name: 'Ganesh Puja',
    duration: '30 minutes',
    description: 'Worship Lord Ganesha for new beginnings',
    steps: [
      'Invoke Lord Ganesha',
      'Offer modak and flowers',
      'Chant Ganesha mantras',
      'Perform abhishekam',
      'Complete with aarti',
    ],
  },
  {
    id: '3',
    name: 'Lakshmi Puja',
    duration: '45 minutes',
    description: 'Worship Goddess Lakshmi for prosperity',
    steps: [
      'Clean and decorate the space',
      'Place Lakshmi idol or image',
      'Offer lotus flowers',
      'Chant Lakshmi mantras',
      'Perform aarti with ghee lamp',
    ],
  },
];

export const mockScriptures: Scripture[] = [
  {
    id: '1',
    name: 'Bhagavad Gita',
    category: 'Vedic Scripture',
    description: 'Divine discourse between Krishna and Arjuna',
  },
  {
    id: '2',
    name: 'Ramayana',
    category: 'Epic',
    description: 'The story of Lord Rama',
  },
  {
    id: '3',
    name: 'Mahabharata',
    category: 'Epic',
    description: 'The great epic of the Bharata dynasty',
  },
  {
    id: '4',
    name: 'Upanishads',
    category: 'Vedic Scripture',
    description: 'Philosophical texts exploring the nature of reality',
  },
];

// Mock API functions
export const getDailyShloka = async (): Promise<Shloka> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockShloka;
};

export const getUpcomingEvents = async (): Promise<Event[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockEvents;
};

export const getPujaGuides = async (): Promise<PujaGuide[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockPujaGuides;
};

export const getScriptures = async (): Promise<Scripture[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockScriptures;
};

export const mockDonate = async (amount: number): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { success: true };
};
