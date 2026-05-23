'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  Plus, 
  Trash2, 
  ChevronLeft, 
  CheckCircle2, 
  Circle, 
  MoreVertical,
  Layers,
  CheckCircle,
  Edit2,
  Check,
  X
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function SubjectDetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const subjectId = searchParams.get('id');
  
  const { 
    subjects, 
    subtopics, 
    topics, 
    addSubtopic, 
    updateSubtopic,
    deleteSubtopic,
    addTopic,
    updateTopic,
    deleteTopic,
    toggleTopic
  } = useStore();

  const [isHydrated, setIsHydrated] = useState(false);
  const [newSubtopicName, setNewSubtopicName] = useState('');
  const [activeSubtopicId, setActiveSubtopicId] = useState<string | null>(null);
  const [newTopicName, setNewTopicName] = useState('');

  // Edit states
  const [editingSubtopicId, setEditingSubtopicId] = useState<string | null>(null);
  const [editSubtopicName, setEditSubtopicName] = useState('');
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editTopicName, setEditTopicName] = useState('');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) return null;

  const subject = subjects.find(s => s.id === subjectId);
  if (!subject) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-2xl font-bold">Subject not found</h2>
        <Link href="/subjects" className="text-primary hover:underline mt-4">Back to Subjects</Link>
      </div>
    );
  }

  const filteredSubtopics = subtopics.filter(st => st.subjectId === subjectId);

  const handleAddSubtopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtopicName.trim()) {
      addSubtopic(subject.id, newSubtopicName.trim());
      setNewSubtopicName('');
    }
  };

  const handleAddTopic = (stId: string) => {
    if (newTopicName.trim()) {
      addTopic(stId, newTopicName.trim());
      setNewTopicName('');
      setActiveSubtopicId(null);
    }
  };

  const startEditingSubtopic = (id: string, name: string) => {
    setEditingSubtopicId(id);
    setEditSubtopicName(name);
  };

  const handleUpdateSubtopic = (id: string) => {
    if (editSubtopicName.trim()) {
      updateSubtopic(id, editSubtopicName.trim());
      setEditingSubtopicId(null);
    }
  };

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

  return (
    <div className="space-y-8 pb-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 bg-secondary border border-border rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{subject.name}</h1>
          <p className="text-muted-foreground mt-1">Manage subtopics and individual topics.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Subtopic List */}
        <div className="flex-1 space-y-6">
          <form onSubmit={handleAddSubtopic} className="flex gap-2">
            <input
              type="text"
              value={newSubtopicName}
              onChange={(e) => setNewSubtopicName(e.target.value)}
              placeholder="New subtopic name..."
              className="flex-1 bg-secondary border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button
              type="submit"
              disabled={!newSubtopicName.trim()}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          </form>

          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {filteredSubtopics.map((subtopic) => {
                const subtopicTopics = topics.filter(t => t.subtopicId === subtopic.id);
                const completedCount = subtopicTopics.filter(t => t.isCompleted).length;
                const totalCount = subtopicTopics.length;
                const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

                return (
                  <motion.div
                    key={subtopic.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-card border border-border rounded-xl overflow-hidden"
                  >
                    <div className="p-4 bg-secondary/30 flex items-center justify-between border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-muted rounded flex items-center justify-center text-primary-foreground">
                          <Layers className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          {editingSubtopicId === subtopic.id ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                autoFocus
                                value={editSubtopicName}
                                onChange={(e) => setEditSubtopicName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleUpdateSubtopic(subtopic.id)}
                                className="bg-black border border-primary/50 rounded-lg px-2 py-1 text-sm focus:outline-none w-full"
                              />
                              <button onClick={() => handleUpdateSubtopic(subtopic.id)} className="text-success hover:scale-110 transition-transform"><Check className="w-4 h-4" /></button>
                              <button onClick={() => setEditingSubtopicId(null)} className="text-destructive hover:scale-110 transition-transform"><X className="w-4 h-4" /></button>
                            </div>
                          ) : (
                            <h3 className="font-semibold text-lg">{subtopic.name}</h3>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary transition-all duration-500" 
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                              {completedCount}/{totalCount} Done
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEditingSubtopic(subtopic.id, subtopic.name)}
                          className="w-8 h-8 rounded flex items-center justify-center hover:bg-muted text-muted-foreground transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setActiveSubtopicId(activeSubtopicId === subtopic.id ? null : subtopic.id)}
                          className={cn(
                            "w-8 h-8 rounded flex items-center justify-center transition-colors",
                            activeSubtopicId === subtopic.id ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground"
                          )}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteSubtopic(subtopic.id)}
                          className="w-8 h-8 rounded flex items-center justify-center hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-2 space-y-1">
                      {activeSubtopicId === subtopic.id && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="p-2 flex gap-2"
                        >
                          <input
                            type="text"
                            autoFocus
                            value={newTopicName}
                            onChange={(e) => setNewTopicName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTopic(subtopic.id)}
                            placeholder="Add topic..."
                            className="flex-1 bg-secondary/50 border border-border rounded px-3 py-1.5 text-sm focus:outline-none"
                          />
                          <button
                            onClick={() => handleAddTopic(subtopic.id)}
                            className="bg-primary text-primary-foreground px-3 py-1.5 rounded text-sm font-medium"
                          >
                            Add
                          </button>
                        </motion.div>
                      )}

                      <AnimatePresence mode="popLayout">
                        {subtopicTopics.map((topic) => (
                          <motion.div
                            key={topic.id}
                            layout
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="group flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <button
                                onClick={() => toggleTopic(topic.id)}
                                className={cn(
                                  "transition-all duration-300 shrink-0",
                                  topic.isCompleted ? "text-primary scale-110" : "text-muted-foreground hover:text-foreground"
                                )}
                              >
                                {topic.isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                  <Circle className="w-5 h-5" />
                                )}
                              </button>
                              {editingTopicId === topic.id ? (
                                <div className="flex items-center gap-2 flex-1">
                                  <input
                                    type="text"
                                    autoFocus
                                    value={editTopicName}
                                    onChange={(e) => setEditTopicName(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateTopic(topic.id)}
                                    className="bg-black border border-primary/50 rounded-lg px-2 py-1 text-sm focus:outline-none w-full"
                                  />
                                  <button onClick={() => handleUpdateTopic(topic.id)} className="text-success hover:scale-110 transition-transform"><Check className="w-4 h-4" /></button>
                                  <button onClick={() => setEditingTopicId(null)} className="text-destructive hover:scale-110 transition-transform"><X className="w-4 h-4" /></button>
                                </div>
                              ) : (
                                <span className={cn(
                                  "text-sm font-medium transition-all duration-300 truncate",
                                  topic.isCompleted ? "text-muted-foreground line-through" : "text-foreground"
                                )}>
                                  {topic.name}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                              <button
                                onClick={() => startEditingTopic(topic.id, topic.name)}
                                className="text-muted-foreground hover:text-primary transition-all p-1"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteTopic(topic.id)}
                                className="text-muted-foreground hover:text-destructive transition-all p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>

                      {subtopicTopics.length === 0 && !activeSubtopicId && (
                        <div className="py-8 text-center text-muted-foreground text-sm italic">
                          No topics yet. Click + to add one.
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredSubtopics.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-4 border-2 border-dashed border-border rounded-xl">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                  <Plus className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-medium">No subtopics yet</h3>
                  <p className="text-muted-foreground">Break down this subject into smaller subtopics.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Progress Summary Card */}
        <div className="lg:w-80 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 sticky top-8">
            <h3 className="font-bold text-lg mb-4">Subject Progress</h3>
            
            {(() => {
              const subjectSubtopics = subtopics.filter(st => st.subjectId === subjectId);
              const subjectSubtopicIds = subjectSubtopics.map(st => st.id);
              const subjectTopics = topics.filter(t => subjectSubtopicIds.includes(t.subtopicId));
              const total = subjectTopics.length;
              const done = subjectTopics.filter(t => t.isCompleted).length;
              const percentage = total > 0 ? Math.round((done / total) * 100) : 0;

              return (
                <div className="space-y-6">
                  <div className="relative w-32 h-32 mx-auto">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle 
                        className="text-muted stroke-current" 
                        strokeWidth="10" 
                        fill="transparent" 
                        r="40" 
                        cx="50" 
                        cy="50" 
                      />
                      <motion.circle 
                        className="text-primary stroke-current" 
                        strokeWidth="10" 
                        strokeLinecap="round" 
                        fill="transparent" 
                        r="40" 
                        cx="50" 
                        cy="50" 
                        initial={{ strokeDasharray: "0 251.2" }}
                        animate={{ strokeDasharray: `${(percentage / 100) * 251.2} 251.2` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold">{percentage}%</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Done</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total Topics</span>
                      <span className="font-semibold">{total}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Completed</span>
                      <span className="font-semibold">{done}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Subtopics</span>
                      <span className="font-semibold">{subjectSubtopics.length}</span>
                    </div>
                  </div>

                  {percentage === 100 && total > 0 && (
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span className="text-xs font-medium text-primary">Mastery Achieved!</span>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
