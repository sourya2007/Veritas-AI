from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.feed import router as feed_router
from app.api.verify import router as verify_router
from app.api.model import router as model_router
from app.api.health import router as health_router


app = FastAPI(title="Veritas AI Backend", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(feed_router)
app.include_router(verify_router)
app.include_router(model_router)
