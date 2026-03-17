from pydantic import BaseModel, Field


class SourceMeta(BaseModel):
    name: str
    domain: str | None = None
    reliability_score: float = Field(default=0.6, ge=0.0, le=1.0)
