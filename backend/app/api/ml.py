from fastapi import APIRouter

from app.schemas.news import MLShowcaseResponse, MLPredictionRequest, MLPredictionResponse
from app.services.ml_showcase import get_showcase_metrics, predict_fake_news_probability


router = APIRouter(prefix="/api/ml", tags=["ml"])


@router.get("/showcase", response_model=MLShowcaseResponse)
def get_showcase() -> MLShowcaseResponse:
    return get_showcase_metrics()


@router.post("/predict", response_model=MLPredictionResponse)
def predict_text(payload: MLPredictionRequest) -> MLPredictionResponse:
    return predict_fake_news_probability(payload.text)
