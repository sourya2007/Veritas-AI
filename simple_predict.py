#!/usr/bin/env python3
from __future__ import annotations

import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

print("START", flush=True)

f = open("results_demo.txt", "w")
f.write("STARTING PREDICTIONS\n")
f.flush()

print("Importing...", flush=True)
import warnings
warnings.filterwarnings('ignore')

import tensorflow as tf
import json
from pathlib import Path
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.preprocessing.text import tokenizer_from_json

f.write("Libraries imported\n")
f.flush()

ROOT = Path(__file__).resolve().parent
MODEL_FILE = ROOT / "detector_model.keras"
TOKENIZER_FILE = ROOT / "detector_tokenizer.json"
CONFIG_FILE = ROOT / "detector_config.json"

if CONFIG_FILE.exists():
    try:
        cfg = json.loads(CONFIG_FILE.read_text(encoding="utf-8"))
        model_name = cfg.get("model_file")
        if model_name:
            MODEL_FILE = ROOT / str(model_name)
    except Exception:
        pass

print("Loading model...", flush=True)
model = tf.keras.models.load_model(MODEL_FILE)
f.write("Model loaded\n")
f.flush()

print("Preparing tokenizer...", flush=True)
tokenizer = tokenizer_from_json(TOKENIZER_FILE.read_text(encoding="utf-8"))
config = json.loads(CONFIG_FILE.read_text(encoding="utf-8")) if CONFIG_FILE.exists() else {}
max_len = int(config.get("max_len", 120))
threshold = float(config.get("real_threshold", 0.5))

f.write("Tokenizer ready\n\n")
f.flush()

print("Making predictions...", flush=True)

samples = [
    "Government confirms new healthcare bill after parliamentary vote.",
    "FAKE: Secret cabal controls all weather patterns using hidden satellites.",
    "Reuters reports unemployment rate fell for fourth month in a row.",
    "BREAKING HOAX: Scientists banned from revealing miracle anti-aging pill.",
]

f.write("PREDICTIONS:\n")
for text in samples:
    seq = tokenizer.texts_to_sequences([text])
    padded = pad_sequences(seq, maxlen=max_len, padding='post', truncating='post')
    pred = model.predict(padded, verbose=0)[0][0]
    result = "REAL" if pred >= threshold else "FAKE"
    f.write(f"'{text}' -> {result} (real_prob={float(pred):.4f})\n")
    f.flush()

f.write("\nDone!\n")
f.close()

print("✅ Check results_demo.txt", flush=True)
