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

interface TrackerState {
  subjects: Subject[];
  subtopics: Subtopic[];
  topics: Topic[];
  theme: AppTheme;
  userId: string | null;

  // Global Actions
  setUserId: (id: string | null) => void;
  setAllData: (data: { subjects: Subject[], subtopics: Subtopic[], topics: Topic[] }) => void;
  setTheme: (theme: AppTheme) => void;

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

      setUserId: (id) => set({ userId: id }),
      setAllData: (data) => set({ ...data }),
      setTheme: (theme) => set({ theme }),

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
        set((state) => ({
          subjects: state.subjects.filter((s) => s.id !== id),
          subtopics: state.subtopics.filter((st) => st.subjectId !== id),
          topics: state.topics.filter((t) => {
            const subtopic = state.subtopics.find((st) => st.id === t.subtopicId);
            return subtopic?.subjectId !== id;
          }),
        })),

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
        set((state) => ({
          subtopics: state.subtopics.filter((st) => st.id !== id),
          topics: state.topics.filter((t) => t.subtopicId !== id),
        })),

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
        set((state) => ({
          topics: state.topics.filter((t) => t.id !== id),
        })),
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
