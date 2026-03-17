# Veritas AI

End-to-end fake news detector webapp implementation with:
- Fullscreen article feed + reader
- Real-time verification against live internet RSS sources
- Local model showcase (training script + inference API)

## Monorepo Structure
- `frontend/` — React + Vite UI
- `backend/` — FastAPI API service
- `ml/` — local model training pipeline and artifacts
- `docs/` — architecture and model documentation

## Run Backend
1. Create/activate Python environment (recommended).
2. Install dependencies:
   - `pip install -r backend/requirements.txt`
3. Start API:
   - `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
   - Run from `backend/`

## Train Local Model Artifacts
- `python ml/training/train_local_model.py`
- Outputs to `ml/artifacts/metrics.json` and `ml/artifacts/model_card.json`

## Run Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

Optional API override:
- `VITE_API_BASE_URL=http://localhost:8000`

## Implemented API Endpoints
- `GET /health`
- `GET /api/feed`
- `GET /api/articles/{id}`
- `POST /api/verify`
- `POST /api/model/infer`
- `GET /api/model/metrics`
