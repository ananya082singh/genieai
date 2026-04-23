import { useState } from 'react'
import useStore from '../store/useStore'
import IdeaCard from '../components/ui/IdeaCard'

const DOMAINS = ['All','AI/ML','Web','Mobile','IoT','Blockchain','Cybersecurity','Cloud','AR/VR','Healthcare','FinTech','EdTech']

export default function SearchPage() {
  const { ideas } = useStore()
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(new Set(['All']))

  function toggleFilter(d) {
    if (d === 'All') { setActive(new Set(['All'])); return }
    const next = new Set(active); next.delete('All')
    next.has(d) ? next.delete(d) : next.add(d)
    if (!next.size) next.add('All')
    setActive(next)
  }

  const filtered = ideas.filter((idea) => {
    const domainOk = active.has('All') || [...active].some((f) => (idea.domain||'').toLowerCase().includes(f.toLowerCase().split('/')[0]))
    const queryOk  = !query || (idea.title+idea.description+(idea.techStack||[]).join(' ')).toLowerCase().includes(query.toLowerCase())
    return domainOk && queryOk
  })

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.75rem', marginBottom: '8px' }}>🔍 Browse & Filter</h1>
      <p style={{ color: '#8a8aaa', fontSize: '14px', marginBottom: '1.5rem' }}>Search across all your generated ideas</p>

      <input style={{ width: '100%', background: '#1a1d2a', border: '1px solid #2a2d3e', borderRadius: '8px', padding: '10px 14px', color: '#f0f0f8', fontSize: '14px', outline: 'none', marginBottom: '1rem' }}
        placeholder="🔍 Search by title, tech, keyword..." value={query} onChange={(e) => setQuery(e.target.value)} />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem' }}>
        {DOMAINS.map((d) => (
          <button key={d} onClick={() => toggleFilter(d)} style={{
            padding: '6px 14px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s',
            background: active.has(d) ? 'rgba(124,106,247,0.15)' : '#1a1d2a',
            border: active.has(d) ? '1px solid #7c6af7' : '1px solid #2a2d3e',
            color: active.has(d) ? '#7c6af7' : '#8a8aaa',
          }}>{d}</button>
        ))}
      </div>

      {ideas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: '#8a8aaa' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <div style={{ fontFamily: 'Syne,sans-serif', color: '#f0f0f8', marginBottom: '8px' }}>No ideas yet</div>
          <div style={{ fontSize: '14px' }}>Generate some ideas first</div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#8a8aaa' }}>No ideas match your search</div>
      ) : (
        filtered.map((idea, i) => <IdeaCard key={i} idea={idea} />)
      )}
    </div>
  )
}