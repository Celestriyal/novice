'use client';

import { useStore } from "@/store/useStore";
import React, { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    
    // Remove all theme classes first
    const themeClasses = ['aurora-theme', 'solaris-theme', 'forest-theme', 'crimson-theme', 'frost-theme'];
    document.documentElement.classList.remove(...themeClasses);
    
    // Add active theme class
    if (theme !== 'default') {
      document.documentElement.classList.add(`${theme}-theme`);
    }
  }, [theme]);

  if (!isHydrated) return <>{children}</>;

  return (
    <>
      {/* Midnight Aurora Animated Glows */}
      {theme === 'aurora' && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-purple-600/20 aurora-blur rounded-full" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-cyan-600/20 aurora-blur rounded-full" style={{ animationDelay: '-5s' }} />
        </div>
      )}

      {/* Cyber Crimson Scanline */}
      {theme === 'crimson' && (
        <div className="fixed inset-0 pointer-events-none z-50 scanline opacity-50" />
      )}

      {/* Arctic Frost Shimmering Elements */}
      {theme === 'frost' && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {Array.from({ length: 15 }).map((_, i) => (
            <div 
              key={i}
              className="absolute bg-white/10 frost-line rounded-full blur-xl"
              style={{
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 2 + 1}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
                animationDelay: `${Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Solaris Gold Sun Glow */}
      {theme === 'solaris' && (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-amber-500/5 blur-[120px] rounded-full" />
        </div>
      )}

      {/* Abstract Background Graphics (Shared) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 opacity-20">
        <svg className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] text-primary/5 rotate-12" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" stroke="currentColor" fill="none" strokeWidth="0.5" strokeDasharray="2 2" />
          <circle cx="50" cy="50" r="30" stroke="currentColor" fill="none" strokeWidth="0.5" />
        </svg>
        <svg className="absolute top-[60%] -right-[5%] w-[30%] h-[30%] text-primary/5 -rotate-12" viewBox="0 0 100 100">
          <rect x="20" y="20" width="60" height="60" stroke="currentColor" fill="none" strokeWidth="0.5" />
          <rect x="30" y="30" width="40" height="40" stroke="currentColor" fill="none" strokeWidth="0.5" strokeDasharray="4 4" />
        </svg>
      </div>
      
      {children}
    </>
  );
}
