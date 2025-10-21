import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, BadgeCheck } from 'lucide-react';
import { toast } from 'sonner';

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save - in real app would call API
    toast.success(t('profile.updated'));
  };

  // Fixed subscription data - remove dependency on user object
  const isSubscribed = true; // or false based on your needs

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
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

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {t('profile.saveChanges')}
          </Button>
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