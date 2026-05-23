'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/components/providers/AuthProvider';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import { 
  Users, 
  UserCircle, 
  Download, 
  Upload, 
  Eye, 
  EyeOff, 
  ChevronRight,
  ShieldCheck,
  Search,
  Loader2,
  Trash2,
  Copy,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface UserData {
  id: string;
  email: string;
  name?: string;
  rollNo?: string;
  role: string;
  subjects?: any[];
  subtopics?: any[];
  topics?: any[];
}

export default function AdminPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const { impersonatedUserId, setImpersonatedUserId, clearImpersonation } = useStore();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [exportData, setExportData] = useState<any>(null);
  const [exportingUserId, setExportingUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/');
    }
  }, [isAdmin, authLoading, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdmin) return;
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const usersList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as UserData[];
        setUsers(usersList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin]);

  const handleImpersonate = (userId: string) => {
    if (impersonatedUserId === userId) {
      clearImpersonation();
    } else {
      setImpersonatedUserId(userId);
      router.push('/');
    }
  };

  const handleExport = async (userId: string) => {
    setExportingUserId(userId);
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setExportData({
          subjects: data.subjects || [],
          subtopics: data.subtopics || [],
          topics: data.topics || []
        });
        alert(`Data exported from ${data.email || userId}`);
      }
    } catch (error) {
      console.error("Export failed:", error);
      alert("Export failed");
    } finally {
      setExportingUserId(null);
    }
  };

  const handleImport = async (userId: string) => {
    if (!exportData) {
      alert("No data to import. Export data from a user first.");
      return;
    }

    if (!confirm(`Are you sure you want to import data to this user? This will merge with their existing data.`)) {
      return;
    }

    try {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);
      const currentData = userDoc.exists() ? userDoc.data() : {};

      // Perform additive merge of arrays
      const mergedData = {
        subjects: [...(currentData.subjects || []), ...exportData.subjects],
        subtopics: [...(currentData.subtopics || []), ...exportData.subtopics],
        topics: [...(currentData.topics || []), ...exportData.topics],
      };

      await setDoc(userDocRef, mergedData, { merge: true });
      alert("Data merged successfully");
    } catch (error) {
      console.error("Import failed:", error);
      alert("Import failed");
    }
  };

  const filteredUsers = users.filter(u => 
    (u.email || '').toLowerCase().includes(search.toLowerCase()) || 
    (u.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (u.rollNo || '').toLowerCase().includes(search.toLowerCase()) ||
    u.id.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3 italic uppercase">
            <ShieldCheck className="w-8 h-8 text-primary" />
            Admin Console
          </h1>
          <p className="text-muted-foreground mt-1 font-medium text-sm">Manage users and data impersonation.</p>
        </div>

        {impersonatedUserId && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-primary/10 border border-primary/20 rounded-2xl px-4 py-2 flex items-center gap-3"
          >
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Impersonating</span>
              <span className="text-xs font-bold truncate max-w-[150px]">
                {users.find(u => u.id === impersonatedUserId)?.email || impersonatedUserId}
              </span>
            </div>
            <button 
              onClick={clearImpersonation}
              className="p-2 hover:bg-primary/20 rounded-xl transition-colors text-primary"
            >
              <EyeOff className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-white transition-colors" />
            <input
              type="text"
              placeholder="Search users by email or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#080808] border border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:border-white/20 transition-all shadow-xl"
            />
          </div>

          <div className="space-y-3 h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredUsers.map((u) => (
              <motion.div
                key={u.id}
                layout
                className={cn(
                  "p-4 rounded-2xl border transition-all duration-300 group",
                  impersonatedUserId === u.id 
                    ? "bg-primary/5 border-primary/30" 
                    : "bg-[#080808] border-white/5 hover:border-white/10"
                )}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shrink-0 transition-transform group-hover:scale-110",
                      u.role === 'admin' ? "bg-primary text-primary-foreground" : "bg-white/5 text-white"
                    )}>
                      {u.email ? u.email[0].toUpperCase() : '?'}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold truncate text-sm">{u.name || u.email || 'No Name'}</h3>
                        {u.role === 'admin' && (
                          <span className="bg-primary/20 text-primary text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded">Admin</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[10px] text-muted-foreground font-mono truncate opacity-60">{u.email}</p>
                        {u.rollNo && (
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-muted-foreground/30">•</span>
                            <GraduationCap className="w-3 h-3 text-primary/50" />
                            <span className="text-[10px] font-black text-primary/70 uppercase tracking-widest">{u.rollNo}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleImpersonate(u.id)}
                      title={impersonatedUserId === u.id ? "Stop Impersonating" : "Impersonate"}
                      className={cn(
                        "p-2.5 rounded-xl transition-all",
                        impersonatedUserId === u.id 
                          ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.3)]" 
                          : "hover:bg-white/5 text-muted-foreground hover:text-white"
                      )}
                    >
                      {impersonatedUserId === u.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    
                    <button
                      onClick={() => handleExport(u.id)}
                      disabled={exportingUserId === u.id}
                      title="Export Data"
                      className="p-2.5 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-white transition-all disabled:opacity-50"
                    >
                      {exportingUserId === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleImport(u.id)}
                      disabled={!exportData}
                      title="Import Data"
                      className={cn(
                        "p-2.5 rounded-xl transition-all",
                        exportData 
                          ? "hover:bg-success/10 text-success" 
                          : "text-muted-foreground/30 cursor-not-allowed"
                      )}
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground text-sm font-medium">No users found matching your search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Data Transfer Info */}
        <div className="space-y-6">
          <div className="bg-[#080808] border border-white/5 rounded-3xl p-6 glass-card sticky top-8">
            <h2 className="text-xl font-black tracking-tighter uppercase italic mb-6">Data Buffer</h2>
            
            {exportData ? (
              <div className="space-y-4">
                <div className="p-4 bg-success/5 border border-success/20 rounded-2xl">
                  <p className="text-xs font-bold text-success mb-2 flex items-center gap-2">
                    <Copy className="w-3 h-3" /> Data Captured
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                    <div className="bg-black/40 p-2 rounded-lg">
                      <span className="text-white block mb-0.5">{exportData.subjects.length}</span>
                      Subjects
                    </div>
                    <div className="bg-black/40 p-2 rounded-lg">
                      <span className="text-white block mb-0.5">{exportData.subtopics.length}</span>
                      Subtopics
                    </div>
                    <div className="bg-black/40 p-2 rounded-lg col-span-2">
                      <span className="text-white block mb-0.5">{exportData.topics.length}</span>
                      Topics
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[10px] text-muted-foreground font-medium italic">
                    You can now select another user and click the upload icon to transfer this data to them.
                  </p>
                  <button
                    onClick={() => setExportData(null)}
                    className="w-full py-2 bg-white/5 hover:bg-destructive/10 hover:text-destructive rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Clear Buffer
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 opacity-30">
                <Download className="w-10 h-10 mx-auto mb-4" />
                <p className="text-xs font-black uppercase tracking-widest">Buffer is Empty</p>
                <p className="text-[10px] mt-2">Export data from a user to start.</p>
              </div>
            )}

            <div className="mt-8 pt-8 border-t border-white/5">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4">Instructions</h3>
              <ul className="space-y-3">
                {[
                  "Click the Eye icon to view the app exactly as that user sees it.",
                  "Click the Download icon to copy a user's entire roadmap.",
                  "Click the Upload icon to paste the copied roadmap into another user.",
                  "Manage Admin roles directly in the Firebase Console."
                ].map((step, i) => (
                  <li key={i} className="flex gap-3 text-[10px] text-muted-foreground font-medium">
                    <span className="text-primary font-black">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
