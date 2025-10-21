import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getPujaGuides, PujaGuide } from '@/services/api';
import { Clock, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SacredLoader from '@/components/SacredLoader';
import { toast } from 'sonner';

const Puja: React.FC = () => {
  const { t } = useTranslation();
  const [guides, setGuides] = useState<PujaGuide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const data = await getPujaGuides();
        setGuides(data);
      } catch (error) {
        console.error('Failed to fetch puja guides:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, []);

  const handleStartPuja = (guide: PujaGuide) => {
    toast.success(`Starting ${guide.name}...`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <SacredLoader />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          {t('puja.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('puja.guides')}
        </p>
      </div>

      <div className="space-y-6">
        {guides.map((guide, index) => (
          <div
            key={guide.id}
            className="sacred-card p-6 hover-sacred animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between space-y-4 md:space-y-0">
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-foreground mb-2">
                  {guide.name}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {guide.description}
                </p>
                
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                  <Clock className="h-4 w-4" />
                  <span>{guide.duration}</span>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Steps:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                    {guide.steps.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </div>

              <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-2">
                <Button
                  onClick={() => handleStartPuja(guide)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>{t('puja.startPuja')}</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Puja;
