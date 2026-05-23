'use client';

import React, { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Undo2, X, Trash2 } from 'lucide-react';

export function UndoToast() {
  const { lastDeleted, undoDelete, clearLastDeleted } = useStore();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (lastDeleted) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Delay clearing the state until after the exit animation
        setTimeout(clearLastDeleted, 500);
      }, 5000); // 5 seconds visibility

      return () => clearTimeout(timer);
    }
  }, [lastDeleted, clearLastDeleted]);

  if (!lastDeleted) return null;

  const getMessage = () => {
    switch (lastDeleted.type) {
      case 'subject': return `Subject "${lastDeleted.name}" deleted`;
      case 'subtopic': return `Subtopic "${lastDeleted.name}" deleted`;
      case 'topic': return `Topic "${lastDeleted.name}" deleted`;
      default: return 'Item deleted';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
          className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-[200] w-[calc(100%-2rem)] max-w-md"
        >
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4 backdrop-blur-xl">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 bg-destructive/10 rounded-xl flex items-center justify-center text-destructive shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold truncate">{getMessage()}</p>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Action can be reversed</p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  undoDelete();
                  setIsVisible(false);
                }}
                className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-90 transition-opacity"
              >
                <Undo2 className="w-3 h-3" />
                Undo
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="p-2 hover:bg-white/5 rounded-xl transition-colors text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Progress bar timer */}
          <motion.div 
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 5, ease: "linear" }}
            className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary/30 rounded-full overflow-hidden"
          >
            <div className="h-full bg-primary" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
