import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { evolveStep } from '../services/api'
import toast from 'react-hot-toast'
import { Sprout, Brain, Zap, Rocket, Dna, RefreshCw, Sparkles, ArrowLeft, FolderClosed } from 'lucide-react'

const EVOLUTION_STEPS = [
  { 
    id: 1, 
    label: 'Base MVP', 
    icon: Sprout, 
    description: 'Core functionality — what the project does at its simplest'
  },
  { 
    id: 2, 
    label: 'Add AI Layer', 
    icon: Brain, 
    description: 'Integrate ML model or AI API to make it intelligent'
  },
  { 
    id: 3, 
    label: 'Add Real-time', 
    icon: Zap, 
    description: 'WebSockets, live updates, collaborative features'
  },
  { 
    id: 4, 
    label: 'Production Ready', 
    icon: Rocket, 
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
        <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--border)', marginBottom: '1.5rem' }}>
          <FolderClosed size={64} />
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
          No Idea Selected
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '2rem' }}>
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
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.75rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
          <Dna size={28} /> Idea Evolution
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
          Evolve your idea step-by-step from MVP to production
        </p>
      </div>

      {/* Current Idea Panel */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '1.75rem',
        marginBottom: '2rem',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2rem',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.2s'
      }}>
        <div style={{ flex: '1 1 450px' }}>
          <span style={{ 
            fontSize: '11px', 
            textTransform: 'uppercase', 
            fontWeight: 600, 
            letterSpacing: '0.05em', 
            color: 'var(--accent)', 
            display: 'inline-block',
            marginBottom: '6px'
          }}>
            Active Project Scope
          </span>
          <h2 style={{ 
            fontFamily: 'var(--font-display)', 
            fontWeight: 800, 
            fontSize: '1.35rem', 
            color: 'var(--text-primary)',
            marginBottom: '8px'
          }}>
            {idea.title}
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            {idea.description}
          </p>
          
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <span style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
              {idea.domain}
            </span>
            <span style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', color: 'var(--text-secondary)' }}>
              {idea.difficulty}
            </span>
          </div>
        </div>

        {/* Progress Tracker Card */}
        <div style={{
          flex: '0 0 240px',
          background: 'var(--bg-input)',
          border: '1px solid var(--border)',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          width: '240px',
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
            <span>Evolution Progress</span>
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{completedSteps}/{EVOLUTION_STEPS.length} stages</span>
          </div>
          <div style={{
            height: '6px',
            background: 'var(--border)',
            borderRadius: '3px',
            overflow: 'hidden',
            marginBottom: '8px'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              background: 'var(--accent)',
              borderRadius: '3px',
              transition: 'width 0.5s ease'
            }} />
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textAlign: 'right' }}>
            {Math.round(progress)}% Completed
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
          background: 'var(--border)',
          borderRadius: '1px',
          zIndex: 0
        }} />

        {/* Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {EVOLUTION_STEPS.map((step) => {
            const isComplete = steps[step.id]
            const isLoading = loading === step.id
            const StepIcon = step.icon
            
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
                  background: isComplete ? 'rgba(90,212,200,0.15)' : 'var(--bg-card)',
                  border: isComplete ? '2px solid #5ad4c8' : '2px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isComplete ? '#5ad4c8' : 'var(--text-secondary)',
                  flexShrink: 0,
                  transition: 'all 0.3s'
                }}>
                  <StepIcon size={20} />
                </div>

                {/* Step Content */}
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '1.25rem 1.5rem',
                  transition: 'all 0.2s'
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    <div style={{ fontWeight: 600, fontSize: '15px', color: 'var(--text-primary)' }}>
                      {step.label}
                    </div>
                    
                    <button
                      onClick={() => handleEvolve(step.id)}
                      disabled={isLoading}
                      style={{
                        background: isComplete ? 'rgba(90,212,200,0.1)' : 'var(--accent-bg)',
                        border: `1px solid ${isComplete ? 'rgba(90,212,200,0.3)' : 'rgba(214, 158, 46, 0.3)'}`,
                        color: isComplete ? '#5ad4c8' : 'var(--accent)',
                        padding: '6px 14px',
                        borderRadius: '6px',
                        cursor: isLoading ? 'wait' : 'pointer',
                        fontSize: '12px',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {isLoading ? (
                        <>
                          <span className="loader" style={{ width: '10px', height: '10px' }} />
                          Evolving...
                        </>
                      ) : isComplete ? (
                        <><RefreshCw size={12} /> Re-evolve</>
                      ) : (
                        <><Sparkles size={12} /> Evolve</>
                      )}
                    </button>
                  </div>

                  <p style={{
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    marginBottom: steps[step.id] ? '12px' : '0',
                    lineHeight: 1.5
                  }}>
                    {step.description}
                  </p>

                  {/* Evolution Result */}
                  {steps[step.id] && (
                    <div style={{
                      background: 'var(--bg-input)',
                      border: '1px solid var(--border)',
                      borderRadius: '8px',
                      padding: '14px',
                      fontSize: '13px',
                      color: 'var(--text-primary)',
                      lineHeight: 1.6,
                      marginTop: '12px',
                      transition: 'all 0.2s'
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
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: '#5ad4c8', marginBottom: '0.5rem' }}>
            Evolution Complete!
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            You now have a full roadmap from MVP to production-ready deployment
          </p>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="btn-ghost"
        style={{ marginTop: '2rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
      >
        <ArrowLeft size={14} /> Back to Ideas
      </button>
    </div>
  )
}