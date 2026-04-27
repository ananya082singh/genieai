import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateRoadmap } from '../services/api'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'

function WeekCard({ week, index, ideaTitle }) {
  const key = `roadmap_${ideaTitle}_week_${index}`
  const saved = JSON.parse(localStorage.getItem(key) || '{"done":false,"note":""}')
  const [done, setDone] = useState(saved.done)
  const [note, setNote] = useState(saved.note)
  const [showNote, setShowNote] = useState(false)
  const [expanded, setExpanded] = useState(false)

  function toggleDone() {
    const next = !done
    setDone(next)
    localStorage.setItem(key, JSON.stringify({ done: next, note }))
    toast.success(next ? 'Week marked complete!' : 'Marked incomplete')
  }

  function saveNote(val) {
    setNote(val)
    localStorage.setItem(key, JSON.stringify({ done, note: val }))
  }

  return (
    <div style={{
      background: done ? 'rgba(90,212,200,0.03)' : '#1a1d2a',
      border: `1px solid ${done ? 'rgba(90,212,200,0.3)' : '#2a2d3e'}`,
      borderRadius: '12px',
      padding: '1.25rem 1.5rem',
      transition: 'all 0.3s'
    }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr auto', gap: '1rem', alignItems: 'start' }}>
        
        {/* Week Icon */}
        <div style={{
          width: '48px',
          height: '48px',
          background: done ? 'rgba(90,212,200,0.15)' : 'rgba(124,106,247,0.1)',
          border: `2px solid ${done ? '#5ad4c8' : 'rgba(124,106,247,0.3)'}`,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Syne, sans-serif',
          fontWeight: 800,
          color: done ? '#5ad4c8' : '#7c6af7',
          fontSize: '14px',
          flexShrink: 0
        }}>
          {done ? '✓' : `W${index + 1}`}
        </div>

        {/* Content */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <div style={{ fontWeight: 700, fontSize: '15px' }}>{week.week}</div>
            <span style={{
              background: 'rgba(124,106,247,0.1)',
              color: '#7c6af7',
              border: '1px solid rgba(124,106,247,0.2)',
              padding: '2px 10px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 500
            }}>
              {week.phase}
            </span>
            {done && (
              <span style={{
                background: 'rgba(90,212,200,0.1)',
                color: '#5ad4c8',
                border: '1px solid rgba(90,212,200,0.2)',
                padding: '2px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 500
              }}>
                ✓ Completed
              </span>
            )}
          </div>

          {/* Tasks - Expandable */}
          <div style={{
            fontSize: '13px',
            color: '#8a8aaa',
            lineHeight: 1.6,
            marginBottom: '10px',
            maxHeight: expanded ? 'none' : '60px',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {week.tasks}
            {!expanded && week.tasks.length > 150 && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '40px',
                background: 'linear-gradient(to bottom, transparent, #1a1d2a)'
              }} />
            )}
          </div>

          {week.tasks.length > 150 && (
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#7c6af7',
                fontSize: '12px',
                cursor: 'pointer',
                padding: 0,
                marginBottom: '10px'
              }}
            >
              {expanded ? '▲ Show less' : '▼ Read more'}
            </button>
          )}

          {/* Milestone Badge */}
          {week.milestone && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(249,112,102,0.1)',
              color: '#f97066',
              border: '1px solid rgba(249,112,102,0.2)',
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              marginBottom: '12px'
            }}>
              🏁 {week.milestone}
            </div>
          )}

          {/* Resources */}
          {week.resources?.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', color: '#3a3d52', marginBottom: '6px', fontWeight: 500 }}>
                Resources
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {week.resources.map((r, j) => (
                  <span key={j} style={{
                    background: '#13151f',
                    border: '1px solid #2a2d3e',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    color: '#5ad4c8',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {r.type === 'YouTube' ? '▶' : r.type === 'Docs' ? '📄' : r.type === 'Course' ? '🎓' : '🔧'}
                    {r.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Note */}
          {showNote && (
            <textarea
              value={note}
              onChange={(e) => saveNote(e.target.value)}
              placeholder="Add your notes for this week..."
              style={{
                width: '100%',
                background: '#13151f',
                border: '1px solid #2a2d3e',
                borderRadius: '8px',
                padding: '10px 12px',
                color: '#f0f0f8',
                fontSize: '13px',
                resize: 'none',
                height: '80px',
                outline: 'none',
                fontFamily: 'DM Sans, sans-serif',
                marginBottom: '10px'
              }}
            />
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={toggleDone}
              style={{
                background: done ? 'rgba(249,112,102,0.1)' : 'rgba(90,212,200,0.1)',
                border: `1px solid ${done ? 'rgba(249,112,102,0.3)' : 'rgba(90,212,200,0.3)'}`,
                color: done ? '#f97066' : '#5ad4c8',
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 500
              }}
            >
              {done ? '↩ Undo' : '✓ Complete'}
            </button>
            <button
              onClick={() => setShowNote(!showNote)}
              style={{
                background: 'transparent',
                border: '1px solid #2a2d3e',
                color: '#8a8aaa',
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              📝 {showNote ? 'Hide' : note ? 'Edit Note' : 'Add Note'}
            </button>
          </div>
        </div>

        {/* Checkbox */}
        <div
          onClick={toggleDone}
          style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            border: `2px solid ${done ? '#5ad4c8' : '#2a2d3e'}`,
            background: done ? '#5ad4c8' : 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.2s'
          }}
        >
          {done && <span style={{ color: '#0a0c14', fontSize: '14px', fontWeight: 900 }}>✓</span>}
        </div>
      </div>
    </div>
  )
}

export default function RoadmapPage() {
  const navigate = useNavigate()
  const { currentIdea, currentRoadmap, setCurrentRoadmap } = useStore()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (currentIdea && !currentRoadmap) {
      fetchRoadmap()
    }
  }, [currentIdea])

  async function fetchRoadmap() {
    if (!currentIdea) return
    setLoading(true)
    try {
      const res = await generateRoadmap({
        title: currentIdea.title,
        description: currentIdea.description,
        techStack: currentIdea.techStack,
        difficulty: currentIdea.difficulty,
        domain: currentIdea.domain
      })
      setCurrentRoadmap(res.data)
      toast.success('Roadmap generated!')
    } catch (err) {
      toast.error('Failed to generate roadmap')
    }
    setLoading(false)
  }

  if (!currentIdea) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '5rem 2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🗺️</div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          No Idea Selected
        </div>
        <p style={{ color: '#8a8aaa', fontSize: '14px', marginBottom: '2rem' }}>
          Select a project idea to generate its roadmap
        </p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Go to Idea Generator
        </button>
      </div>
    )
  }

  const totalWeeks = currentRoadmap?.weeks?.length || 0
  const completed = currentRoadmap?.weeks?.filter((_, i) => {
    const saved = JSON.parse(localStorage.getItem(`roadmap_${currentIdea.title}_week_${i}`) || '{"done":false}')
    return saved.done
  }).length || 0
  const progress = totalWeeks ? Math.round((completed / totalWeeks) * 100) : 0

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button onClick={() => navigate(-1)} className="btn-ghost" style={{ marginBottom: '1rem', fontSize: '13px' }}>
          ← Back
        </button>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.75rem', marginBottom: '4px' }}>
          🗺️ Roadmap Generator
        </h1>
        <p style={{ color: '#8a8aaa', fontSize: '14px' }}>
          Week-by-week plan with milestones & resources
        </p>
      </div>

      {/* Project Info */}
      <div style={{
        background: 'rgba(124,106,247,0.05)',
        border: '1px solid rgba(124,106,247,0.15)',
        borderRadius: '12px',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{ fontSize: '12px', color: '#8a8aaa', marginBottom: '6px' }}>Roadmap for</div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px' }}>
          {currentIdea.title}
        </div>
        <p style={{ fontSize: '13px', color: '#5ad4c8', lineHeight: 1.5 }}>
          🎯 {currentIdea.description}
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="card" style={{ padding: '1.5rem' }}>
              {[['80px', '20px'], ['60%', '14px'], ['100%', '60px']].map(([w, h], j) => (
                <div key={j} style={{
                  background: '#3a3d52',
                  borderRadius: '6px',
                  width: w,
                  height: h,
                  marginBottom: '12px',
                  animation: 'pulse 1.5s ease infinite'
                }} />
              ))}
            </div>
          ))}
        </div>
      ) : currentRoadmap ? (
        <>
          {/* Progress Bar */}
          <div className="card" style={{ padding: '1.25rem 1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
              <span style={{ color: '#8a8aaa', fontWeight: 500 }}>Overall Progress</span>
              <span style={{ color: '#5ad4c8', fontWeight: 600 }}>
                {completed}/{totalWeeks} weeks · {progress}%
              </span>
            </div>
            <div style={{ height: '8px', background: '#2a2d3e', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #7c6af7, #5ad4c8)',
                borderRadius: '4px',
                transition: 'width 0.5s ease'
              }} />
            </div>
          </div>

          {/* Weeks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {currentRoadmap.weeks.map((week, i) => (
              <WeekCard key={i} week={week} index={i} ideaTitle={currentIdea.title} />
            ))}
          </div>

          {/* Final Milestone */}
          {currentRoadmap.finalMilestone && (
            <div style={{
              background: 'rgba(90,212,200,0.05)',
              border: '1px solid rgba(90,212,200,0.2)',
              borderRadius: '12px',
              padding: '1.5rem',
              marginTop: '2rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🏆</div>
              <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '15px' }}>Final Milestone</div>
              <p style={{ fontSize: '13px', color: '#5ad4c8', lineHeight: 1.6 }}>
                {currentRoadmap.finalMilestone}
              </p>
            </div>
          )}
        </>
      ) : null}
    </div>
  )
}