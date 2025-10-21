import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import SacredLoader from '@/components/SacredLoader';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/home', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSendOtp = async () => {
    if (!phone) {
      toast.error('Please enter phone number');
      return;
    }
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setShowOtp(true);
    setLoading(false);
    toast.success('OTP sent successfully!');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showOtp) {
      handleSendOtp();
      return;
    }

    setLoading(true);
    try {
      await login({ phone, otp });
      toast.success(t('auth.loginSuccess'));
      navigate('/app/home', { replace: true });
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center devotion-gradient p-4">
      <div className="sacred-card max-w-md w-full p-8 animate-fade-in">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🙏</div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('auth.login')}
          </h1>
          <p className="text-muted-foreground">
            {t('app.welcome')}
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phone">{t('auth.phone')}</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={showOtp || loading}
              required
            />
          </div>

          {showOtp && (
            <div className="space-y-2 animate-slide-up">
              <Label htmlFor="otp">{t('auth.otp')}</Label>
              <Input
                id="otp"
                type="text"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                disabled={loading}
                maxLength={6}
                required
              />
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? (
              <SacredLoader />
            ) : showOtp ? (
              t('auth.verifyOtp')
            ) : (
              t('auth.sendOtp')
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link
              to="/auth/register"
              className="text-primary hover:underline font-medium"
            >
              {t('auth.register')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
