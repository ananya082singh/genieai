import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { recommendStack } from '../services/api'
import toast from 'react-hot-toast'

const layers = [
  { key:'frontend', label:'Frontend',         icon:'🎨' },
  { key:'backend',  label:'Backend',          icon:'⚙️' },
  { key:'database', label:'Database',         icon:'🗄️' },
  { key:'ai_ml',    label:'AI / ML',          icon:'🤖' },
  { key:'devops',   label:'DevOps & Hosting', icon:'☁️' },
  { key:'extras',   label:'Tools & Extras',   icon:'🔧' },
]

export default function StackPage() {
  const location = useLocation()
  const prefill = location.state?.idea
  const [form, setForm] = useState({
    projectDescription: prefill ? `${prefill.title}: ${prefill.description}` : '',
    teamSize: 'Solo', timeAvailable: '6 months', deploymentTarget: 'Web'
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult]   = useState(null)

  const inputStyle = { width: '100%', background: '#13151f', border: '1px solid #2a2d3e', borderRadius: '8px', padding: '10px 14px', color: '#f0f0f8', fontSize: '14px', outline: 'none', fontFamily: 'DM Sans,sans-serif' }
  const labelStyle = { display: 'block', fontSize: '12px', color: '#8a8aaa', marginBottom: '6px', fontWeight: 500 }

  async function handleRecommend() {
    if (!form.projectDescription.trim()) { toast.error('Describe your project'); return }
    setLoading(true)
    try {
      const res = await recommendStack(form)
      setResult(res.data)
    } catch { toast.error('Failed to recommend stack') }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.75rem', marginBottom: '8px' }}>⚙️ Tech Stack Recommender</h1>
      <p style={{ color: '#8a8aaa', fontSize: '14px', marginBottom: '2rem' }}>Get the optimal tech stack for your project idea</p>

      <div style={{ background: '#1a1d2a', border: '1px solid #2a2d3e', borderRadius: '16px', padding: '1.75rem', marginBottom: '1.5rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Describe your project idea</label>
          <textarea style={{ ...inputStyle, height: '96px', resize: 'none' }} placeholder="e.g. A mental health monitoring app with mood tracking and AI recommendations..."
            value={form.projectDescription} onChange={(e) => setForm((f) => ({ ...f, projectDescription: e.target.value }))} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
          {[['teamSize','Team Size',['Solo','2-3 members','4+ members']],['timeAvailable','Time Available',['3 months','6 months','1 year']],['deploymentTarget','Deployment Target',['Web','Mobile','Desktop','Cloud API','Edge/IoT']]].map(([key,label,opts]) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <select style={inputStyle} value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}>
                {opts.map((o) => <option key={o} style={{ background: '#13151f' }}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
        <button onClick={handleRecommend} disabled={loading} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {loading ? <><span className="loader" /> Recommending...</> : '⚙️ Recommend Stack'}
        </button>
      </div>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {result.summary && <div style={{ background: 'rgba(90,212,200,0.05)', border: '1px solid rgba(90,212,200,0.15)', borderRadius: '10px', padding: '14px', color: '#5ad4c8', fontSize: '14px' }}>{result.summary}</div>}
          {layers.filter((l) => result[l.key]?.technologies?.length).map((l) => (
            <div key={l.key} style={{ background: '#1a1d2a', border: '1px solid #2a2d3e', borderRadius: '12px', padding: '1.25rem', display: 'grid', gridTemplateColumns: '48px 1fr', gap: '1rem', alignItems: 'start' }}>
              <div style={{ width: '44px', height: '44px', background: 'rgba(124,106,247,0.1)', border: '1px solid rgba(124,106,247,0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{l.icon}</div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '8px' }}>{l.label}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                  {result[l.key].technologies.map((t) => <span key={t} style={{ background: '#13151f', border: '1px solid #2a2d3e', padding: '3px 10px', borderRadius: '6px', fontSize: '12px', color: '#8a8aaa', fontFamily: 'monospace' }}>{t}</span>)}
                </div>
                <div style={{ fontSize: '13px', color: '#8a8aaa' }}>{result[l.key].why}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}