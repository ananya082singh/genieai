import { useNavigate, useLocation } from 'react-router-dom'
import useStore from '../../store/useStore'
import {
  LayoutDashboard,
  Lightbulb,
  GitFork,
  Cpu,
  Dna,
  Bookmark,
  Search,
  MessageSquare,
  LogOut,
  Terminal,
  Sun,
  Moon
} from 'lucide-react'

const navItems = [
  {
    section: 'Overview',
    items: [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ]
  },

  {
    section: 'Generate',
    items: [
      { path: '/', icon: Lightbulb, label: 'Idea Generator' },
      { path: '/roadmap', icon: GitFork, label: 'Roadmaps' },
      { path: '/stack', icon: Cpu, label: 'Tech Stack' },
      { path: '/evolve', icon: Dna, label: 'Idea Evolution' },
    ]
  },

  {
    section: 'Library',
    items: [
      { path: '/saved', icon: Bookmark, label: 'Saved Ideas' },
      { path: '/search', icon: Search, label: 'Browse & Filter' },
    ]
  },

  {
    section: 'Assistant',
    items: [
      { path: '/chat', icon: MessageSquare, label: 'AI Chatbot' },
    ]
  },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const {
    ideas,
    savedIdeas,
    logout,
    token,
    theme,
    toggleTheme
  } = useStore()

  return (
    <aside
      style={{
        width: '220px',
        minHeight: '100vh',
        background: 'var(--bg-card)',
        borderRight: '1px solid var(--border)',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
        transition: 'background-color 0.2s, border-color 0.2s'
      }}
    >
      {/* Logo */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '4px 8px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent)',
            transition: 'background-color 0.2s, border-color 0.2s, color 0.2s'
          }}
        >
          <Terminal size={18} />
        </div>

        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.2rem',
            color: 'var(--text-primary)',
            transition: 'color 0.2s'
          }}
        >
          GenieAI
        </span>
      </div>

      {/* Navigation */}
      {navItems.map((section) => (
        <div key={section.section}>
          <div
            style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              opacity: 0.7,
              padding: '12px 12px 4px',
            }}
          >
            {section.section}
          </div>

          {section.items.map((item) => {
            const active = location.pathname === item.path
            const Icon = item.icon

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  background: active
                    ? 'var(--accent-bg)'
                    : 'transparent',
                  color: active ? 'var(--accent)' : 'var(--text-secondary)',
                  fontWeight: active ? 600 : 400,
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'var(--bg-input)'
                    e.currentTarget.style.color = 'var(--text-primary)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = 'var(--text-secondary)'
                  }
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '20px',
                  }}
                >
                  <Icon size={16} />
                </span>

                {item.label}
              </button>
            )
          })}
        </div>
      ))}

      {/* Bottom Section */}
      <div
        style={{
          marginTop: 'auto',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        {/* Session Stats */}
        <div
          style={{
            background: 'var(--bg-app)',
            border: '1px solid var(--border)',
            borderRadius: '10px',
            padding: '12px',
            fontSize: '12px',
            color: 'var(--text-secondary)',
            marginBottom: token ? '4px' : '0px',
            transition: 'background-color 0.2s, border-color 0.2s'
          }}
        >
          <div
            style={{
              color: 'var(--accent)',
              fontWeight: 600,
              marginBottom: '4px',
            }}
          >
            Session Stats
          </div>

          <div>
            Ideas generated:{' '}
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
              {ideas.length}
            </span>
          </div>

          <div>
            Saved:{' '}
            <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
              {savedIdeas.length}
            </span>
          </div>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid var(--border)',
            background: 'transparent',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: '13px',
            transition: '0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-input)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
          }}
        >
          {theme === 'dark' ? (
            <><Sun size={14} /> Light Mode</>
          ) : (
            <><Moon size={14} /> Dark Mode</>
          )}
        </button>

        {/* Logout Button */}
        {token && (
          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              background: 'transparent',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: '13px',
              transition: '0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'var(--bg-input)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <LogOut size={14} /> Logout
          </button>
        )}
      </div>
    </aside>
  )
}