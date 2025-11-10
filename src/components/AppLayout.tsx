import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Calendar, Church, Heart, BookOpen, User, Settings, LogOut, Menu, X, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const AppLayout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [streakCount, setStreakCount] = useState(0);
  const [lastVisitDate, setLastVisitDate] = useState<string>('');

  // Sample ads - you can replace with your actual ads
  const ads = [
    {
      id: 1,
      title: t('ads.specialPuja', 'Special Puja Offer'),
      description: t('ads.bookNow', 'Book now and get 20% off'),
      image: '/ads/puja-offer.jpg',
      link: '/app/puja'
    },
    {
      id: 2,
      title: t('ads.donation', 'Support Temple Renovation'),
      description: t('ads.contributeToday', 'Contribute to a noble cause'),
      image: '/ads/donation.jpg',
      link: '/app/donate'
    },
    {
      id: 3,
      title: t('ads.events', 'Upcoming Festival'),
      description: t('ads.joinCelebration', 'Join the grand celebration'),
      image: '/ads/festival.jpg',
      link: '/app/events'
    }
  ];

  const [currentAd, setCurrentAd] = useState(0);

  const navItems = [
    { path: '/app/home', icon: Home, label: t('nav.home') },
    { path: '/app/library', icon: BookOpen, label: t('nav.library') },
    { path: '/app/events', icon: Calendar, label: t('nav.events') },
    { path: '/app/profile', icon: User, label: t('nav.profile') },
  ];

  // Initialize and update streak
  useEffect(() => {
    const today = new Date().toDateString();
    const storedLastVisit = localStorage.getItem('lastVisitDate');
    const storedStreak = parseInt(localStorage.getItem('streakCount') || '0');

    if (storedLastVisit === today) {
      // User already visited today
      setStreakCount(storedStreak);
    } else if (storedLastVisit) {
      const lastVisit = new Date(storedLastVisit);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastVisit.toDateString() === yesterday.toDateString()) {
        // Consecutive day - increment streak
        const newStreak = storedStreak + 1;
        setStreakCount(newStreak);
        localStorage.setItem('streakCount', newStreak.toString());
      } else {
        // Streak broken - reset to 1
        setStreakCount(1);
        localStorage.setItem('streakCount', '1');
      }
    } else {
      // First time - start streak
      setStreakCount(1);
      localStorage.setItem('streakCount', '1');
    }

    // Update last visit date
    setLastVisitDate(today);
    localStorage.setItem('lastVisitDate', today);
  }, [location.pathname]);

  // Rotate ads every 5 seconds
  useEffect(() => {
    const adInterval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(adInterval);
  }, [ads.length]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const handleAdClick = (link: string) => {
    navigate(link);
  };

  // Safe error handler for images
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.currentTarget;
    target.style.display = 'none';
    
    const nextSibling = target.nextElementSibling as HTMLElement;
    if (nextSibling && nextSibling.style) {
      nextSibling.style.display = 'flex';
    }
  };

  return (
    <div className="min-h-screen devotion-gradient">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-card/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              variant="ghost"
              size="sm"
              className="hidden md:flex mr-2"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <span className="text-3xl">HareHare</span>
            <h1 className="text-xl font-bold text-foreground hidden sm:block">
              {t('app.name')}
            </h1>
          </div>
          
          {/* Streak Counter */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-800">
                {streakCount} {t('streak.days', 'days')}
              </span>
            </div>
            
            <Button
              onClick={toggleLanguage}
              variant="outline"
              size="sm"
              className="sacred-transition"
            >
              {i18n.language === 'en' ? 'हिन्दी' : 'English'}
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="hidden sm:flex items-center space-x-1"
            >
              <LogOut className="h-4 w-4" />
              <span>{t('auth.logout')}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content with Ad Section */}
      <div className="flex flex-col md:flex-row container mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>

        {/* Ad Sidebar - Hidden on mobile, shown on desktop */}
        <aside className="hidden lg:block w-80 ml-6 space-y-4">
          {/* Streak Widget */}
          <div className="bg-white rounded-lg shadow-sm border border-orange-200 p-4 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Flame className="h-6 w-6 text-orange-500" />
              <h3 className="font-semibold text-gray-800">{t('streak.title', 'Daily Streak')}</h3>
            </div>
            <div className="text-3xl font-bold text-orange-600 mb-1">{streakCount}</div>
            <p className="text-sm text-gray-600">{t('streak.subtitle', 'consecutive days')}</p>
            <p className="text-xs text-gray-500 mt-2">{t('streak.visitDaily', 'Visit daily to maintain your streak!')}</p>
          </div>

          {/* Ad Window */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3">
              <h3 className="font-semibold text-white text-center text-sm">
                {t('ads.sponsored', 'Sponsored')}
              </h3>
            </div>
            <div className="p-4">
              <div 
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => handleAdClick(ads[currentAd].link)}
              >
                <div className="bg-gray-100 h-32 rounded-lg mb-3 flex items-center justify-center">
                  <img 
                    src={ads[currentAd].image} 
                    alt={ads[currentAd].title}
                    className="h-full w-full object-cover rounded-lg"
                    onError={handleImageError}
                  />
                  <div className="hidden flex-col items-center justify-center text-gray-400">
                    <Church className="h-8 w-8 mb-2" />
                    <span className="text-sm">{ads[currentAd].title}</span>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-800 text-sm mb-1">
                  {ads[currentAd].title}
                </h4>
                <p className="text-xs text-gray-600">
                  {ads[currentAd].description}
                </p>
              </div>
              
              {/* Ad Indicators */}
              <div className="flex justify-center space-x-1 mt-3">
                {ads.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index === currentAd ? 'bg-orange-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Ad Banner - Only shown on mobile */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-2 z-40">
        <div 
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => handleAdClick(ads[currentAd].link)}
        >
          <div className="bg-gray-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
            <img 
              src={ads[currentAd].image} 
              alt={ads[currentAd].title}
              className="w-full h-full object-cover rounded-lg"
              onError={handleImageError}
            />
            <div className="hidden items-center justify-center text-gray-400">
              <Church className="h-6 w-6" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-gray-800 text-sm truncate">
              {ads[currentAd].title}
            </h4>
            <p className="text-xs text-gray-600 truncate">
              {ads[currentAd].description}
            </p>
          </div>
          <Button variant="outline" size="sm" className="flex-shrink-0">
            {t('ads.learnMore', 'Learn More')}
          </Button>
        </div>
      </div>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden z-50 backdrop-blur-sm bg-card/90">
        <div className="flex justify-around items-center h-16">
          {navItems.slice(0, 4).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center flex-1 h-full sacred-transition ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`
                }
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Sidebar Navigation (Desktop) */}
      <aside className={`hidden md:block fixed left-0 top-16 bottom-0 bg-card border-r border-border p-4 overflow-y-auto sacred-transition ${
        sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'
      }`}>
        <nav className="space-y-2">
          {/* Streak in Sidebar */}
          <div className="px-4 py-3 rounded-lg bg-orange-50 border border-orange-200 mb-4">
            <div className="flex items-center space-x-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <div>
                <div className="font-semibold text-orange-800">{streakCount} day streak</div>
                <div className="text-xs text-orange-600">Keep it going!</div>
              </div>
            </div>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg sacred-transition ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted'
                  }`
                }
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
          
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start mt-4"
          >
            <LogOut className="h-5 w-5 mr-3" />
            {t('auth.logout')}
          </Button>
        </nav>
      </aside>

      {/* Adjust content for sidebar on desktop */}
      <style>{`
        @media (min-width: 768px) {
          .container {
            margin-left: ${sidebarOpen ? '256px' : '0'};
            transition: margin-left 0.3s ease;
          }
        }
      `}</style>
    </div>
  );
};

export default AppLayout;