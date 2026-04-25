import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveIdea, deleteSaved } from '../../services/api'
import useStore from '../../store/useStore'
import toast from 'react-hot-toast'
import DifficultyAnalyzer from './DifficultyAnalyzer'

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
    : { background: 'rgba(124,106,247,0.1)', color: '#7c6af7', border: '1px solid rgba(124,106,247,0.2)' }

  return (
    <div style={{
      background: '#1a1d2a', border: '1px solid #2a2d3e', borderRadius: '16px',
      padding: '1.5rem', transition: 'border-color 0.2s', marginBottom: '1rem'
    }}
    onMouseEnter={(e) => e.currentTarget.style.borderColor = '#7c6af7'}
    onMouseLeave={(e) => e.currentTarget.style.borderColor = '#2a2d3e'}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '12px' }}>
        <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.3 }}>{idea.title}</h3>
        <button onClick={isSaved ? handleUnsave : handleSave} disabled={saving}
          style={{ fontSize: '18px', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
          {isSaved ? '🔖' : '🏷️'}
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

      <p style={{ fontSize: '14px', color: '#8a8aaa', lineHeight: 1.6, marginBottom: '16px' }}>{idea.description}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
        {idea.techStack?.map((t) => (
          <span key={t} style={{
            background: '#13151f', border: '1px solid #2a2d3e',
            padding: '3px 10px', borderRadius: '6px', fontSize: '12px', color: '#8a8aaa', fontFamily: 'monospace'
          }}>{t}</span>
        ))}
      </div>

      {idea.outcome && (
        <div style={{
          background: 'rgba(90,212,200,0.05)', border: '1px solid rgba(90,212,200,0.15)',
          borderRadius: '8px', padding: '10px 14px', fontSize: '13px', color: '#5ad4c8',
          lineHeight: 1.5, marginBottom: '16px'
        }}>
          🎯 <strong>Outcome:</strong> {idea.outcome}
        </div>
      )}

      {/* NEW: Difficulty Analyzer */}
      <DifficultyAnalyzer idea={idea} userSkills={userSkills} />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '16px', borderTop: '1px solid #2a2d3e' }}>
        <button onClick={goRoadmap} className="btn-primary" style={{ fontSize: '13px', padding: '8px 14px' }}>🗺️ Get Roadmap</button>
        <button onClick={() => navigate('/stack', { state: { idea } })} className="btn-ghost" style={{ fontSize: '13px', padding: '8px 14px' }}>⚙️ Tech Stack</button>
        <button onClick={() => navigate('/chat', { state: { title: idea.title } })} className="btn-ghost" style={{ fontSize: '13px', padding: '8px 14px' }}>💬 Discuss</button>
      </div>
    </div>
  )
}