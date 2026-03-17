from __future__ import annotations

from dataclasses import dataclass
import hashlib
import re
from datetime import datetime, timezone
from urllib.request import urlopen
import xml.etree.ElementTree as ET

from app.schemas.feed import ArticleOut
from app.schemas.common import SourceMeta


RSS_FEEDS = [
    "http://feeds.bbci.co.uk/news/world/rss.xml",
    "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    "https://www.aljazeera.com/xml/rss/all.xml",
]


TOPIC_RULES = {
    "Politics": ["election", "minister", "government", "parliament", "president"],
    "Technology": ["ai", "technology", "software", "internet", "chip", "startup"],
    "Health": ["health", "hospital", "virus", "vaccine", "medical"],
    "Finance": ["market", "bank", "finance", "economy", "stock", "inflation"],
    "Climate": ["climate", "weather", "emission", "environment", "wildfire"],
}


@dataclass
class FeedQuery:
    topic: str | None = None
    genre: str | None = None
    source: str | None = None
    page: int = 1
    page_size: int = 24


class FeedService:
    def __init__(self) -> None:
        self._cache: list[ArticleOut] = []
        self._cache_ts: datetime | None = None

    def _infer_topic(self, text: str) -> str:
        lowered = text.lower()
        for topic, keywords in TOPIC_RULES.items():
            if any(keyword in lowered for keyword in keywords):
                return topic
        return "Politics"

    def _get_child_text(self, node: ET.Element, tag: str) -> str:
        child = node.find(tag)
        return (child.text or "").strip() if child is not None and child.text else ""

    def _extract_thumbnail(self, node: ET.Element, summary: str) -> str | None:
        media_thumb = node.find("{http://search.yahoo.com/mrss/}thumbnail")
        if media_thumb is not None and media_thumb.get("url"):
            return media_thumb.get("url")

        media_content = node.find("{http://search.yahoo.com/mrss/}content")
        if media_content is not None and media_content.get("url"):
            return media_content.get("url")

        enclosure = node.find("enclosure")
        if enclosure is not None and enclosure.get("url"):
            return enclosure.get("url")

        image_match = re.search(r'<img[^>]+src=["\']([^"\']+)["\']', summary)
        if image_match:
            return image_match.group(1)

        return None

    def _fetch_feed_xml(self, url: str) -> ET.Element | None:
        try:
            with urlopen(url, timeout=12) as response:
                content = response.read()
            return ET.fromstring(content)
        except Exception:
            return None

    def _fetch_live_articles(self) -> list[ArticleOut]:
        items: list[ArticleOut] = []
        seen_titles: set[str] = set()

        for feed_url in RSS_FEEDS:
            root = self._fetch_feed_xml(feed_url)
            if root is None:
                continue

            channel = root.find("channel")
            feed_title = self._get_child_text(channel, "title") if channel is not None else "News Source"
            entries = root.findall(".//item")[:35]

            for entry in entries:
                title = self._get_child_text(entry, "title") or "Untitled"
                summary_html = self._get_child_text(entry, "description") or title
                summary = re.sub(r"<[^>]+>", " ", summary_html).strip()
                link = self._get_child_text(entry, "link")
                published = self._get_child_text(entry, "pubDate") or datetime.now(timezone.utc).isoformat()
                topic = self._infer_topic(f"{title} {summary}")

                digest = hashlib.md5((title + link).encode("utf-8")).hexdigest()[:12]
                source = SourceMeta(
                    name=feed_title,
                    domain=link or None,
                    reliability_score=0.72 if "bbc" in feed_title.lower() or "times" in feed_title.lower() else 0.68,
                )

                normalized = ArticleOut(
                    id=f"article-{digest}",
                    title=title,
                    summary=summary,
                    body=summary,
                    source=source,
                    topic=topic,
                    genre="Breaking",
                    published_at=published,
                    url=link or None,
                    thumbnail_url=self._extract_thumbnail(entry, summary_html),
                )

                key = f"{normalized.title.lower()}-{normalized.source.name.lower()}"
                if key in seen_titles:
                    continue
                seen_titles.add(key)
                items.append(normalized)

        items.sort(key=lambda article: article.published_at, reverse=True)
        return items

    def list_articles(self, query: FeedQuery) -> tuple[list[ArticleOut], int]:
        should_refresh = not self._cache_ts or (datetime.now(timezone.utc) - self._cache_ts).seconds > 180
        if should_refresh or not self._cache:
            self._cache = self._fetch_live_articles()
            self._cache_ts = datetime.now(timezone.utc)

        filtered = self._cache
        if query.topic and query.topic != "All":
            filtered = [item for item in filtered if item.topic == query.topic]
        if query.genre and query.genre != "All":
            filtered = [item for item in filtered if item.genre == query.genre]
        if query.source:
            lowered = query.source.lower()
            filtered = [item for item in filtered if lowered in item.source.name.lower()]

        total = len(filtered)
        start = (query.page - 1) * query.page_size
        end = start + query.page_size
        return filtered[start:end], total

    def get_article(self, article_id: str) -> ArticleOut | None:
        if not self._cache:
            self._cache = self._fetch_live_articles()
        return next((article for article in self._cache if article.id == article_id), None)


feed_service = FeedService()
