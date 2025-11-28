import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import SacredLoader from '@/components/SacredLoader';

// Firebase Auth imports
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
import { app } from '@/firebase';

const auth = getAuth(app);

declare global {
  interface Window {
    confirmationResult: any;
    recaptchaVerifier: RecaptchaVerifier | null;
  }
}

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Initialize ReCAPTCHA
  useEffect(() => {
    if (!window.recaptchaVerifier && recaptchaContainerRef.current) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
          'callback': () => {
            console.log('reCAPTCHA solved');
          },
          'expired-callback': () => {
            toast.error('reCAPTCHA expired. Please try again.');
            window.recaptchaVerifier = null;
          }
        });

        window.recaptchaVerifier.render().then((widgetId) => {
          console.log('reCAPTCHA rendered with widget ID:', widgetId);
        });
      } catch (error) {
        console.error("Failed to set up reCAPTCHA:", error);
        toast.error('Failed to initialize security verification');
      }
    }

    return () => {
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      toast.error('Please enter phone number');
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      toast.error('Please enter a valid 10-digit Indian phone number');
      return;
    }

    setLoading(true);

    try {
      const fullPhoneNumber = `+91${phone}`;

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible',
        });
      }

      const confirmation = await signInWithPhoneNumber(
        auth,
        fullPhoneNumber,
        window.recaptchaVerifier
      );

      window.confirmationResult = confirmation;
      setShowOtp(true);
      toast.success('OTP sent successfully! Check your messages.');

    } catch (error: any) {
      console.error('Error during OTP send:', error);

      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }

      let errorMessage = 'Failed to send OTP. Please try again.';
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later.';
      } else if (error.code === 'auth/quota-exceeded') {
        errorMessage = 'SMS quota exceeded. Please try again later.';
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.trim() || !window.confirmationResult) {
      toast.error('Please enter OTP');
      return;
    }

    if (otp.length !== 6) {
      toast.error('Please enter 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const result = await window.confirmationResult.confirm(otp);
      const user = result.user;

      const idToken = await user.getIdToken();

      await login(phone, idToken);

      toast.success('Login successful!');

    } catch (error: any) {
      console.error('Error during OTP verification:', error);

      let errorMessage = 'Invalid OTP. Please try again.';
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'Invalid OTP code';
      } else if (error.code === 'auth/code-expired') {
        errorMessage = 'OTP has expired. Please request a new one.';
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showOtp) {
      handleSendOtp();
    } else {
      handleVerifyOtp(e);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) {
      setPhone(value);
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) {
      setOtp(value);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/auth_background.png')" }}
    >
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />

      <div className="sacred-card max-w-md w-full p-8 animate-fade-in relative z-10 bg-transparent border-none shadow-none">
        <div className="text-center mb-8">
          <img src="/applogo.png" alt="App Logo" className="h-24 w-auto mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-black mb-2 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">
            {t('auth.login') || 'Login'}
          </h1>
          {/* <p className="text-muted-foreground">
            {t('app.welcome') || 'Welcome to Divine Dialogue'}
          </p> */}
        </div>

        <div id="recaptcha-container" ref={recaptchaContainerRef} style={{ display: 'none' }}></div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phone" className="font-extrabold text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] text-base">Phone Number</Label>
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
                disabled={showOtp || loading}
                className="rounded-l-none bg-white text-black border-amber-200 shadow-sm font-medium placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          {showOtp && (
            <div className="space-y-2 animate-slide-up">
              <Label htmlFor="otp" className="font-extrabold text-black drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] text-base">OTP</Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={handleOtpChange}
                disabled={loading}
                maxLength={6}
                className="bg-white text-black border-amber-200 shadow-sm font-medium placeholder:text-gray-400"
                required
              />
              <p className="text-xs text-black font-bold drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                Enter the OTP sent to +91{phone}
              </p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-amber-600 text-white hover:bg-amber-700 shadow-lg font-bold text-lg"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <SacredLoader />
              </div>
            ) : showOtp ? (
              'Verify OTP'
            ) : (
              'Send OTP'
            )}
          </Button>
        </form>

        {showOtp && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={loading}
              className="text-sm text-amber-800 hover:text-amber-900 underline disabled:opacity-50 font-extrabold drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
            >
              Resend OTP
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-black font-bold drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
            Don't have an account?{' '}
            <Link
              to="/auth/register"
              className="text-amber-900 hover:text-black underline decoration-2 font-extrabold"
            >
              {t('auth.register') || 'Register'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;