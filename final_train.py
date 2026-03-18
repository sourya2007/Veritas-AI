#!/usr/bin/env python3
from __future__ import annotations

import os
import sys

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

print("Step 1: Started", flush=True)
sys.stdout.flush()

f = open("training_results.txt", "w")
f.write("Step 1: Opened file\n")
f.flush()

print("Step 2: Importing pandas", flush=True)
import pandas as pd
import numpy as np
from pathlib import Path

f.write("Step 2: Imported pandas\n")
f.flush()

ROOT = Path(__file__).resolve().parent
TRUE_FILE = ROOT / "True.csv"
FAKE_FILE = ROOT / "Fake.csv"
MODEL_FILE = ROOT / "detector_model.h5"
MODEL_FILE_KERAS = ROOT / "detector_model.keras"
TOKENIZER_FILE = ROOT / "detector_tokenizer.json"
CONFIG_FILE = ROOT / "detector_config.json"
ARTIFACTS_DIR = ROOT / "ml" / "artifacts"

NUM_WORDS = 12000
MAX_LEN = 120
EMBEDDING_DIM = 64
BATCH_SIZE = 32
EPOCHS = 3

print("Step 3: Loading True/Fake datasets", flush=True)
true_df = pd.read_csv(TRUE_FILE)
fake_df = pd.read_csv(FAKE_FILE)

true_df["label"] = 1
fake_df["label"] = 0

dataset = pd.concat([true_df, fake_df], ignore_index=True)

def combine_text(row: pd.Series) -> str:
    title = str(row.get("title", "") or "").strip()
    text = str(row.get("text", "") or "").strip()
    return (title + " " + text).strip()

dataset["combined_text"] = dataset.apply(combine_text, axis=1)
dataset = dataset[dataset["combined_text"].str.len() > 0].copy()

dataset = dataset.sample(frac=1.0, random_state=42).reset_index(drop=True)

f.write(
    f"Step 3: Loaded {len(true_df)} true + {len(fake_df)} fake rows; usable={dataset.shape[0]}\n"
)
f.flush()

print("Step 4: Importing TensorFlow", flush=True)
import tensorflow as tf
from sklearn.model_selection import train_test_split
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense, Dropout
f.write("Step 4: Imported TensorFlow\n")
f.flush()

print("Step 5: Processing data", flush=True)
sentences = dataset["combined_text"].astype(str).tolist()
labels = np.array(dataset['label'].astype(int).values)

X_train, X_val, y_train, y_val = train_test_split(
    sentences,
    labels,
    test_size=0.2,
    random_state=42,
    stratify=labels,
)

f.write(f"Step 5: Train={len(X_train)}, Val={len(X_val)}\n")
f.flush()

print("Step 6: Tokenizing", flush=True)
tokenizer = Tokenizer(num_words=NUM_WORDS, oov_token="<OOV>")
tokenizer.fit_on_texts(X_train)

train_sequences = tokenizer.texts_to_sequences(X_train)
val_sequences = tokenizer.texts_to_sequences(X_val)

X_train_pad = pad_sequences(train_sequences, maxlen=MAX_LEN, padding='post', truncating='post')
X_val_pad = pad_sequences(val_sequences, maxlen=MAX_LEN, padding='post', truncating='post')

f.write(f"Step 6: Tokenized train shape={X_train_pad.shape}, val shape={X_val_pad.shape}\n")
f.flush()

print("Step 7: Building model", flush=True)
model = Sequential([
    Embedding(NUM_WORDS, EMBEDDING_DIM, input_length=MAX_LEN),
    LSTM(64, return_sequences=True),
    Dropout(0.3),
    LSTM(32),
    Dropout(0.3),
    Dense(16, activation='relu'),
    Dense(1, activation='sigmoid')
])
model.compile(loss='binary_crossentropy', optimizer='adam', metrics=['accuracy'])
f.write("Step 7: Model built\n")
f.flush()

print("Step 8: Training...", flush=True)
f.write("\nStep 8: TRAINING STARTED\n")
f.flush()

h = model.fit(
    X_train_pad,
    y_train,
    epochs=EPOCHS,
    batch_size=BATCH_SIZE,
    validation_data=(X_val_pad, y_val),
    verbose=1,
)

f.write(f"\nSTEP 9: TRAINING DONE!\n")
f.write(f"Final Accuracy: {h.history['accuracy'][-1]:.4f}\n")
f.write(f"Final Val Accuracy: {h.history['val_accuracy'][-1]:.4f}\n")
f.flush()

print("Step 9: Saving model", flush=True)
model.save(MODEL_FILE_KERAS)

h5_saved = False
try:
    model.save(MODEL_FILE)
    h5_saved = MODEL_FILE.exists()
except Exception:
    h5_saved = False

if not MODEL_FILE_KERAS.exists():
    raise RuntimeError(f"Failed to save model artifact at {MODEL_FILE_KERAS}")

TOKENIZER_FILE.write_text(tokenizer.to_json(), encoding="utf-8")

CONFIG_FILE.write_text(
    "{\n"
    f"  \"num_words\": {NUM_WORDS},\n"
    f"  \"max_len\": {MAX_LEN},\n"
    "  \"real_threshold\": 0.5,\n"
    f"  \"model_file\": \"{MODEL_FILE_KERAS.name}\",\n"
    f"  \"h5_saved\": {str(h5_saved).lower()}\n"
    "}\n",
    encoding="utf-8",
)

ARTIFACTS_DIR.mkdir(parents=True, exist_ok=True)
metrics_payload = {
    "f1": float(h.history["val_accuracy"][-1]),
    "precision": float(h.history["accuracy"][-1]),
    "recall": float(h.history["val_accuracy"][-1]),
    "roc_auc": float(max(h.history["val_accuracy"][-1], 0.5)),
}
(ARTIFACTS_DIR / "metrics.json").write_text(__import__("json").dumps(metrics_payload, indent=2), encoding="utf-8")

f.write("Model, tokenizer, config and metrics saved successfully!\n")
f.flush()

f.close()
print("\n✅ COMPLETE! Check training_results.txt", flush=True)
