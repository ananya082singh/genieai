import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'
import { LayoutDashboard, FolderClosed, FileText, Eye, Play } from 'lucide-react'

export default function DashboardPage() {
  const navigate = useNavigate()
  const { ideas, savedIdeas } = useStore()
  const [roadmapProgress, setRoadmapProgress] = useState({})
  const [allSkills, setAllSkills] = useState([])

  useEffect(() => {
    calculateProgress()
    aggregateSkills()
  }, [savedIdeas])

  function calculateProgress() {
    const progress = {}
    savedIdeas.forEach(saved => {
      const title = saved.idea.title
      
      // Read the actual number of weeks from cached roadmap data
      const cacheKey = `roadmap_data_${title}`
      const cached = localStorage.getItem(cacheKey)
      let total = 6
      if (cached) {
        try {
          const roadmapObj = JSON.parse(cached)
          if (roadmapObj && Array.isArray(roadmapObj.weeks)) {
            total = roadmapObj.weeks.length
          }
        } catch (e) {
          console.error('Error parsing cached roadmap:', e)
        }
      } else {
        // Fallback default duration based on difficulty if roadmap not generated yet
        const difficulty = saved.idea.difficulty?.toLowerCase() || ''
        if (difficulty.includes('beginner')) {
          total = 6
        } else if (difficulty.includes('intermediate') || difficulty.includes('medium')) {
          total = 8
        } else {
          total = 12
        }
      }
      
      let completed = 0
      for (let i = 0; i < total; i++) {
        const key = `roadmap_${title}_week_${i}`
        const data = JSON.parse(localStorage.getItem(key) || '{"done":false}')
        if (data.done) completed++
      }
      
      progress[title] = { completed, total, percent: Math.round((completed / total) * 100) }
    })
    setRoadmapProgress(progress)
  }

  function aggregateSkills() {
    const skillSet = new Set()
    savedIdeas.forEach(saved => {
      saved.idea.techStack?.forEach(tech => skillSet.add(tech))
    })
    setAllSkills(Array.from(skillSet))
  }

  function exportResume() {
    const completedProjects = savedIdeas.filter(saved => {
      const prog = roadmapProgress[saved.idea.title]
      return prog && prog.percent === 100
    })

    if (completedProjects.length === 0) {
      toast.error('No completed projects to export yet')
      return
    }

    let resumeText = '=== FINAL YEAR PROJECTS ===\n\n'
    
    completedProjects.forEach((saved, idx) => {
      const idea = saved.idea
      resumeText += `${idx + 1}. ${idea.title}\n`
      resumeText += `   Domain: ${idea.domain}\n`
      resumeText += `   Tech Stack: ${idea.techStack?.join(', ')}\n`
      resumeText += `   Outcome: ${idea.outcome}\n`
      resumeText += `   Status: ✓ Completed\n\n`
    })

    const blob = new Blob([resumeText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resume-projects.txt'
    a.click()
    toast.success('Resume projects exported!')
  }

  const totalRoadmapsViewed = Object.keys(roadmapProgress).length
  const averageProgress = totalRoadmapsViewed > 0
    ? Math.round(Object.values(roadmapProgress).reduce((sum, p) => sum + p.percent, 0) / totalRoadmapsViewed)
    : 0

  const completedProjects = Object.values(roadmapProgress).filter(p => p.percent === 100).length

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.75rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
          <LayoutDashboard size={28} /> Dashboard
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Track your progress, skills, and completed projects
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--accent)', marginBottom: '4px' }}>
            {ideas.length}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Ideas Generated</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#5ad4c8', marginBottom: '4px' }}>
            {savedIdeas.length}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Ideas Saved</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#f4c430', marginBottom: '4px' }}>
            {totalRoadmapsViewed}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Roadmaps Viewed</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: '#f97066', marginBottom: '4px' }}>
            {completedProjects}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Projects Completed</div>
        </div>
      </div>

      {/* Average Progress */}
      {totalRoadmapsViewed > 0 && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)' }}>Average Roadmap Progress</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Across all your saved projects</div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-display)', color: 'var(--accent)' }}>
              {averageProgress}%
            </div>
          </div>
          <div style={{ height: '8px', background: 'var(--bg-input)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${averageProgress}%`,
              height: '100%',
              background: 'var(--accent)',
              borderRadius: '4px',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      )}

      {/* Skills Learned */}
      {allSkills.length > 0 && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
            Skills Across Your Projects ({allSkills.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {allSkills.map(skill => (
              <span key={skill} style={{
                background: 'var(--accent-bg)',
                border: '1px solid rgba(214, 158, 46, 0.2)',
                color: 'var(--accent)',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 500
              }}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Project Progress List */}
      {savedIdeas.length > 0 && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Your Projects</div>
            {completedProjects > 0 && (
              <button onClick={exportResume} className="btn-primary" style={{ fontSize: '12px', padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <FileText size={14} /> Export for Resume
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {savedIdeas.map((saved) => {
              const idea = saved.idea
              const difficulty = idea.difficulty?.toLowerCase() || ''
              let defaultTotal = 6
              if (difficulty.includes('beginner')) {
                defaultTotal = 6
              } else if (difficulty.includes('intermediate') || difficulty.includes('medium')) {
                defaultTotal = 8
              } else {
                defaultTotal = 12
              }
              const progress = roadmapProgress[idea.title] || { completed: 0, total: defaultTotal, percent: 0 }
              const isComplete = progress.percent === 100

              return (
                <div key={saved.id} style={{
                  background: isComplete ? 'rgba(90,212,200,0.03)' : 'var(--bg-input)',
                  border: `1px solid ${isComplete ? 'rgba(90,212,200,0.3)' : 'var(--border)'}`,
                  borderRadius: '12px',
                  padding: '1rem 1.25rem',
                  transition: 'all 0.2s'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px', color: 'var(--text-primary)' }}>
                        {isComplete && '✓ '}
                        {idea.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                        {idea.domain} • {idea.difficulty}
                      </div>
                    </div>
                    <span style={{
                      background: isComplete ? 'rgba(90,212,200,0.1)' : 'var(--accent-bg)',
                      border: `1px solid ${isComplete ? 'rgba(90,212,200,0.3)' : 'rgba(214, 158, 46, 0.3)'}`,
                      color: isComplete ? '#5ad4c8' : 'var(--accent)',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '11px',
                      fontWeight: 600
                    }}>
                      {progress.percent}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{ height: '5px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${progress.percent}%`,
                        height: '100%',
                        background: isComplete ? '#5ad4c8' : 'var(--accent)',
                        borderRadius: '3px',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                  </div>

                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                    {progress.completed} / {progress.total} weeks completed
                    {isComplete && ' (Completed)'}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      useStore.getState().setCurrentIdea(idea)
                      navigate('/roadmap')
                    }}
                    className="btn-ghost"
                    style={{ fontSize: '11px', padding: '5px 10px', marginTop: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    {isComplete ? (
                      <><Eye size={12} /> View Roadmap</>
                    ) : (
                      <><Play size={12} fill="currentColor" /> Continue Progress</>
                    )}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {savedIdeas.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--border)', marginBottom: '1rem' }}>
            <FolderClosed size={64} />
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            No Projects Yet
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '1.5rem' }}>
            Start by generating and saving some project ideas
          </p>
          <button onClick={() => navigate('/')} className="btn-primary">
            Generate Ideas
          </button>
        </div>
      )}
    </div>
  )
}