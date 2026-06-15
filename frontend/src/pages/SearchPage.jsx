import { useState } from 'react'
import useStore from '../store/useStore'
import IdeaCard from '../components/ui/IdeaCard'
import { Search, FolderClosed } from 'lucide-react'

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
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.75rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
        <Search size={28} /> Browse & Filter
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '1.5rem' }}>Search across all your generated ideas</p>

      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <Search size={16} style={{ position: 'absolute', left: '14px', top: '14px', color: 'var(--text-secondary)' }} />
        <input style={{ width: '100%', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px 14px 10px 38px', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}
          placeholder="Search by title, tech, keyword..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem' }}>
        {DOMAINS.map((d) => (
          <button key={d} onClick={() => toggleFilter(d)} style={{
            padding: '6px 14px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s',
            background: active.has(d) ? 'var(--accent-bg)' : 'var(--bg-card)',
            border: active.has(d) ? '1px solid var(--accent)' : '1px solid var(--border)',
            color: active.has(d) ? 'var(--accent)' : 'var(--text-secondary)',
            fontFamily: 'var(--font-body)'
          }}>{d}</button>
        ))}
      </div>

      {ideas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--border)', marginBottom: '1rem' }}>
            <FolderClosed size={64} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 600 }}>No ideas yet</div>
          <div style={{ fontSize: '14px' }}>Generate some ideas first</div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>No ideas match your search</div>
      ) : (
        filtered.map((idea, i) => <IdeaCard key={i} idea={idea} />)
      )}
    </div>
  )
}