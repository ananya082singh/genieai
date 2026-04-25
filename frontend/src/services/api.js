import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api'
})

export const generateIdeas  = (data) => api.post('/ideas/generate', data)
export const generateRoadmap = (data) => api.post('/roadmap/generate', data)
export const recommendStack  = (data) => api.post('/stack/recommend', data)
export const getSaved        = ()     => api.get('/saved/')
export const saveIdea        = (idea) => api.post('/saved/', { idea })
export const deleteSaved     = (id)   => api.delete(`/saved/${id}`)
export const sendChat        = (messages) => api.post('/chat/', { messages })
export const analyzeDifficulty = (data) => api.post('/ideas/analyze-difficulty', data)
export const evolveStep = (data) => api.post('/evolution/step', data)