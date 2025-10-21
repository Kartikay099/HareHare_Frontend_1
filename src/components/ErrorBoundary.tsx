import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center devotion-gradient p-4">
          <div className="sacred-card max-w-md w-full p-8 text-center animate-fade-in">
            <div className="text-6xl mb-4">🙏</div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Something went wrong
            </h1>
            <p className="text-muted-foreground mb-6">
              Please reload the page to continue your sacred journey.
            </p>
            <Button
              onClick={this.handleReload}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
