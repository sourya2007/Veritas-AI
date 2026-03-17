import type { Article } from '../types'

const RSS_FEEDS = [
  'http://feeds.bbci.co.uk/news/world/rss.xml',
  'https://rss.nytimes.com/services/xml/rss/nyt/World.xml',
  'https://www.aljazeera.com/xml/rss/all.xml',
]

const toAbsoluteProxyUrl = (feedUrl: string) => {
  return `https://api.allorigins.win/raw?url=${encodeURIComponent(feedUrl)}`
}

const inferTopic = (text: string) => {
  const normalized = text.toLowerCase()

  if (/(election|minister|government|parliament|policy|president)/.test(normalized)) {
    return 'Politics'
  }

  if (/(ai|tech|software|chip|internet|digital|startup)/.test(normalized)) {
    return 'Technology'
  }

  if (/(health|hospital|virus|vaccine|medical|disease)/.test(normalized)) {
    return 'Health'
  }

  if (/(market|bank|finance|economy|inflation|stock|trade)/.test(normalized)) {
    return 'Finance'
  }

  if (/(climate|weather|carbon|emission|environment|wildfire)/.test(normalized)) {
    return 'Climate'
  }

  return 'Politics'
}

const extractImageUrl = (item: Element) => {
  const mediaThumbnail = item.querySelector('media\\:thumbnail, thumbnail')
  const mediaContent = item.querySelector('media\\:content, content')
  const enclosure = item.querySelector('enclosure')

  const byAttribute =
    mediaThumbnail?.getAttribute('url') ??
    mediaContent?.getAttribute('url') ??
    enclosure?.getAttribute('url')

  if (byAttribute) {
    return byAttribute
  }

  const description = item.querySelector('description')?.textContent ?? ''
  const imageMatch = description.match(/<img[^>]+src=["']([^"']+)["']/i)
  if (imageMatch?.[1]) {
    return imageMatch[1]
  }

  return ''
}

const parseFeedXml = (xmlText: string, feedIndex: number) => {
  const parser = new DOMParser()
  const documentXml = parser.parseFromString(xmlText, 'application/xml')

  const sourceName =
    documentXml.querySelector('channel > title')?.textContent?.trim() || `Source ${feedIndex + 1}`

  return Array.from(documentXml.querySelectorAll('item')).slice(0, 20).map((item, itemIndex) => {
    const title = item.querySelector('title')?.textContent?.trim() || 'Untitled story'
    const summary = item.querySelector('description')?.textContent?.replace(/<[^>]*>/g, ' ').trim() || title
    const link = item.querySelector('link')?.textContent?.trim() || ''
    const publishedAt = item.querySelector('pubDate')?.textContent?.trim() || 'Recent'
    const topic = inferTopic(`${title} ${summary}`)

    return {
      id: `live-${feedIndex}-${itemIndex}-${title.slice(0, 32).replace(/\s+/g, '-')}`,
      title,
      summary,
      source: sourceName,
      publishedAt,
      topic,
      genre: 'Breaking',
      imageUrl: extractImageUrl(item),
      articleUrl: link,
    } satisfies Article
  })
}

export async function fetchLiveNewsArticles(): Promise<Article[]> {
  const responses = await Promise.allSettled(
    RSS_FEEDS.map(async (feedUrl, feedIndex) => {
      const xmlResponse = await fetch(toAbsoluteProxyUrl(feedUrl))
      if (!xmlResponse.ok) {
        throw new Error(`Failed to fetch feed: ${feedUrl}`)
      }

      const xmlText = await xmlResponse.text()
      return parseFeedXml(xmlText, feedIndex)
    }),
  )

  const combined: Article[] = []
  for (const response of responses) {
    if (response.status === 'fulfilled') {
      combined.push(...response.value)
    }
  }

  const seenTitles = new Set<string>()
  const deduped = combined.filter((article) => {
    const key = `${article.title.toLowerCase()}-${article.source.toLowerCase()}`
    if (seenTitles.has(key)) {
      return false
    }

    seenTitles.add(key)
    return true
  })

  return deduped.slice(0, 72)
}
