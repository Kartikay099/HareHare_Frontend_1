import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, BadgeCheck, Settings } from 'lucide-react';
import { toast } from 'sonner';
import SacredLoader from '@/components/SacredLoader';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial data loading
  useEffect(() => {
    const loadProfileData = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsLoading(false);
    };

    loadProfileData();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(t('profile.updated'));
  };

  const handleSettingsClick = () => {
    navigate('/app/settings');
  };

  const isSubscribed = true;

  // PAGE LOADING SCREEN
  if (isLoading) {
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

    
    <div className="max-w-2xl mx-auto animate-fade-in">
      
        {/* Settings Button - Top Right */}
      <div className="flex justify-end mb-6">
        <Button
          onClick={handleSettingsClick}
          variant="outline"
          className="flex items-center gap-2 border-amber-200 text-amber-700 hover:bg-amber-50"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </div>

      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-block p-4 bg-primary/10 rounded-full mb-4 relative">
          <User className="h-16 w-16 text-primary" />
          {isSubscribed && (
            <div className="absolute -top-1 -right-1 bg-background rounded-full p-1">
              <BadgeCheck className="h-6 w-6 text-green-500 fill-current" />
            </div>
          )}
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          {t('profile.title')}
        </h1>
        <p className="text-muted-foreground">
          Manage your personal information
        </p>
        {isSubscribed && (
          <div className="mt-2 inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
            <BadgeCheck className="h-4 w-4" />
            Premium Subscriber
          </div>
        )}
      </div>

    

      {/* Profile Form */}
      <div className="sacred-card p-8">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t('auth.name')}</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {email && (
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          {phone && (
            <div className="space-y-2">
              <Label htmlFor="phone">{t('auth.phone')}</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {t('profile.saveChanges')}
            </Button>
            
            {/* Alternative: Settings button can also be placed here */}
            {/* <Button
              onClick={handleSettingsClick}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </Button> */}
          </div>
        </form>

        <div className="mt-8 pt-8 border-t border-border">
          <h3 className="font-semibold text-foreground mb-4">Account Information</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Member since: {new Date().toLocaleDateString()}</p>
            <p>Account Status: Active 🙏</p>
            <p className={isSubscribed ? 'text-green-600 font-medium' : 'text-muted-foreground'}>
              Subscription: {isSubscribed ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;