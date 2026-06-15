import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { recommendStack } from '../services/api'
import toast from 'react-hot-toast'
import { Cpu, Palette, Server, Database, Bot, Cloud, Wrench } from 'lucide-react'

const layers = [
  { key:'frontend', label:'Frontend',         icon: Palette },
  { key:'backend',  label:'Backend',          icon: Server },
  { key:'database', label:'Database',         icon: Database },
  { key:'ai_ml',    label:'AI / ML',          icon: Bot },
  { key:'devops',   label:'DevOps & Hosting', icon: Cloud },
  { key:'extras',   label:'Tools & Extras',   icon: Wrench },
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

  const inputStyle = { width: '100%', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }
  const labelStyle = { display: 'block', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }

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
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.75rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
        <Cpu size={28} /> Tech Stack Recommender
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '2rem' }}>Get the optimal tech stack for your project idea</p>

      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.75rem', marginBottom: '1.5rem', transition: 'all 0.2s' }}>
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
                {opts.map((o) => <option key={o} style={{ background: 'var(--bg-input)', color: 'var(--text-primary)' }}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
        <button onClick={handleRecommend} disabled={loading} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {loading ? <><span className="loader" /> Recommending...</> : <><Cpu size={14} /> Recommend Stack</>}
        </button>
      </div>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {result.summary && <div style={{ background: 'rgba(90,212,200,0.05)', border: '1px solid rgba(90,212,200,0.15)', borderRadius: '10px', padding: '14px', color: '#5ad4c8', fontSize: '14px' }}>{result.summary}</div>}
          {layers.filter((l) => result[l.key]?.technologies?.length).map((l) => {
            const LayerIcon = l.icon
            return (
              <div key={l.key} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', padding: '1.25rem', display: 'grid', gridTemplateColumns: '48px 1fr', gap: '1rem', alignItems: 'start', transition: 'all 0.2s' }}>
                <div style={{ width: '44px', height: '44px', background: 'var(--accent-bg)', border: '1px solid rgba(214, 158, 46, 0.2)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', transition: 'all 0.2s' }}>
                  <LayerIcon size={20} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '8px', color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>{l.label}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                    {result[l.key].technologies.map((t) => <span key={t} style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', padding: '3px 10px', borderRadius: '6px', fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{t}</span>)}
                  </div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{result[l.key].why}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}