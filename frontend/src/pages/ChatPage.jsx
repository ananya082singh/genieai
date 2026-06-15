import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { sendChat } from '../services/api'
import useStore from '../store/useStore'
import { MessageSquare, Send } from 'lucide-react'

export default function ChatPage() {
  const location = useLocation()
  const { chatHistory, addChatMessage } = useStore()
  const [input, setInput]     = useState(location.state?.title ? `Tell me more about: "${location.state.title}". What are the key challenges?` : '')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [chatHistory, loading])

  async function handleSend() {
    if (!input.trim() || loading) return
    const userMsg = { role: 'user', content: input.trim() }
    addChatMessage(userMsg); setInput(''); setLoading(true)
    try {
      const res = await sendChat([...chatHistory, userMsg])
      addChatMessage({ role: 'assistant', content: res.data.reply })
    } catch {
      addChatMessage({ role: 'assistant', content: 'Something went wrong. Please try again.' })
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4rem)' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.75rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
        <MessageSquare size={28} /> AI Assistant
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '1rem' }}>Ask anything about your project</p>

      <div style={{ flex: 1, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden', transition: 'all 0.2s' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {chatHistory.length === 0 && (
            <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', fontSize: '14px', color: 'var(--text-secondary)', maxWidth: '80%', lineHeight: 1.6, transition: 'all 0.2s' }}>
              Welcome to your GenieAI project assistant. Ask me anything — project ideas, tech choices, implementation help, or career advice!
            </div>
          )}
          {chatHistory.map((msg, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '80%', padding: '12px 16px', borderRadius: '12px', fontSize: '14px', lineHeight: 1.6,
                background: msg.role === 'user' ? 'var(--accent-bg)' : 'var(--bg-input)',
                border: msg.role === 'user' ? '1px solid rgba(214, 158, 46, 0.3)' : '1px solid var(--border)',
                color: 'var(--text-primary)',
                transition: 'all 0.2s'
              }}>{msg.content}</div>
            </div>
          ))}
          {loading && (
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '12px', padding: '14px 16px', display: 'flex', gap: '4px', alignItems: 'center', transition: 'all 0.2s' }}>
                {[0,1,2].map((i) => <span key={i} className="loader" style={{ width: '6px', height: '6px', borderWidth: '1.5px', animationDelay: `${i*0.15}s` }} />)}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div style={{ display: 'flex', gap: '10px', padding: '1rem', borderTop: '1px solid var(--border)' }}>
          <textarea style={{ flex: 1, background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', resize: 'none', height: '48px', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}
            placeholder="Ask about your project..." value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }}} />
          <button onClick={handleSend} disabled={loading || !input.trim()} className="btn-primary" style={{ padding: '10px 20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Send size={14} /> Send
          </button>
        </div>
      </div>
    </div>
  )
}