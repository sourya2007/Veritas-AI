import gsap from 'gsap'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { genres, mockArticles, topics } from '../data/mockData'
import { apiGet } from '../lib/api'
import type { Article, FeedApiItem } from '../types'

const COLUMN_COUNT = 6

const thumbnailForArticle = (seed: string) => {
  return `https://picsum.photos/seed/${seed}/720/420`
}

const normalizeItem = (item: FeedApiItem): Article => {
  return {
    id: item.id,
    title: item.title,
    summary: item.summary,
    source: item.source.name,
    publishedAt: item.published_at,
    topic: item.topic,
    genre: item.genre,
    imageUrl: item.thumbnail_url ?? undefined,
    articleUrl: item.url ?? undefined,
  }
}

export function FeedPage() {
  const [topic, setTopic] = useState('All')
  const [genre, setGenre] = useState('All')
  const [query, setQuery] = useState('')
  const [controlsVisible, setControlsVisible] = useState(true)
  const [articles, setArticles] = useState<Article[]>(mockArticles)

  useEffect(() => {
    gsap.fromTo(
      '.moving-columns-fullscreen',
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 2.2, ease: 'power2.out' },
    )
  }, [])

  useEffect(() => {
    let timeoutId: number

    const revealAndScheduleHide = () => {
      setControlsVisible(true)
      window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => {
        setControlsVisible(false)
      }, 2600)
    }

    revealAndScheduleHide()

    window.addEventListener('mousemove', revealAndScheduleHide)
    window.addEventListener('touchstart', revealAndScheduleHide)
    window.addEventListener('keydown', revealAndScheduleHide)
    window.addEventListener('wheel', revealAndScheduleHide, { passive: true })

    return () => {
      window.clearTimeout(timeoutId)
      window.removeEventListener('mousemove', revealAndScheduleHide)
      window.removeEventListener('touchstart', revealAndScheduleHide)
      window.removeEventListener('keydown', revealAndScheduleHide)
      window.removeEventListener('wheel', revealAndScheduleHide)
    }
  }, [])

  useEffect(() => {
    let active = true

    const loadFeed = async () => {
      try {
        const response = await apiGet<{ items: FeedApiItem[] }>('/api/feed?page=1&page_size=72')
        const normalized = response.items.map(normalizeItem)
        if (active && normalized.length > 0) {
          setArticles(normalized)
        }
      } catch {
        if (active) {
          setArticles(mockArticles)
        }
      }
    }

    void loadFeed()

    return () => {
      active = false
    }
  }, [])

  const filteredItems = useMemo(() => {
    return articles.filter((article) => {
      const topicMatch = topic === 'All' || article.topic === topic
      const genreMatch = genre === 'All' || article.genre === genre
      const searchText = `${article.title} ${article.summary} ${article.source}`.toLowerCase()
      const queryMatch = query.trim().length === 0 || searchText.includes(query.toLowerCase())
      return topicMatch && genreMatch && queryMatch
    })
  }, [articles, genre, query, topic])

  const displayItems = filteredItems.length > 0 ? filteredItems : articles

  const columns = useMemo(() => {
    const baseColumns = Array.from({ length: COLUMN_COUNT }, () => []) as typeof displayItems[]

    displayItems.forEach((article, index) => {
      baseColumns[index % COLUMN_COUNT].push(article)
    })

    return baseColumns.map((column) => [...column, ...column])
  }, [displayItems])

  return (
    <main className="feed-home-root">
      <div className={`feed-controls-overlay ${controlsVisible ? 'visible' : 'hidden'}`}>
        <select value={topic} onChange={(event) => setTopic(event.target.value)}>
          {topics.map((value) => (
            <option key={value} value={value}>
              Topic: {value}
            </option>
          ))}
        </select>

        <input
          className="feed-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search news"
          aria-label="Search news"
        />

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
                  <Link to={`/article/${article.id}`} className="moving-article-card" key={`${article.id}-${articleIndex}`}>
                    <div
                      className="article-thumb"
                      style={{
                        backgroundImage: `url(${article.imageUrl || thumbnailForArticle(article.id)})`,
                      }}
                    />
                    <div className="moving-card-content">
                      <h3 className="card-title">{article.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
