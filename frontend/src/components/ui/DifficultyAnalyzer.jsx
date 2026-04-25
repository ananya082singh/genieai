import { useState } from 'react'
import { analyzeDifficulty } from '../../services/api'
import toast from 'react-hot-toast'

export default function DifficultyAnalyzer({ idea, userSkills }) {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  async function analyze() {
    setLoading(true)
    try {
      const res = await analyzeDifficulty({
        title: idea.title,
        description: idea.description,
        techStack: idea.techStack,
        userSkills: userSkills
      })
      setResult(res.data)
      toast.success('Analysis complete!')
    } catch (err) {
      toast.error('Analysis failed')
      console.error(err)
    }
    setLoading(false)
  }

  const getScoreColor = (score) => {
    if (score >= 8) return '#f97066'  // Red - Hard
    if (score >= 5) return '#f4c430'  // Yellow - Medium
    return '#5ad4c8'                   // Teal - Easy
  }

  const getMatchColor = (pct) => {
    if (pct >= 70) return '#5ad4c8'   // Good match
    if (pct >= 40) return '#f4c430'   // Moderate
    return '#f97066'                   // Low match
  }

  if (!result) {
    return (
      <button 
        onClick={analyze} 
        disabled={loading}
        style={{
          background: 'rgba(124,106,247,0.1)',
          border: '1px solid rgba(124,106,247,0.3)',
          color: '#7c6af7',
          padding: '10px 16px',
          borderRadius: '8px',
          cursor: loading ? 'wait' : 'pointer',
          fontSize: '13px',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '1rem'
        }}
      >
        {loading ? (
          <>
            <span className="loader" style={{ width: '12px', height: '12px' }} />
            Analyzing difficulty...
          </>
        ) : (
          <>📊 Analyze Difficulty</>
        )}
      </button>
    )
  }

  return (
    <div style={{
      background: '#13151f',
      border: '1px solid #2a2d3e',
      borderRadius: '12px',
      padding: '1.25rem',
      marginTop: '1rem'
    }}>
      {/* Score Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 800,
            fontFamily: 'Syne, sans-serif',
            color: getScoreColor(result.difficulty_score)
          }}>
            {result.difficulty_score}
            <span style={{ fontSize: '1rem', color: '#8a8aaa' }}>/10</span>
          </div>
          <div style={{ fontSize: '11px', color: '#8a8aaa', marginTop: '4px' }}>Difficulty</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 800,
            fontFamily: 'Syne, sans-serif',
            color: getMatchColor(result.skill_match_percent)
          }}>
            {result.skill_match_percent}
            <span style={{ fontSize: '1rem', color: '#8a8aaa' }}>%</span>
          </div>
          <div style={{ fontSize: '11px', color: '#8a8aaa', marginTop: '4px' }}>Skill Match</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 800,
            fontFamily: 'Syne, sans-serif',
            color: '#7c6af7'
          }}>
            {result.estimated_weeks}
          </div>
          <div style={{ fontSize: '11px', color: '#8a8aaa', marginTop: '4px' }}>Weeks</div>
        </div>
      </div>

      {/* Skills Gap */}
      {result.missing_skills?.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '11px', color: '#8a8aaa', marginBottom: '6px', fontWeight: 500 }}>
            Skills to Learn ({result.missing_skills.length})
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {result.missing_skills.map((skill) => (
              <span key={skill} style={{
                background: 'rgba(249,112,102,0.1)',
                border: '1px solid rgba(249,112,102,0.2)',
                color: '#f97066',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '12px'
              }}>
                ↗ {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Complexity Bars */}
      {result.complexity_breakdown && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '11px', color: '#8a8aaa', marginBottom: '8px', fontWeight: 500 }}>
            Complexity Breakdown
          </div>
          {Object.entries(result.complexity_breakdown).map(([layer, score]) => (
            <div key={layer} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '8px'
            }}>
              <div style={{
                width: '80px',
                fontSize: '11px',
                color: '#8a8aaa',
                textTransform: 'capitalize'
              }}>
                {layer.replace('_', ' ')}
              </div>
              <div style={{
                flex: 1,
                height: '6px',
                background: '#2a2d3e',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${score * 10}%`,
                  height: '100%',
                  background: getScoreColor(score),
                  borderRadius: '3px',
                  transition: 'width 0.8s ease'
                }} />
              </div>
              <div style={{
                fontSize: '11px',
                color: '#8a8aaa',
                width: '24px',
                textAlign: 'right'
              }}>
                {score}/10
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recommendation */}
      {result.recommendation && (
        <div style={{
          background: 'rgba(124,106,247,0.05)',
          border: '1px solid rgba(124,106,247,0.15)',
          borderRadius: '8px',
          padding: '12px',
          fontSize: '13px',
          color: '#7c6af7',
          lineHeight: 1.5
        }}>
          💡 <strong>Recommendation:</strong> {result.recommendation}
        </div>
      )}

      {/* Re-analyze button */}
      <button
        onClick={() => setResult(null)}
        style={{
          background: 'transparent',
          border: '1px solid #2a2d3e',
          color: '#8a8aaa',
          padding: '6px 12px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '12px',
          marginTop: '12px'
        }}
      >
        🔄 Re-analyze
      </button>
    </div>
  )
}