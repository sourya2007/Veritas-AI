from __future__ import annotations

import json
from pathlib import Path

from pipeline.naive_bayes import MultinomialNaiveBayes


ROOT = Path(__file__).resolve().parent
DATASET_PATH = ROOT / "data" / "demo_dataset.jsonl"
ARTIFACT_PATH = ROOT / "artifacts" / "demo_model.json"


def load_rows() -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []

    with DATASET_PATH.open("r", encoding="utf-8") as handle:
        for line in handle:
            rows.append(json.loads(line))

    return rows


def evaluate(model: MultinomialNaiveBayes, trained_model, rows: list[dict[str, str]]) -> dict[str, float]:
    correct = 0
    true_positive = 0
    false_positive = 0
    false_negative = 0

    for row in rows:
        prediction = model.predict(trained_model, row["text"])
        label = row["label"]

        if prediction == label:
            correct += 1

        if prediction == "fake" and label == "fake":
            true_positive += 1
        elif prediction == "fake" and label != "fake":
            false_positive += 1
        elif prediction != "fake" and label == "fake":
            false_negative += 1

    total = len(rows)
    accuracy = correct / total if total else 0.0
    precision = true_positive / (true_positive + false_positive) if (true_positive + false_positive) else 0.0
    recall = true_positive / (true_positive + false_negative) if (true_positive + false_negative) else 0.0
    f1_score = (2 * precision * recall / (precision + recall)) if (precision + recall) else 0.0

    return {
        "accuracy": round(accuracy, 4),
        "precision": round(precision, 4),
        "recall": round(recall, 4),
        "f1_score": round(f1_score, 4),
    }


def summarize_top_tokens(trained_model) -> dict[str, list[str]]:
    summary: dict[str, list[str]] = {}

    for label in trained_model.labels:
        label_counts = trained_model.token_counts[label]
        top_tokens = sorted(label_counts, key=label_counts.get, reverse=True)[:8]
        summary[label] = top_tokens

    return summary


def main() -> None:
    rows = load_rows()
    model = MultinomialNaiveBayes()
    trained_model = model.fit(rows)
    metrics = evaluate(model, trained_model, rows)

    artifact = {
        "dataset": DATASET_PATH.name,
        "model_name": "standard-library-multinomial-naive-bayes",
        "labels": trained_model.labels,
        "metrics": metrics,
        "top_tokens": summarize_top_tokens(trained_model),
    }

    ARTIFACT_PATH.parent.mkdir(parents=True, exist_ok=True)
    ARTIFACT_PATH.write_text(json.dumps(artifact, indent=2), encoding="utf-8")

    print(json.dumps(artifact, indent=2))


if __name__ == "__main__":
    main()