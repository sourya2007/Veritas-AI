from fastapi import APIRouter

from app.schemas.news import VerificationRequest, VerificationResponse
from app.services.verification import verify_claim


router = APIRouter(prefix="/api/verification", tags=["verification"])


@router.post("/verify", response_model=VerificationResponse)
def verify_submission(payload: VerificationRequest) -> VerificationResponse:
    return verify_claim(payload)
