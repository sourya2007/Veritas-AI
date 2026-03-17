from __future__ import annotations

from collections import Counter, defaultdict
from dataclasses import dataclass
from math import log
import re


TOKEN_PATTERN = re.compile(r"[a-zA-Z']+")


def tokenize(text: str) -> list[str]:
    return [token.lower() for token in TOKEN_PATTERN.findall(text)]


@dataclass
class TrainedModel:
    labels: list[str]
    priors: dict[str, float]
    token_totals: dict[str, int]
    token_counts: dict[str, dict[str, int]]
    vocabulary: list[str]


class MultinomialNaiveBayes:
    def fit(self, rows: list[dict[str, str]]) -> TrainedModel:
        label_counts: Counter[str] = Counter()
        token_totals: Counter[str] = Counter()
        token_counts: dict[str, Counter[str]] = defaultdict(Counter)
        vocabulary: set[str] = set()

        for row in rows:
            label = row["label"]
            tokens = tokenize(row["text"])
            label_counts[label] += 1
            token_totals[label] += len(tokens)
            token_counts[label].update(tokens)
            vocabulary.update(tokens)

        total_rows = sum(label_counts.values())
        priors = {label: count / total_rows for label, count in label_counts.items()}

        return TrainedModel(
            labels=sorted(label_counts.keys()),
            priors=priors,
            token_totals=dict(token_totals),
            token_counts={label: dict(counter) for label, counter in token_counts.items()},
            vocabulary=sorted(vocabulary),
        )

    def predict_proba(self, model: TrainedModel, text: str) -> dict[str, float]:
        tokens = tokenize(text)
        vocabulary_size = max(len(model.vocabulary), 1)
        log_scores: dict[str, float] = {}

        for label in model.labels:
            score = log(model.priors[label])
            total = model.token_totals[label]
            label_token_counts = model.token_counts[label]

            for token in tokens:
                token_count = label_token_counts.get(token, 0)
                probability = (token_count + 1) / (total + vocabulary_size)
                score += log(probability)

            log_scores[label] = score

        max_score = max(log_scores.values())
        exp_scores = {label: pow(2.718281828, score - max_score) for label, score in log_scores.items()}
        denominator = sum(exp_scores.values())
        return {label: value / denominator for label, value in exp_scores.items()}

    def predict(self, model: TrainedModel, text: str) -> str:
        probabilities = self.predict_proba(model, text)
        return max(probabilities, key=probabilities.get)
