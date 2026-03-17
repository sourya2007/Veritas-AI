import { useMemo, useState } from 'react'
import { ShinyText } from '../components/reactbits/ShinyText'
import type { VerificationEvidence } from '../types'
import SpotlightCard from '../components/reactbits-official/SpotlightCard'
import Magnet from '../components/reactbits-official/Magnet'

const mockEvidence: VerificationEvidence[] = [
  {
    source: 'WHO Situation Bulletin',
    snippet: 'Current bulletin does not report the claimed nationwide outbreak pattern.',
    stance: 'contradicts',
  },
  {
    source: 'National Public Health Agency',
    snippet: 'Official advisory confirms localized increase but no broad emergency declaration.',
    stance: 'supports',
  },
  {
    source: 'Reuters Fact Check',
    snippet: 'Claim appears to combine old statistics with new events, causing misleading context.',
    stance: 'neutral',
  },
]

export function VerifyPage() {
  const [claim, setClaim] = useState('')
  const [progress, setProgress] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  const verdict = useMemo(() => {
    if (progress < 100) {
      return 'Analyzing...'
    }

    return 'Mixed / Needs Context'
  }, [progress])

  const runVerification = () => {
    if (!claim.trim() || isRunning) {
      return
    }

    setIsRunning(true)
    setProgress(0)

    let value = 0
    const timer = setInterval(() => {
      value += 20
      setProgress(Math.min(100, value))

      if (value >= 100) {
        clearInterval(timer)
        setIsRunning(false)
      }
    }, 450)
  }

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <ShinyText>Real-time Verification</ShinyText>
          <p className="subtext">Paste any news claim and verify against live internet source patterns.</p>
        </div>
        <span className="status-badge">Internet Evidence Mode</span>
      </header>

      <section className="verify-grid">
        <form
          className="verify-form"
          onSubmit={(event) => {
            event.preventDefault()
            runVerification()
          }}
        >
          <label htmlFor="claim" className="subtext">
            News or claim text
          </label>
          <textarea
            id="claim"
            className="verify-textarea"
            value={claim}
            onChange={(event) => setClaim(event.target.value)}
            placeholder="Example: Government has banned all digital payments nationwide from tomorrow."
          />

          <div className="progress-line" aria-label="verification progress">
            <div className="progress-value" style={{ width: `${progress}%` }} />
          </div>
          <span className="muted">Pipeline progress: {progress}%</span>

          <Magnet>
            <button className="magnetic-button" type="submit" disabled={isRunning}>
              {isRunning ? 'Verifying...' : 'Verify Claim'}
            </button>
          </Magnet>
        </form>

        <SpotlightCard className="panel">
          <div className="spotlight-inner">
            <h3 className="card-title">Verdict</h3>
            <p className="metric-value">{verdict}</p>
            <p className="subtext">Confidence: {progress === 100 ? '0.71' : '--'}</p>
            <div className="evidence-list">
              {mockEvidence.map((evidence) => (
                <div key={evidence.source} className="evidence-item">
                  <strong>{evidence.source}</strong>
                  <p className="card-description">{evidence.snippet}</p>
                  <span className="pill">{evidence.stance}</span>
                </div>
              ))}
            </div>
          </div>
        </SpotlightCard>
      </section>
    </main>
  )
}
