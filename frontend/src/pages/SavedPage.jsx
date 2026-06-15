import { useEffect, useState } from 'react'
import { getSaved } from '../services/api'
import useStore from '../store/useStore'
import IdeaCard from '../components/ui/IdeaCard'
import { Bookmark } from 'lucide-react'

export default function SavedPage() {
  const { savedIdeas, setSavedIdeas } = useStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSaved().then((res) => { setSavedIdeas(res.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.75rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
        <Bookmark size={28} /> Saved Ideas
      </h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '2rem' }}>Your bookmarked project ideas</p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}><div className="loader" style={{ width: '28px', height: '28px', borderWidth: '3px', margin: '0 auto' }} /></div>
      ) : savedIdeas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-secondary)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--border)', marginBottom: '1rem' }}>
            <Bookmark size={64} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 600 }}>No saved ideas yet</div>
          <div style={{ fontSize: '14px' }}>Bookmark ideas from the generator to see them here</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1rem' }}>
          {savedIdeas.map((s) => <IdeaCard key={s.id} idea={s.idea} savedId={s.id} />)}
        </div>
      )}
    </div>
  )
}