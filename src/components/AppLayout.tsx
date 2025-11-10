import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, Calendar, Church, Heart, BookOpen, User, Settings, LogOut, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const AppLayout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { path: '/app/home', icon: Home, label: t('nav.home') },
    
    // { path: '/app/puja', icon: Church, label: t('nav.puja') },
    // { path: '/app/donate', icon: Heart, label: t('nav.donate') },
    { path: '/app/library', icon: BookOpen, label: t('nav.library') },
  
    
      { path: '/app/events', icon: Calendar, label: t('nav.events') },
      { path: '/app/profile', icon: User, label: t('nav.profile') },
    // { path: '/app/settings', icon: Settings, label: t('nav.settings') },
  ];

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
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
          
          <div className="flex items-center space-x-2">
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-6">
        <Outlet />
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:hidden z-50 backdrop-blur-sm bg-card/90">
        <div className="flex justify-around items-center h-16">
          {navItems.slice(0, 5).map((item) => {
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
          main {
            margin-left: ${sidebarOpen ? '256px' : '0'};
            transition: margin-left 0.3s ease;
          }
        }
      `}</style>
    </div>
  );
};

export default AppLayout;
