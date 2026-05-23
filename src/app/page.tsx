'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore';
import { useAuth } from '@/components/providers/AuthProvider';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  CheckSquare, 
  BookOpen, 
  TrendingUp, 
  Clock,
  LayoutDashboard,
  GraduationCap
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { subjects, topics, theme } = useStore();
  const { profile } = useAuth();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return null;

  const totalTopics = topics.length;
  const completedTopics = topics.filter(t => t.isCompleted).length;
  const overallPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

  // Data for Subject Progress Bar Chart
  const subjectProgressData = subjects.map(s => {
    const subjectTopics = topics.filter(t => {
      const subtopic = useStore.getState().subtopics.find(st => st.id === t.subtopicId);
      return subtopic?.subjectId === s.id;
    });
    const total = subjectTopics.length;
    const completed = subjectTopics.filter(t => t.isCompleted).length;
    return {
      name: s.name,
      completed,
      total,
      percentage: total > 0 ? (completed / total) * 100 : 0
    };
  }).sort((a, b) => b.percentage - a.percentage);

  // Data for Activity Chart (Last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const activityData = last7Days.map(dateStr => {
    const count = topics.filter(t => {
      if (!t.isCompleted || !t.completedAt) return false;
      return new Date(t.completedAt).toISOString().split('T')[0] === dateStr;
    }).length;
    
    return {
      date: new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' }),
      count
    };
  });

  const stats = [
    { label: 'Total Topics', value: totalTopics, icon: CheckSquare, color: 'text-info', bg: 'bg-info/10' },
    { label: 'Completed', value: completedTopics, icon: TrendingUp, color: 'text-success', bg: 'bg-success/10' },
    { label: 'Subjects', value: subjects.length, icon: BookOpen, color: 'text-warning', bg: 'bg-warning/10' },
    { label: 'Completion Rate', value: `${overallPercentage}%`, icon: Clock, color: 'text-primary', bg: 'bg-primary/10' },
  ];

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black tracking-tighter uppercase italic">
            Welcome, {profile?.name || 'Scholar'}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <GraduationCap className="w-3 h-3 text-primary" />
            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
              {profile?.dept || 'No Department'} • {profile?.rollNo || 'No Roll No'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              "p-6 glass-card relative overflow-hidden group transition-all duration-500",
              theme === 'crimson' ? "rounded-none border-success/30 shadow-[4px_4px_0px_rgba(255,0,0,0.1)]" : "rounded-[var(--radius)]"
            )}
          >
            <div className="absolute -right-2 -bottom-2 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
              <stat.icon className="w-16 h-16" />
            </div>
            <div className="flex items-center gap-4 relative z-10">
              <div className={cn(
                "p-2 flex items-center justify-center transition-all duration-500",
                theme === 'crimson' ? "rounded-none" : "rounded-[calc(var(--radius)*0.6)]",
                stat.bg, 
                stat.color
              )}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className={cn(
                  "text-[10px] text-muted-foreground font-black uppercase tracking-widest",
                  theme === 'solaris' ? "tracking-[0.2em]" : ""
                )}>{stat.label}</p>
                <h3 className={cn(
                  "text-2xl font-bold tracking-tighter transition-all duration-500",
                  theme === 'crimson' ? "font-mono" : ""
                )}>{stat.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card border border-border rounded-xl p-6 glass-card"
        >
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-success" />
            Learning Activity (Last 7 Days)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" vertical={false} />
                <XAxis 
                  dataKey="date" 
                  stroke="#4b5563" 
                  fontSize={10} 
                  fontWeight={700}
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#4b5563" 
                  fontSize={10} 
                  fontWeight={700}
                  tickLine={false} 
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ 
                    backgroundColor: '#0a0a0a', 
                    border: '1px solid #1a1a1a',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="url(%23colorCount)" 
                  radius={[4, 4, 0, 0]} 
                  barSize={24}
                >
                  {activityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === activityData.length - 1 ? '#ffffff' : '#4b5563'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Subject Progress Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-6 glass-card"
        >
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-info" />
            Progress per Subject
          </h3>
          <div className="space-y-6 overflow-y-auto max-h-64 pr-2 custom-scrollbar">
            {subjectProgressData.length > 0 ? (
              subjectProgressData.map((data, i) => (
                <div key={data.name} className="space-y-2 group">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold tracking-tight">{data.name}</span>
                    <span className="text-muted-foreground font-mono">{Math.round(data.percentage)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${data.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                      className={cn(
                        "h-full transition-all duration-500",
                        ["bg-success", "bg-info", "bg-warning"][i % 3]
                      )}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-10 text-muted-foreground">
                <p className="text-sm">No subjects tracked yet.</p>
                <Link href="/subjects" className="text-primary hover:underline text-xs mt-2 font-bold uppercase tracking-widest">Add Subject</Link>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Summary Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border rounded-xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden"
      >
        <div className="relative z-10 space-y-4">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 border border-border">
            <TrendingUp className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">You've completed {completedTopics} topics!</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Consistency is key. You're currently at {overallPercentage}% of your total learning goals. 
            Keep pushing forward to reach 100%.
          </p>
          <div className="pt-4">
            <Link 
              href="/subjects" 
              className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
            >
              Continue Learning
            </Link>
          </div>
        </div>
        
        {/* Decorative background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-0" />
      </motion.div>
    </div>
  );
}
