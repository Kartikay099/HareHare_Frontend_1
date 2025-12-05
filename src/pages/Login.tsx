import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import SacredLoader from '@/components/SacredLoader';

// Firebase
import { auth, setupRecaptcha, sendOTP as firebaseSendOTP, verifyOTP as firebaseVerifyOTP } from '@/firebase';

declare global {
  interface Window {
    confirmationResult: any;
    recaptchaVerifier: any;
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

  /* ----------------------------------------------------
      Redirect if user already logged in
  ---------------------------------------------------- */
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/home', { replace: true });
    }
  }, [isAuthenticated]);

  /* ----------------------------------------------------
      Init Recaptcha Once
  ---------------------------------------------------- */
  useEffect(() => {
    setupRecaptcha();

    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (e) {
          console.error("Error clearing recaptcha", e);
        }
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  /* ----------------------------------------------------
      Send OTP
  ---------------------------------------------------- */
  const handleSendOtp = async () => {
    if (!phone.trim()) return toast.error("Please enter phone number");

    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      toast.error('Please enter a valid 10-digit Indian phone number');
      return;
    }

    setLoading(true);

    try {
      await firebaseSendOTP(phone);
      setShowOtp(true);
      toast.success('OTP sent successfully!');
    } catch (error: any) {
      console.error("OTP Send Error:", error);
      toast.error("Failed to send OTP. Try again.");
    }

    setLoading(false);
  };

  /* ----------------------------------------------------
      Verify OTP
  ---------------------------------------------------- */
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp.trim()) return toast.error("Enter OTP");

    if (otp.length !== 6) return toast.error("OTP must be 6 digits");

    setLoading(true);

    try {
      const result = await firebaseVerifyOTP(otp);
      const idToken = result.idToken;

      try {
        await login(phone, idToken); // Call your AuthProvider
        toast.success("Login successful!");
      } catch (authErr: any) {
        console.error("Backend Login Error:", authErr);

        if (
          authErr.message.includes("User not found") ||
          authErr.message.includes("register first")
        ) {
          toast.error("User not registered. Please register first.");
          navigate('/auth/register');
        } else {
          toast.error(authErr.message || "Login failed");
        }
      }
    } catch (error: any) {
      console.error("OTP Verification Error:", error);
      toast.error("Invalid or expired OTP");
      setOtp('');
    }

    setLoading(false);
  };

  /* ----------------------------------------------------
      Unified Submit
  ---------------------------------------------------- */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showOtp) handleSendOtp();
    else handleVerifyOtp(e);
  };

  /* ----------------------------------------------------
      Input Handlers
  ---------------------------------------------------- */
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 10) setPhone(value);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 6) setOtp(value);
  };

  /* ----------------------------------------------------
      UI STARTS
  ---------------------------------------------------- */
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/auth_background.png')" }}
    >
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />

      <div className="sacred-card max-w-md w-full p-8 animate-fade-in relative z-10 bg-transparent border-none shadow-none">
        <div className="text-center mb-8">
          <img src="/applogo.png" alt="App Logo" className="h-24 w-auto mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-black mb-2 drop-shadow-[0_2px_2px_rgba(255,255,255,0.8)]">
            {t('auth.login') || 'Login'}
          </h1>
        </div>

        {/* Recaptcha container */}
        <div id="recaptcha-container" ref={recaptchaContainerRef} style={{ display: 'none' }}></div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Phone Input */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="font-extrabold text-black text-base">
              Phone Number
            </Label>
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
                className="rounded-l-none bg-white text-black border-amber-200 shadow-sm"
                required
              />
            </div>
          </div>

          {/* OTP Input */}
          {showOtp && (
            <div className="space-y-2 animate-slide-up">
              <Label htmlFor="otp" className="font-extrabold text-black text-base">
                OTP
              </Label>
              <Input
                id="otp"
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={handleOtpChange}
                disabled={loading}
                maxLength={6}
                className="bg-white text-black border-amber-200 shadow-sm"
                required
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-amber-600 text-white hover:bg-amber-700 shadow-lg font-bold text-lg"
            disabled={loading}
          >
            {loading ? <SacredLoader /> : showOtp ? 'Verify OTP' : 'Send OTP'}
          </Button>
        </form>

        {showOtp && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleSendOtp}
              className="text-sm underline text-amber-800 font-bold"
              disabled={loading}
            >
              Resend OTP
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-black font-bold">
            Don't have an account?{' '}
            <Link to="/auth/register" className="text-amber-900 hover:text-black underline font-extrabold">
              {t('auth.register') || 'Register'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

