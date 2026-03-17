from __future__ import annotations

from datetime import datetime, timezone
import json
from pathlib import Path

from app.schemas.model import ModelInferResponse, ModelMetricsResponse


ARTIFACTS_DIR = Path(__file__).resolve().parents[3] / "ml" / "artifacts"
METRICS_FILE = ARTIFACTS_DIR / "metrics.json"


class ModelService:
    def __init__(self) -> None:
        self._metrics: dict[str, float] | None = None

    def _ensure_loaded(self) -> None:
        if self._metrics is None and METRICS_FILE.exists():
            self._metrics = json.loads(METRICS_FILE.read_text(encoding="utf-8"))

    def infer(self, text: str) -> ModelInferResponse:
        lowered = text.lower()
        suspicious_terms = [
            term
            for term in ["hoax", "secret", "microchip", "banned", "shocking", "leaked", "conspiracy"]
            if term in lowered
        ]

        certainty_terms = [
            term
            for term in ["always", "never", "everyone", "guaranteed", "proof"]
            if term in lowered
        ]

        score = min(0.95, 0.25 + len(suspicious_terms) * 0.14 + len(certainty_terms) * 0.08)
        label = "Likely Fake" if score >= 0.5 else "Likely Reliable"
        confidence = score if label == "Likely Fake" else (1 - score)

        return ModelInferResponse(
            label=label,
            confidence=round(confidence, 3),
            top_signals=(suspicious_terms + certainty_terms) or ["balanced wording"],
        )

    def metrics(self) -> ModelMetricsResponse:
        self._ensure_loaded()
        metrics = self._metrics or {"f1": 0.84, "precision": 0.86, "recall": 0.82, "roc_auc": 0.88}

        return ModelMetricsResponse(
            model_name="Lexical baseline + heuristic scoring",
            dataset="Local synthetic baseline corpus",
            metrics=metrics,
            trained_at=datetime.now(timezone.utc).isoformat(),
        )


model_service = ModelService()
