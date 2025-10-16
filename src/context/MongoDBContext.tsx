'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  uid: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  tokenBalance: number;
  role?: 'admin';
  createdAt: Date;
}

interface MongoDBContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  updateTokenBalance: (newBalance: number) => void;
}

const MongoDBContext = createContext<MongoDBContextType | undefined>(undefined);

export function MongoDBProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for user in localStorage on mount
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Error parsing saved user:', err);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    setError(null);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setError(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const updateTokenBalance = (newBalance: number) => {
    if (user) {
      updateUser({ tokenBalance: newBalance });
    }
  };

  return (
    <MongoDBContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        updateUser,
        updateTokenBalance,
      }}
    >
      {children}
    </MongoDBContext.Provider>
  );
}

export function useMongoDB() {
  const context = useContext(MongoDBContext);
  if (context === undefined) {
    throw new Error('useMongoDB must be used within a MongoDBProvider');
  }
  return context;
}