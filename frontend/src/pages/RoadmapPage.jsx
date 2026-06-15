import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { generateRoadmap } from '../services/api'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'
import { 
  Map, 
  GitFork, 
  Flag, 
  Play, 
  FileText, 
  GraduationCap, 
  Wrench, 
  Award, 
  PenSquare, 
  ArrowLeft, 
  FolderClosed, 
  Target, 
  Check, 
  Youtube, 
  FileText as DocIcon, 
  BookOpen 
} from 'lucide-react'

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
      background: done ? 'rgba(90,212,200,0.03)' : 'var(--bg-card)',
      border: `1px solid ${done ? 'rgba(90,212,200,0.3)' : 'var(--border)'}`,
      borderRadius: '12px',
      padding: '1.25rem 1.5rem',
      transition: 'all 0.3s'
    }}>
      
      <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr auto', gap: '1rem', alignItems: 'start' }}>
        
        {/* Week Icon */}
        <div style={{
          width: '48px',
          height: '48px',
          background: done ? 'rgba(90,212,200,0.15)' : 'var(--accent-bg)',
          border: `2px solid ${done ? '#5ad4c8' : 'rgba(214, 158, 46, 0.3)'}`,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          color: done ? '#5ad4c8' : 'var(--accent)',
          fontSize: '14px',
          flexShrink: 0
        }}>
          {done ? <Check size={18} /> : `W${index + 1}`}
        </div>

        {/* Content */}
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)' }}>{week.week}</div>
            <span style={{
              background: 'var(--accent-bg)',
              color: 'var(--accent)',
              border: '1px solid rgba(214, 158, 46, 0.2)',
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
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Check size={10} /> Completed
              </span>
            )}
          </div>

          {/* Tasks - Expandable */}
          <div style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
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
                background: 'linear-gradient(to bottom, transparent, var(--bg-card))'
              }} />
            )}
          </div>

          {week.tasks.length > 150 && (
            <button
              onClick={() => setExpanded(!expanded)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent)',
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
              <Flag size={12} /> {week.milestone}
            </div>
          )}

          {/* Resources */}
          {week.resources?.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
                Resources
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {week.resources.map((r, j) => {
                  const getIcon = () => {
                    if (r.type === 'YouTube') return <Youtube size={12} />
                    if (r.type === 'Docs') return <DocIcon size={12} />
                    if (r.type === 'Course') return <GraduationCap size={12} />
                    return <Wrench size={12} />
                  }
                  return (
                    <span key={j} style={{
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      color: 'var(--accent)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      {getIcon()}
                      {r.label}
                    </span>
                  )
                })}
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
                background: 'var(--bg-input)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                padding: '10px 12px',
                color: 'var(--text-primary)',
                fontSize: '13px',
                resize: 'none',
                height: '80px',
                outline: 'none',
                fontFamily: 'var(--font-body)',
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
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {done ? '↩ Undo' : <><Check size={12} /> Complete</>}
            </button>
            <button
              onClick={() => setShowNote(!showNote)}
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
                padding: '6px 14px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <PenSquare size={12} /> {showNote ? 'Hide' : note ? 'Edit Note' : 'Add Note'}
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
            border: `2px solid ${done ? '#5ad4c8' : 'var(--border)'}`,
            background: done ? '#5ad4c8' : 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'all 0.2s'
          }}
        >
          {done && <Check size={14} color="#0a0c14" strokeWidth={3} />}
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
    if (currentIdea) {
      const cacheKey = `roadmap_data_${currentIdea.title}`
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        setCurrentRoadmap(JSON.parse(cached))
      } else {
        setCurrentRoadmap(null)
        fetchRoadmap()
      }
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
      localStorage.setItem(`roadmap_data_${currentIdea.title}`, JSON.stringify(res.data))
      toast.success('Roadmap generated!')
    } catch (err) {
      toast.error('Failed to generate roadmap')
    }
    setLoading(false)
  }

  if (!currentIdea) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '5rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--border)', marginBottom: '1.5rem' }}>
          <FolderClosed size={64} />
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
          No Idea Selected
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '2rem' }}>
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
        <button onClick={() => navigate(-1)} className="btn-ghost" style={{ marginBottom: '1rem', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <ArrowLeft size={14} /> Back
        </button>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.75rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
          <Map size={28} /> Roadmap Generator
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Week-by-week plan with milestones & resources
        </p>
      </div>

      {/* Project Info */}
      <div style={{
        background: 'var(--accent-bg)',
        border: '1px solid rgba(214, 158, 46, 0.2)',
        borderRadius: '12px',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
        transition: 'all 0.2s'
      }}>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '6px' }}>Roadmap for</div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px', color: 'var(--text-primary)' }}>
          {currentIdea.title}
        </div>
        <div style={{ fontSize: '13px', color: 'var(--accent)', lineHeight: 1.5, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
          <Target size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>{currentIdea.description}</div>
        </div>
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
              <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>Overall Progress</span>
              <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                {completed}/{totalWeeks} weeks · {progress}%
              </span>
            </div>
            <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${progress}%`,
                height: '100%',
                background: 'var(--accent)',
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
              <div style={{ display: 'flex', justifyContent: 'center', color: '#5ad4c8', marginBottom: '0.75rem' }}>
                <Award size={32} />
              </div>
              <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '15px', color: 'var(--text-primary)' }}>Final Milestone</div>
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