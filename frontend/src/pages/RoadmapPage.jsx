import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateRoadmap } from '../services/api'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'

export default function RoadmapPage() {
  const navigate = useNavigate()
  const { currentIdea, currentRoadmap, setCurrentRoadmap } = useStore()
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (currentIdea && !currentRoadmap) fetchRoadmap() }, [currentIdea])

  async function fetchRoadmap() {
    setLoading(true)
    try {
      const res = await generateRoadmap({ title: currentIdea.title, description: currentIdea.description, techStack: currentIdea.techStack, difficulty: currentIdea.difficulty, domain: currentIdea.domain })
      setCurrentRoadmap(res.data)
    } catch { toast.error('Failed to generate roadmap') }
    setLoading(false)
  }

  if (!currentIdea) return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.75rem', marginBottom: '2rem' }}>🗺️ Roadmap Generator</h1>
      <div style={{ textAlign: 'center', padding: '5rem 2rem', color: '#8a8aaa' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🗺️</div>
        <div style={{ fontFamily: 'Syne,sans-serif', fontSize: '1.1rem', color: '#f0f0f8', marginBottom: '8px' }}>No project selected</div>
        <div style={{ fontSize: '14px', marginBottom: '1.5rem' }}>Generate ideas first, then click "Get Roadmap"</div>
        <button onClick={() => navigate('/')} className="btn-primary">Go to Idea Generator</button>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'Syne,sans-serif', fontWeight: 800, fontSize: '1.75rem', marginBottom: '8px' }}>🗺️ Roadmap Generator</h1>
      <p style={{ color: '#8a8aaa', fontSize: '14px', marginBottom: '1.5rem' }}>Week-by-week plan with milestones & resources</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button onClick={() => navigate('/')} className="btn-ghost" style={{ fontSize: '13px' }}>← Back</button>
        <div>
          <div style={{ fontSize: '12px', color: '#8a8aaa' }}>Roadmap for</div>
          <div style={{ fontFamily: 'Syne,sans-serif', fontWeight: 700 }}>{currentIdea.title}</div>
        </div>
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '4rem', color: '#8a8aaa' }}><div className="loader" style={{ width: '28px', height: '28px', borderWidth: '3px', margin: '0 auto 1rem' }} /><div>Generating roadmap...</div></div>}

      {!loading && currentRoadmap && (
        <>
          <div style={{ background: 'rgba(90,212,200,0.05)', border: '1px solid rgba(90,212,200,0.15)', borderRadius: '10px', padding: '14px', color: '#5ad4c8', fontSize: '14px', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            🎯 {currentRoadmap.overview}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentRoadmap.weeks?.map((week, i) => (
              <div key={i} style={{ background: '#1a1d2a', border: '1px solid #2a2d3e', borderRadius: '12px', padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: '48px 1fr', gap: '1rem', alignItems: 'start' }}>
                <div style={{ width: '44px', height: '44px', background: 'rgba(124,106,247,0.1)', border: '1px solid rgba(124,106,247,0.3)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne,sans-serif', fontWeight: 800, color: '#7c6af7', fontSize: '13px' }}>W{i+1}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <strong style={{ fontSize: '15px' }}>{week.week}</strong>
                    <span style={{ background: 'rgba(124,106,247,0.1)', color: '#7c6af7', border: '1px solid rgba(124,106,247,0.2)', padding: '2px 10px', borderRadius: '20px', fontSize: '11px' }}>{week.phase}</span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#8a8aaa', lineHeight: 1.6, marginBottom: '10px' }}>{week.tasks}</p>
                  {week.milestone && <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(249,112,102,0.1)', color: '#f97066', border: '1px solid rgba(249,112,102,0.2)', padding: '3px 12px', borderRadius: '20px', fontSize: '12px', marginBottom: '10px' }}>🏁 {week.milestone}</div>}
                  {week.resources?.length > 0 && (
                    <div>
                      <div style={{ fontSize: '11px', color: '#3a3d52', marginBottom: '6px' }}>Resources</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {week.resources.map((r, j) => (
                          <span key={j} style={{ background: '#13151f', border: '1px solid #2a2d3e', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', color: '#5ad4c8', cursor: 'pointer' }}>
                            {r.type === 'YouTube' ? '▶' : '📄'} {r.label}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {currentRoadmap.finalMilestone && (
            <div style={{ background: 'rgba(90,212,200,0.05)', border: '1px solid rgba(90,212,200,0.15)', borderRadius: '10px', padding: '14px', color: '#5ad4c8', fontSize: '14px', marginTop: '1.5rem' }}>
              🏆 <strong>Final Milestone:</strong> {currentRoadmap.finalMilestone}
            </div>
          )}
        </>
      )}
    </div>
  )
}