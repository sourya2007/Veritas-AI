const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`)
  if (!response.ok) {
    throw new Error(`GET ${path} failed: ${response.status}`)
  }
  return (await response.json()) as T
}

export async function apiPost<T, TBody>(path: string, body: TBody): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    throw new Error(`POST ${path} failed: ${response.status}`)
  }

  return (await response.json()) as T
}
