import { create } from 'zustand'

const useStore = create((set) => ({
  ideas: [],
  savedIdeas: [],
  currentRoadmap: null,
  currentIdea: null,
  chatHistory: [],

  setIdeas: (ideas) => set({ ideas }),
  addIdeas: (newIdeas) => set((s) => ({ ideas: [...s.ideas, ...newIdeas] })),

  setSavedIdeas: (savedIdeas) => set({ savedIdeas }),
  addSaved: (saved) => set((s) => ({ savedIdeas: [...s.savedIdeas, saved] })),
  removeSaved: (id) => set((s) => ({ savedIdeas: s.savedIdeas.filter((x) => x.id !== id) })),

  setCurrentRoadmap: (roadmap) => set({ currentRoadmap: roadmap }),
  setCurrentIdea: (idea) => set({ currentIdea: idea }),

  addChatMessage: (msg) => set((s) => ({ chatHistory: [...s.chatHistory, msg] })),
  setChatHistory: (chatHistory) => set({ chatHistory }),
}))

export default useStore