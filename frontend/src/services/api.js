import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

export const generateIdeas  = (data) => api.post('/ideas/generate', data)
export const generateRoadmap = (data) => api.post('/roadmap/generate', data)
export const recommendStack  = (data) => api.post('/stack/recommend', data)
export const getSaved        = ()     => api.get('/saved/')
export const saveIdea        = (idea) => api.post('/saved/', { idea })
export const deleteSaved     = (id)   => api.delete(`/saved/${id}`)
export const sendChat        = (messages) => api.post('/chat/', { messages })