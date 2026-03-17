from fastapi import APIRouter

from app.schemas.model import ModelInferRequest, ModelInferResponse, ModelMetricsResponse
from app.services.model_service import model_service


router = APIRouter(prefix="/api/model", tags=["model"])


@router.post("/infer", response_model=ModelInferResponse)
def infer(payload: ModelInferRequest):
    return model_service.infer(payload.text)


@router.get("/metrics", response_model=ModelMetricsResponse)
def metrics():
    return model_service.metrics()
