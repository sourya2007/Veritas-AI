# Veritas AI Implementation Plan

## Goal

Create an AI fake-news detector web application with three connected product areas:

1. A reader experience for browsing articles in a filtered feed.
2. A real-time verification workflow that checks user-submitted claims against live internet-facing sources.
3. A local Python model-training showcase for fake-news prediction.

## Scope

### Included

- Article feed and article reader UX.
- Topic and genre filtering.
- Verification workspace for pasted text and article URLs.
- Evidence-backed verification results with confidence and source attribution.
- Local ML model training and prediction showcase.

### Excluded from first production milestone

- Native mobile apps.
- Browser extension support.
- Full editorial CMS.
- Social publishing features.
- Large-scale custom model infrastructure.

## Architecture

### Frontend

- React + TypeScript.
- Feed UI, verification panel, and ML showcase.
- API-driven state with typed responses.

### Backend

- FastAPI service.
- Article feed APIs.
- Verification APIs.
- ML showcase APIs.

### Data and infrastructure

- PostgreSQL for persistent entities in later phases.
- Redis for caching and background-job coordination in later phases.
- Docker Compose for local orchestration.

### ML

- Local training pipeline in Python.
- Start with a lightweight baseline model.
- Keep live verification separate from local ML scoring.

## Phases

### Phase 1

- Create repo structure.
- Add backend FastAPI scaffold.
- Add frontend React scaffold.
- Add local mock data and basic verification heuristics.
- Add ML training starter code.

### Phase 2

- Replace in-memory article data with PostgreSQL models and migrations.
- Add article ingestion from RSS and one article API provider.
- Add bookmark and reading-state persistence.
- Add structured topic and genre taxonomies.

### Phase 3

- Add live fact-check providers.
- Add live search/news-source corroboration.
- Add caching, retries, and background verification jobs.
- Add verification history.

### Phase 4

- Expand local model training to real datasets.
- Persist trained artifacts and metrics.
- Surface training metrics and evaluation history in the UI.
- Connect backend ML endpoints to saved artifacts.

### Phase 5

- Add auth, rate limiting, observability, and production deployment.
- Harden secrets management and API usage.
- Add end-to-end test coverage.

## Immediate next tasks

1. Wire backend endpoints to persistent storage.
2. Add live verification provider adapters behind a common interface.
3. Replace frontend single-page sections with route-based pages.
4. Connect backend ML endpoints to real artifacts produced by the local training script.
