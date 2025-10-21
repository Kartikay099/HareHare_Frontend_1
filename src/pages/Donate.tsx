import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart } from 'lucide-react';
import { mockDonate } from '@/services/api';
import { toast } from 'sonner';
import SacredLoader from '@/components/SacredLoader';

const Donate: React.FC = () => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const presetAmounts = [100, 500, 1000, 5000];

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      await mockDonate(Number(amount));
      toast.success(t('donate.thankYou'));
      setAmount('');
    } catch (error) {
      toast.error('Donation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🙏</div>
        <h1 className="text-4xl font-bold text-foreground mb-2">
          {t('donate.title')}
        </h1>
        <p className="text-muted-foreground">
          Your generosity helps preserve and spread sacred knowledge
        </p>
      </div>

      <div className="sacred-card p-8">
        <form onSubmit={handleDonate} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="amount">{t('donate.amount')} (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={loading}
              min="1"
              required
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {presetAmounts.map((preset) => (
              <Button
                key={preset}
                type="button"
                variant="outline"
                onClick={() => setAmount(String(preset))}
                disabled={loading}
                className="hover:bg-primary/10"
              >
                ₹{preset}
              </Button>
            ))}
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center space-x-2"
            disabled={loading}
          >
            {loading ? (
              <SacredLoader />
            ) : (
              <>
                <Heart className="h-5 w-5" />
                <span>{t('donate.makedonation')}</span>
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 pt-8 border-t border-border">
          <h3 className="font-semibold text-foreground mb-4">Impact of Your Donation</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>✓ Support temple maintenance and festivals</p>
            <p>✓ Provide free spiritual education</p>
            <p>✓ Distribute sacred texts and resources</p>
            <p>✓ Help those in need through charitable activities</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
