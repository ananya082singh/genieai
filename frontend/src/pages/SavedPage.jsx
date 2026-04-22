import { useEffect, useState } from 'react'
import { getSaved } from '../services/api'
import useStore from '../store/useStore'
import IdeaCard from '../components/ui/IdeaCard'

export default function SavedPage() {
  const { savedIdeas, setSavedIdeas } = useStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSaved().then((res) => { setSavedIdeas(res.data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.75rem', marginBottom: '8px' }}>🔖 Saved Ideas</h1>
      <p style={{ color: '#8a8aaa', fontSize: '14px', marginBottom: '2rem' }}>Your bookmarked project ideas</p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}><div className="loader" style={{ width: '28px', height: '28px', borderWidth: '3px', margin: '0 auto' }} /></div>
      ) : savedIdeas.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#8a8aaa' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔖</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.1rem', color: '#f0f0f8', marginBottom: '8px' }}>No saved ideas yet</div>
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