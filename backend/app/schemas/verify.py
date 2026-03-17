from pydantic import BaseModel, Field


class VerifyRequest(BaseModel):
    claim_text: str = Field(min_length=5)
    url: str | None = None


class EvidenceItem(BaseModel):
    source: str
    url: str | None = None
    snippet: str
    stance: str
    reliability_score: float = Field(ge=0.0, le=1.0)


class VerifyResponse(BaseModel):
    verdict: str
    confidence: float = Field(ge=0.0, le=1.0)
    evidence: list[EvidenceItem]
    explanation: str
    disclaimer: str
