from fastapi import APIRouter, HTTPException, Query

from app.schemas.news import Article, ArticleFeedResponse
from app.services.mock_data import SAMPLE_ARTICLES, TOPICS


router = APIRouter(prefix="/api/articles", tags=["articles"])


@router.get("", response_model=ArticleFeedResponse)
def list_articles(
    topic: str | None = Query(default=None),
    genre: str | None = Query(default=None),
    query: str | None = Query(default=None),
) -> ArticleFeedResponse:
    filtered_articles = SAMPLE_ARTICLES

    if topic:
        filtered_articles = [article for article in filtered_articles if article.topic == topic]

    if genre:
        filtered_articles = [article for article in filtered_articles if article.genre == genre]

    if query:
        lowered_query = query.lower()
        filtered_articles = [
            article
            for article in filtered_articles
            if lowered_query in article.title.lower() or lowered_query in article.summary.lower()
        ]

    return ArticleFeedResponse(
        items=filtered_articles,
        topics=TOPICS,
        genres=sorted({article.genre for article in SAMPLE_ARTICLES}),
        total=len(filtered_articles),
    )


@router.get("/{slug}", response_model=Article)
def get_article(slug: str) -> Article:
    for article in SAMPLE_ARTICLES:
        if article.slug == slug:
            return article

    raise HTTPException(status_code=404, detail="Article not found")
