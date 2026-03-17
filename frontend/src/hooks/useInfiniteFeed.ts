import { useCallback, useMemo, useState } from 'react'
import type { Article } from '../types'

type FeedOptions = {
  pageSize?: number
  topic: string
  genre: string
}

export function useInfiniteFeed(allArticles: Article[], options: FeedOptions) {
  const pageSize = options.pageSize ?? 12
  const [pagesLoaded, setPagesLoaded] = useState(1)

  const filtered = useMemo(() => {
    return allArticles.filter((article) => {
      const topicMatch = options.topic === 'All' || article.topic === options.topic
      const genreMatch = options.genre === 'All' || article.genre === options.genre
      return topicMatch && genreMatch
    })
  }, [allArticles, options.genre, options.topic])

  const effectiveItems = filtered.length > 0 ? filtered : allArticles
  const maxCount = Math.max(pageSize, pagesLoaded * pageSize)

  const items = useMemo(() => {
    return Array.from({ length: maxCount }).map((_, index) => {
      const source = effectiveItems[index % effectiveItems.length]
      return {
        ...source,
        id: `${source.id}-loop-${index}`,
      }
    })
  }, [effectiveItems, maxCount])

  const loadMore = useCallback(() => {
    setPagesLoaded((value) => value + 1)
  }, [])

  const reset = useCallback(() => {
    setPagesLoaded(1)
  }, [])

  return {
    items,
    loadMore,
    reset,
    hasAnyMatch: filtered.length > 0,
  }
}
