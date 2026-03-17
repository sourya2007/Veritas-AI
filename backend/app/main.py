from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.articles import router as articles_router
from app.api.health import router as health_router
from app.api.ml import router as ml_router
from app.api.verification import router as verification_router
from app.config import settings


app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router)
app.include_router(articles_router)
app.include_router(verification_router)
app.include_router(ml_router)
