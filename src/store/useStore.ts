import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Topic {
  id: string;
  subtopicId: string;
  name: string;
  isCompleted: boolean;
  completedAt: number | null;
  createdAt: number;
}

export interface Subtopic {
  id: string;
  subjectId: string;
  name: string;
  createdAt: number;
}

export interface Subject {
  id: string;
  name: string;
  createdAt: number;
}

export type AppTheme = 'default' | 'aurora' | 'solaris' | 'forest' | 'crimson' | 'frost';

interface DeletedSnapshot {
  subjects: Subject[];
  subtopics: Subtopic[];
  topics: Topic[];
  type: 'subject' | 'subtopic' | 'topic';
  name: string;
}

interface TrackerState {
  subjects: Subject[];
  subtopics: Subtopic[];
  topics: Topic[];
  theme: AppTheme;
  userId: string | null;
  impersonatedUserId: string | null;
  lastDeleted: DeletedSnapshot | null;

  // Global Actions
  setUserId: (id: string | null) => void;
  setImpersonatedUserId: (id: string | null) => void;
  clearImpersonation: () => void;
  setAllData: (data: { subjects: Subject[], subtopics: Subtopic[], topics: Topic[] }) => void;
  setTheme: (theme: AppTheme) => void;
  undoDelete: () => void;
  clearLastDeleted: () => void;

  // Subject Actions
  addSubject: (name: string) => void;
  updateSubject: (id: string, name: string) => void;
  deleteSubject: (id: string) => void;

  // Subtopic Actions
  addSubtopic: (subjectId: string, name: string) => void;
  updateSubtopic: (id: string, name: string) => void;
  deleteSubtopic: (id: string) => void;

  // Topic Actions
  addTopic: (subtopicId: string, name: string) => void;
  updateTopic: (id: string, name: string) => void;
  deleteTopic: (id: string) => void;
  toggleTopic: (id: string) => void;
}

export const useStore = create<TrackerState>()(
  persist(
    (set) => ({
      subjects: [],
      subtopics: [],
      topics: [],
      theme: 'default',
      userId: null,
      impersonatedUserId: null,
      lastDeleted: null,

      setUserId: (id) => set({ userId: id }),
      setImpersonatedUserId: (id) => set({ impersonatedUserId: id }),
      clearImpersonation: () => set({ impersonatedUserId: null }),
      setAllData: (data) => set({ ...data }),
      setTheme: (theme) => set({ theme }),
      
      undoDelete: () => set((state) => {
        if (!state.lastDeleted) return state;
        return {
          subjects: state.lastDeleted.subjects,
          subtopics: state.lastDeleted.subtopics,
          topics: state.lastDeleted.topics,
          lastDeleted: null
        };
      }),
      
      clearLastDeleted: () => set({ lastDeleted: null }),

      // Subject Actions
      addSubject: (name) =>
        set((state) => ({
          subjects: [
            ...state.subjects,
            { id: crypto.randomUUID(), name, createdAt: Date.now() },
          ],
        })),
      updateSubject: (id, name) =>
        set((state) => ({
          subjects: state.subjects.map((s) => (s.id === id ? { ...s, name } : s)),
        })),
      deleteSubject: (id) =>
        set((state) => {
          const subject = state.subjects.find(s => s.id === id);
          if (!subject) return state;
          
          return {
            lastDeleted: {
              subjects: state.subjects,
              subtopics: state.subtopics,
              topics: state.topics,
              type: 'subject',
              name: subject.name
            },
            subjects: state.subjects.filter((s) => s.id !== id),
            subtopics: state.subtopics.filter((st) => st.subjectId !== id),
            topics: state.topics.filter((t) => {
              const subtopic = state.subtopics.find((st) => st.id === t.subtopicId);
              return subtopic?.subjectId !== id;
            }),
          };
        }),

      // Subtopic Actions
      addSubtopic: (subjectId, name) =>
        set((state) => ({
          subtopics: [
            ...state.subtopics,
            { id: crypto.randomUUID(), subjectId, name, createdAt: Date.now() },
          ],
        })),
      updateSubtopic: (id, name) =>
        set((state) => ({
          subtopics: state.subtopics.map((st) => (st.id === id ? { ...st, name } : st)),
        })),
      deleteSubtopic: (id) =>
        set((state) => {
          const subtopic = state.subtopics.find(st => st.id === id);
          if (!subtopic) return state;

          return {
            lastDeleted: {
              subjects: state.subjects,
              subtopics: state.subtopics,
              topics: state.topics,
              type: 'subtopic',
              name: subtopic.name
            },
            subtopics: state.subtopics.filter((st) => st.id !== id),
            topics: state.topics.filter((t) => t.subtopicId !== id),
          };
        }),

      // Topic Actions
      addTopic: (subtopicId, name) =>
        set((state) => ({
          topics: [
            ...state.topics,
            {
              id: crypto.randomUUID(),
              subtopicId,
              name,
              isCompleted: false,
              completedAt: null,
              createdAt: Date.now(),
            },
          ],
        })),
      updateTopic: (id, name) =>
        set((state) => ({
          topics: state.topics.map((t) => (t.id === id ? { ...t, name } : t)),
        })),
      deleteTopic: (id) =>
        set((state) => {
          const topic = state.topics.find(t => t.id === id);
          if (!topic) return state;

          return {
            lastDeleted: {
              subjects: state.subjects,
              subtopics: state.subtopics,
              topics: state.topics,
              type: 'topic',
              name: topic.name
            },
            topics: state.topics.filter((t) => t.id !== id),
          };
        }),
      toggleTopic: (id) =>
        set((state) => ({
          topics: state.topics.map((t) =>
            t.id === id
              ? {
                  ...t,
                  isCompleted: !t.isCompleted,
                  completedAt: !t.isCompleted ? Date.now() : null,
                }
              : t
          ),
        })),
    }),
    {
      name: 'tracker-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
