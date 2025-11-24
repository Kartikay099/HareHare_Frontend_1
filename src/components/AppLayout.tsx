import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Calendar, Flame, BookOpen, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

/* ---------------------------------------------------
   TOUCH EFFECT + HAPTIC + RIPPLE (GLOBAL)
----------------------------------------------------*/
const haptic = () => {
  if (navigator.vibrate) navigator.vibrate(10);
};

const addRipple = (e: any) => {
  const target = e.currentTarget;
  const circle = document.createElement("span");

  const d = Math.max(target.clientWidth, target.clientHeight);
  circle.style.width = circle.style.height = `${d}px`;
  circle.style.left = `${e.clientX - target.getBoundingClientRect().left - d / 2}px`;
  circle.style.top = `${e.clientY - target.getBoundingClientRect().top - d / 2}px`;

  circle.classList.add("ripple");
  target.appendChild(circle);

  setTimeout(() => circle.remove(), 500);
};

const touchCls =
  "active:scale-[0.93] transition-all duration-150 relative overflow-hidden";


/* ---------------------------------------------------
   MAIN LAYOUT COMPONENT
----------------------------------------------------*/
const AppLayout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [streakCount, setStreakCount] = useState(0);

  const navItems = [
    { path: '/app/home', icon: Home, label: t('nav.home') },
    { path: '/app/library', icon: BookOpen, label: t('Collections') },
    { path: '/app/events', icon: Calendar, label: t('nav.events') },
    { path: '/app/profile', icon: User, label: t('nav.profile') },
  ];

  /* Streak Logic */
  useEffect(() => {
    const today = new Date().toDateString();
    const storedLast = localStorage.getItem("lastVisitDate");
    const storedStreak = parseInt(localStorage.getItem("streakCount") || "0");

    if (storedLast === today) {
      setStreakCount(storedStreak);
    } else if (storedLast) {
      const lastVisit = new Date(storedLast);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastVisit.toDateString() === yesterday.toDateString()) {
        const newStreak = storedStreak + 1;
        setStreakCount(newStreak);
        localStorage.setItem("streakCount", newStreak.toString());
      } else {
        setStreakCount(1);
        localStorage.setItem("streakCount", "1");
      }
    } else {
      setStreakCount(1);
      localStorage.setItem("streakCount", "1");
    }

    localStorage.setItem("lastVisitDate", today);
  }, [location.pathname]);

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "hi" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen devotion-gradient">

      {/* HEADER */}
      <header className="bg-white border-b sticky top-0 z-50 backdrop-blur-md pt-[env(safe-area-inset-top)]">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">

          {/* LEFT — Logo + Title */}
          <div className="flex items-center space-x-3">

            {/* LOGO WITH BREATHING EFFECT */}
            <img
              src="/applogo.png"
              alt="App Logo"
              className="w-10 h-10 rounded-full object-contain animate-logoPulse"
            />

            <h1 className="text-xl font-bold">{t("app.name")}</h1>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center space-x-4">

            {/* Streak */}
            <div className="flex items-center space-x-2 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-orange-800">
                {streakCount} {t("streak.days")}
              </span>
            </div>

            {/* Language */}
            <Button onClick={(e)=>{addRipple(e);haptic(); toggleLanguage();}} size="sm" variant="outline">
              {i18n.language === "en" ? "English" : "हिन्दी"}
            </Button>

            {/* Logout */}
            <Button
              onClick={(e)=>{addRipple(e);haptic(); handleLogout();}}
              variant="ghost"
              size="sm"
              className="hidden sm:flex items-center space-x-1"
            >
              <LogOut className="h-4 w-4" />
              <span>{t("auth.logout")}</span>
            </Button>

          </div>
        </div>
      </header>

      {/* MAIN OUTLET */}
      <div className="container mx-auto px-4 py-6 pb-24">
        <Outlet />
      </div>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-orange-200 md:hidden z-50 shadow-[0_-8px_25px_rgba(0,0,0,0.06)]">
        <div className="flex justify-around items-center h-16">

          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={(e) => { addRipple(e); haptic(); }}
                className={`flex-1 flex items-center justify-center ${touchCls}`}
              >
                {({ isActive }) => (
                  <div className="relative flex flex-col items-center">

                    {/* Glow */}
                    <div
                      className={`
                        absolute top-2 w-10 h-10 rounded-full blur-xl transition-all duration-500
                        ${isActive ? "bg-orange-400 opacity-40 scale-125" : "opacity-0 scale-50"}
                      `}
                    />

                    {/* Icon */}
                    <Icon
                      className={`
                        relative z-10 h-6 w-6 transition-all duration-300
                        ${isActive ? "text-orange-600 scale-110" : "text-gray-500"}
                      `}
                    />

                    {/* Label */}
                    <span
                      className={`
                        relative z-10 mt-1 text-[11px] transition-all duration-300
                        ${isActive ? "text-orange-600" : "text-gray-500 opacity-60"}
                      `}
                    >
                      {item.label}
                    </span>

                  </div>
                )}
              </NavLink>
            );
          })}

        </div>
      </nav>

      {/* GLOBAL CSS */}
      <style>{`
        /* Ripple */
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 149, 0, 0.25);
          transform: scale(0);
          animation: rippleAnim 0.5s linear;
          pointer-events: none;
        }
        @keyframes rippleAnim {
          to { transform: scale(3); opacity: 0; }
        }

        /* LOGO BREATHING ANIMATION */
        @keyframes logoPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.12); }
          100% { transform: scale(1); }
        }
        .animate-logoPulse {
          animation: logoPulse 2.2s ease-in-out infinite;
        }
      `}</style>

    </div>
  );
};

export default AppLayout;
