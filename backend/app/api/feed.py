from fastapi import APIRouter, HTTPException, Query

from app.schemas.feed import ArticleOut, FeedResponse
from app.services.feed_service import FeedQuery, feed_service


router = APIRouter(prefix="/api", tags=["feed"])


@router.get("/feed", response_model=FeedResponse)
def get_feed(
    topic: str | None = Query(default=None),
    genre: str | None = Query(default=None),
    source: str | None = Query(default=None),
    search: str | None = Query(default=None),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=24, ge=1, le=100),
):
    items, total = feed_service.list_articles(
        FeedQuery(topic=topic, genre=genre, source=source, search=search, page=page, page_size=page_size)
    )
    return FeedResponse(page=page, page_size=page_size, total=total, items=items)


@router.get("/articles/{article_id}", response_model=ArticleOut)
def get_article(article_id: str):
    article = feed_service.get_article(article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
    return article
