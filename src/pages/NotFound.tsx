import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center devotion-gradient p-4">
      <div className="sacred-card max-w-md w-full p-8 text-center animate-fade-in">
        <div className="text-8xl mb-4">🙏</div>
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Path Not Found
        </h2>
        <p className="text-muted-foreground mb-6">
          The path you seek does not exist on this sacred journey.
        </p>
        <Link to="/app/home">
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center space-x-2 mx-auto">
            <Home className="h-5 w-5" />
            <span>Return Home</span>
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
