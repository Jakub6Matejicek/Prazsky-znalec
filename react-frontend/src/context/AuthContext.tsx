// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect } from 'react';

interface UserData {
  id: number;
  username: string;
  email: string;
}

interface AuthContextProps {
  currentUser: UserData | null;
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  isLoggedIn: false,
  login: async () => {},
  logout: async () => {},
  checkAuth: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  const isLoggedIn = !!currentUser;

  // 1) Načteme stav přihlášení při prvním mountu
  useEffect(() => {
    checkAuth();
  }, []);

  // 2) Funkce, která zjistí, jestli je user přihlášen (/api/me)
  const checkAuth = async () => {
    try {
      const res = await fetch('/api/me', {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.logged_in && data.user) {
        setCurrentUser(data.user);
      } else {
        setCurrentUser(null);
      }
    } catch (err) {
      console.error('Chyba při checkAuth', err);
      setCurrentUser(null);
    }
  };

  // 3) Login
  const login = async (username: string, password: string) => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // důležité pro session cookie
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Login error');
    }

    // Po úspěšném loginu znovu zavoláme checkAuth, aby se currentUser vyplnil
    await checkAuth();
  };

  // 4) Logout
  const logout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Chyba při logoutu', err);
    } finally {
      setCurrentUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoggedIn,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
