import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/layout/Sidebar'
import GeneratePage from './pages/GeneratePage'
import RoadmapPage from './pages/RoadmapPage'
import StackPage from './pages/StackPage'
import SavedPage from './pages/SavedPage'
import SearchPage from './pages/SearchPage'
import ChatPage from './pages/ChatPage'

export default function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0c0e14' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        <Routes>
          <Route path="/" element={<GeneratePage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/stack" element={<StackPage />} />
          <Route path="/saved" element={<SavedPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/chat" element={<ChatPage />} />
        </Routes>
      </main>
    </div>
  )
}
