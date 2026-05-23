'use client';

import React, { useState, useEffect } from 'react';
import { useStore, type AppTheme } from '@/store/useStore';
import { useAuth } from '@/components/providers/AuthProvider';
import { auth, db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential, linkWithCredential } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Sun, 
  Trees, 
  Zap, 
  Snowflake, 
  Moon,
  Palette, 
  Check, 
  Image as ImageIcon,
  ShieldCheck,
  LogOut,
  User as UserIcon,
  Lock,
  Edit2,
  Save,
  X,
  Loader2,
  Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { theme, setTheme } = useStore();
  const { user, isAdmin, profile, refreshProfile } = useAuth();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Profile Update State
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState(profile?.name || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Password Update State
  const [showPassModal, setShowPassModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPass, setIsUpdatingPass] = useState(false);
  const [passError, setPassError] = useState('');

  useEffect(() => {
    setIsHydrated(true);
    if (profile?.name) setNewName(profile.name);
  }, [profile]);

  if (!isHydrated) return null;

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleUpdateName = async () => {
    if (!user || !newName.trim()) return;
    setIsUpdatingProfile(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name: newName.trim()
      });
      await refreshProfile();
      setIsEditingName(false);
    } catch (error) {
      console.error("Failed to update name:", error);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (newPassword !== confirmPassword) {
      setPassError("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      setPassError("Password must be at least 6 characters");
      return;
    }

    setIsUpdatingPass(true);
    setPassError('');

    try {
      const hasPassword = user.providerData.some(p => p.providerId === 'password');
      
      if (hasPassword) {
        // Change existing password - requires re-auth
        const credential = EmailAuthProvider.credential(user.email!, oldPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
      } else {
        // Google user setting up password for the first time
        const credential = EmailAuthProvider.credential(user.email!, newPassword);
        await linkWithCredential(user, credential);
      }
      
      setShowPassModal(false);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      alert("Password updated successfully!");
    } catch (error: any) {
      setPassError(error.message);
    } finally {
      setIsUpdatingPass(false);
    }
  };

  const isGoogleOnly = user?.providerData.length === 1 && user.providerData[0].providerId === 'google.com';

  const themes: { id: AppTheme; name: string; description: string; icon: any; color: string }[] = [
    {
      id: 'default',
      name: 'Deep Obsidian',
      description: 'The classic high-contrast black aesthetic.',
      icon: Moon,
      color: 'bg-zinc-900'
    },
    {
      id: 'aurora',
      name: 'Midnight Aurora',
      description: 'Ethereal purple and cyan light flows.',
      icon: Sparkles,
      color: 'bg-purple-600'
    },
    {
      id: 'solaris',
      name: 'Solaris Gold',
      description: 'Warm amber glow on deep charcoal.',
      icon: Sun,
      color: 'bg-amber-500'
    },
    {
      id: 'forest',
      name: 'Forest Mist',
      description: 'Serene emerald and deep moss tones.',
      icon: Trees,
      color: 'bg-emerald-600'
    },
    {
      id: 'crimson',
      name: 'Cyber Crimson',
      description: 'Sharp technical red on pure black.',
      icon: Zap,
      color: 'bg-red-600'
    },
    {
      id: 'frost',
      name: 'Arctic Frost',
      description: 'Clean icy blue and deep navy vibes.',
      icon: Snowflake,
      color: 'bg-sky-400'
    }
  ];

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Personalize your Novice experience.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#080808] border border-white/5 rounded-3xl p-6 glass-card">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center gap-2">
            <UserIcon className="w-3 h-3" /> Profile Information
          </h3>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    disabled={!isEditingName}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className={cn(
                      "w-full bg-black border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none transition-all",
                      isEditingName ? "border-primary/50" : "border-white/5 opacity-50"
                    )}
                  />
                </div>
                {isEditingName ? (
                  <div className="flex gap-1">
                    <button
                      onClick={handleUpdateName}
                      disabled={isUpdatingProfile}
                      className="p-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                      {isUpdatingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => { setIsEditingName(false); setNewName(profile?.name || ''); }}
                      className="p-3 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="p-3 bg-white/5 text-muted-foreground rounded-xl hover:bg-white/10 hover:text-white transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-muted-foreground">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold">Security</h4>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      {isGoogleOnly ? 'Setup Login Password' : 'Change Account Password'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPassModal(true)}
                  className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-opacity"
                >
                  {isGoogleOnly ? 'Setup' : 'Change'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#080808] border border-white/5 rounded-3xl p-6 glass-card">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center gap-2">
            <Key className="w-3 h-3" /> Academic Identity
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Department</span>
                <span className="text-sm font-bold">{profile?.dept || '—'}</span>
              </div>
              <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Roll Number</span>
                <span className="text-sm font-bold">{profile?.rollNo || '—'}</span>
              </div>
            </div>
            <div className="bg-black/40 p-4 rounded-2xl border border-white/5">
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Current Semester</span>
              <span className="text-sm font-bold">{profile?.semester ? `${profile.semester}th Semester` : '—'}</span>
            </div>
            <p className="text-[9px] text-muted-foreground font-medium italic mt-2 opacity-50">
              * To change academic details, please contact the system administrator.
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showPassModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPassModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-primary/20" />
              
              <h3 className="text-xl font-black tracking-tighter uppercase italic mb-6 flex items-center gap-3">
                <Lock className="w-6 h-6 text-primary" />
                {isGoogleOnly ? 'Setup Password' : 'Change Password'}
              </h3>

              <form onSubmit={handlePasswordAction} className="space-y-4">
                {!isGoogleOnly && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Current Password</label>
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="••••••••"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-all"
                    placeholder="••••••••"
                  />
                </div>

                {passError && (
                  <p className="text-destructive text-[10px] font-bold uppercase tracking-wider text-center">{passError}</p>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowPassModal(false)}
                    className="flex-1 py-3 bg-white/5 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdatingPass}
                    className="flex-1 py-3 bg-white text-black rounded-xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isUpdatingPass ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Update'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-card border border-border rounded-xl p-6 glass-card space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Palette className="w-5 h-5 text-primary" />
            <h3 className="text-xl font-bold tracking-tight">Experience Themes</h3>
          </div>

          <div className="space-y-3">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={cn(
                  "w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300 group text-left",
                  theme === t.id 
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20" 
                    : "border-border bg-muted/10 hover:border-muted-foreground/20 hover:bg-muted/20"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg",
                    t.color,
                    "text-white"
                  )}>
                    <t.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{t.name}</h4>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{t.description}</p>
                  </div>
                </div>
                {theme === t.id && (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-background" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-8 glass-card flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-muted/50 rounded-2xl flex items-center justify-center mb-4 rotate-3 group-hover:rotate-0 transition-transform">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold tracking-tight">Visual Polish</h3>
            <p className="text-xs text-muted-foreground max-w-[200px] mt-2">
              All themes are optimized for performance and visual clarity on OLED and high-end displays.
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 glass-card">
            <h3 className="font-bold mb-4">About Novice</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Designed for masters and deep learners. Novice is more than a tracker; it's a digital environment that respects your focus and aesthetic sensibility.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#080808] border border-white/5 rounded-3xl p-6 glass-card mt-8">
        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center gap-2">
          <UserIcon className="w-3 h-3" /> Account & Security
        </h3>
        
        <div className="flex flex-col md:flex-row gap-4">
          <button
            onClick={handleLogout}
            className="flex-1 flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl hover:bg-white/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-muted-foreground group-hover:text-white transition-colors">
                <LogOut className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-bold">Sign Out</h4>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{user?.email}</p>
              </div>
            </div>
          </button>

          {isAdmin && (
            <button
              onClick={() => router.push('/admin')}
              className="flex-1 flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-2xl hover:bg-primary/10 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-bold text-primary">Admin Console</h4>
                  <p className="text-[10px] text-primary/60 font-black uppercase tracking-widest">Manage Users & Data</p>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
