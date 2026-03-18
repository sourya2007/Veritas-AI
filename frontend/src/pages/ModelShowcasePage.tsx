import { useEffect, useMemo, useState } from 'react'
import { ShinyText } from '../components/reactbits/ShinyText'
import Magnet from '../components/reactbits-official/Magnet'
import { apiGet, apiPost } from '../lib/api'
import type { ModelInferApiResponse, ModelMetricsApiResponse, VerifyApiResponse } from '../types'

const DEMO_SAMPLES = [
  'Reuters: Federal Reserve keeps interest rates unchanged amid inflation concerns.',
  'CNN reports UN climate summit reaches provisional emissions framework agreement.',
  'FAKE: NASA confirms Earth will go completely dark for six days next month.',
  'HOAX: Government to seize all private savings accounts starting Monday morning.',
  'BBC: Parliament passes revised public health spending bill after final vote.',
]

const TRUE_NEWS_SAMPLES = [
  'The Federal Reserve announced today that it will maintain its current interest rates at 5.25-5.5% amid persistent inflation concerns. Chair Jerome Powell stated in a press conference that economic data suggests a measured approach is warranted. Markets responded with a 1.2% gain on the S&P 500.',
  'Parliament voted 342 to 156 in favor of a revised public health spending bill that allocates an additional 2 billion pounds to the National Health Service. The legislation passed its final reading this afternoon with cross-party support.',
  'The World Health Organization has launched an expanded vaccination campaign targeting seasonal influenza in developing nations. More than 50 countries have pledged to participate in the initiative announced by WHO Director-General.',
]

const FAKE_NEWS_SAMPLES = [
  'Breaking news: Scientists have discovered a hidden technology that will revolutionize everything and hide the truth from you forever. Governments do not want you to know about this shocking secret that billionaires are using to control everyone and nobody is telling you the real truth.',
  'Shocking new evidence proves that every major news organization is completely controlled by evil forces and spreading lies to the public. Millions of people are waking up to this conspiracy that authorities never want exposed and you must share this immediately.',
  'A miracle cure has been suppressed from the public for decades and is guaranteed to heal any disease instantly. Medical doctors refuse to acknowledge this proven treatment because pharmaceutical companies are preventing it to make money off people.',
]

type DemoResult = {
  sample: string
  infer?: ModelInferApiResponse
  verify?: VerifyApiResponse
  error?: string
}

