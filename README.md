# Veritas AI

Veritas AI is a fake-news detector web app built around three product pillars:

1. A Pocket-style article reader with topic and genre filtering.
2. A real-time verification workspace for user-submitted claims and article URLs.
3. A local Python ML showcase for fake-news model training and prediction.

## Current status

This repository now contains the first implementation slice:

- FastAPI backend with article, verification, and ML showcase endpoints.
- React + TypeScript frontend with a feed, filter controls, verification form, and ML demo panel.
- Docker Compose for local orchestration.

## Repository layout

```text
backend/   FastAPI service and verification logic
frontend/  React + Vite client
infra/     Local orchestration
```

## Local development

### Backend

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend

```powershell
cd frontend
npm install
npm run dev
```

The frontend defaults to `http://localhost:8000` for the API.

## Next implementation targets

- Replace in-memory sample data with PostgreSQL models and migrations.
- Add live external verification providers and Redis caching.
- Build the local model training pipeline and artifact storage.
