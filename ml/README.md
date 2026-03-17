# Local ML Showcase

This module contains the first local training path for the fake-news showcase.

## What it does

- Loads a small labeled demo dataset.
- Trains a lightweight multinomial naive Bayes classifier using only the Python standard library.
- Writes metrics and learned weights to `ml/artifacts/demo_model.json`.

## Run locally

```powershell
cd ml
python train.py
```

This starter implementation is intentionally dependency-light so the local showcase can run before the project adopts heavier ML packages.
