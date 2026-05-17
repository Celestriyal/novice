'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    // Force load after 5 seconds if Firebase doesn't respond
    const forceLoadTimeout = setTimeout(() => {
      console.warn("Auth took too long, forcing load...");
      setLoading(false);
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      clearTimeout(forceLoadTimeout);
      setUser(user);
      setLoading(false);
      
      // Redirect logic
      if (!user && pathname !== '/login') {
        router.push('/login');
      } else if (user && pathname === '/login') {
        router.push('/');
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(forceLoadTimeout);
    };
  }, [pathname, router]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center z-[9999]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-white text-black rounded-xl flex items-center justify-center font-black text-xl rotate-3 animate-pulse">
            N
          </div>
          <Loader2 className="w-6 h-6 text-white/20 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
