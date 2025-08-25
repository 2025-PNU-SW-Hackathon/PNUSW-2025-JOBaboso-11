from fastapi import APIRouter, HTTPException, Depends, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from db.session import get_db
from models.user import PersonalUser
from schema.personal import CompanyLikeListResponse, CompanyLikeResponse, PrivacyConsentUpdate
from crud.personal import get_company_likes_with_count, validate_and_get_personal_user
from utils.jwt import verify_token

router = APIRouter(
    prefix="/personal",
)

security = HTTPBearer()

@router.get("/company-likes", response_model=CompanyLikeListResponse)
def get_my_company_likes(
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 토큰입니다."
        )
    

    personal_user = validate_and_get_personal_user(db, user_id, user_type)
    
    # 회사가 찜한 리스트와 총 개수 조회
    company_likes, total_count = get_company_likes_with_count(db, user_id)
    
    # 응답 데이터 생성
    likes_response = [
        CompanyLikeResponse(
            id=like.id,
            company_id=like.company_id,
            company_name=like.company_name,
            message=like.message,
            contact_email=like.contact_email,
            contact_phone=like.contact_phone,
            suggested_position=like.suggested_position,
            hr_manager_name=like.hr_manager_name,
            created_at=like.created_at
        )
        for like in company_likes
    ]
    
    return CompanyLikeListResponse(
        total_count=total_count,
        likes=likes_response
    )

@router.patch("/privacy-consent")
def update_privacy_consent(
    consent_data: PrivacyConsentUpdate,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 토큰입니다."
        )
    
    if user_type != "personal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="개인 회원만 접근 가능합니다."
        )
    
    personal_user = db.query(PersonalUser).filter(PersonalUser.user_id == user_id).first()
    if not personal_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="개인 회원 정보를 찾을 수 없습니다."
        )
    
    personal_user.privacy_consent = consent_data.privacy_consent
    db.commit()
    db.refresh(personal_user)
    
    return {
        "message": "개인정보 동의 여부가 업데이트되었습니다.",
        "privacy_consent": personal_user.privacy_consent
    }