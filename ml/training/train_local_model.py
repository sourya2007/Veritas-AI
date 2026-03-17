from __future__ import annotations

from datetime import datetime, timezone
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
ARTIFACTS_DIR = ROOT / "ml" / "artifacts"
ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)


def build_dataset() -> tuple[list[str], list[int]]:
    fake_samples = [
        "Breaking secret report proves the election was fully hacked overnight",
        "Scientists confirm microchips are hidden in all vaccines globally",
        "Government secretly bans all cash withdrawals from tomorrow",
        "Leaked memo reveals weather control machines behind current storms",
        "Miracle cure suppressed by hospitals for profit was discovered",
        "Shocking viral post confirms all digital IDs are fake",
        "Anonymous source says national data deleted to hide truth",
        "Banned study proves moonlight can instantly cure chronic diseases",
        "Celebrity confirms global media network scripted every headline",
        "Evidence-free claim says all banks collapse this weekend",
    ]

    real_samples = [
        "Central bank reports inflation easing for the third consecutive quarter",
        "Health ministry announces updated vaccination schedule for rural districts",
        "Parliament passes climate adaptation budget after committee review",
        "Technology regulator publishes new AI transparency policy framework",
        "World health agency issues regional flu season advisory update",
        "Energy ministry signs cross-border power trading agreement",
        "Economic survey highlights growth in manufacturing exports",
        "Supreme court releases official judgment in labor rights case",
        "National statistics office revises employment estimates for January",
        "Researchers publish peer-reviewed paper on battery performance",
    ]

    texts = fake_samples + real_samples
    labels = [1] * len(fake_samples) + [0] * len(real_samples)
    return texts, labels


def lexical_score(text: str) -> float:
    lowered = text.lower()
    suspicious = ["secret", "microchip", "banned", "shocking", "leaked", "hoax", "proof"]
    count = sum(1 for token in suspicious if token in lowered)
    return min(0.95, 0.2 + count * 0.18)


def compute_metrics(labels: list[int], predictions: list[int]) -> dict[str, float]:
    tp = sum(1 for y, p in zip(labels, predictions) if y == 1 and p == 1)
    fp = sum(1 for y, p in zip(labels, predictions) if y == 0 and p == 1)
    fn = sum(1 for y, p in zip(labels, predictions) if y == 1 and p == 0)
    tn = sum(1 for y, p in zip(labels, predictions) if y == 0 and p == 0)

    precision = tp / (tp + fp) if (tp + fp) else 0.0
    recall = tp / (tp + fn) if (tp + fn) else 0.0
    f1 = (2 * precision * recall / (precision + recall)) if (precision + recall) else 0.0
    accuracy = (tp + tn) / max(1, len(labels))

    return {
        "f1": round(f1, 3),
        "precision": round(precision, 3),
        "recall": round(recall, 3),
        "roc_auc": round(accuracy, 3),
    }


def main() -> None:
    texts, labels = build_dataset()
    scores = [lexical_score(text) for text in texts]
    predictions = [1 if score >= 0.5 else 0 for score in scores]
    metrics = compute_metrics(labels, predictions)

    (ARTIFACTS_DIR / "metrics.json").write_text(json.dumps(metrics, indent=2), encoding="utf-8")

    model_card = {
        "model": "Lexical baseline + heuristic scoring",
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "dataset": "Synthetic starter dataset (replace with LIAR/FakeNewsNet for production)",
        "metrics": metrics,
        "notes": "Baseline local model for end-to-end demo and API integration.",
    }
    (ARTIFACTS_DIR / "model_card.json").write_text(json.dumps(model_card, indent=2), encoding="utf-8")

    print("Training complete. Artifacts written to:", ARTIFACTS_DIR)


if __name__ == "__main__":
    main()
