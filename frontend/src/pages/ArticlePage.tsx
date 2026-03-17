import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ShinyText } from '../components/reactbits/ShinyText'
import { apiGet } from '../lib/api'
import type { FeedApiItem } from '../types'

export function ArticlePage() {
  const { id } = useParams<{ id: string }>()
  const [article, setArticle] = useState<FeedApiItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const run = async () => {
      if (!id) {
        setLoading(false)
        return
      }

      try {
        const payload = await apiGet<FeedApiItem>(`/api/articles/${id}`)
        if (active) {
          setArticle(payload)
        }
      } catch {
        if (active) {
          setArticle(null)
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void run()
    return () => {
      active = false
    }
  }, [id])

  return (
    <main className="page">
      <header className="page-header">
        <div>
          <ShinyText>Article Reader</ShinyText>
          <p className="subtext">Source transparency and article details.</p>
        </div>
        <Link to="/" className="status-badge">
          Back to Feed
        </Link>
      </header>

      {loading && <section className="panel">Loading article...</section>}

      {!loading && !article && <section className="panel">Article not found.</section>}

      {!loading && article && (
        <article className="panel">
          <h2 className="card-title" style={{ marginBottom: '0.7rem' }}>
            {article.title}
          </h2>
          <p className="subtext" style={{ marginBottom: '1rem' }}>
            {article.source.name} · {article.published_at}
          </p>
          <p className="card-description" style={{ marginBottom: '1rem' }}>
            {article.body ?? article.summary}
          </p>
        </article>
      )}
    </main>
  )
}
