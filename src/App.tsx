import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/context/AuthContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/AppLayout';

// Pages
import Onboarding from '@/pages/Onboarding';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Home from '@/pages/Home';
import Events from '@/pages/Events';
import Donate from '@/pages/Donate';
import Library from '@/pages/Library';
import Profile from '@/pages/Profile';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import Chat from '@/pages/Chat';

// ⭐ New Added Page
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import PujaDetails from '@/pages/PujaDetails';

// i18n config
import '@/i18n/config';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <HashRouter>
              <Routes>

                {/* Public */}
                <Route path="/" element={<Onboarding />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />

                {/* Protected */}
                <Route
                  path="/app"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/app/home" replace />} />
                  <Route path="home" element={<Home />} />
                  <Route path="events" element={<Events />} />
              
                  <Route path="puja/:id" element={<PujaDetails />} />
                  <Route path="puja-details" element={<PujaDetails />} />
                  <Route path="donate" element={<Donate />} />
                  <Route path="library" element={<Library />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="chat" element={<Chat />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </HashRouter>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;