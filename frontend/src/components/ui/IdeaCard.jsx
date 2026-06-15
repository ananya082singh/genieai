import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveIdea, deleteSaved } from '../../services/api'
import useStore from '../../store/useStore'
import toast from 'react-hot-toast'
import DifficultyAnalyzer from './DifficultyAnalyzer'
import { Bookmark, Target, GitFork, Cpu, Dna, MessageSquare } from 'lucide-react'

export default function IdeaCard({ idea, savedId = null, userSkills = '' }) {
  const navigate = useNavigate()
  const { addSaved, removeSaved, savedIdeas, setCurrentIdea, setCurrentRoadmap } = useStore()
  const [saving, setSaving] = useState(false)

  const isSaved = savedId || savedIdeas.some((s) => s.idea.title === idea.title)

  async function handleSave() {
    if (isSaved) return
    setSaving(true)
    try {
      const res = await saveIdea(idea)
      addSaved(res.data)
      toast.success('Idea saved!')
    } catch { toast.error('Failed to save') }
    setSaving(false)
  }

  async function handleUnsave() {
    if (!savedId) return
    try {
      await deleteSaved(savedId)
      removeSaved(savedId)
      toast.success('Removed')
    } catch { toast.error('Failed to remove') }
  }

  function goRoadmap() {
    setCurrentIdea(idea)
    setCurrentRoadmap(null)
    navigate('/roadmap')
  }

  const diffStyle = idea.difficulty === 'Advanced'
    ? { background: 'rgba(249,112,102,0.1)', color: '#f97066', border: '1px solid rgba(249,112,102,0.2)' }
    : idea.difficulty === 'Beginner'
    ? { background: 'rgba(90,212,200,0.1)', color: '#5ad4c8', border: '1px solid rgba(90,212,200,0.2)' }
    : { background: 'var(--accent-bg)', color: 'var(--accent)', border: '1px solid rgba(214,158, 46, 0.2)' }

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px',
      padding: '1.5rem', transition: 'all 0.2s', marginBottom: '1rem'
    }}
    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '12px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.3, color: 'var(--text-primary)' }}>{idea.title}</h3>
        <button onClick={isSaved ? handleUnsave : handleSave} disabled={saving}
          style={{ background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0, padding: 0 }}>
          {isSaved ? (
            <Bookmark size={18} fill="var(--accent)" color="var(--accent)" />
          ) : (
            <Bookmark size={18} color="var(--text-secondary)" />
          )}
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
        <span style={{ background: 'rgba(90,212,200,0.1)', color: '#5ad4c8', border: '1px solid rgba(90,212,200,0.2)', padding: '2px 10px', borderRadius: '20px', fontSize: '12px' }}>
          {idea.domain}
        </span>
        <span style={{ ...diffStyle, padding: '2px 10px', borderRadius: '20px', fontSize: '12px' }}>
          {idea.difficulty}
        </span>
      </div>

      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '16px' }}>{idea.description}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
        {idea.techStack?.map((t) => (
          <span key={t} style={{
            background: 'var(--bg-input)', border: '1px solid var(--border)',
            padding: '3px 10px', borderRadius: '6px', fontSize: '12px', color: 'var(--text-secondary)', fontFamily: 'monospace'
          }}>{t}</span>
        ))}
      </div>

      {idea.outcome && (
        <div style={{
          background: 'rgba(90,212,200,0.05)', border: '1px solid rgba(90,212,200,0.15)',
          borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#5ad4c8',
          lineHeight: 1.5, marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '8px'
        }}>
          <Target size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Outcome:</strong> {idea.outcome}
          </div>
        </div>
      )}

      {/* Difficulty Analyzer */}
      <DifficultyAnalyzer idea={idea} userSkills={userSkills} />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '16px', borderTop: '1px solid var(--border)', alignItems: 'center' }}>
        <button onClick={goRoadmap} className="btn-primary" style={{ fontSize: '13px', padding: '8px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <GitFork size={14} /> Get Roadmap
        </button>
        <button onClick={() => navigate('/stack', { state: { idea } })} className="btn-ghost" style={{ fontSize: '13px', padding: '8px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Cpu size={14} /> Tech Stack
        </button>
        <button onClick={() => navigate('/evolve', { state: { idea } })} className="btn-ghost" style={{ fontSize: '13px', padding: '8px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Dna size={14} /> Evolve
        </button>
        <button onClick={() => navigate('/chat', { state: { title: idea.title } })} className="btn-ghost" style={{ fontSize: '13px', padding: '8px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <MessageSquare size={14} /> Discuss
        </button>
      </div>
    </div>
  )
}