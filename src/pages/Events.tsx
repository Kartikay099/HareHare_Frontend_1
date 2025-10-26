import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getUpcomingEvents, Event } from '@/services/api';
import { Calendar, MapPin } from 'lucide-react';
import SacredLoader from '@/components/SacredLoader';

const Events: React.FC = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getUpcomingEvents();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
  <div className="relative">
    <div className="text-6xl text-amber-600">ॐ</div>
  </div>
  
  <div className="text-center space-y-2">
    <p className="text-lg font-semibold text-amber-700 animate-pulse">
      ॐ शान्ति शान्ति शान्तिः
    </p>
    {/* <p className="text-sm text-amber-600">
      Divine energy flowing...
    </p> */}
  </div>
</div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          {t('events.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('events.upcomingEvents')}
        </p>
      </div>

      <div className="space-y-4">
        {events.map((event, index) => (
          <div
            key={event.id}
            className="sacred-card p-6 hover-sacred animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-lg flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {new Date(event.date).getDate()}
                    </span>
                    <span className="text-xs text-primary">
                      {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-1">
                      {event.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {event.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4 text-accent" />
                        <span className="text-accent font-medium">{event.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {events.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{t('events.noEvents')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
