import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ShinyText } from '../components/reactbits/ShinyText'
import { apiGet } from '../lib/api'
import type { FeedApiItem } from '../types'

export function ArticlePage() {
  const { id } = useParams<{ id: string }>()
  const [article, setArticle] = useState<FeedApiItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [embedFailed, setEmbedFailed] = useState(false)

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
          setEmbedFailed(false)
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

          {article.url && (
            <section className="article-embed-section" aria-label="Original article embed">
              <h2 className="article-embed-title">Read Full Original Article</h2>
              <p className="article-embed-subtext">
                The original source is embedded below. Some publishers block embedding; if that happens, use the open link.
              </p>
              <div className="article-embed-wrap">
                {!embedFailed ? (
                  <iframe
                    title="Original news article"
                    src={article.url}
                    className="article-embed-frame"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
                    onError={() => setEmbedFailed(true)}
                  />
                ) : (
                  <div className="article-embed-fallback">
                    <p>This source does not allow in-page embedding.</p>
                    <a href={article.url} target="_blank" rel="noreferrer" className="article-open-link">
                      Open Original Source
                    </a>
                  </div>
                )}
              </div>
              {!embedFailed && (
                <a href={article.url} target="_blank" rel="noreferrer" className="article-open-link">
                  Open in New Tab
                </a>
              )}
            </section>
          )}
        </article>
      )}
    </main>
  )
}
