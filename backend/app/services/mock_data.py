from app.schemas.news import Article


TOPICS = ["Politics", "Technology", "Health", "Climate", "Business"]

SAMPLE_ARTICLES = [
    Article(
        slug="election-disinformation-patterns",
        title="How election disinformation campaigns adapt to breaking events",
        source="Civic Ledger",
        summary="Researchers tracked how false claims mutated across messaging channels within hours.",
        body=(
            "A new research brief shows how coordinated misinformation clusters rewrite headlines, "
            "reuse emotional language, and amplify claims during periods of civic uncertainty. "
            "The report argues that fast verification and strong source labeling reduce spread."
        ),
        topic="Politics",
        genre="Analysis",
        published_at="2026-03-17T09:00:00Z",
        image_url="https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=80",
        source_url="https://example.com/election-disinformation-patterns",
        credibility_label="Needs verification",
    ),
    Article(
        slug="ai-medical-triage-pilot",
        title="Regional hospitals test AI-assisted triage for emergency queues",
        source="Health Signal",
        summary="Pilot programs report lower wait times, but clinicians want stricter oversight rules.",
        body=(
            "The pilot spans six hospitals and combines nurse triage intake with automated risk scoring. "
            "Supervising clinicians say the software is useful for prioritization but should not replace judgment."
        ),
        topic="Health",
        genre="Report",
        published_at="2026-03-16T18:30:00Z",
        image_url="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
        source_url="https://example.com/ai-medical-triage-pilot",
        credibility_label="Verified by editors",
    ),
    Article(
        slug="green-grid-storage-race",
        title="Battery startups race to stabilize the green energy grid",
        source="Future Grid",
        summary="A new funding wave is pushing long-duration storage from labs into public utilities.",
        body=(
            "Utilities are evaluating iron-air, sodium-ion, and hybrid systems to smooth renewable volatility. "
            "Analysts caution that grid economics still depend on local regulation and procurement speed."
        ),
        topic="Climate",
        genre="Feature",
        published_at="2026-03-15T12:00:00Z",
        image_url="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=900&q=80",
        source_url="https://example.com/green-grid-storage-race",
        credibility_label="Cross-source match",
    ),
    Article(
        slug="consumer-ai-device-launch",
        title="Consumer AI device launches with privacy promises under scrutiny",
        source="Circuit Daily",
        summary="Privacy advocates say the product claims are too vague to evaluate without audits.",
        body=(
            "The company says most requests are processed on-device, but policy language leaves exceptions for cloud routing. "
            "Independent researchers are requesting audit access before endorsing the launch."
        ),
        topic="Technology",
        genre="News",
        published_at="2026-03-14T14:15:00Z",
        image_url="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
        source_url="https://example.com/consumer-ai-device-launch",
        credibility_label="Needs verification",
    ),
]
