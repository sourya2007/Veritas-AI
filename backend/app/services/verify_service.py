from __future__ import annotations

import asyncio
import re
from collections import Counter
from urllib.request import urlopen

from app.schemas.verify import EvidenceItem, VerifyResponse


FACT_CHECK_FEEDS = [
    "http://feeds.bbci.co.uk/news/world/rss.xml",
    "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    "https://www.aljazeera.com/xml/rss/all.xml",
]


class VerifyService:
    def _fetch_feed_text(self, feed: str) -> str:
        try:
            with urlopen(feed, timeout=10) as response:
                return response.read().decode("utf-8", errors="ignore").lower()
        except Exception:
            return ""

    async def _fetch_evidence(self, claim_text: str) -> list[EvidenceItem]:
        terms = [term for term in re.findall(r"[a-zA-Z]{4,}", claim_text.lower()) if term not in {"that", "with", "from", "have", "this"}]
        top_terms = set(term for term, _ in Counter(terms).most_common(6))
        evidence: list[EvidenceItem] = []

        for feed in FACT_CHECK_FEEDS:
            xml_text = await asyncio.to_thread(self._fetch_feed_text, feed)
            if not xml_text:
                continue

            overlap = sum(1 for term in top_terms if term in xml_text)
            stance = "supports" if overlap >= 4 else "neutral" if overlap >= 2 else "contradicts"
            score = min(0.95, 0.35 + overlap * 0.12)

            snippet = f"Matched {overlap} contextual keywords against live source coverage for this claim."
            evidence.append(
                EvidenceItem(
                    source=feed,
                    url=feed,
                    snippet=snippet,
                    stance=stance,
                    reliability_score=score,
                )
            )

        return evidence[:5]

    def _aggregate(self, claim_text: str, evidence: list[EvidenceItem]) -> VerifyResponse:
        if not evidence:
            return VerifyResponse(
                verdict="Unverified",
                confidence=0.32,
                evidence=[],
                explanation="Insufficient live corroborating evidence found across configured internet sources.",
                disclaimer="This assistant provides decision support, not absolute truth.",
            )

        support_weight = sum(item.reliability_score for item in evidence if item.stance == "supports")
        contradict_weight = sum(item.reliability_score for item in evidence if item.stance == "contradicts")

        delta = support_weight - contradict_weight
        confidence = min(0.94, max(0.4, 0.55 + abs(delta) * 0.22))

        if abs(delta) < 0.25:
            verdict = "Mixed"
        elif delta > 0:
            verdict = "Likely True"
        else:
            verdict = "Likely False"

        explanation = (
            f"Verdict is based on live-source corroboration scoring for the claim: '{claim_text[:130]}'. "
            f"Support weight={support_weight:.2f}, contradiction weight={contradict_weight:.2f}."
        )

        return VerifyResponse(
            verdict=verdict,
            confidence=round(confidence, 3),
            evidence=evidence,
            explanation=explanation,
            disclaimer="This assistant provides decision support, not absolute truth.",
        )

    async def verify(self, claim_text: str) -> VerifyResponse:
        evidence = await self._fetch_evidence(claim_text)
        return self._aggregate(claim_text, evidence)


verify_service = VerifyService()
