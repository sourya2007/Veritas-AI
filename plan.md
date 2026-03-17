# Veritas AI — Complete Build Plan

## 1) Vision & Outcomes

Build an AI-powered fake news detector webapp with three integrated experiences:

1. **Article Feed & Reader** (Pocket-like UX)
   - Users browse a curated stream of articles.
   - Users filter by topic/genre/source/date.
   - Users open full article view with metadata and related fact-check context.

2. **Real-Time News Verification**
   - Users paste or type any claim/news text.
   - System verifies in near real-time against live internet sources (news APIs, search snippets, official sources, fact-check databases).
   - Output includes confidence score, supporting/opposing evidence, source reliability, and explanation.

3. **Local Fake News ML Showcase**
   - Dedicated section demonstrating a locally trained Python model.
   - Includes training pipeline, metrics dashboard, and inference demo.
   - Shows transparent model behavior and limitations.

### Success Criteria

- Feed loads in under 2s for cached requests.
- Verification request completes within 5–12s for typical input.
- Verification response contains at least 3 evidence sources when available.
- Local model achieves target baseline (e.g., F1 >= 0.85 on chosen benchmark).
- Every prediction includes confidence and explainability summary.

---

## 2) Product Scope

### In Scope (MVP)

- User-facing web app with:
  - Home feed
  - Filters (topic, genre, source, date)
  - Article reader page
  - Verification page (manual claim input)
  - Model showcase page (local model results)
- Backend APIs for feed aggregation, verification orchestration, model inference.
- Data storage for users, articles cache, verification history, and model artifacts metadata.
- Admin utilities for source management and monitoring.

### Out of Scope (Post-MVP)

- Native mobile apps.
- Social posting/sharing platform features.
- Fully autonomous claim extraction from video/audio streams.
- Human editorial moderation workflow tools.

---

## 3) High-Level Architecture

## Frontend
- Framework: React + Next.js (App Router) + TypeScript.
- Styling/UI: Tailwind CSS + component library.
- Features:
  - Feed listing with pagination/infinite scroll.
  - Filter panel and search.
  - Article detail view with source transparency block.
  - Verification form + progress states + evidence cards.
  - Model showcase dashboard (metrics, confusion matrix, sample predictions).

## Backend Services
- API layer: FastAPI (Python).
- Core modules:
  1. **Feed Service**: fetches and normalizes news from external APIs.
  2. **Verification Orchestrator**: retrieval + scoring + claim matching + explanation.
  3. **ML Inference Service**: serves local model predictions.
  4. **Training Pipeline**: offline training/evaluation jobs.
- Async tasks: Celery/RQ + Redis for queueing expensive verification tasks.

## Data Layer
- PostgreSQL: users, preferences, article metadata, verification logs.
- Redis: caching feed and verification retrieval snippets.
- Object storage (local/S3-compatible): model files, evaluation artifacts.

## External Integrations
- News source APIs (e.g., NewsAPI, GDELT, mediastack or equivalent).
- Search providers for live web evidence.
- Fact-check APIs/databases (e.g., ClaimReview-compatible data sources).
- Optional URL extraction/scraping for primary source retrieval.

---

## 4) Core Components Breakdown

## A. Article Feed & Reader

### Functional Requirements
- Display stream of article cards with title, source, publish date, short summary.
- Filters: topic, genre/category, source reputation tier, recency.
- Open article detail with:
  - Full content (or clean excerpt + outbound source link)
  - Related articles
  - Source details
  - “Verify this claim” quick action

### Backend Responsibilities
- Scheduled ingestion from chosen news APIs.
- Deduplication (URL hash + semantic similarity).
- Topic classification tagging.
- Relevance scoring for feed ranking.

### Data Model (Key Entities)
- `Article`: id, url, title, body, source, author, published_at, language.
- `ArticleTag`: article_id, topic, genre.
- `Source`: id, domain, reliability_score, bias_label, metadata.

## B. Real-Time News Verification

### Functional Requirements
- Input: user-entered claim/news text (and optional URL).
- Real-time evidence retrieval from internet-connected sources.
- Output:
  - Verdict class (Likely True / Mixed / Likely False / Unverified)
  - Confidence score
  - Top evidence snippets with source links
  - Source credibility summary
  - Rationale in plain language

### Verification Pipeline
1. **Claim preprocessing**: clean text, NER, keyphrase extraction.
2. **Query generation**: multiple search queries from claim intent.
3. **Evidence retrieval**: top-k results from news/search/fact-check APIs.
4. **Evidence quality scoring**: source trust + recency + corroboration.
5. **Semantic contradiction/entailment**: compare claim vs evidence.
6. **Verdict aggregation**: weighted score + confidence calibration.
7. **Explainability response**: why score/verdict was assigned.

### Real-Time Requirements
- Use async I/O with timeouts and fallback providers.
- Cache results by claim fingerprint for short TTL.
- Stream progress states to frontend (SSE/WebSocket optional).

### Key Safety Controls
- Label uncertain outputs as “Unverified” instead of hard false/true.
- Show source links and timestamps.
- Add disclaimer: tool assists verification; not absolute truth engine.

## C. Local Fake News Model Showcase (Python)

### Functional Requirements
- Show local model type, training dataset summary, and performance metrics.
- Run user-input inference through locally hosted model.
- Display explanation (important features/attention keywords/shap-lite summary).

### Training Pipeline
1. Dataset curation and cleaning.
2. Train/validation/test split with leakage checks.
3. Baseline model (TF-IDF + Logistic Regression).
4. Advanced model (Transformer fine-tuning, optional).
5. Evaluation (precision, recall, F1, ROC-AUC, calibration).
6. Error analysis dashboard (false positives/negatives).
7. Export artifact + model card.

