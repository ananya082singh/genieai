import { useNavigate, useLocation } from 'react-router-dom'
import useStore from '../../store/useStore'

const navItems = [
  {
    section: 'Overview',
    items: [
      { path: '/dashboard', icon: '📈', label: 'Dashboard' },
    ]
  },

  {
    section: 'Generate',
    items: [
      { path: '/', icon: '💡', label: 'Idea Generator' },
      { path: '/roadmap', icon: '🗺️', label: 'Roadmaps' },
      { path: '/stack', icon: '⚙️', label: 'Tech Stack' },
      { path: '/evolve', icon: '🧬', label: 'Idea Evolution' },
    ]
  },

  {
    section: 'Library',
    items: [
      { path: '/saved', icon: '🔖', label: 'Saved Ideas' },
      { path: '/search', icon: '🔍', label: 'Browse & Filter' },
    ]
  },

  {
    section: 'Assistant',
    items: [
      { path: '/chat', icon: '🤖', label: 'AI Chatbot' },
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
    token
  } = useStore()

  return (
    <aside
      style={{
        width: '220px',
        minHeight: '100vh',
        background: '#13151f',
        borderRight: '1px solid #2a2d3e',
        padding: '1.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto',
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
            background: 'linear-gradient(135deg,#7c6af7,#5ad4c8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
          }}
        >
          ✨
        </div>

        <span
          style={{
            fontFamily: 'Syne, sans-serif',
            fontWeight: 800,
            fontSize: '1.2rem',
            background: 'linear-gradient(90deg,#7c6af7,#5ad4c8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
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
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#3a3d52',
              padding: '12px 12px 4px',
            }}
          >
            {section.section}
          </div>

          {section.items.map((item) => {
            const active = location.pathname === item.path

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
                    ? 'rgba(124,106,247,0.15)'
                    : 'transparent',
                  color: active ? '#7c6af7' : '#8a8aaa',
                  fontWeight: active ? 500 : 400,
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = '#1a1d2a'
                    e.currentTarget.style.color = '#f0f0f8'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent'
                    e.currentTarget.style.color = '#8a8aaa'
                  }
                }}
              >
                <span
                  style={{
                    fontSize: '16px',
                    width: '20px',
                    textAlign: 'center',
                  }}
                >
                  {item.icon}
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
          borderTop: '1px solid #2a2d3e',
        }}
      >
        {/* Session Stats */}
        <div
          style={{
            background: '#13151f',
            border: '1px solid #2a2d3e',
            borderRadius: '10px',
            padding: '12px',
            fontSize: '12px',
            color: '#8a8aaa',
            marginBottom: token ? '12px' : '0px',
          }}
        >
          <div
            style={{
              color: '#7c6af7',
              fontWeight: 600,
              marginBottom: '4px',
            }}
          >
            Session Stats
          </div>

          <div>
            Ideas generated:{' '}
            <span style={{ color: '#f0f0f8', fontWeight: 500 }}>
              {ideas.length}
            </span>
          </div>

          <div>
            Saved:{' '}
            <span style={{ color: '#f0f0f8', fontWeight: 500 }}>
              {savedIdeas.length}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        {token && (
          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #2a2d3e',
              background: 'transparent',
              color: '#f0f0f8',
              cursor: 'pointer',
              fontSize: '13px',
              transition: '0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1a1d2a'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            🚪 Logout
          </button>
        )}
      </div>
    </aside>
  )
}