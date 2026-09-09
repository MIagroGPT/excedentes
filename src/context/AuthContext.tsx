'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserAdmin } from '@/lib/types';

interface AuthContextType {
  user: UserAdmin | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isSuperAdmin: boolean;
  isSupervisor: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
  isSuperAdmin: false,
  isSupervisor: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserAdmin | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const stored = typeof window !== 'undefined' ? localStorage.getItem('raees_admin_user') : null;
        if (stored) {
          try {
            setUser(JSON.parse(stored));
          } catch {
            localStorage.removeItem('raees_admin_user');
          }
        }

        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            localStorage.setItem('raees_admin_user', JSON.stringify(data.user));
          } else {
            setUser(null);
            localStorage.removeItem('raees_admin_user');
          }
        } else {
          if (!stored) {
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Credenciales inválidas' };
      }

      setUser(data.user);
      if (typeof window !== 'undefined') {
        localStorage.setItem('raees_admin_user', JSON.stringify(data.user));
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Error de conexión con el servidor' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('raees_admin_user');
    }
    router.push('/admin/login');
  };

  const isSuperAdmin = user?.rol === 'SUPER ADMIN';
  const isSupervisor = user?.rol === 'SUPERVISOR';

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isSuperAdmin, isSupervisor }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
