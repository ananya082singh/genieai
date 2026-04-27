import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../services/api'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setToken, setUser } = useStore()
  const [isRegister, setIsRegister] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', name: '', branch: '' })
  const [loading, setLoading] = useState(false)

  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.email || !form.password) {
      toast.error('Email and password required')
      return
    }
    if (isRegister && !form.name) {
      toast.error('Name required')
      return
    }

    setLoading(true)
    try {
      const endpoint = isRegister ? register : login
      const payload = isRegister ? form : { email: form.email, password: form.password }
      const res = await endpoint(payload)
      
      setToken(res.data.access_token)
      toast.success(isRegister ? 'Account created!' : 'Logged in!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Authentication failed')
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%',
    background: '#13151f',
    border: '1px solid #2a2d3e',
    borderRadius: '8px',
    padding: '12px 16px',
    color: '#f0f0f8',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'DM Sans, sans-serif'
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧞</div>
          <div style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '2rem',
            fontWeight: 800,
            background: 'linear-gradient(135deg, #7c6af7, #5ad4c8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem'
          }}>
            GenieAI
          </div>
          <p style={{ color: '#8a8aaa', fontSize: '14px' }}>
            {isRegister ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="card" style={{ padding: '2rem' }}>
          {isRegister && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#8a8aaa', marginBottom: '6px', fontWeight: 500 }}>
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setF('name', e.target.value)}
                placeholder="John Doe"
                style={inputStyle}
              />
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#8a8aaa', marginBottom: '6px', fontWeight: 500 }}>
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setF('email', e.target.value)}
              placeholder="you@example.com"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '12px', color: '#8a8aaa', marginBottom: '6px', fontWeight: 500 }}>
              Password
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setF('password', e.target.value)}
              placeholder="••••••••"
              style={inputStyle}
            />
          </div>

          {isRegister && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#8a8aaa', marginBottom: '6px', fontWeight: 500 }}>
                Branch (Optional)
              </label>
              <input
                type="text"
                value={form.branch}
                onChange={(e) => setF('branch', e.target.value)}
                placeholder="Computer Science"
                style={inputStyle}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginBottom: '1rem' }}
          >
            {loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}
          </button>

          <div style={{ textAlign: 'center', fontSize: '13px', color: '#8a8aaa' }}>
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              style={{
                background: 'none',
                border: 'none',
                color: '#7c6af7',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              {isRegister ? 'Sign in' : 'Create one'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}