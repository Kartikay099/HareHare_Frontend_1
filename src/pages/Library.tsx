import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getScriptures, Scripture } from '@/services/api';
import { BookOpen, Search, Download, Eye } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Library: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [scriptures, setScriptures] = useState<Scripture[]>([]);
  const [filteredScriptures, setFilteredScriptures] = useState<Scripture[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchScriptures = async () => {
      try {
        const data = await getScriptures();
        setScriptures(data);
        setFilteredScriptures(data);
      } catch (error) {
        console.error('Failed to fetch scriptures:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScriptures();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = scriptures.filter(
        (scripture) =>
          scripture.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          scripture.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredScriptures(filtered);
    } else {
      setFilteredScriptures(scriptures);
    }
  }, [searchQuery, scriptures]);

  const handleDownload = (scripture: Scripture) => {
    // Mock download functionality
    console.log('Downloading:', scripture.name);
    // In real app: window.open(scripture.downloadUrl, '_blank');
  };

  const handleRead = (scripture: Scripture) => {
    // Mock read functionality
    console.log('Reading:', scripture.name);
    // In real app: navigate(`/scripture/${scripture.id}`);
  };

  // Loading screen with Hindi text
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative">
          <div className="text-6xl text-amber-600">ॐ</div>
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-amber-700 animate-pulse">
            {i18n.language === 'hi' ? 'ॐ शान्ति शान्ति शान्तिः' : 'Om Shanti Shanti Shantih'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">
          {t('library.title')}
        </h1>
        <p className="text-muted-foreground">
          {t('library.scriptures')} & {t('library.resources')}
        </p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t('library.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredScriptures.map((scripture, index) => (
          <div
            key={scripture.id}
            className="sacred-card p-6 hover-sacred animate-slide-up group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className="flex-shrink-0 w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-foreground mb-1">
                    {scripture.name}
                  </h3>
                  <p className="text-sm text-primary mb-2">{scripture.category}</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {scripture.description}
                  </p>
                </div>
              </div>
              
              {/* Action Buttons - Icons Only */}
              <div className="flex gap-2 ml-4">
                <Button
                  onClick={() => handleRead(scripture)}
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-primary hover:text-primary-foreground"
                  title={i18n.language === 'hi' ? 'पढ़ें' : 'Read'}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  onClick={() => handleDownload(scripture)}
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 hover:bg-green-600 hover:text-white"
                  title={i18n.language === 'hi' ? 'डाउनलोड करें' : 'Download PDF'}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {filteredScriptures.length === 0 && (
          <div className="col-span-2 text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {i18n.language === 'hi' ? 'कोई ग्रंथ नहीं मिले' : 'No scriptures found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;