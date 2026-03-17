from app.schemas.news import VerificationEvidence, VerificationRequest, VerificationResponse


RISK_TERMS = {
    "always": 0.12,
    "secret": 0.15,
    "guaranteed": 0.18,
    "cover-up": 0.18,
    "shocking": 0.1,
    "viral": 0.08,
    "they don't want you to know": 0.24,
}


def verify_claim(payload: VerificationRequest) -> VerificationResponse:
    text = payload.text.lower()
    suspicion_score = 0.32
    signals: list[str] = []

    for phrase, weight in RISK_TERMS.items():
        if phrase in text:
            suspicion_score += weight
            signals.append(f"Detected high-risk phrase: '{phrase}'")

    if payload.source_url:
        signals.append("User supplied a source URL for external evidence matching.")
        suspicion_score -= 0.04

    if len(payload.text.split()) > 45:
        signals.append("Longer submission allows richer claim extraction for live verification.")
        suspicion_score -= 0.05

    suspicion_score = max(0.08, min(suspicion_score, 0.93))

    if suspicion_score >= 0.72:
        verdict = "likely_false"
        reasoning = "Language patterns and unsupported framing increase the likelihood that the claim needs stronger external verification."
    elif suspicion_score >= 0.5:
        verdict = "mixed_or_unverified"
        reasoning = "The claim has some risk indicators but needs cross-source validation before a stronger verdict is appropriate."
    else:
        verdict = "likely_true"
        reasoning = "The current heuristics do not see strong deception signals, but live provider checks should still confirm the claim."

    evidence = [
        VerificationEvidence(
            title="Fact-check provider integration placeholder",
            source="External fact-check provider",
            url="https://toolbox.google.com/factcheck/explorer",
            stance="reference",
            summary="This implementation stub is ready to be replaced with real provider results and cached evidence.",
        ),
        VerificationEvidence(
            title="Search corroboration placeholder",
            source="Search aggregation",
            url="https://news.google.com/",
            stance="reference",
            summary="The production pipeline will query live search and news sources, then rank corroborating and conflicting articles.",
        ),
    ]

    return VerificationResponse(
        verdict=verdict,
        confidence=round(suspicion_score, 2),
        reasoning=reasoning,
        signals=signals or ["No high-risk phrases detected by the local heuristic."],
        evidence=evidence,
    )
