from sqlalchemy.orm import Session
from models.company import CompanyLikesPersonal
from models.user import PersonalUser
from typing import List, Tuple, Optional
from fastapi import HTTPException, status

def get_company_likes_by_user(db: Session, user_id: str) -> List[CompanyLikesPersonal]:
    return db.query(CompanyLikesPersonal).filter(
        CompanyLikesPersonal.user_id == user_id
    ).order_by(CompanyLikesPersonal.created_at.desc()).all()

def get_company_likes_count_by_user(db: Session, user_id: str) -> int:
    return db.query(CompanyLikesPersonal).filter(
        CompanyLikesPersonal.user_id == user_id
    ).count()

def validate_and_get_personal_user(db: Session, user_id: str, user_type: str) -> PersonalUser:
    if user_type != "personal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="개인 사용자만 접근 가능합니다."
        )
    
    personal_user = db.query(PersonalUser).filter(
        PersonalUser.user_id == user_id
    ).first()
    
    if not personal_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="개인 사용자 정보를 찾을 수 없습니다."
        )
    
    return personal_user

def get_company_likes_with_count(db: Session, user_id: str) -> Tuple[List[CompanyLikesPersonal], int]:
    query = db.query(CompanyLikesPersonal).filter(
        CompanyLikesPersonal.user_id == user_id
    )
    
    total_count = query.count()
    
    company_likes = query.order_by(CompanyLikesPersonal.created_at.desc()).all()
    
    return company_likes, total_count