'use client';

import React, { useState, useEffect } from 'react';
import { useStore, type AppTheme } from '@/store/useStore';
import { 
  Sparkles, 
  Sun, 
  Trees, 
  Zap, 
  Snowflake, 
  Moon,
  Palette, 
  Check, 
  Image as ImageIcon 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { theme, setTheme } = useStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return null;

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
    </div>
  );
}
