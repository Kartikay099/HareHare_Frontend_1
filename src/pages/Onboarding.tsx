import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';

const Onboarding: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentMantra, setCurrentMantra] = useState('');

  // Random mantras array
const mantras = [
  'ॐ शान्ति', // Om Shanti
  'ॐ नमः शिवाय', // Om Namah Shivaya
  'हरे कृष्ण', // Hare Krishna
  'गुरुर्ब्रह्मा', // Gurur Brahma
  'ॐ साई राम', // Om Sai Ram
  'जय श्री राम', // Jai Shri Ram
  'सीता राम', // Sita Ram
  'ॐ गं गणपतये', // Om Gam Ganapataye
  'शुभम करोति', // Shubham Karoti
  'सर्वम् शिवम', // Sarvam Shivam
  'माता की जय', // Mata Ki Jai
  'हनुमान बलवीर', // Hanuman Balveer
  'जय माता दी', // Jai Mata Di
  'ॐ ह्रीं दुर्गायै', // Om Hreem Durgayai
  'राम नाम सत्य है', // Ram Nam Satya Hai
  'हर हर महादेव', // Har Har Mahadev
  'वक्रतुंड महाकाय', // Vakratunda Mahakaya
  'ॐ श्री महालक्ष्म्यै', // Om Shri Mahalakshmyai
  'जय जय श्री कृष्ण', // Jai Jai Shri Krishna
  'सत्यं शिवं सुंदरम' // Satyam Shivam Sundaram
];

  useEffect(() => {
    // Select random mantra
    const randomMantra = mantras[Math.floor(Math.random() * mantras.length)];
    setCurrentMantra(randomMantra);

    // Auto-navigate based on auth status
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        navigate('/app/home', { replace: true });
      } else {
        navigate('/auth/login', { replace: true });
      }
    }, 4000); // 4 seconds delay

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center  bg-gradient-to-br from-orange-50  p-4">
      <div className="max-w-md w-full text-center  bg-gradient-to-br from-orange-50  animate-fade-in">
        
        {/* Big App Logo */}
        <div className="mb-8 animate-scale-in">
          <div className="w-48 h-48 mx-auto mb-6  bg-gradient-to-br from-orange-50  flex items-center justify-center  sacred-transition">
            <img 
              src="/applogo.png" 
              alt="App Logo" 
              className="w-36 h-36 object-contain sacred-pulse"
              onError={(e) => {
                // Fallback if logo doesn't load
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = 'ॐ';
                e.currentTarget.parentElement!.classList.add('text-6xl', 'text-white');
              }}
            />
          </div>
        </div>

        <div className="mb-8 animate-slide-up">
          {/* Random Mantra */}
          <h1 className="text-2xl font-bold sacred-gradient bg-clip-text text-transparent mb-6 font-devanagari leading-relaxed">
            {currentMantra}
          </h1>
          
          {/* Hindu Symbols */}
          <div className="flex justify-center space-x-8 mb-6">
            <div className="text-center sacred-transition">
              <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-2 text-3xl">
                ॐ
              </div>
            </div>
            <div className="text-center sacred-transition">
              <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-2 text-3xl">
                卐
              </div>
            </div>
            <div className="text-center sacred-transition">
              <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-2 text-3xl">
                ✡
              </div>
            </div>
          </div>

          {/* Loading/Redirect Text */}
          <p className="text-sm text-muted-foreground animate-pulse">
            {isAuthenticated ? 'Redirecting to home...' : 'Redirecting to login...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;