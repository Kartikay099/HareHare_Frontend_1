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
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuth();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [preferred_language, setPreferredLanguage] = useState(localStorage.getItem('language') || 'en');
  const [date_of_birth, setDateOfBirth] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  // ⭐ ADDED STATE  
  const [referral_code, setReferralCode] = useState('');

  // Animated heading text
  const AnimatedHeading = () => {
    const texts = [
      "Start your authentic journey",
      "अपनी असली यात्रा शुरू करें",
      "మీ నిజమైన ప్రయాణాన్ని ప్రారంభించండి"
    ];

    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
      const interval = setInterval(() => {
        setFade(false);

        setTimeout(() => {
          setIndex((prev) => (prev + 1) % texts.length);
          setFade(true);
        }, 450);
      }, 3000);

      return () => clearInterval(interval);
    }, []);

    return (
      <p className={`text-muted-foreground transition-all duration-700 ease-out ${fade ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}>
        {texts[index]}
      </p>
    );
  };

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Handle Language Change
  const handleLanguageChange = (value: string) => {
    setPreferredLanguage(value);
    localStorage.setItem('language', value);
    i18n.changeLanguage(value);
  };

  // Submit handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Email validation - only if email is provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error('Please enter a valid email address');
        return;
      }
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      toast.error('Please enter a valid 10-digit Indian phone number');
      return;
    }

    // DOB Validation
    if (date_of_birth) {
      const dobDate = new Date(date_of_birth);
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
      toast.error('Please accept the Terms & Privacy Policy to continue');
      return;
    }

    if (!name.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!preferred_language) {
      toast.error('Please select your preferred language');
      return;
    }

    setLoading(true);

    try {
      // ⭐ ADDED referral_code in API payload
      const userData = {
        name: name.trim(),
        phone,
        preferred_language: preferred_language || 'en',
        email: email.trim() || null,
        date_of_birth: date_of_birth || null,
        referral_code: referral_code.trim() || null,  // <-- VERY IMPORTANT
      };

      await register(userData);
      toast.success(t('auth.registerSuccess') || 'Registration successful!');
      navigate('/app/home', { replace: true });
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Phone input handler
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) setPhone(value);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/auth_background.png')" }}
    >
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />

      <div className="sacred-card max-w-md w-full p-8 animate-fade-in relative z-10 bg-transparent border-none shadow-none">

        {/* Header */}
        <div className="text-center mb-8">
          <img src="/applogo.png" alt="App Logo" className="h-24 w-auto mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-black mb-2 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">
            {t('auth.register') || 'Create Account'}
          </h1>
          <AnimatedHeading />
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-6">

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="font-extrabold text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] text-base">Full Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="bg-white text-black border-amber-200 shadow-sm font-medium placeholder:text-gray-400"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="font-extrabold text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] text-base">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="bg-white text-black border-amber-200 shadow-sm font-medium placeholder:text-gray-400"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="font-extrabold text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] text-base">Phone Number *</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-amber-200 bg-white text-black font-bold text-sm shadow-sm">
                +91
              </span>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter 10-digit number"
                value={phone}
                onChange={handlePhoneChange}
                disabled={loading}
                className="rounded-l-none bg-white text-black border-amber-200 shadow-sm font-medium placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          {/* Language */}
          <div className="space-y-2">
            <Label className="font-extrabold text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] text-base">Preferred Language *</Label>
            <Select value={preferred_language} onValueChange={handleLanguageChange} disabled={loading}>
              <SelectTrigger className="bg-white text-black border-amber-200 shadow-sm font-medium">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-black font-bold drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">You can change it later in settings.</p>
          </div>

          {/* DOB */}
          <div className="space-y-2">
            <Label htmlFor="date_of_birth" className="font-extrabold text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] text-base">Date of Birth</Label>
            <Input
              id="date_of_birth"
              type="date"
              value={date_of_birth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              disabled={loading}
              max={new Date().toISOString().split('T')[0]}
              className="bg-white text-black border-amber-200 shadow-sm font-medium"
            />
          </div>

          {/* ⭐ Referral Code */}
          <div className="space-y-2">
            <Label htmlFor="referral_code" className="font-extrabold text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] text-base">Referral Code (optional)</Label>
            <Input
              id="referral_code"
              type="text"
              placeholder="Enter referral code"
              value={referral_code}
              onChange={(e) => setReferralCode(e.target.value)}
              disabled={loading}
              className="bg-white text-black border-amber-200 shadow-sm font-medium placeholder:text-gray-400"
            />
          </div>

          {/* Terms */}
          <div className="space-y-3 pt-1">
            <div className="flex items-start space-x-3">
              <input
                id="terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                disabled={loading}
                className="mt-1 w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 focus:ring-2"
              />
              <label htmlFor="terms" className="text-sm leading-tight cursor-pointer text-black font-bold drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                I agree to the{' '}
                <Link to="/terms" className="text-amber-900 hover:text-black underline decoration-2 font-extrabold">
                  Terms & Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-amber-900 hover:text-black underline decoration-2 font-extrabold">
                  Privacy Policy
                </Link>{' '}
                *
              </label>
            </div>
          </div>

          {/* Submit Btn */}
          <Button
            type="submit"
            className="w-full bg-amber-600 text-white hover:bg-amber-700 transition shadow-lg font-bold text-lg"
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

        {/* Already account */}
        <div className="mt-6 text-center">
          <p className="text-sm text-black font-bold drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
            Already have an account?{' '}
            <Link to="/auth/login" className="text-amber-900 hover:text-black underline decoration-2 font-extrabold">
              {t('auth.login') || 'Sign In'}
            </Link>
          </p>
        </div>

        {/* Bottom Notice */}
        <div className="mt-4 p-3 bg-white/90 backdrop-blur-sm rounded-lg border border-amber-200 shadow-sm">
          <p className="text-xs text-amber-950 text-center font-bold">
            Your spiritual journey is private & sacred. We respect your privacy. 🙏
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
