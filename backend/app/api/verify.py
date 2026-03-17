from fastapi import APIRouter

from app.schemas.verify import VerifyRequest, VerifyResponse
from app.services.verify_service import verify_service


router = APIRouter(prefix="/api", tags=["verify"])


@router.post("/verify", response_model=VerifyResponse)
async def verify_claim(payload: VerifyRequest):
    return await verify_service.verify(payload.claim_text)
