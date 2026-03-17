from pydantic import BaseModel, Field, HttpUrl


class Article(BaseModel):
    slug: str
    title: str
    source: str
    summary: str
    body: str
    topic: str
    genre: str
    published_at: str
    image_url: HttpUrl
    source_url: HttpUrl
    credibility_label: str


class ArticleFeedResponse(BaseModel):
    items: list[Article]
    topics: list[str]
    genres: list[str]
    total: int


class VerificationRequest(BaseModel):
    text: str = Field(min_length=15)
    source_url: HttpUrl | None = None


class VerificationEvidence(BaseModel):
    title: str
    source: str
    url: HttpUrl
    stance: str
    summary: str


class VerificationResponse(BaseModel):
    verdict: str
    confidence: float = Field(ge=0.0, le=1.0)
    reasoning: str
    signals: list[str]
    evidence: list[VerificationEvidence]


class MLShowcaseResponse(BaseModel):
    dataset_name: str
    model_name: str
    accuracy: float = Field(ge=0.0, le=1.0)
    precision: float = Field(ge=0.0, le=1.0)
    recall: float = Field(ge=0.0, le=1.0)
    f1_score: float = Field(ge=0.0, le=1.0)
    notes: list[str]


class MLPredictionRequest(BaseModel):
    text: str = Field(min_length=15)


class MLPredictionResponse(BaseModel):
    fake_probability: float = Field(ge=0.0, le=1.0)
    confidence_band: str
    explanation: str
