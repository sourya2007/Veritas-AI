from pydantic import BaseModel, Field

from app.schemas.common import SourceMeta


class ArticleOut(BaseModel):
    id: str
    title: str
    summary: str
    body: str | None = None
    source: SourceMeta
    topic: str
    genre: str
    published_at: str
    url: str | None = None
    thumbnail_url: str | None = None


class FeedResponse(BaseModel):
    page: int = Field(ge=1)
    page_size: int = Field(ge=1)
    total: int = Field(ge=0)
    items: list[ArticleOut]
