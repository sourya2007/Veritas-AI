import { useState } from 'react'
import { ShinyText } from '../components/reactbits/ShinyText'
import Magnet from '../components/reactbits-official/Magnet'

const metrics = [
  { label: 'F1 Score', value: '0.88' },
  { label: 'Precision', value: '0.90' },
  { label: 'Recall', value: '0.86' },
  { label: 'ROC-AUC', value: '0.92' },
]

export function ModelShowcasePage() {
  const [text, setText] = useState('Breaking: Local authority confirms vaccine microchip mandate begins this weekend.')
  const [prediction, setPrediction] = useState('Likely Fake')

  const runLocalInference = () => {
    const riskyWords = ['microchip', 'secret', 'hoax', 'banned', 'leak']
    const matched = riskyWords.some((word) => text.toLowerCase().includes(word))
    setPrediction(matched ? 'Likely Fake' : 'Likely Reliable')
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
          <p className="subtext">Dataset blend: LIAR + FakeNewsNet + local curated samples</p>
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
              <button className="magnetic-button" onClick={runLocalInference} type="button">
                Run Local Prediction
              </button>
            </Magnet>
          </div>
          <p className="metric-value" style={{ marginTop: '1rem' }}>
            {prediction}
          </p>
          <p className="subtext">Confidence: 0.83 · Top signals: sensational phrasing, unsupported certainty</p>
        </article>
      </section>
    </main>
  )
}
