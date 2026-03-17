# Veritas AI API Spec

## Health
### `GET /health`
Returns service health status.

## Feed
### `GET /api/feed`
Query params:
- `topic` (optional)
- `genre` (optional)
- `source` (optional)
- `page` (default 1)
- `page_size` (default 24)

Response:
- `page`, `page_size`, `total`, `items[]`

### `GET /api/articles/{id}`
Returns article details by id.

## Verification
### `POST /api/verify`
Body:
```json
{ "claim_text": "...", "url": null }
```
Response:
- `verdict`
- `confidence`
- `evidence[]`
- `explanation`
- `disclaimer`

## Model
### `POST /api/model/infer`
Body:
```json
{ "text": "..." }
```
Response:
- `label`
- `confidence`
- `top_signals[]`

### `GET /api/model/metrics`
Returns current model metadata and metrics.
