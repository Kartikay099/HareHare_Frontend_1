import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, BadgeCheck, Settings, Share2, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const user = (auth as any).user as any; // cast to any to tolerate flexible user shape
  const navigate = useNavigate();

  // profile data from backend
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // referral state (unchanged, but fixed template strings below)
  const [referralCode, setReferralCode] = useState('');

  const generateFallbackCode = () => {
    const base =
      (user?.id || user?.email || user?.name || 'USER')
        .toString()
        .replace(/[^a-zA-Z0-9]/g, '');

    const prefix = base.substring(0, 4).toUpperCase().padEnd(4, 'X');
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    return `${prefix}${randomPart}`;
  };

  useEffect(() => {
    const saved = localStorage.getItem('referralCode');
    if (saved) {
      setReferralCode(saved);
    } else {
      const newCode = generateFallbackCode();
      setReferralCode(newCode);
      localStorage.setItem('referralCode', newCode);
    }
  }, [user]);

  // build referral link
  const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;

  // small loading animation delay (you already had)
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1200);
  }, []);

  // --------- Fetch profile from backend ---------
  useEffect(() => {
    let mounted = true;
    async function fetchProfile() {
      try {
        // Acquire token - try auth.getIdToken() first, then fallback to user.token
        let token = undefined;
        const maybeGetId = (auth as any).getIdToken;
        if (typeof maybeGetId === 'function') {
          token = await maybeGetId();
        } else if (user && user.token) {
          token = user.token;
        }

        const res = await fetch('/api/auth/profile/me', {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          // handle 401/404 gracefully
          if (res.status === 401) {
            toast.error('Not authenticated — please login again.');
            // redirect to login to refresh auth
            navigate('/auth/login');
          } else if (res.status === 404) {
            toast.error('Profile not found. Please complete registration.');
          } else {
            toast.error('Failed to load profile');
          }
          setProfile(null);
        } else {
          const data = await res.json();
          if (mounted) setProfile(data);
        }
      } catch (err) {
        console.error('fetchProfile error', err);
        toast.error('Network error fetching profile');
      }
    }

    fetchProfile();
    return () => { mounted = false; };
  }, [user]);

  // UI helpers
  const name = profile?.name || user?.name || 'N/A';
  const email = profile?.email || user?.email || 'N/A';
  const phone = profile?.phone || user?.phone || 'N/A';
  const dob = profile?.dob || user?.dob || 'N/A';
  const isSubscribed = profile?.is_premium ?? false;

  const handleSettingsClick = () => navigate('/app/settings');

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied!');
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'Join me!',
        text: 'Register using my referral link',
        url: referralLink,
      });
    } else {
      handleCopy();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="text-6xl text-amber-600">ॐ</div>
        <p className="text-lg font-semibold text-amber-700 animate-pulse">
          ॐ शान्ति शान्ति शान्तिः
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Settings Button */}
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

      {/* Profile Header */}
      <div className="text-center mb-8">
        <div className="inline-block p-4 bg-primary/10 rounded-full mb-4 relative">
          <User className="h-16 w-16 text-primary" />
          {isSubscribed && (
            <div className="absolute -top-1 -right-1 bg-background rounded-full p-1">
              <BadgeCheck className="h-6 w-6 text-green-500" />
            </div>
          )}
        </div>

        <h1 className="text-4xl font-bold text-foreground mb-2">{t('profile.title')}</h1>
        <p className="text-muted-foreground">Your personal spiritual identity</p>

        {isSubscribed && (
          <div className="mt-2 inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
            <BadgeCheck className="h-4 w-4" />
            Premium Subscriber
          </div>
        )}
      </div>

      {/* Profile Information */}
      <div className="sacred-card p-8 space-y-5">

        <div className="space-y-1">
          <Label>Name</Label>
          <Input value={name} readOnly disabled className="bg-gray-100 font-medium" />
        </div>

        <div className="space-y-1">
          <Label>Email</Label>
          <Input value={email} readOnly disabled className="bg-gray-100 font-medium" />
        </div>

        <div className="space-y-1">
          <Label>Phone</Label>
          <Input value={phone} readOnly disabled className="bg-gray-100 font-medium" />
        </div>

        <div className="space-y-1">
          <Label>Date of Birth</Label>
          <Input value={dob} readOnly disabled className="bg-gray-100 font-medium" />
        </div>

        {/* REFERRAL SECTION */}
        <div className="pt-6 border-t mt-6">
          <h3 className="font-semibold mb-4">Referral Benefits </h3>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
            <p className="font-medium text-amber-700 text-sm">Your Referral Code:</p>
            <p className="text-2xl font-bold text-amber-900 tracking-wider">
              {referralCode}
            </p>

            <p className="text-sm text-muted-foreground">
              Share this link & invite people. Rewards coming soon.
            </p>

            <div className="flex items-center gap-2">
              <Input value={referralLink} readOnly className="bg-white" />
              <Button onClick={handleCopy} size="icon" className="bg-amber-600 hover:bg-amber-700">
                <Copy className="w-4 h-4" />
              </Button>
              <Button onClick={handleShare} variant="outline" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Profile;