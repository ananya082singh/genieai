import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useStore from '../store/useStore'
import toast from 'react-hot-toast'

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
      let completed = 0
      let total = 6 // Assuming 6 week-groups per roadmap
      
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
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.75rem', marginBottom: '8px' }}>
          📈 Dashboard
        </h1>
        <p style={{ color: '#8a8aaa', fontSize: '14px' }}>
          Track your progress, skills, and completed projects
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: '#7c6af7', marginBottom: '4px' }}>
            {ideas.length}
          </div>
          <div style={{ fontSize: '12px', color: '#8a8aaa' }}>Ideas Generated</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: '#5ad4c8', marginBottom: '4px' }}>
            {savedIdeas.length}
          </div>
          <div style={{ fontSize: '12px', color: '#8a8aaa' }}>Ideas Saved</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: '#f4c430', marginBottom: '4px' }}>
            {totalRoadmapsViewed}
          </div>
          <div style={{ fontSize: '12px', color: '#8a8aaa' }}>Roadmaps Viewed</div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: '#f97066', marginBottom: '4px' }}>
            {completedProjects}
          </div>
          <div style={{ fontSize: '12px', color: '#8a8aaa' }}>Projects Completed</div>
        </div>
      </div>

      {/* Average Progress */}
      {totalRoadmapsViewed > 0 && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: '4px' }}>Average Roadmap Progress</div>
              <div style={{ fontSize: '12px', color: '#8a8aaa' }}>Across all your saved projects</div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'Syne, sans-serif', color: '#7c6af7' }}>
              {averageProgress}%
            </div>
          </div>
          <div style={{ height: '8px', background: '#2a2d3e', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${averageProgress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #7c6af7, #5ad4c8)',
              borderRadius: '4px',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      )}

      {/* Skills Learned */}
      {allSkills.length > 0 && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ fontWeight: 600, marginBottom: '12px' }}>
            Skills Across Your Projects ({allSkills.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {allSkills.map(skill => (
              <span key={skill} style={{
                background: 'rgba(124,106,247,0.1)',
                border: '1px solid rgba(124,106,247,0.2)',
                color: '#7c6af7',
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
            <div style={{ fontWeight: 600 }}>Your Projects</div>
            {completedProjects > 0 && (
              <button onClick={exportResume} className="btn-primary" style={{ fontSize: '12px', padding: '6px 14px' }}>
                📄 Export for Resume
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {savedIdeas.map((saved, idx) => {
              const idea = saved.idea
              const progress = roadmapProgress[idea.title] || { completed: 0, total: 6, percent: 0 }
              const isComplete = progress.percent === 100

              return (
                <div key={saved.id} style={{
                  background: isComplete ? 'rgba(90,212,200,0.03)' : '#13151f',
                  border: `1px solid ${isComplete ? 'rgba(90,212,200,0.3)' : '#2a2d3e'}`,
                  borderRadius: '12px',
                  padding: '1rem 1.25rem',
                  transition: 'all 0.2s'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>
                        {isComplete && '✓ '}
                        {idea.title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#8a8aaa' }}>
                        {idea.domain} • {idea.difficulty}
                      </div>
                    </div>
                    <span style={{
                      background: isComplete ? 'rgba(90,212,200,0.1)' : 'rgba(124,106,247,0.1)',
                      border: `1px solid ${isComplete ? 'rgba(90,212,200,0.3)' : 'rgba(124,106,247,0.3)'}`,
                      color: isComplete ? '#5ad4c8' : '#7c6af7',
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
                    <div style={{ height: '5px', background: '#2a2d3e', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${progress.percent}%`,
                        height: '100%',
                        background: isComplete ? '#5ad4c8' : '#7c6af7',
                        borderRadius: '3px',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                  </div>

                  <div style={{ fontSize: '11px', color: '#8a8aaa' }}>
                    {progress.completed} / {progress.total} weeks completed
                    {isComplete && ' 🎉'}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => {
                      useStore.getState().setCurrentIdea(idea)
                      navigate('/roadmap')
                    }}
                    className="btn-ghost"
                    style={{ fontSize: '11px', padding: '5px 10px', marginTop: '8px' }}
                  >
                    {isComplete ? '👁️ View Roadmap' : '▶️ Continue Progress'}
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
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            No Projects Yet
          </div>
          <p style={{ color: '#8a8aaa', fontSize: '14px', marginBottom: '1.5rem' }}>
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