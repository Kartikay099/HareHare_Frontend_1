import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Onboarding: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleContinue = () => {
    navigate('/auth/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center devotion-gradient p-4">
      <div className="max-w-md w-full text-center animate-fade-in">
        <div className="mb-8 animate-slide-up">
          <div className="text-8xl mb-4 animate-sacred-pulse">🕉️</div>
          <h1 className="text-4xl font-bold sacred-gradient bg-clip-text text-transparent mb-2">
            {t('onboarding.welcome')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('onboarding.subtitle')}
          </p>
        </div>
        
        <Button
          onClick={handleContinue}
          size="lg"
          className="bg-primary text-primary-foreground hover:bg-primary/90 sacred-transition w-full"
        >
          {t('onboarding.continue')}
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
