'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { 
  Plus, 
  Trash2, 
  ChevronRight, 
  BookOpen, 
  Code, 
  Database, 
  Globe, 
  Cpu, 
  Atom, 
  Palette, 
  Music, 
  PenTool,
  Binary,
  Lightbulb,
  Microscope,
  Terminal,
  Server,
  Shield,
  Zap,
  Coffee,
  Brain,
  Rocket,
  Edit2,
  Check,
  X
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const subjectIcons = [
  BookOpen, Code, Database, Globe, Cpu, Atom, Palette, Music, PenTool, Binary, 
  Lightbulb, Microscope, Terminal, Server, Shield, Zap, Coffee, Brain, Rocket
];

export default function SubjectsPage() {
  const { subjects, addSubject, updateSubject, deleteSubject } = useStore();
  const [newSubjectName, setNewSubjectName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration to avoid mismatch with localStorage
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubjectName.trim()) {
      addSubject(newSubjectName.trim());
      setNewSubjectName('');
    }
  };

  const startEditing = (id: string, name: string) => {
    setEditingId(id);
    setEditName(name);
  };

  const handleUpdate = (id: string) => {
    if (editName.trim()) {
      updateSubject(id, editName.trim());
      setEditingId(null);
    }
  };

  if (!isHydrated) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Subjects</h1>
          <p className="text-muted-foreground mt-1 text-xs md:text-sm">Manage your main areas of learning.</p>
        </div>
      </div>

      <form onSubmit={handleAddSubject} className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          value={newSubjectName}
          onChange={(e) => setNewSubjectName(e.target.value)}
          placeholder="Enter subject name..."
          className="flex-1 bg-secondary border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
        />
        <button
          type="submit"
          disabled={!newSubjectName.trim()}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Add Subject
        </button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {subjects.map((subject, index) => {
            const IconComponent = subjectIcons[index % subjectIcons.length];
            return (
              <motion.div
                key={subject.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 relative overflow-hidden glass-card"
              >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <IconComponent className="w-24 h-24 rotate-12 translate-x-8 -translate-y-8" />
                </div>

                <div className="flex flex-col h-full space-y-4 relative z-10">
                  <div className="flex items-start justify-between">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110",
                      [
                        "bg-success/10 text-success",
                        "bg-info/10 text-info",
                        "bg-warning/10 text-warning"
                      ][index % 3]
                    )}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEditing(subject.id, subject.name)}
                        className="text-muted-foreground hover:text-primary transition-colors p-1"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteSubject(subject.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    {editingId === subject.id ? (
                      <div className="flex items-center gap-2 mt-1">
                        <input
                          type="text"
                          autoFocus
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleUpdate(subject.id)}
                          className="bg-black border border-primary/50 rounded-lg px-2 py-1 text-sm focus:outline-none w-full"
                        />
                        <button onClick={() => handleUpdate(subject.id)} className="text-success hover:scale-110 transition-transform"><Check className="w-4 h-4" /></button>
                        <button onClick={() => setEditingId(null)} className="text-destructive hover:scale-110 transition-transform"><X className="w-4 h-4" /></button>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-xl font-semibold tracking-tight">{subject.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Added {new Date(subject.createdAt).toLocaleDateString()}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="pt-2 mt-auto">
                    <Link
                      href={`/subjects/detail?id=${subject.id}`}
                      className="flex items-center justify-between w-full px-4 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-muted transition-colors group/link"
                    >
                      View Subtopics
                      <ChevronRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
                
                {/* Subtle background glow on hover */}
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
              </motion.div>
            );
          })}
        </AnimatePresence>

        {subjects.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-border rounded-xl">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-medium">No subjects yet</h3>
              <p className="text-muted-foreground">Start by adding your first subject above.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
