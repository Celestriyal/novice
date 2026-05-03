'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Settings, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Subjects', href: '/subjects', icon: BookOpen },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function BottomNav() {
  const pathname = usePathname();
  const { theme } = useStore();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] px-4 pb-6 pt-2 pointer-events-none">
      <div className={cn(
        "flex items-center justify-around p-2 pointer-events-auto transition-all duration-500",
        "glass-card border border-white/10 shadow-2xl shadow-black/50",
        theme === 'crimson' ? "rounded-none" : "rounded-2xl"
      )}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-300 relative",
                isActive 
                  ? "text-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeBottomNav"
                  className={cn(
                    "absolute inset-0 bg-primary/10 z-0",
                    theme === 'crimson' ? "rounded-none border-b-2 border-primary" : "rounded-xl"
                  )}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon className={cn(
                "w-5 h-5 relative z-10 transition-transform duration-300",
                isActive ? "scale-110" : ""
              )} />
              <span className={cn(
                "text-[10px] font-black uppercase tracking-widest relative z-10",
                theme === 'solaris' ? "tracking-[0.15em]" : ""
              )}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
