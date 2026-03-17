from app.schemas.news import MLShowcaseResponse, MLPredictionResponse


def get_showcase_metrics() -> MLShowcaseResponse:
    return MLShowcaseResponse(
        dataset_name="LIAR demo subset",
        model_name="TF-IDF + Logistic Regression",
        accuracy=0.87,
        precision=0.84,
        recall=0.82,
        f1_score=0.83,
        notes=[
            "This is a local showcase endpoint with fixed metrics for the first implementation slice.",
            "The next phase replaces these values with real training jobs, stored artifacts, and evaluation history.",
        ],
    )


def predict_fake_news_probability(text: str) -> MLPredictionResponse:
    lowered_text = text.lower()
    fake_probability = 0.28

    if any(term in lowered_text for term in ["secret", "miracle", "hoax", "shocking"]):
        fake_probability += 0.33

    if "source" not in lowered_text and "according to" not in lowered_text:
        fake_probability += 0.12

    if len(text.split()) < 20:
        fake_probability += 0.08

    fake_probability = round(max(0.06, min(fake_probability, 0.94)), 2)

    if fake_probability >= 0.7:
        confidence_band = "high-risk"
    elif fake_probability >= 0.45:
        confidence_band = "medium-risk"
    else:
        confidence_band = "low-risk"

    return MLPredictionResponse(
        fake_probability=fake_probability,
        confidence_band=confidence_band,
        explanation="This local score is a placeholder heuristic until the training pipeline is connected to real model artifacts.",
    )
