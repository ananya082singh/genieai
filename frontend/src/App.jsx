import { Routes, Route, Navigate } from 'react-router-dom'

import Sidebar from './components/layout/Sidebar'

import GeneratePage from './pages/GeneratePage'
import RoadmapPage from './pages/RoadmapPage'
import StackPage from './pages/StackPage'
import SavedPage from './pages/SavedPage'
import SearchPage from './pages/SearchPage'
import ChatPage from './pages/ChatPage'
import EvolvePage from './pages/EvolvePage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'

import useStore from './store/useStore'

function ProtectedRoute({ children }) {
  const { token } = useStore()

  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}

function AppLayout({ children }) {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#0c0e14',
      }}
    >
      <Sidebar />

      <main
        style={{
          flex: 1,
          padding: '2rem',
          overflowY: 'auto',
        }}
      >
        {children}
      </main>
    </div>
  )
}

export default function App() {
  const { token } = useStore()

  return (
    <Routes>
      {/* Login */}
      <Route
        path="/login"
        element={
          token ? <Navigate to="/" replace /> : <LoginPage />
        }
      />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout>
              <GeneratePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/roadmap"
        element={
          <ProtectedRoute>
            <AppLayout>
              <RoadmapPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/stack"
        element={
          <ProtectedRoute>
            <AppLayout>
              <StackPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/saved"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SavedPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SearchPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ChatPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/evolve"
        element={
          <ProtectedRoute>
            <AppLayout>
              <EvolvePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}