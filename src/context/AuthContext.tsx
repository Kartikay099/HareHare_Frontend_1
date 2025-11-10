import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (phone: string, idToken: string) => Promise<void>;
  register: (data: { name: string; phone: string; password?: string }, idToken?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('sacred_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('sacred_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (phone: string, idToken: string) => {
    setIsLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'https://nontemporarily-subthoracic-giselle.ngrok-free.dev/';
      const fullPhoneNumber = `+91${phone}`;

      const requestPayloads = [
        { phone: fullPhoneNumber, firebase_token: idToken },
        { phone_number: fullPhoneNumber, id_token: idToken },
        { phone: fullPhoneNumber, token: idToken }
      ];

      let response = null;
      let lastError = null;

      for (const payload of requestPayloads) {
        try {
          console.log('Trying login payload:', payload);
          response = await fetch(`${backendUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (response.ok) break;
          
          const errorText = await response.text();
          lastError = `Status: ${response.status}, Error: ${errorText}`;
          console.log(`Login payload failed:`, payload, lastError);
          
        } catch (error) {
          lastError = error;
          console.log(`Login payload failed:`, payload, error);
        }
      }

      if (!response || !response.ok) {
        throw new Error(lastError || 'All login attempts failed');
      }

      const backendUser = await response.json();
      
      const verifiedUser: User = {
        id: backendUser.id || backendUser.user_id || `user-${phone}`,
        name: backendUser.name || backendUser.display_name || 'Devotee User',
        phone: backendUser.phone || fullPhoneNumber,
        email: backendUser.email,
      };
      
      setUser(verifiedUser);
      localStorage.setItem('sacred_user', JSON.stringify(verifiedUser));
      
      if (backendUser.token) {
        localStorage.setItem('auth_token', backendUser.token);
      } else {
        localStorage.setItem('auth_token', idToken);
      }

    } catch (error: any) {
      console.error("Login error:", error);
      
      if (error.message.includes('400')) {
        throw new Error('Invalid request. Please check your phone number and try again.');
      } else if (error.message.includes('404')) {
        throw new Error('User not found. Please register first.');
      } else if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error. Please check your connection.');
      } else {
        throw new Error('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: { name: string; phone: string; password?: string }, idToken?: string) => {
    setIsLoading(true);
    try {
      const backendUrl = import.meta.env.VITE_API_URL || 'https://nontemporarily-subthoracic-giselle.ngrok-free.dev/';
      
      const requestData = {
        ...data,
        phone: `+91${data.phone}`,
        // Include the Firebase token in the payload if available
        ...(idToken && { 
          firebase_token: idToken,
          id_token: idToken,
          token: idToken 
        })
      };

      console.log('Registration attempt with data:', requestData);

      // Try registration with different payload combinations
      const payloads = [
        requestData,
        { ...requestData, firebase_token: idToken },
        { ...requestData, id_token: idToken },
        { ...requestData, token: idToken }
      ];

      let response = null;
      let lastError = null;

      for (const payload of payloads) {
        try {
          console.log('Trying registration payload:', payload);
          response = await fetch(`${backendUrl}/api/auth/register`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            console.log('Registration successful with payload:', payload);
            break;
          }
          
          const errorText = await response.text();
          lastError = `Status: ${response.status}, Error: ${errorText}`;
          console.log(`Registration payload failed:`, payload, lastError);
          
        } catch (error) {
          lastError = error;
          console.log(`Registration payload failed:`, payload, error);
        }
      }

      if (!response || !response.ok) {
        // If registration fails, try to auto-login and then register
        if (idToken) {
          console.log('Registration failed, trying auto-login approach');
          try {
            // First try to login (in case user already exists)
            await login(data.phone, idToken);
            return; // Login successful, exit
          } catch (loginError) {
            console.log('Auto-login failed, user likely needs registration');
          }
        }
        
        throw new Error(lastError || 'Registration failed. Please try again.');
      }

      const backendUser = await response.json();
      
      const newUser: User = {
        id: backendUser.id || backendUser.user_id,
        name: backendUser.name,
        phone: backendUser.phone,
        email: backendUser.email,
      };
      
      setUser(newUser);
      localStorage.setItem('sacred_user', JSON.stringify(newUser));
      
      if (backendUser.token) {
        localStorage.setItem('auth_token', backendUser.token);
      } else if (idToken) {
        localStorage.setItem('auth_token', idToken);
      }

      console.log('Registration completed successfully');

    } catch (error: any) {
      console.error('Registration error:', error);
      
      // Provide user-friendly error messages
      if (error.message.includes('401')) {
        throw new Error('Please complete phone verification first before registering.');
      } else if (error.message.includes('400')) {
        throw new Error('Invalid registration data. Please check your information.');
      } else if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      } else {
        throw new Error(error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sacred_user');
    localStorage.removeItem('auth_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};