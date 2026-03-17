export type Article = {
  id: string
  title: string
  summary: string
  source: string
  publishedAt: string
  topic: string
  genre: string
}

export type VerificationEvidence = {
  source: string
  snippet: string
  stance: 'supports' | 'contradicts' | 'neutral'
}
