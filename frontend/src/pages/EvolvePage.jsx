import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { evolveStep } from '../services/api'
import toast from 'react-hot-toast'

const EVOLUTION_STEPS = [
  { 
    id: 1, 
    label: 'Base MVP', 
    icon: '🌱', 
    description: 'Core functionality — what the project does at its simplest'
  },
  { 
    id: 2, 
    label: 'Add AI Layer', 
    icon: '🧠', 
    description: 'Integrate ML model or AI API to make it intelligent'
  },
  { 
    id: 3, 
    label: 'Add Real-time', 
    icon: '⚡', 
    description: 'WebSockets, live updates, collaborative features'
  },
  { 
    id: 4, 
    label: 'Production Ready', 
    icon: '🚀', 
    description: 'Auth, deployment, monitoring, scalability'
  },
]

export default function EvolvePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const idea = location.state?.idea
  const [steps, setSteps] = useState({})
  const [loading, setLoading] = useState(null)

  useEffect(() => {
    if (!idea) return
    // Auto-evolve first step on load
    if (Object.keys(steps).length === 0) {
      handleEvolve(1)
    }
  }, [idea])

  async function handleEvolve(stepId) {
    if (!idea) return
    const step = EVOLUTION_STEPS.find(s => s.id === stepId)
    setLoading(stepId)
    
    try {
      const res = await evolveStep({
        title: idea.title,
        description: idea.description,
        techStack: idea.techStack || [],
        stepLabel: step.label,
        stepDescription: step.description
      })
      
      setSteps(prev => ({ ...prev, [stepId]: res.data.guidance }))
      toast.success(`${step.label} evolved!`)
    } catch (err) {
      toast.error('Evolution failed')
      console.error(err)
    }
    setLoading(null)
  }

  if (!idea) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '5rem 2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🧬</div>
        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          No Idea Selected
        </div>
        <p style={{ color: '#8a8aaa', fontSize: '14px', marginBottom: '2rem' }}>
          Select a project idea and click "Evolve" to see its evolution path
        </p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Go to Idea Generator
        </button>
      </div>
    )
  }

  const completedSteps = Object.keys(steps).length
  const progress = (completedSteps / EVOLUTION_STEPS.length) * 100

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.75rem', marginBottom: '8px' }}>
          🧬 Idea Evolution
        </h1>
        <p style={{ color: '#8a8aaa', fontSize: '14px' }}>
          Evolve your idea step-by-step from MVP to production
        </p>
      </div>

      {/* Current Idea */}
      <div style={{
        background: 'rgba(124,106,247,0.05)',
        border: '1px solid rgba(124,106,247,0.2)',
        borderRadius: '12px',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.05rem', marginBottom: '6px' }}>
          {idea.title}
        </div>
        <p style={{ fontSize: '13px', color: '#8a8aaa', lineHeight: 1.5 }}>
          {idea.description}
        </p>
        
        {/* Progress Bar */}
        <div style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#8a8aaa', marginBottom: '6px' }}>
            <span>Evolution Progress</span>
            <span style={{ color: '#7c6af7', fontWeight: 600 }}>{completedSteps}/{EVOLUTION_STEPS.length} stages</span>
          </div>
          <div style={{
            height: '6px',
            background: '#2a2d3e',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #7c6af7, #5ad4c8)',
              borderRadius: '3px',
              transition: 'width 0.5s ease'
            }} />
          </div>
        </div>
      </div>

      {/* Evolution Timeline */}
      <div style={{ position: 'relative' }}>
        {/* Vertical Line */}
        <div style={{
          position: 'absolute',
          left: '23px',
          top: '32px',
          bottom: '32px',
          width: '2px',
          background: 'linear-gradient(to bottom, #7c6af7, #5ad4c8)',
          borderRadius: '1px',
          zIndex: 0
        }} />

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {EVOLUTION_STEPS.map((step) => {
            const isComplete = steps[step.id]
            const isLoading = loading === step.id
            
            return (
              <div key={step.id} style={{
                display: 'grid',
                gridTemplateColumns: '48px 1fr',
                gap: '1rem',
                position: 'relative',
                zIndex: 1
              }}>
                {/* Step Circle */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: isComplete ? 'rgba(90,212,200,0.15)' : '#1a1d2a',
                  border: isComplete ? '2px solid #5ad4c8' : '2px solid #2a2d3e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  flexShrink: 0,
                  transition: 'all 0.3s'
                }}>
                  {step.icon}
                </div>

                {/* Step Content */}
                <div style={{
                  background: '#1a1d2a',
                  border: '1px solid #2a2d3e',
                  borderRadius: '12px',
                  padding: '1.25rem 1.5rem'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    <div style={{ fontWeight: 600, fontSize: '15px' }}>
                      {step.label}
                    </div>
                    
                    <button
                      onClick={() => handleEvolve(step.id)}
                      disabled={isLoading}
                      style={{
                        background: isComplete ? 'rgba(90,212,200,0.1)' : 'rgba(124,106,247,0.1)',
                        border: `1px solid ${isComplete ? 'rgba(90,212,200,0.3)' : 'rgba(124,106,247,0.3)'}`,
                        color: isComplete ? '#5ad4c8' : '#7c6af7',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        cursor: isLoading ? 'wait' : 'pointer',
                        fontSize: '12px',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      {isLoading ? (
                        <>
                          <span className="loader" style={{ width: '10px', height: '10px' }} />
                          Evolving...
                        </>
                      ) : isComplete ? (
                        '🔄 Re-evolve'
                      ) : (
                        '✨ Evolve'
                      )}
                    </button>
                  </div>

                  <p style={{
                    fontSize: '13px',
                    color: '#8a8aaa',
                    marginBottom: steps[step.id] ? '12px' : '0',
                    lineHeight: 1.5
                  }}>
                    {step.description}
                  </p>

                  {/* Evolution Result */}
                  {steps[step.id] && (
                    <div style={{
                      background: '#13151f',
                      borderRadius: '8px',
                      padding: '14px',
                      fontSize: '13px',
                      color: '#f0f0f8',
                      lineHeight: 1.6,
                      borderLeft: '3px solid #5ad4c8'
                    }}>
                      {steps[step.id]}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Completion Badge */}
      {completedSteps === EVOLUTION_STEPS.length && (
        <div style={{
          marginTop: '2rem',
          background: 'rgba(90,212,200,0.05)',
          border: '1px solid rgba(90,212,200,0.2)',
          borderRadius: '12px',
          padding: '1.25rem 1.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎉</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.1rem', color: '#5ad4c8', marginBottom: '0.5rem' }}>
            Evolution Complete!
          </div>
          <p style={{ fontSize: '13px', color: '#8a8aaa' }}>
            You now have a full roadmap from MVP to production-ready deployment
          </p>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="btn-ghost"
        style={{ marginTop: '2rem' }}
      >
        ← Back to Ideas
      </button>
    </div>
  )
}