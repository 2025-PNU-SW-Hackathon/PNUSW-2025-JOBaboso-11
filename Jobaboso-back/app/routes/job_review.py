from fastapi import APIRouter, HTTPException, Depends, Security, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List
from db.session import get_db
from schema.job_review import *
from schema.company_application import CompanyApplicationResponse
from crud.job_review import *
from crud.validation import validate_pagination_params
from typing import Optional
from utils.jwt import verify_token

router = APIRouter(
    prefix="/job-reviews",
    tags=["job_reviews"]
)

security = HTTPBearer()

@router.post("/", response_model=JobReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(
    review: JobReviewCreate,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """취업 후기 작성"""
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if user_type != "personal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="개인 사용자만 접근할 수 있습니다."
        )
    
    try:
        db_review = create_job_review(db, review, user_id)
        return db_review
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="후기 작성에 실패했습니다."
        )

@router.get("/", response_model=JobReviewListResponse)
def get_my_reviews(
    page: int = 1,
    page_size: int = 10,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """내 취업 후기 목록 조회"""
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if user_type != "personal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="개인 사용자만 접근할 수 있습니다."
        )
    
    validate_pagination_params(page, page_size)
    return get_user_job_reviews_paginated(db, user_id, page, page_size)

@router.get("/available-applications", response_model=List[CompanyApplicationResponse])
def get_available_applications_for_review(
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """후기 작성 가능한 지원서 목록 조회"""
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if user_type != "personal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="개인 사용자만 접근할 수 있습니다."
        )
    
    applications = get_completed_applications_without_review(db, user_id)
    return applications

@router.get("/public", response_model=PublicJobReviewListResponse)
def get_public_reviews(
    page: int = 1,
    page_size: int = 10,
    company_name: Optional[str] = None,
    same_school: bool = False,
    same_major: bool = False,
    experience_level: Optional[str] = None,
    overall_evaluation: Optional[str] = None,
    difficulty: Optional[str] = None,
    final_result: Optional[str] = None,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """다른 사용자들의 후기 목록 조회"""
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if user_type != "personal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="개인 사용자만 접근할 수 있습니다."
        )
    
    validate_pagination_params(page, page_size)
    
    try:
        return get_public_job_reviews_paginated(
            db=db,
            requesting_user_id=user_id,
            page=page,
            page_size=page_size,
            company_name=company_name,
            same_school=same_school,
            same_major=same_major,
            experience_level=experience_level,
            overall_evaluation=overall_evaluation,
            difficulty=difficulty,
            final_result=final_result
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.get("/{review_id}", response_model=JobReviewResponse)
def get_review_detail(
    review_id: int,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """취업 후기 상세 조회"""
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if user_type != "personal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="개인 사용자만 접근할 수 있습니다."
        )
    
    review = get_job_review(db, review_id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="후기를 찾을 수 없습니다."
        )
    
    if review.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="접근 권한이 없습니다."
        )
    
    return review

@router.put("/{review_id}", response_model=JobReviewResponse)
def update_review(
    review_id: int,
    review_update: JobReviewUpdate,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """취업 후기 수정"""
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if user_type != "personal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="개인 사용자만 접근할 수 있습니다."
        )
    
    updated_review = update_job_review(db, review_id, user_id, review_update)
    if not updated_review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="후기를 찾을 수 없습니다."
        )
    
    return updated_review

@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """취업 후기 삭제"""
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if user_type != "personal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="개인 사용자만 접근할 수 있습니다."
        )
    
    success = delete_job_review(db, review_id, user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="후기를 찾을 수 없습니다."
        )

@router.get("/application/{application_id}", response_model=JobReviewResponse)
def get_review_by_application(
    application_id: int,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """지원서 ID로 취업 후기 조회"""
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if user_type != "personal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="개인 사용자만 접근할 수 있습니다."
        )
    
    review = get_job_review_by_application(db, application_id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="해당 지원서에 대한 후기를 찾을 수 없습니다."
        )
    
    if review.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="접근 권한이 없습니다."
        )
    
    return review