### Candidate Datasets
- LIAR dataset
- FakeNewsNet
- Kaggle fake/real news datasets
- Custom curated local dataset (if licensing permits)

### Deliverables
- Reproducible training script/notebook.
- Versioned model artifact.
- Inference endpoint integrated with web UI.

---

## 5) Suggested Tech Stack

## Frontend
- Next.js + TypeScript
- Tailwind CSS
- TanStack Query for API state management
- Charting library for metrics

## Backend
- FastAPI + Pydantic
- HTTPX (async external requests)
- SQLAlchemy + Alembic
- Redis
- Optional Celery/RQ worker

## ML/NLP
- scikit-learn (baseline)
- PyTorch + HuggingFace Transformers (advanced)
- sentence-transformers for semantic similarity
- spaCy for NER/keyphrase support

## Infra/DevOps
- Docker + docker-compose
- GitHub Actions CI
- Optional deployment: Azure/AWS/GCP + managed Postgres/Redis

---

## 6) API Blueprint (MVP)

- `GET /api/feed`
  - Query: topic, genre, source, page, page_size, sort
  - Returns paginated article cards

- `GET /api/articles/{id}`
  - Returns full article metadata + content

- `POST /api/verify`
  - Body: claim_text, optional url
  - Returns verdict, confidence, evidence list, explanation

- `GET /api/verify/{job_id}` (if async verification)
  - Returns verification status/progress/result

- `POST /api/model/infer`
  - Body: text
  - Returns local model label, confidence, explanation

- `GET /api/model/metrics`
  - Returns latest model metrics and training metadata

---

## 7) UI/UX Plan

### Page Structure
- `/` Feed page with filters and article cards.
- `/article/[id]` Reader page.
- `/verify` Verification workflow page.
- `/model-showcase` Local model insights page.

### UX Details
- Always show source and timestamp in feed/verify cards.
- Use badges for verdict and reliability level.
- Provide loading states, retries, and clear timeout messaging.
- For verification, display “evidence found/checked” progress indicator.

---

## 8) Implementation Roadmap (12 Weeks)

## Phase 0 — Discovery & Setup (Week 1)
- Finalize requirements and KPIs.
- Choose APIs and datasets.
- Create mono-repo structure (`frontend/`, `backend/`, `ml/`, `infra/`).
- Setup CI, linting, formatting, and environment configs.

## Phase 1 — Feed MVP (Weeks 2-4)
- Build ingestion connectors and normalization pipeline.
- Implement database schema and caching.
- Build feed + filter + reader UI.
- Add source metadata and ranking basics.

## Phase 2 — Verification MVP (Weeks 5-7)
- Implement claim preprocessing and query generation.
- Integrate live search/news/fact-check retrieval.
- Build evidence scoring and verdict aggregation.
- Build verification UI and API responses with explanations.

## Phase 3 — Local Model Showcase (Weeks 8-9)
- Train baseline local model.
- Evaluate and publish metrics + model card.
- Expose inference endpoint.
- Build showcase page with demo input + outputs.

## Phase 4 — Hardening & Launch Prep (Weeks 10-11)
- Performance tuning, caching strategy, and timeout fallbacks.
- Security review, rate limits, abuse controls.
- Observability dashboards (latency, errors, API quotas).
- Accessibility and responsive QA.

## Phase 5 — Launch & Iteration (Week 12)
- Soft launch with sample users.
- Collect feedback and monitor quality.
- Prioritize backlog for post-MVP improvements.

---

## 9) Repository Structure (Planned)

```
veritas-ai/
  frontend/
    app/
    components/
    lib/
  backend/
    app/
      api/
      services/
      models/
      repositories/
      workers/
  ml/
    data/
    notebooks/
    training/
    inference/
    artifacts/
  infra/
    docker/
    scripts/
  docs/
    architecture.md
    api-spec.md
    model-card.md
```

---

## 10) Data, Governance, and Ethics

- Respect API terms/licenses for content storage and display.
- Store only needed user data; encrypt sensitive fields.
- Add transparent messaging about model limitations and bias risk.
- Include “Why this verdict?” for every verification output.
- Keep audit logs for verification decisions and source evidence.

---

## 11) Testing Strategy

## Backend
- Unit tests for parsing, scoring, and verdict aggregation.
- Integration tests with mocked external providers.
- Contract tests for API responses.

## Frontend
- Component tests for feed cards, filters, verification result states.
- E2E tests for full user journeys.

## ML
- Reproducibility checks for training runs.
- Drift checks and threshold alerts.
- Regression tests on benchmark claims.

---

## 12) Risks & Mitigations

- **API quota/latency risk**: use multi-provider fallback + caching.
- **Hallucinated or weak evidence**: enforce source quality thresholds.
- **Bias in fake-news datasets**: balanced datasets + error audits.
- **Legal/reuse constraints**: keep source links; avoid storing restricted full text.
- **User over-trust of AI verdicts**: uncertainty labels + clear disclaimers.

---

## 13) Launch Checklist

- [ ] Feed ingestion stable with monitoring.
- [ ] Verification handles success, timeout, and low-evidence cases.
- [ ] Local model metrics documented and visible.
- [ ] Security basics complete (auth, rate limit, input sanitization).
- [ ] Observability dashboards and alerts active.
- [ ] Documentation complete for setup, APIs, and model pipeline.

---

## 14) Post-MVP Backlog

- Personalized feed ranking by reading behavior.
- Browser extension for one-click claim verification.
- Multi-language verification pipeline.
- Human fact-checker collaboration workflow.
- Continuous retraining pipeline with active learning.
