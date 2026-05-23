'use client';

import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/components/providers/AuthProvider';
import { motion } from 'framer-motion';
import { User as UserIcon, Book, Hash, GraduationCap, ArrowRight, Loader2, Sparkles } from 'lucide-react';

export function CompleteProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const [name, setName] = useState(profile?.name || '');
  const [dept, setDept] = useState(profile?.dept || '');
  const [rollNo, setRollNo] = useState(profile?.rollNo || '');
  const [semester, setSemester] = useState(profile?.semester || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError('');

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        name: name.trim(),
        dept: dept.trim(),
        rollNo: rollNo.trim(),
        semester: semester,
        updatedAt: Date.now()
      });
      await refreshProfile();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_50%)] pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-md bg-[#080808] border border-white/10 rounded-[2rem] p-8 glass-card relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white text-black rounded-2xl flex items-center justify-center mx-auto mb-4 font-black text-3xl rotate-3 shadow-[0_0_30px_rgba(255,255,255,0.2)]">
            N
          </div>
          <h2 className="text-2xl font-black tracking-tighter uppercase italic flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Complete Your Profile
          </h2>
          <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest mt-1 opacity-60">
            We need a few more details to set up your dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors"
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Department</label>
              <div className="relative">
                <Book className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={dept}
                  onChange={(e) => setDept(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="CSE"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Roll No</label>
              <div className="relative">
                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="12345"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Semester</label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                required
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-white/30 transition-colors appearance-none"
              >
                <option value="" disabled>Select Semester</option>
                {[1,2,3,4,5,6,7,8].map(s => (
                  <option key={s} value={s}>{s}th Semester</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="text-destructive text-[10px] font-bold uppercase tracking-wider text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black rounded-xl py-4 font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 mt-6"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Finalize Setup'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
