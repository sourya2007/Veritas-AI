import { FormEvent, useEffect, useState } from 'react'

type Article = {
  slug: string
  title: string
  source: string
  summary: string
  body: string
  topic: string
  genre: string
  published_at: string
  image_url: string
  source_url: string
  credibility_label: string
}

type ArticleFeedResponse = {
  items: Article[]
  topics: string[]
  genres: string[]
  total: number
}

type VerificationEvidence = {
  title: string
  source: string
  url: string
  stance: string
  summary: string
}

type VerificationResponse = {
  verdict: string
  confidence: number
  reasoning: string
  signals: string[]
  evidence: VerificationEvidence[]
}

type MLShowcaseResponse = {
  dataset_name: string
  model_name: string
  accuracy: number
  precision: number
  recall: number
  f1_score: number
  notes: string[]
}

type MLPredictionResponse = {
  fake_probability: number
  confidence_band: string
  explanation: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

function App() {
  const [feed, setFeed] = useState<ArticleFeedResponse | null>(null)
  const [topic, setTopic] = useState('')
  const [genre, setGenre] = useState('')
  const [search, setSearch] = useState('')
  const [verificationInput, setVerificationInput] = useState('')
  const [verificationResult, setVerificationResult] = useState<VerificationResponse | null>(null)
  const [showcase, setShowcase] = useState<MLShowcaseResponse | null>(null)
  const [predictionInput, setPredictionInput] = useState('')
  const [prediction, setPrediction] = useState<MLPredictionResponse | null>(null)

  useEffect(() => {
    const params = new URLSearchParams()

    if (topic) {
      params.set('topic', topic)
    }

    if (genre) {
      params.set('genre', genre)
    }

    if (search) {
      params.set('query', search)
    }

    fetch(`${API_BASE_URL}/api/articles?${params.toString()}`)
      .then((response) => response.json())
      .then((data: ArticleFeedResponse) => setFeed(data))
      .catch(() => setFeed({ items: [], topics: [], genres: [], total: 0 }))
  }, [topic, genre, search])

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/ml/showcase`)
      .then((response) => response.json())
      .then((data: MLShowcaseResponse) => setShowcase(data))
      .catch(() => setShowcase(null))
  }, [])

  const handleVerify = async (event: FormEvent) => {
    event.preventDefault()

    const response = await fetch(`${API_BASE_URL}/api/verification/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: verificationInput }),
    })

    const data: VerificationResponse = await response.json()
    setVerificationResult(data)
  }

  const handlePredict = async (event: FormEvent) => {
    event.preventDefault()

    const response = await fetch(`${API_BASE_URL}/api/ml/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: predictionInput }),
    })

    const data: MLPredictionResponse = await response.json()
    setPrediction(data)
  }

  return (
    <div className="page-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Veritas AI</p>
          <h1>Read the news. Verify the claim. Compare it with a local model.</h1>
        </div>
        <p className="hero-copy">
          This first implementation slice wires together a news feed, a verification workspace,
          and a local fake-news showcase in one interface.
        </p>
      </header>

      <main className="layout-grid">
        <section className="panel panel-feed">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Article Reader</p>
              <h2>Signal-rich news feed</h2>
            </div>
            <span className="badge">{feed?.total ?? 0} results</span>
          </div>

          <div className="filters">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by headline or summary"
            />
            <select value={topic} onChange={(event) => setTopic(event.target.value)}>
              <option value="">All topics</option>
              {feed?.topics.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select value={genre} onChange={(event) => setGenre(event.target.value)}>
              <option value="">All genres</option>
              {feed?.genres.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="article-list">
            {feed?.items.map((article) => (
              <article key={article.slug} className="article-card">
                <img src={article.image_url} alt={article.title} />
                <div>
                  <div className="meta-row">
                    <span>{article.topic}</span>
                    <span>{article.genre}</span>
                    <span>{article.credibility_label}</span>
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.summary}</p>
                  <div className="article-footer">
                    <span>{article.source}</span>
                    <a href={article.source_url} target="_blank" rel="noreferrer">
                      Open source
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel panel-verify">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Real-Time Verification</p>
              <h2>Check a claim against internet-facing evidence</h2>
            </div>
          </div>

          <form className="stack" onSubmit={handleVerify}>
            <textarea
              value={verificationInput}
              onChange={(event) => setVerificationInput(event.target.value)}
              placeholder="Paste a headline, article excerpt, or claim to verify"
              rows={7}
            />
            <button type="submit">Run verification</button>
          </form>

          {verificationResult && (
            <div className="result-card">
              <div className="meta-row">
                <span>{verificationResult.verdict}</span>
                <span>{Math.round(verificationResult.confidence * 100)}% confidence</span>
              </div>
              <p>{verificationResult.reasoning}</p>
              <ul>
                {verificationResult.signals.map((signal) => (
                  <li key={signal}>{signal}</li>
                ))}
              </ul>
              <div className="evidence-grid">
                {verificationResult.evidence.map((item) => (
                  <a key={item.url} className="evidence-card" href={item.url} target="_blank" rel="noreferrer">
                    <strong>{item.title}</strong>
                    <span>{item.source}</span>
                    <p>{item.summary}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="panel panel-ml">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Local Model Showcase</p>
              <h2>Python training and prediction demo</h2>
            </div>
          </div>

          {showcase && (
            <div className="stats-grid">
              <div>
                <span>Dataset</span>
                <strong>{showcase.dataset_name}</strong>
              </div>
              <div>
                <span>Model</span>
                <strong>{showcase.model_name}</strong>
              </div>
              <div>
                <span>Accuracy</span>
                <strong>{Math.round(showcase.accuracy * 100)}%</strong>
              </div>
              <div>
                <span>F1</span>
                <strong>{Math.round(showcase.f1_score * 100)}%</strong>
              </div>
            </div>
          )}

          <form className="stack" onSubmit={handlePredict}>
            <textarea
              value={predictionInput}
              onChange={(event) => setPredictionInput(event.target.value)}
              placeholder="Paste text to score with the local fake-news model showcase"
              rows={6}
            />
            <button type="submit">Run local model</button>
          </form>

          {prediction && (
            <div className="result-card accent-card">
              <div className="meta-row">
                <span>{prediction.confidence_band}</span>
                <span>{Math.round(prediction.fake_probability * 100)}% fake probability</span>
              </div>
              <p>{prediction.explanation}</p>
            </div>
          )}

          <div className="notes-block">
            {showcase?.notes.map((note) => (
              <p key={note}>{note}</p>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
