import { useState } from 'react'
import { analyzeDifficulty } from '../../services/api'
import toast from 'react-hot-toast'
import { BarChart3, RefreshCw, TrendingUp, Lightbulb } from 'lucide-react'

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
    if (score >= 5) return 'var(--accent)'  // Gold/Sand Accent - Medium
    return '#5ad4c8'                   // Teal - Easy
  }

  const getMatchColor = (pct) => {
    if (pct >= 70) return '#5ad4c8'   // Good match
    if (pct >= 40) return 'var(--accent)'   // Moderate
    return '#f97066'                   // Low match
  }

  if (!result) {
    return (
      <button 
        onClick={analyze} 
        disabled={loading}
        style={{
          background: 'var(--accent-bg)',
          border: '1px solid rgba(214, 158, 46, 0.3)',
          color: 'var(--accent)',
          padding: '10px 16px',
          borderRadius: '8px',
          cursor: loading ? 'wait' : 'pointer',
          fontSize: '13px',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginTop: '1rem',
          fontFamily: 'var(--font-body)',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = 0.9}
        onMouseLeave={(e) => e.currentTarget.style.opacity = 1}
      >
        {loading ? (
          <>
            <span className="loader" style={{ width: '12px', height: '12px' }} />
            Analyzing difficulty...
          </>
        ) : (
          <>
            <BarChart3 size={14} /> Analyze Difficulty
          </>
        )}
      </button>
    )
  }

  return (
    <div style={{
      background: 'var(--bg-input)',
      border: '1px solid var(--border)',
      borderRadius: '12px',
      padding: '1.25rem',
      marginTop: '1rem',
      transition: 'all 0.2s'
    }}>
      {/* Score Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            color: getScoreColor(result.difficulty_score)
          }}>
            {result.difficulty_score}
            <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>/10</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Difficulty</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            color: getMatchColor(result.skill_match_percent)
          }}>
            {result.skill_match_percent}
            <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>%</span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Skill Match</div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 800,
            fontFamily: 'var(--font-display)',
            color: 'var(--accent)'
          }}>
            {result.estimated_weeks}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Weeks</div>
        </div>
      </div>

      {/* Skills Gap */}
      {result.missing_skills?.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
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
                fontSize: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <TrendingUp size={12} /> {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Complexity Bars */}
      {result.complexity_breakdown && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
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
                color: 'var(--text-secondary)',
                textTransform: 'capitalize'
              }}>
                {layer.replace('_', ' ')}
              </div>
              <div style={{
                flex: 1,
                height: '6px',
                background: 'var(--border)',
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
                color: 'var(--text-secondary)',
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
          background: 'var(--accent-bg)',
          border: '1px solid rgba(214, 158, 46, 0.15)',
          borderRadius: '8px',
          padding: '12px',
          fontSize: '13px',
          color: 'var(--accent)',
          lineHeight: 1.5,
          display: 'flex',
          alignItems: 'flex-start',
          gap: '8px'
        }}>
          <Lightbulb size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Recommendation:</strong> {result.recommendation}
          </div>
        </div>
      )}

      {/* Re-analyze button */}
      <button
        onClick={() => setResult(null)}
        style={{
          background: 'transparent',
          border: '1px solid var(--border)',
          color: 'var(--text-secondary)',
          padding: '6px 12px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '12px',
          marginTop: '12px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <RefreshCw size={12} /> Re-analyze
      </button>
    </div>
  )
}