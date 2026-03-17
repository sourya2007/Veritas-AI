import type { Article } from '../types'

export const topics = ['All', 'Politics', 'Technology', 'Health', 'Finance', 'Climate']
export const genres = ['All', 'Analysis', 'Breaking', 'Opinion', 'Explainer']

const baseArticles: Omit<Article, 'id' | 'publishedAt'>[] = [
  {
    title: 'City council approves AI-assisted emergency alert framework',
    summary: 'Municipal officials introduced a phased rollout with independent audits and opt-out controls for residents.',
    source: 'Civic Journal',
    topic: 'Politics',
    genre: 'Analysis',
  },
  {
    title: 'Open-source medical model flags drug interaction patterns early',
    summary: 'Researchers report stronger precision on rare side-effect combinations in peer-reviewed preprint.',
    source: 'Health Grid',
    topic: 'Health',
    genre: 'Breaking',
  },
  {
    title: 'Satellite data suggests regional cooling pockets despite global warming',
    summary: 'Scientists caution local anomalies should not be confused with long-term climate reversal trends.',
    source: 'Earth Signal',
    topic: 'Climate',
    genre: 'Explainer',
  },
  {
    title: 'Payment giants test on-device fraud scoring with lower latency',
    summary: 'Pilot programs indicate fraud detection speed gains while keeping sensitive data local to user devices.',
    source: 'Ledger Post',
    topic: 'Finance',
    genre: 'Analysis',
  },
  {
    title: 'Chip startup claims 10x efficiency, but benchmarks remain private',
    summary: 'Investors welcome the announcement, while analysts wait for third-party validation and power metrics.',
    source: 'Circuit Weekly',
    topic: 'Technology',
    genre: 'Opinion',
  },
  {
    title: 'National agency denies rumor of overnight tax changes',
    summary: 'Officials published a public notice debunking viral posts and urged citizens to verify via official portals.',
    source: 'Public Desk',
    topic: 'Politics',
    genre: 'Breaking',
  },
]

export const mockArticles: Article[] = Array.from({ length: 40 }).map((_, index) => {
  const item = baseArticles[index % baseArticles.length]
  const hourOffset = index * 2

  return {
    id: `article-${index + 1}`,
    ...item,
    publishedAt: `${hourOffset + 1}h ago`,
  }
})
