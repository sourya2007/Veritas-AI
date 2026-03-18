#!/usr/bin/env python3
from __future__ import annotations

import json
import urllib.error
import urllib.request

API_BASE = "http://localhost:8000"

SAMPLES = [
    "Reuters: Federal Reserve keeps interest rates unchanged amid inflation concerns.",
    "CNN reports UN climate summit reaches provisional emissions framework agreement.",
    "FAKE: NASA confirms Earth will go completely dark for six days next month.",
    "HOAX: Government to seize all private savings accounts starting Monday morning.",
    "BBC: Parliament passes revised public health spending bill after final vote.",
]


def post_json(path: str, payload: dict) -> dict:
    body = json.dumps(payload).encode("utf-8")
    request = urllib.request.Request(
        f"{API_BASE}{path}",
        data=body,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=25) as response:
        return json.loads(response.read())


def print_divider() -> None:
    print("-" * 96)


def main() -> int:
    print("VERITAS AI - LOCAL MODEL SHOWCASE")
    print_divider()

    try:
        metrics = urllib.request.urlopen(f"{API_BASE}/api/model/metrics", timeout=15)
        metrics_data = json.loads(metrics.read())
        print(f"Model:   {metrics_data.get('model_name', 'unknown')}")
        print(f"Dataset: {metrics_data.get('dataset', 'unknown')}")
    except Exception as exc:
        print(f"Could not read /api/model/metrics: {exc}")
        print("Make sure backend is running: uvicorn app.main:app --reload --port 8000")
        return 1

    print_divider()

    for idx, sample in enumerate(SAMPLES, start=1):
        print(f"Sample {idx}:")
        print(f"Text: {sample}")

        try:
            infer_result = post_json("/api/model/infer", {"text": sample})
            verify_result = post_json("/api/verify", {"claim_text": sample})
        except urllib.error.HTTPError as exc:
            details = exc.read().decode("utf-8", errors="ignore")
            print(f"Request failed ({exc.code}): {details}")
            print_divider()
            continue
        except Exception as exc:
            print(f"Request failed: {exc}")
            print_divider()
            continue

        infer_label = infer_result.get("label", "n/a")
        infer_conf = infer_result.get("confidence", "n/a")
        infer_signals = infer_result.get("top_signals", [])

        verify_verdict = verify_result.get("verdict", "n/a")
        verify_conf = verify_result.get("confidence", "n/a")

        print(f"Model Infer  -> label={infer_label}, confidence={infer_conf}")
        print(f"Top Signals  -> {', '.join(infer_signals[:4]) if infer_signals else 'none'}")
        print(f"Verify Claim -> verdict={verify_verdict}, confidence={verify_conf}")
        print_divider()

    print("Showcase complete.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