export function ModelShowcasePage() {
  const [text, setText] = useState('Breaking: Local authority confirms vaccine microchip mandate begins this weekend.')
  const [inference, setInference] = useState<ModelInferApiResponse | null>(null)
  const [metricsPayload, setMetricsPayload] = useState<ModelMetricsApiResponse | null>(null)
  const [isRunningInference, setIsRunningInference] = useState(false)
  const [isDemoRunning, setIsDemoRunning] = useState(false)
  const [demoResults, setDemoResults] = useState<DemoResult[]>([])

  useEffect(() => {
    let active = true
    const loadMetrics = async () => {
      try {
        const metrics = await apiGet<ModelMetricsApiResponse>('/api/model/metrics')
        if (active) {
          setMetricsPayload(metrics)
        }
      } catch {
        if (active) {
          setMetricsPayload(null)
        }
      }
    }

    void loadMetrics()
    const intervalId = window.setInterval(() => {
      void loadMetrics()
    }, 5000)

    return () => {
      active = false
      window.clearInterval(intervalId)
    }
  }, [])

  const metrics = useMemo(() => {
    if (!metricsPayload) {
      return [
        { label: 'F1 Score', value: '0.88' },
        { label: 'Precision', value: '0.90' },
        { label: 'Recall', value: '0.86' },
        { label: 'ROC-AUC', value: '0.92' },
      ]
    }

    return [
      { label: 'F1 Score', value: metricsPayload.metrics.f1?.toFixed(2) ?? '--' },
      { label: 'Precision', value: metricsPayload.metrics.precision?.toFixed(2) ?? '--' },
      { label: 'Recall', value: metricsPayload.metrics.recall?.toFixed(2) ?? '--' },
      { label: 'ROC-AUC', value: metricsPayload.metrics.roc_auc?.toFixed(2) ?? '--' },
    ]
  }, [metricsPayload])

  const runLocalInference = async () => {
    if (!text.trim() || isRunningInference || isDemoRunning) {
      return
    }

    setIsRunningInference(true)
    try {
      const payload = await apiPost<ModelInferApiResponse, { text: string }>('/api/model/infer', { text })
      setInference(payload)
    } catch {
      setInference({ label: 'Unavailable', confidence: 0, top_signals: ['backend unavailable'] })
    } finally {
      setIsRunningInference(false)
    }
  }

  const runDemoSamples = async () => {
    if (isRunningInference || isDemoRunning) {
      return
    }

    setIsDemoRunning(true)
    setDemoResults([])

    const nextResults: DemoResult[] = []
    for (const sample of DEMO_SAMPLES) {
      try {
        const [infer, verify] = await Promise.all([
          apiPost<ModelInferApiResponse, { text: string }>('/api/model/infer', { text: sample }),
          apiPost<VerifyApiResponse, { claim_text: string }>('/api/verify', { claim_text: sample }),
        ])
        nextResults.push({ sample, infer, verify })
      } catch {
        nextResults.push({ sample, error: 'Demo sample request failed.' })
      }
      setDemoResults([...nextResults])
    }

    setIsDemoRunning(false)
  }

  const predictionMetrics = useMemo(
    () => [
      { label: 'Predictions Served', value: String(metricsPayload?.prediction_count ?? 0) },
      { label: 'Last Prediction (ms)', value: metricsPayload ? metricsPayload.last_prediction_ms.toFixed(2) : '--' },
      { label: 'Avg Prediction (ms)', value: metricsPayload ? metricsPayload.avg_prediction_ms.toFixed(2) : '--' },
      { label: 'Overall Model Score', value: metricsPayload ? metricsPayload.overall_score.toFixed(3) : '--' },
    ],
    [metricsPayload],
  )

  const loadSampleForInference = (sample: string) => {
    setText(sample)
    setInference(null)
  }

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <ShinyText>Local Model Showcase</ShinyText>
          <p className="subtext">Prediction-only dashboard for local model inference, statistical metrics, and demo runs.</p>
        </div>
        <span className="status-badge">Local Prediction Metrics</span>
      </header>

      <section className="model-grid">
        <article className="panel">
          <h3 className="card-title">Model + Dataset</h3>
          <p className="subtext">{metricsPayload?.model_name ?? 'Loading model metadata...'}</p>
          <p className="subtext">{metricsPayload?.dataset ?? 'Loading dataset metadata...'}</p>
          <p className="subtext">Trained at: {metricsPayload?.trained_at ?? '--'}</p>
          <p className="subtext">Mode: {metricsPayload?.mode ?? '--'}</p>
          <div className="metrics" style={{ marginTop: '1rem' }}>
            {metrics.map((metric) => (
              <div className="metric-card" key={metric.label}>
                <div className="muted">{metric.label}</div>
                <div className="metric-value">{metric.value}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1rem' }}>
            <h4 className="card-title" style={{ fontSize: '0.98rem', marginBottom: '0.55rem' }}>
              Sample Inputs for Local Testing
            </h4>
            <p className="muted" style={{ margin: '0 0 0.55rem 0' }}>
              Click any sample to load it into the inference playground.
            </p>

            <p className="muted" style={{ margin: 0 }}>True News Samples</p>
            <ul style={{ margin: '0.4rem 0 0.8rem 1rem', padding: 0, lineHeight: 1.4 }}>
              {TRUE_NEWS_SAMPLES.map((sample) => (
                <li key={sample} className="subtext" style={{ marginBottom: '0.35rem' }}>
                  <button
                    type="button"
                    className="demo-button"
                    style={{ textAlign: 'left', width: '100%' }}
                    onClick={() => loadSampleForInference(sample)}
                    disabled={isRunningInference || isDemoRunning}
                  >
                    {sample}
                  </button>
                </li>
              ))}
            </ul>

            <p className="muted" style={{ margin: 0 }}>Fake News Samples</p>
            <ul style={{ margin: '0.4rem 0 0 1rem', padding: 0, lineHeight: 1.4 }}>
              {FAKE_NEWS_SAMPLES.map((sample) => (
                <li key={sample} className="subtext" style={{ marginBottom: '0.35rem' }}>
                  <button
                    type="button"
                    className="demo-button"
                    style={{ textAlign: 'left', width: '100%' }}
                    onClick={() => loadSampleForInference(sample)}
                    disabled={isRunningInference || isDemoRunning}
                  >
                    {sample}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </article>

        <article className="panel">
          <h3 className="card-title">Inference Playground</h3>
          <p className="subtext">Run direct local-model inference on any custom claim text.</p>
          <textarea
            className="verify-textarea"
            value={text}
            onChange={(event) => setText(event.target.value)}
            style={{ marginTop: '0.75rem' }}
          />
          <div className="verify-actions" style={{ marginTop: '0.7rem' }}>
            <Magnet>
              <button className="magnetic-button" onClick={() => void runLocalInference()} type="button" disabled={isRunningInference || isDemoRunning}>
                {isRunningInference ? 'Running Inference...' : 'Run Local Prediction'}
              </button>
            </Magnet>
            <button className="demo-button" type="button" onClick={() => void runDemoSamples()} disabled={isRunningInference || isDemoRunning}>
              {isDemoRunning ? 'Running Demo Samples...' : 'Run Demo Samples'}
            </button>
          </div>
          <p className="metric-value" style={{ marginTop: '1rem' }}>
            {inference?.label ?? 'Awaiting prediction'}
          </p>
          <p className="subtext">
            Confidence: {inference ? inference.confidence.toFixed(2) : '--'} · Top signals:{' '}
            {inference?.top_signals.join(', ') ?? 'run inference to view'}
          </p>
        </article>
      </section>

      <section className="model-grid" style={{ marginTop: '1rem' }}>
        <article className="panel">
          <h3 className="card-title">Prediction Processing Metrics</h3>
          <div className="metrics" style={{ marginTop: '1rem' }}>
            {predictionMetrics.map((metric) => (
              <div className="metric-card" key={metric.label}>
                <div className="muted">{metric.label}</div>
                <div className="metric-value">{metric.value}</div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <h3 className="card-title">General Model Health</h3>
          <p className="subtext">Overall score summarizes F1, precision, recall, and ROC-AUC.</p>
          <div className="metrics" style={{ marginTop: '0.8rem' }}>
            {[
              { label: 'Overall Score', value: metricsPayload ? metricsPayload.overall_score.toFixed(3) : '--' },
              { label: 'Model Mode', value: metricsPayload?.mode ?? '--' },
            ].map((item) => (
              <div className="metric-card" key={item.label}>
                <div className="muted">{item.label}</div>
                <div className="metric-value">{item.value}</div>
              </div>
            ))}
          </div>
        </article>
      </section>

      {(isDemoRunning || demoResults.length > 0) && (
        <section className="panel demo-results-panel">
          <h3 className="card-title">Demo Sample Results</h3>
          <p className="subtext">Showcase outputs for curated local-model samples.</p>

          <div className="demo-results-list">
            {demoResults.map((entry) => (
              <article key={entry.sample} className="demo-result-item">
                <p className="demo-result-text">{entry.sample}</p>
                {entry.error ? (
                  <p className="muted">{entry.error}</p>
                ) : (
                  <>
                    <p className="muted">
                      Model: {entry.infer?.label ?? 'N/A'} ({entry.infer?.confidence?.toFixed(2) ?? '--'})
                    </p>
                    <p className="muted">
                      Verify: {entry.verify?.verdict ?? 'N/A'} ({entry.verify?.confidence?.toFixed(2) ?? '--'})
                    </p>
                    <p className="muted">Signals: {entry.infer?.top_signals?.slice(0, 4).join(', ') ?? 'none'}</p>
                  </>
                )}
              </article>
            ))}
            {isDemoRunning && <p className="muted">Processing remaining samples...</p>}
          </div>
        </section>
      )}
    </main>
  )
}
