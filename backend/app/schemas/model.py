from pydantic import BaseModel, Field


class ModelInferRequest(BaseModel):
    text: str = Field(min_length=5)


class ModelInferResponse(BaseModel):
    label: str
    confidence: float = Field(ge=0.0, le=1.0)
    top_signals: list[str]


class ModelMetricsResponse(BaseModel):
    model_name: str
    dataset: str
    metrics: dict[str, float]
    trained_at: str
