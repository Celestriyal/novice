'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  dept?: string;
  rollNo?: string;
  semester?: string;
  createdAt: number;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isProfileComplete: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  profile: null,
  loading: true, 
  isAdmin: false,
  isProfileComplete: true,
  refreshProfile: async () => {}
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isProfileComplete = !!(
    profile?.name && 
    profile?.dept && 
    profile?.rollNo && 
    profile?.semester
  );

  const fetchProfile = async (firebaseUser: User) => {
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserProfile;
        setProfile(userData);
        setIsAdmin(userData.role === 'admin');
        
        // Sync email if missing
        if (!userData.email) {
          await setDoc(userDocRef, { email: firebaseUser.email }, { merge: true });
        }
      } else {
        // Doc might not exist yet if registration is in progress
        setProfile(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user);
    }
  };

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        await fetchProfile(firebaseUser);
      } else {
        setProfile(null);
        setIsAdmin(false);
      }
      
      setLoading(false);
      
      // Redirect logic
      if (!firebaseUser && pathname !== '/login') {
        router.push('/login');
      } else if (firebaseUser && pathname === '/login') {
        router.push('/');
      }
    });

    return () => unsubscribe();
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
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, isProfileComplete, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
