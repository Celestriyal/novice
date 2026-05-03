'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, BookOpen, Settings, CheckSquare, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { motion } from 'framer-motion';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Subjects', href: '/subjects', icon: BookOpen },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
];

export function Sidebar() {
  const pathname = usePathname();
  const { topics, theme } = useStore();
  const [isHydrated, setIsHydrated] = React.useState(false);

  React.useEffect(() => {
    setIsHydrated(true);
  }, []);

  const completedCount = topics.filter(t => t.isCompleted).length;
  const totalCount = topics.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const currentUser = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    // Data will be cleared or kept local depending on your preference. 
    // Usually on logout we want to reset the store.
    useStore.getState().setAllData({ subjects: [], subtopics: [], topics: [] });
  };

  return (
    <div className="hidden md:flex flex-col h-screen w-64 bg-card border-r border-border fixed left-0 top-0 z-50 transition-all duration-500">
      <div className="p-6 flex flex-col gap-6">
        <h1 className={cn(
          "text-2xl font-black tracking-tighter flex items-center gap-2 italic transition-all duration-500",
          theme === 'crimson' ? "font-mono not-italic uppercase" : "",
          theme === 'solaris' ? "uppercase tracking-[0.2em]" : ""
        )}>
          <div className={cn(
            "w-8 h-8 flex items-center justify-center font-black not-italic transition-all duration-500",
            theme === 'crimson' ? "bg-success text-black rounded-none" : "bg-foreground text-background rounded-[calc(var(--radius)*0.8)] rotate-3 group-hover:rotate-0"
          )}>
            N
          </div>
          <span>NOVICE</span>
        </h1>

        {currentUser && (
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-xl border border-white/5">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground truncate">
                {currentUser.email?.split('@')[0]}
              </p>
              <p className="text-[9px] text-muted-foreground/50 truncate">Account Active</p>
            </div>
          </div>
        )}
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 transition-all duration-300 group relative",
                theme === 'crimson' ? "rounded-none" : "rounded-[var(--radius)]",
                isActive 
                  ? "bg-secondary text-foreground" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              )}
            >
              <Icon className={cn(
                "w-4 h-4 transition-transform duration-300 group-hover:scale-110",
                isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
              )} />
              <span className={cn(
                "font-semibold text-sm tracking-tight",
                theme === 'solaris' ? "uppercase tracking-widest text-[10px]" : ""
              )}>{item.name}</span>
              {isActive && (
                <motion.div 
                  layoutId="activeNav"
                  className={cn(
                    "absolute left-0 w-1 bg-foreground",
                    theme === 'crimson' ? "h-full" : "h-4 rounded-r-full"
                  )}
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className={cn(
        "p-6 border-t border-border bg-muted/20 transition-all duration-500",
        theme === 'aurora' ? "rounded-t-[var(--radius)]" : ""
      )}>
        {isHydrated && totalCount > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              <span>Overall Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-foreground"
              />
            </div>
          </div>
        )}
        <Link 
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 group mt-6",
            theme === 'crimson' ? "rounded-none" : "rounded-[var(--radius)]",
            pathname === '/settings' ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <Settings className={cn(
            "w-4 h-4 transition-transform duration-500",
            pathname === '/settings' ? "rotate-45 text-foreground" : "group-hover:rotate-45"
          )} />
          <span className={cn(
            "text-xs font-bold uppercase tracking-wider",
            theme === 'solaris' ? "text-[10px]" : ""
          )}>Settings</span>
        </Link>

        <button 
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-300 group mt-2 w-full text-left",
            theme === 'crimson' ? "rounded-none" : "rounded-[var(--radius)]",
            "text-muted-foreground hover:text-destructive hover:bg-destructive/5"
          )}
        >
          <LogOut className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className={cn(
            "text-xs font-bold uppercase tracking-wider",
            theme === 'solaris' ? "text-[10px]" : ""
          )}>Logout</span>
        </button>
        </div>
        </div>
        );
        }

