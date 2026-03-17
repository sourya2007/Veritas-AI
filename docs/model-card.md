# Veritas AI Local Model Card

## Model
- Name: TF-IDF + Logistic Regression
- Task: Binary fake-news likelihood classification
- Label 1: Likely Fake
- Label 0: Likely Reliable

## Training Data
- Current: Synthetic starter dataset for demo and pipeline validation.
- Planned upgrade: LIAR + FakeNewsNet + curated local dataset.

## Metrics (latest local run)
- Source: `ml/artifacts/metrics.joblib`
- Expected keys: `f1`, `precision`, `recall`, `roc_auc`

## Limitations
- Baseline model; not production-grade without larger audited dataset.
- Linguistic bias and topic skew possible.
- Must be used with evidence-based verification outputs.
