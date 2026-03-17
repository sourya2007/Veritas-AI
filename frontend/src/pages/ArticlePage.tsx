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
        <article className="panel article-reader">
          <div className="article-header">
            <h1 className="article-headline">
              {article.title}
            </h1>
            <div className="article-meta">
              <span className="article-source">{article.source.name}</span>
              <span className="article-separator">·</span>
              <span className="article-date">{article.published_at}</span>
            </div>
          </div>
          <div className="article-body-container">
            <p className="article-body">
              {article.body ?? article.summary}
            </p>
          </div>
        </article>
      )}
    </main>
  )
}
