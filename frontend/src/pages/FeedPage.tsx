import gsap from 'gsap'
import { useEffect, useMemo, useState } from 'react'
import { genres, mockArticles, topics } from '../data/mockData'

const COLUMN_COUNT = 4

const thumbnailForArticle = (seed: string) => {
  return `https://picsum.photos/seed/${seed}/720/420`
}

export function FeedPage() {
  const [topic, setTopic] = useState('All')
  const [genre, setGenre] = useState('All')

  useEffect(() => {
    gsap.fromTo(
      '.moving-columns-fullscreen',
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 1.1, ease: 'power2.out' },
    )
  }, [])

  const filteredItems = useMemo(() => {
    return mockArticles.filter((article) => {
      const topicMatch = topic === 'All' || article.topic === topic
      const genreMatch = genre === 'All' || article.genre === genre
      return topicMatch && genreMatch
    })
  }, [genre, topic])

  const displayItems = filteredItems.length > 0 ? filteredItems : mockArticles

  const columns = useMemo(() => {
    const baseColumns = Array.from({ length: COLUMN_COUNT }, () => []) as typeof displayItems[]

    displayItems.forEach((article, index) => {
      baseColumns[index % COLUMN_COUNT].push(article)
    })

    return baseColumns.map((column) => [...column, ...column])
  }, [displayItems])

  const emptyNotice = useMemo(() => {
    if (filteredItems.length > 0) {
      return 'Columns auto-scroll continuously. Hover a column to pause it.'
    }

    return 'No exact filter match found. Showing nearest article set.'
  }, [filteredItems.length])

  return (
    <main className="feed-home-root">
      <div className="feed-controls-overlay">
        <select value={topic} onChange={(event) => setTopic(event.target.value)}>
          {topics.map((value) => (
            <option key={value} value={value}>
              Topic: {value}
            </option>
          ))}
        </select>

        <select value={genre} onChange={(event) => setGenre(event.target.value)}>
          {genres.map((value) => (
            <option key={value} value={value}>
              Genre: {value}
            </option>
          ))}
        </select>
      </div>

      <section className="moving-columns moving-columns-fullscreen" aria-label="moving article columns">
        <div className="moving-columns-grid moving-columns-grid-fullscreen">
          {columns.map((column, columnIndex) => (
            <div
              key={`column-${columnIndex}`}
              className={`moving-column ${columnIndex % 2 === 0 ? 'column-up' : 'column-down'}`}
            >
              <div className="moving-column-track">
                {column.map((article, articleIndex) => (
                  <article className="moving-article-card" key={`${article.id}-${articleIndex}`}>
                    <div
                      className="article-thumb"
                      style={{
                        backgroundImage: `url(${thumbnailForArticle(article.id)})`,
                      }}
                    />
                    <div className="moving-card-content">
                      <div className="pill-row">
                        <span className="pill">{article.topic}</span>
                        <span className="pill">{article.genre}</span>
                      </div>
                      <h3 className="card-title">{article.title}</h3>
                      <p className="card-description">{article.summary}</p>
                      <div className="muted">
                        {article.source} · {article.publishedAt}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="feed-status-overlay">{emptyNotice}</p>
    </main>
  )
}
