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

  user: null,
  token: localStorage.getItem('token') || null,
  
  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
    set({ token })
  },
  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, token: null })
  },
  theme: localStorage.getItem('theme') || 'dark',
  toggleTheme: () => set((s) => {
    const next = s.theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', next)
    document.documentElement.setAttribute('data-theme', next)
    return { theme: next }
  })
}))

export default useStore

