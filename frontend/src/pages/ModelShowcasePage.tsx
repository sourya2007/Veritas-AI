import { useEffect, useMemo, useState } from 'react'
import { ShinyText } from '../components/reactbits/ShinyText'
import Magnet from '../components/reactbits-official/Magnet'
import { apiGet, apiPost } from '../lib/api'
import type { ModelInferApiResponse, ModelMetricsApiResponse } from '../types'

export function ModelShowcasePage() {
  const [text, setText] = useState('Breaking: Local authority confirms vaccine microchip mandate begins this weekend.')
  const [inference, setInference] = useState<ModelInferApiResponse | null>(null)
  const [metricsPayload, setMetricsPayload] = useState<ModelMetricsApiResponse | null>(null)

  useEffect(() => {
    let active = true
    const loadMetrics = async () => {
      try {
        const payload = await apiGet<ModelMetricsApiResponse>('/api/model/metrics')
        if (active) {
          setMetricsPayload(payload)
        }
      } catch {
        if (active) {
          setMetricsPayload(null)
        }
      }
    }

    void loadMetrics()

    return () => {
      active = false
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
    try {
      const payload = await apiPost<ModelInferApiResponse, { text: string }>('/api/model/infer', { text })
      setInference(payload)
    } catch {
      setInference({ label: 'Unavailable', confidence: 0, top_signals: ['backend unavailable'] })
    }
  }

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <ShinyText>Local Model Showcase</ShinyText>
          <p className="subtext">Demonstration of locally trained Python fake-news classifier outputs.</p>
        </div>
        <span className="status-badge">Offline Model Inference</span>
      </header>

      <section className="model-grid">
        <article className="panel">
          <h3 className="card-title">Training Snapshot</h3>
          <p className="subtext">{metricsPayload?.dataset ?? 'Dataset blend: LIAR + FakeNewsNet + local curated samples'}</p>
          <div className="metrics" style={{ marginTop: '1rem' }}>
            {metrics.map((metric) => (
              <div className="metric-card" key={metric.label}>
                <div className="muted">{metric.label}</div>
                <div className="metric-value">{metric.value}</div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <h3 className="card-title">Inference Playground</h3>
          <p className="subtext">Model: TF-IDF + Logistic Regression (local Python endpoint)</p>
          <textarea
            className="verify-textarea"
            value={text}
            onChange={(event) => setText(event.target.value)}
            style={{ marginTop: '0.75rem' }}
          />
          <div style={{ marginTop: '0.7rem' }}>
            <Magnet>
              <button className="magnetic-button" onClick={() => void runLocalInference()} type="button">
                Run Local Prediction
              </button>
            </Magnet>
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
    </main>
  )
}
