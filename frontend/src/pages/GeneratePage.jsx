import { useState } from 'react'
import { generateIdeas } from '../services/api'
import useStore from '../store/useStore'
import IdeaCard from '../components/ui/IdeaCard'
import toast from 'react-hot-toast'

const branches  = ['Computer Science','Information Technology','Electronics & Communication','Electrical Engineering','Mechanical Engineering','Data Science','Artificial Intelligence & ML','Cybersecurity']
const domains   = ['AI/ML','Web','Mobile','IoT','Blockchain','Cybersecurity','Cloud','AR/VR','Healthcare','FinTech','EdTech']
const diffs     = ['Beginner','Intermediate','Advanced']

export default function GeneratePage() {
  const { addIdeas } = useStore()
  const [form, setForm]       = useState({ branch:'', skills:'', interests:'', domain:'', difficulty:'' })
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState([])

  const setF = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  async function handleGenerate() {
    if (!form.branch && !form.skills && !form.interests) {
      toast.error('Fill in at least branch, skills or interests')
      return
    }
    setLoading(true); setResults([])
    try {
      const res = await generateIdeas(form)
      setResults(res.data.ideas)
      addIdeas(res.data.ideas)
      toast.success(`${res.data.total} ideas generated!`)
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Failed to generate ideas')
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', background: '#13151f', border: '1px solid #2a2d3e',
    borderRadius: '8px', padding: '10px 14px', color: '#f0f0f8',
    fontSize: '14px', outline: 'none', fontFamily: 'DM Sans, sans-serif'
  }
  const labelStyle = { display: 'block', fontSize: '12px', color: '#8a8aaa', marginBottom: '6px', fontWeight: 500 }

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.75rem', marginBottom: '4px' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#7c6af7', marginRight: '8px', marginBottom: '2px' }}/>
          Idea Generator
        </h1>
        <p style={{ color: '#8a8aaa', fontSize: '14px' }}>Describe your profile — GenieAI will craft tailored final year project ideas</p>
      </div>

      <div style={{ background: '#1a1d2a', border: '1px solid #2a2d3e', borderRadius: '16px', padding: '1.75rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          {[['branch','Branch',branches,true],['domain','Domain Focus',domains,false],['difficulty','Difficulty',diffs,false]].map(([key,label,opts,required]) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <select style={inputStyle} value={form[key]} onChange={(e) => setF(key, e.target.value)}>
                <option value="">{required ? `Select ${label.toLowerCase()}` : `Any ${label.toLowerCase()}`}</option>
                {opts.map((o) => <option key={o} style={{ background: '#13151f' }}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Your Skills (comma separated)</label>
          <input style={inputStyle} placeholder="e.g. Python, React, Machine Learning, Firebase..."
            value={form.skills} onChange={(e) => setF('skills', e.target.value)} />
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>Interests & Problem Areas</label>
          <input style={inputStyle} placeholder="e.g. mental health, agriculture, smart cities, education..."
            value={form.interests} onChange={(e) => setF('interests', e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={handleGenerate} disabled={loading} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {loading ? <><span className="loader" /> Generating...</> : '✨ Generate Ideas'}
          </button>
          <button onClick={() => { setForm({ branch:'',skills:'',interests:'',domain:'',difficulty:'' }); setResults([]) }} className="btn-ghost">
            Clear
          </button>
        </div>
      </div>

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1,2,3,4].map((i) => (
            <div key={i} style={{ background: '#1a1d2a', border: '1px solid #2a2d3e', borderRadius: '16px', padding: '1.5rem' }}>
              {[['70%','20px'],['40%','14px'],['100%','60px'],['50%','14px']].map(([w,h],j) => (
                <div key={j} style={{ background: '#3a3d52', borderRadius: '6px', width: w, height: h, marginBottom: '12px', animation: 'pulse 1.5s ease infinite' }} />
              ))}
            </div>
          ))}
        </div>
      )}

      {!loading && results.length > 0 && results.map((idea, i) => <IdeaCard key={i} idea={idea} userSkills={form.skills} />)}
    </div>
  )
}