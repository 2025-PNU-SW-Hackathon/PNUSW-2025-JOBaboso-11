from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_
from typing import List, Optional
from models.company_application import CompanyApplication
from schema.company_application import (
    CompanyApplicationCreate, 
    CompanyApplicationUpdate, 
    ApplicationStatus
)

def create_company_application(
    db: Session, 
    application: CompanyApplicationCreate, 
    user_id: str
) -> CompanyApplication:
    """기업 지원 생성"""
    db_application = CompanyApplication(
        user_id=user_id,
        company_name=application.company_name,
        position=application.position,
        application_date=application.application_date,
        status="preparing_documents"  # 기본 상태
    )
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

def get_company_application(db: Session, application_id: int) -> Optional[CompanyApplication]:
    """기업 지원 단일 조회"""
    return db.query(CompanyApplication).filter(CompanyApplication.id == application_id).first()

def get_company_application_with_details(db: Session, application_id: int) -> Optional[CompanyApplication]:
    """기업 지원 상세 조회 (서류, 일정 포함)"""
    return (
        db.query(CompanyApplication)
        .options(
            joinedload(CompanyApplication.documents),
            joinedload(CompanyApplication.schedules)
        )
        .filter(CompanyApplication.id == application_id)
        .first()
    )

def get_user_company_applications(
    db: Session, 
    user_id: str, 
    skip: int = 0, 
    limit: int = 100
) -> List[CompanyApplication]:
    """사용자의 기업 지원 목록 조회"""
    return (
        db.query(CompanyApplication)
        .filter(CompanyApplication.user_id == user_id)
        .order_by(CompanyApplication.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

def get_user_company_applications_count(
    db: Session, 
    user_id: str
) -> int:
    """사용자의 기업 지원 총 개수 조회"""
    return (
        db.query(CompanyApplication)
        .filter(CompanyApplication.user_id == user_id)
        .count()
    )

def update_company_application(
    db: Session, 
    application_id: int, 
    user_id: str, 
    application_update: CompanyApplicationUpdate
) -> Optional[CompanyApplication]:
    """기업 지원 정보 수정"""
    db_application = db.query(CompanyApplication).filter(
        and_(
            CompanyApplication.id == application_id,
            CompanyApplication.user_id == user_id
        )
    ).first()
    
    if not db_application:
        return None
    
    update_data = application_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_application, field, value)
    
    db.commit()
    db.refresh(db_application)
    return db_application

def delete_company_application(
    db: Session, 
    application_id: int, 
    user_id: str
) -> bool:
    """기업 지원 삭제"""
    db_application = db.query(CompanyApplication).filter(
        and_(
            CompanyApplication.id == application_id,
            CompanyApplication.user_id == user_id
        )
    ).first()
    
    if not db_application:
        return False
    
    db.delete(db_application)
    db.commit()
    return True

def get_applications_by_status(
    db: Session, 
    user_id: str, 
    status: ApplicationStatus,
    skip: int = 0, 
    limit: int = 100
) -> List[CompanyApplication]:
    """상태별 기업 지원 조회"""
    return (
        db.query(CompanyApplication)
        .filter(
            and_(
                CompanyApplication.user_id == user_id,
                CompanyApplication.status == status
            )
        )
        .order_by(CompanyApplication.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )