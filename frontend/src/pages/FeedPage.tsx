import gsap from 'gsap'
import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import StaggeredMenu from '../components/StaggeredMenu'
import { mockArticles } from '../data/mockData'
import { apiGet } from '../lib/api'
import type { Article, FeedApiItem } from '../types'

const COLUMN_COUNT = 6

const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
  { label: 'AI Verification', ariaLabel: 'AI Verification', link: '/verify' },
  { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' },
]

const socialItems = [
  { label: 'Twitter', link: 'https://twitter.com' },
  { label: 'GitHub', link: 'https://github.com' },
  { label: 'LinkedIn', link: 'https://linkedin.com' },
]

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
  const [query, setQuery] = useState('')
  const [activeQuery, setActiveQuery] = useState('')
  const [searchToken, setSearchToken] = useState(0)
  const [isSearching, setIsSearching] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [articles, setArticles] = useState<Article[]>(mockArticles)

  useEffect(() => {
    // Set initial visibility directly instead of animating
    const elem = document.querySelector('.moving-columns-fullscreen') as HTMLElement
    if (elem) {
      elem.style.opacity = '1'
      elem.style.visibility = 'visible'
    }
    // Uncomment below for fade-in animation instead
    // gsap.fromTo(
    //   '.moving-columns-fullscreen',
    //   { autoAlpha: 0 },
    //   { autoAlpha: 1, duration: 2.2, ease: 'power2.out' },
    // )
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
      if (activeQuery.trim().length > 0 || searchToken > 0) {
        setIsSearching(true)
      }

      try {
        const search = activeQuery.trim()
        const params = new URLSearchParams({ page: '1', page_size: '72' })
        if (search.length > 0) {
          params.set('search', search)
        }
        const response = await apiGet<{ page: number; page_size: number; total: number; items: FeedApiItem[] }>(`/api/feed?${params.toString()}`)
        const normalized = response.items.map(normalizeItem)
        if (active) {
          setArticles(normalized)
        }
      } catch {
        if (active) {
          setArticles(activeQuery.trim().length > 0 ? [] : mockArticles)
        }
      } finally {
        if (active) {
          setIsSearching(false)
        }
      }
    }

    void loadFeed()

    return () => {
      active = false
    }
  }, [activeQuery, searchToken])

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setActiveQuery(query.trim())
    setSearchToken((value) => value + 1)
  }

  const displayItems = articles

  const columns = useMemo(() => {
    // Create enough duplicates to ensure smooth infinite scroll
    const extended = [...displayItems, ...displayItems, ...displayItems]
    const baseColumns = Array.from({ length: COLUMN_COUNT }, () => []) as typeof extended[]

    extended.forEach((article, index) => {
      baseColumns[index % COLUMN_COUNT].push(article)
    })

    return baseColumns
  }, [displayItems])

  return (
    <main className="feed-home-root">
      <div className={`feed-controls-overlay ${controlsVisible ? 'visible' : 'hidden'}`}>
        <form className="feed-search-form" onSubmit={handleSearchSubmit}>
          <input
            className="feed-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Type and press Enter to search"
            aria-label="Search news"
          />
        </form>
      </div>

      <StaggeredMenu
        position="right"
        items={menuItems}
        socialItems={socialItems}
        displaySocials={false}
        displayItemNumbering={true}
        menuButtonColor="#ffffff"
        openMenuButtonColor="#fff"
        changeMenuColorOnOpen={true}
        colors={['#B19EEF', '#5227FF']}
        logoUrl="/path-to-your-logo.svg"
        accentColor="#4c00ff"
        isFixed={true}
        onMenuOpen={() => console.log('Menu opened')}
        onMenuClose={() => console.log('Menu closed')}
      />

      {isSearching && <div className="feed-search-status">Searching…</div>}

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

      {!isSearching && activeQuery.length > 0 && displayItems.length === 0 && (
        <div className="feed-empty-state">No results found for “{activeQuery}”.</div>
      )}
    </main>
  )
}
