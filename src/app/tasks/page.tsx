'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { 
  CheckSquare, 
  Search, 
  Filter, 
  CheckCircle2, 
  Circle,
  BookOpen,
  Edit2,
  Trash2,
  Check,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function TasksPage() {
  const { subjects, subtopics, topics, updateTopic, deleteTopic, toggleTopic } = useStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Edit states
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editTopicName, setEditTopicName] = useState('');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const startEditingTopic = (id: string, name: string) => {
    setEditingTopicId(id);
    setEditTopicName(name);
  };

  const handleUpdateTopic = (id: string) => {
    if (editTopicName.trim()) {
      updateTopic(id, editTopicName.trim());
      setEditingTopicId(null);
    }
  };

  if (!isHydrated) return null;

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'pending' && !topic.isCompleted) || 
      (filter === 'completed' && topic.isCompleted);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground mt-1">All your learning topics in one place.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-card border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-64"
            />
          </div>
          <div className="flex bg-card border border-border rounded-lg p-1">
            {(['all', 'pending', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-medium capitalize transition-all",
                  filter === f ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredTopics.length > 0 ? (
            filteredTopics.map((topic) => {
              const subtopic = subtopics.find(st => st.id === topic.subtopicId);
              const subject = subjects.find(s => s.id === subtopic?.subjectId);
              
              return (
                <motion.div
                  key={topic.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="bg-card border border-border rounded-xl p-4 flex items-center justify-between hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleTopic(topic.id)}
                      className={cn(
                        "transition-all duration-300",
                        topic.isCompleted ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {topic.isCompleted ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <Circle className="w-6 h-6" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      {editingTopicId === topic.id ? (
                        <div className="flex items-center gap-2 max-w-md">
                          <input
                            type="text"
                            autoFocus
                            value={editTopicName}
                            onChange={(e) => setEditTopicName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleUpdateTopic(topic.id)}
                            className="bg-black border border-primary/50 rounded-lg px-2 py-1 text-sm focus:outline-none w-full"
                          />
                          <button onClick={() => handleUpdateTopic(topic.id)} className="text-success hover:scale-110 transition-transform shrink-0"><Check className="w-4 h-4" /></button>
                          <button onClick={() => setEditingTopicId(null)} className="text-destructive hover:scale-110 transition-transform shrink-0"><X className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <h3 className={cn(
                          "font-semibold transition-all duration-300 truncate",
                          topic.isCompleted ? "text-muted-foreground line-through" : "text-foreground"
                        )}>
                          {topic.name}
                        </h3>
                      )}
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] bg-secondary px-2 py-0.5 rounded text-muted-foreground font-bold uppercase tracking-widest">
                          {subject?.name || 'Unknown'}
                        </span>
                        <span className="text-[10px] text-muted-foreground/50">•</span>
                        <span className="text-[10px] text-muted-foreground font-medium italic">
                          {subtopic?.name || 'General'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => startEditingTopic(topic.id, topic.name)}
                        className="text-muted-foreground hover:text-primary transition-all p-1.5 rounded-lg hover:bg-white/5"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTopic(topic.id)}
                        className="text-muted-foreground hover:text-destructive transition-all p-1.5 rounded-lg hover:bg-white/5"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {topic.isCompleted && topic.completedAt && (
                      <div className="text-right shrink-0">
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Completed</p>
                        <p className="text-xs font-medium">{new Date(topic.completedAt).toLocaleDateString()}</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-border rounded-xl">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                <CheckSquare className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-medium">No tasks found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter.</p>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
