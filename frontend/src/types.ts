export type Article = {
  id: string
  title: string
  summary: string
  source: string
  publishedAt: string
  topic: string
  genre: string
  imageUrl?: string
  articleUrl?: string
}

export type VerificationEvidence = {
  source: string
  url?: string
  snippet: string
  stance: 'supports' | 'contradicts' | 'neutral'
  reliability_score?: number
}

export type FeedApiItem = {
  id: string
  title: string
  summary: string
  body?: string
  source: {
    name: string
    domain?: string | null
    reliability_score: number
  }
  topic: string
  genre: string
  published_at: string
  url?: string | null
  thumbnail_url?: string | null
}

export type VerifyApiResponse = {
  verdict: string
  confidence: number
  evidence: VerificationEvidence[]
  explanation: string
  disclaimer: string
}

export type ModelInferApiResponse = {
  label: string
  confidence: number
  top_signals: string[]
}

export type ModelMetricsApiResponse = {
  model_name: string
  dataset: string
  metrics: Record<string, number>
  trained_at: string
  overall_score: number
  mode: string
  prediction_count: number
  last_prediction_ms: number
  avg_prediction_ms: number
}
