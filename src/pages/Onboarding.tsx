import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';

const Onboarding: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [currentMantra, setCurrentMantra] = useState('');
  const [visibleLogos, setVisibleLogos] = useState([false, false, false]);
  const [lastTap, setLastTap] = useState(0); // 👈 Added for double-tap detection

  // 🔥 Instant navigation on double-tap
  const handleDoubleTap = () => {
    const now = Date.now();
    if (now - lastTap < 300) {
      // ✔ Double tap detected
      if (isAuthenticated) navigate('/app/home', { replace: true });
      else navigate('/auth/login', { replace: true });
    }
    setLastTap(now);
  };

  const mantras = [
    'ॐ शान्ति', 'ॐ नमः शिवाय', 'हरे कृष्ण', 'गुरुर्ब्रह्मा',
    'ॐ साई राम', 'जय श्री राम', 'सीता राम', 'ॐ गं गणपतये',
    'शुभम करोति', 'सर्वम् शिवम', 'माता की जय', 'हनुमान बलवीर',
    'जय माता दी', 'ॐ ह्रीं दुर्गायै',
    'हर हर महादेव', 'वक्रतुंड महाकाय', 'ॐ श्री महालक्ष्म्यै',
    'जय जय श्री कृष्ण', 'सत्यं शिवं सुंदरम'
  ];

  useEffect(() => {
    const randomMantra = mantras[Math.floor(Math.random() * mantras.length)];
    setCurrentMantra(randomMantra);

    const logoTimers = [
      setTimeout(() => setVisibleLogos(prev => [true, prev[1], prev[2]]), 500),
      setTimeout(() => setVisibleLogos(prev => [prev[0], true, prev[2]]), 1500),
      setTimeout(() => setVisibleLogos(prev => [prev[0], prev[1], true]), 2500)
    ];

    const navigationTimer = setTimeout(() => {
      if (isAuthenticated) navigate('/app/home', { replace: true });
      else navigate('/auth/login', { replace: true });
    }, 10000);

    return () => {
      logoTimers.forEach(timer => clearTimeout(timer));
      clearTimeout(navigationTimer);
    };
  }, [isAuthenticated, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 p-4"
      onClick={handleDoubleTap} // 👈 DOUBLE TAP TRIGGER
    >
      <div className="max-w-md w-full text-center bg-gradient-to-br from-orange-50 animate-fade-in">

        <div className="mb-8 animate-scale-in">
          <div className="w-48 h-48 mx-auto mb-6 bg-gradient-to-br from-orange-50 flex items-center justify-center sacred-transition">
            <img 
              src="/applogo.png" 
              alt="App Logo" 
              className="w-36 h-36 object-contain sacred-pulse"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = 'ॐ';
                e.currentTarget.parentElement!.classList.add('text-6xl', 'text-white');
              }}
            />
          </div>
        </div>

        <div className="mb-8 animate-slide-up">

          <h1 className="text-2xl font-bold sacred-gradient bg-clip-text text-transparent mb-6 font-devanagari leading-relaxed">
            {currentMantra}
          </h1>

          <div className="mb-8">
            <p className="text-b text-gray-600 mb-4 font-xl"><b>Supported by prestigious temples</b></p>
            <div className="flex justify-center items-center space-x-6">
              {[1, 2, 3].map((num, index) => (
                <div 
                  key={num}
                  className={`transition-all duration-500 transform ${
                    visibleLogos[index] 
                      ? 'opacity-100 scale-100 blur-0' 
                      : 'opacity-0 scale-90 blur-sm'
                  }`}
                >
                  <img 
                    src={`/logo${num}.png`} 
                    alt={`Partner logo ${num}`}
                    className="w-15 h-15 object-contain filter brightness-0 opacity-80"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = 
                        '<div class="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-500">Logo</div>';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          <p className="text-sm text-muted-foreground animate-pulse">
            {isAuthenticated ? 'Redirecting to home...' : 'Redirecting to login...'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
