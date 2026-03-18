import { useState } from 'react'
import { ShinyText } from '../components/reactbits/ShinyText'
import SpotlightCard from '../components/reactbits-official/SpotlightCard'
import Magnet from '../components/reactbits-official/Magnet'
import { apiPost } from '../lib/api'
import type { VerificationEvidence, VerifyApiResponse } from '../types'

export function VerifyPage() {
  const [claim, setClaim] = useState('')
  const [progress, setProgress] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState<VerifyApiResponse | null>(null)

  const runVerification = async () => {
    if (!claim.trim() || isRunning) {
      return
    }

    setIsRunning(true)
    setResult(null)
    setProgress(22)

    try {
      const response = await apiPost<VerifyApiResponse, { claim_text: string }>('/api/verify', {
        claim_text: claim,
      })
      setProgress(100)
      setResult(response)
    } catch {
      setProgress(100)
      setResult({
        verdict: 'Unverified',
        confidence: 0.3,
        evidence: [],
        explanation: 'Verification failed. Please retry shortly.',
        disclaimer: 'This assistant provides decision support, not absolute truth.',
      })
    } finally {
      setIsRunning(false)
    }
  }

  const evidence: VerificationEvidence[] = result?.evidence ?? []

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <ShinyText>Real-time Verification</ShinyText>
          <p className="subtext">Paste any news claim and verify using local detector model + live internet source patterns.</p>
        </div>
        <span className="status-badge">Hybrid Local+Internet Mode</span>
      </header>

      <section className="verify-grid">
        <form
          className="verify-form"
          onSubmit={(event) => {
            event.preventDefault()
            void runVerification()
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
            <p className="metric-value">{result?.verdict ?? (isRunning ? 'Analyzing...' : 'Awaiting input')}</p>
            <p className="subtext">Confidence: {result ? result.confidence.toFixed(2) : '--'}</p>
            <p className="subtext">{result?.explanation ?? 'Run verification to see internet evidence.'}</p>
            <div className="evidence-list">
              {evidence.map((item) => (
                <div key={`${item.source}-${item.snippet}`} className="evidence-item">
                  <strong>{item.source}</strong>
                  <p className="card-description">{item.snippet}</p>
                  <span className="pill">{item.stance}</span>
                </div>
              ))}
              {result && evidence.length === 0 && <div className="muted">No evidence snippets available.</div>}
            </div>
            {result && <p className="muted">{result.disclaimer}</p>}
          </div>
        </SpotlightCard>
      </section>
    </main>
  )
}
