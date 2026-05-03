'use client';

import React, { useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { useAuth } from './AuthProvider';
import { useStore } from '@/store/useStore';

export function SyncProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { subjects, subtopics, topics, theme, setUserId, setAllData, setTheme } = useStore();
  const isInitialMount = useRef(true);
  const isSyncingFromRemote = useRef(false);

  // Sync userId to store
  useEffect(() => {
    setUserId(user?.uid || null);
  }, [user, setUserId]);

  // Handle Remote -> Local Sync (Real-time updates)
  useEffect(() => {
    if (!user) return;

    const userDocRef = doc(db, 'users', user.uid);
    
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        isSyncingFromRemote.current = true;
        
        if (data.subjects || data.subtopics || data.topics) {
          setAllData({
            subjects: data.subjects || [],
            subtopics: data.subtopics || [],
            topics: data.topics || []
          });
        }
        
        if (data.theme) {
          setTheme(data.theme);
        }
        
        // Reset after state update is likely processed
        setTimeout(() => { isSyncingFromRemote.current = false; }, 100);
      } else {
        // First time user? Let's push existing local data if any
        if (subjects.length > 0 || subtopics.length > 0 || topics.length > 0) {
           setDoc(userDocRef, { subjects, subtopics, topics, theme });
        }
      }
    });

    return () => unsubscribe();
  }, [user, setAllData, setTheme]);

  // Handle Local -> Remote Sync (Push changes)
  useEffect(() => {
    if (!user || isSyncingFromRemote.current) return;
    
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const userDocRef = doc(db, 'users', user.uid);
      setDoc(userDocRef, { subjects, subtopics, topics, theme }, { merge: true });
    }, 1000); // Debounce push to Firestore

    return () => clearTimeout(timer);
  }, [subjects, subtopics, topics, theme, user]);

  return <>{children}</>;
}
