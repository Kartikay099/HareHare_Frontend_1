import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import SacredLoader from '@/components/SacredLoader';

const Register: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [language, setLanguage] = useState('en');
  const [dob, setDob] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔥 Smooth Animated Heading (fade + slide)
  const AnimatedHeading = () => {
    const texts = [
      "Start your authentic journey",
      "अपनी असली यात्रा शुरू करें",
    ];

    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
      const interval = setInterval(() => {
        setFade(false);

        setTimeout(() => {
          setIndex((prev) => (prev + 1) % texts.length);
          setFade(true);
        }, 450); // smoother fade-out before switching
      }, 3000); // switch every 3 sec

      return () => clearInterval(interval);
    }, []);

    return (
      <p
        className={`
          text-muted-foreground
          transition-all 
          duration-700 
          ease-out
          ${fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
        `}
      >
        {texts[index]}
      </p>
    );
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      toast.error('Please enter a valid 10-digit Indian phone number');
      return;
    }

    if (dob) {
      const dobDate = new Date(dob);
      const today = new Date();
      if (dobDate >= today) {
        toast.error('Date of birth cannot be in the future');
        return;
      }

      const minAgeDate = new Date();
      minAgeDate.setFullYear(minAgeDate.getFullYear() - 10);
      if (dobDate > minAgeDate) {
        toast.error('You must be at least 10 years old to register');
        return;
      }
    }

    if (!acceptedTerms) {
      toast.error('Please accept the Terms and Conditions to continue');
      return;
    }

    setLoading(true);

    try {
      await register({ name, phone });
      toast.success(t('auth.registerSuccess') || 'Registration successful!');
      navigate('/app/home', { replace: true });
    } catch (error: any) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100 p-4">
      <div className="sacred-card max-w-md w-full p-8 animate-fade-in">
        
        <div className="text-center mb-8">
          <div className="text-6xl text-amber-600 mb-4"> ॐ </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('auth.register') || 'Create Account'}
          </h1>

          {/* 🔥 Smooth Animated Text */}
          <AnimatedHeading />
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          
          <div className="space-y-2">
            <Label htmlFor="name">{t('auth.name') || 'Full Name'} *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('auth.phone') || 'Phone Number'} *</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">+91</span>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter 10-digit number"
                value={phone}
                onChange={handlePhoneChange}
                disabled={loading}
                className="rounded-l-none"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Preferred Language *</Label>
            <Select value={language} onValueChange={setLanguage} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              You can change this later in settings
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              disabled={loading}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-start space-x-3">
              <input
                id="terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                disabled={loading}
                className="mt-1 w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 focus:ring-2"
              />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="terms" className="text-sm font-medium cursor-pointer">
                  I agree to the{' '}
                  <Link to="/terms" target="_blank" className="text-amber-600 hover:text-amber-700 underline font-medium">Terms and Conditions</Link>
                  {' '}and{' '}
                  <Link to="/privacy" target="_blank" className="text-amber-600 hover:text-amber-700 underline font-medium">Privacy Policy</Link>
                  {' '}*
                </label>
                <p className="text-xs text-muted-foreground">
                  You must accept our terms and privacy policy to create an account
                </p>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-amber-600 text-white hover:bg-amber-700"
            disabled={loading || !acceptedTerms}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <SacredLoader />
                <span>Creating Account...</span>
              </div>
            ) : (
              t('auth.register') || 'Create Account'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-amber-600 hover:underline font-medium">
              {t('auth.login') || 'Sign In'}
            </Link>
          </p>
        </div>

        <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <p className="text-xs text-amber-800 text-center">
            Your spiritual journey is Private and sacred. We respect your privacy and protect your data.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
