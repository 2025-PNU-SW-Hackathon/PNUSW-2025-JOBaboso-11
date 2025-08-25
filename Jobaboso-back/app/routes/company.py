from fastapi import APIRouter, HTTPException, Depends, status, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from db.session import get_db
from schema.company import (
    PersonalUserResponse, PersonalUserListResponse,
    CompanyLikeCreate, CompanyLikeResponse, CompanyLikeListResponse
)
from crud.company import (
    get_random_personal_users_with_details, get_total_personal_users_count,
    create_company_like, get_company_likes, get_company_likes_count, delete_company_like
)
from utils.jwt import verify_token
from models.user import User

router = APIRouter(
    prefix="/company",
    tags=["company"]
)

security = HTTPBearer()


@router.get("/personal-users/random", response_model=PersonalUserListResponse)
def get_random_personal_users_list(
    limit: int = 6,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    # JWT 토큰 인증
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if not user_id or user_type != "company":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="회사 직원만 접근할 수 있습니다."
        )
    
    if limit > 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="최대 6명까지만 조회할 수 있습니다."
        )
    
    # 랜덤 개인 사용자 상세 정보 조회
    users_data = get_random_personal_users_with_details(db, limit)
    
    # 전체 개인 사용자 수
    total_count = get_total_personal_users_count(db)
    
    # 응답 데이터 변환
    user_responses = []
    for user_data in users_data:
        user_response = PersonalUserResponse(
            user_id=user_data["user_id"],
            name=user_data["name"],
            gender=user_data["gender"],
            age=user_data["age"],
            major=user_data["major"],
            job=user_data["job"],
            career_period=user_data["career_period"],
            skills=user_data["skills"]
        )
        user_responses.append(user_response)
    
    return PersonalUserListResponse(
        users=user_responses,
        total_count=total_count
    )



# 찜하기 API
@router.post("/likes", status_code=201)
def create_like(
    like_data: CompanyLikeCreate,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):

    # JWT 토큰 인증
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if not user_id or user_type != "company":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="회사 직원만 접근할 수 있습니다."
        )
    
    current_user = db.query(User).filter(User.user_id == user_id).first()
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="사용자 정보를 찾을 수 없습니다."
        )
    hr_manager_name = current_user.name
    
    try:
        company_like = create_company_like(
            db=db,
            company_user_id=user_id,
            target_user_id=like_data.target_user_id,
            message=like_data.message,
            contact_email=like_data.contact_email,
            contact_phone=like_data.contact_phone,
            suggested_position=like_data.suggested_position,
            hr_manager_name=hr_manager_name
        )
        
        return {
            "message": "찜하기가 완료되었습니다.",
            "like_id": company_like.id
        }
    
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="찜하기 처리 중 오류가 발생했습니다."
        )

# 찜한 사용자 목록 조회 API
@router.get("/likes", response_model=CompanyLikeListResponse)
def get_likes_list(
    page: int = 1,
    limit: int = 6,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    # JWT 토큰 인증
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if not user_id or user_type != "company":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="회사 직원만 접근할 수 있습니다."
        )
    
    if page < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="페이지 번호는 1 이상이어야 합니다."
        )
    
    if limit > 24:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="최대 24개까지만 조회할 수 있습니다."
        )
    
    # page를 offset으로 변환 (page 1 = offset 0)
    offset = (page - 1) * limit
    
    # 찜 목록 조회
    likes_data = get_company_likes(db, user_id, limit, offset)
    
    # 전체 찜 수
    total_count = get_company_likes_count(db, user_id)
    
    # 페이지네이션 계산
    total_pages = (total_count + limit - 1) // limit if total_count > 0 else 1  
    
    # 페이지 번호 검증
    if page > total_pages and total_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"페이지 번호가 범위를 벗어났습니다. (최대: {total_pages})"
        )
    
    current_page = page 
    
    # 응답 데이터 변환
    like_responses = []
    for like_data in likes_data:
        like_response = CompanyLikeResponse(
            id=like_data["id"],
            target_user_id=like_data["target_user_id"],
            target_user_name=like_data["target_user_name"],
            message=like_data["message"],
            contact_email=like_data["contact_email"],
            contact_phone=like_data["contact_phone"],
            suggested_position=like_data["suggested_position"],
            company_name=like_data["company_name"],
            hr_manager_name=like_data["hr_manager_name"],
            created_at=like_data["created_at"]
        )
        like_responses.append(like_response)
    
    return CompanyLikeListResponse(
        likes=like_responses,
        total_count=total_count,
        page_size=limit,
        current_page=current_page,
        total_pages=total_pages
    )

# 찜 취소 API
@router.delete("/likes/{like_id}")
def delete_like(
    like_id: int,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    # JWT 토큰 인증
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if not user_id or user_type != "company":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="회사 직원만 접근할 수 있습니다."
        )
    
    success = delete_company_like(db, user_id, like_id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="찜 정보를 찾을 수 없거나 삭제 권한이 없습니다."
        )
    
    return {"message": "찜이 취소되었습니다."} 