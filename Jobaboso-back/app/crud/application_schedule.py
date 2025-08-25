from sqlalchemy.orm import Session
from sqlalchemy import and_, extract, func
from typing import List, Optional
from datetime import datetime
from models.application_schedule import ApplicationSchedule
from models.company_application import CompanyApplication
from schema.application_schedule import ApplicationScheduleCreate, ApplicationScheduleUpdate

def create_application_schedule(
    db: Session,
    schedule: ApplicationScheduleCreate,
    application_id: int
) -> ApplicationSchedule:
    """일정 생성"""
    db_schedule = ApplicationSchedule(
        application_id=application_id,
        schedule_type=schedule.schedule_type,
        start_date=schedule.start_date,
        end_date=schedule.end_date,
        notes=schedule.notes
    )
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

def get_application_schedules(
    db: Session,
    application_id: int
) -> List[ApplicationSchedule]:
    """특정 지원서의 일정 목록 조회"""
    return (
        db.query(ApplicationSchedule)
        .filter(ApplicationSchedule.application_id == application_id)
        .order_by(ApplicationSchedule.start_date.asc())
        .all()
    )

def get_application_schedule(
    db: Session,
    schedule_id: int
) -> Optional[ApplicationSchedule]:
    """일정 단일 조회"""
    return db.query(ApplicationSchedule).filter(ApplicationSchedule.id == schedule_id).first()

def update_application_schedule(
    db: Session,
    schedule_id: int,
    application_id: int,
    schedule_update: ApplicationScheduleUpdate
) -> Optional[ApplicationSchedule]:
    """일정 수정"""
    db_schedule = db.query(ApplicationSchedule).filter(
        and_(
            ApplicationSchedule.id == schedule_id,
            ApplicationSchedule.application_id == application_id
        )
    ).first()
    
    if not db_schedule:
        return None
    
    update_data = schedule_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_schedule, field, value)
    
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

def delete_application_schedule(
    db: Session,
    schedule_id: int,
    application_id: int
) -> bool:
    """일정 삭제"""
    db_schedule = db.query(ApplicationSchedule).filter(
        and_(
            ApplicationSchedule.id == schedule_id,
            ApplicationSchedule.application_id == application_id
        )
    ).first()
    
    if not db_schedule:
        return False
    
    db.delete(db_schedule)
    db.commit()
    return True

def mark_schedule_completed(
    db: Session,
    schedule_id: int,
    application_id: int,
    is_completed: bool = True
) -> Optional[ApplicationSchedule]:
    """일정 완료 처리"""
    db_schedule = db.query(ApplicationSchedule).filter(
        and_(
            ApplicationSchedule.id == schedule_id,
            ApplicationSchedule.application_id == application_id
        )
    ).first()
    
    if not db_schedule:
        return None
    
    db_schedule.is_completed = is_completed
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

def get_schedules_by_type(
    db: Session,
    application_id: int,
    schedule_type: str
) -> List[ApplicationSchedule]:
    """일정 타입별 조회"""
    return (
        db.query(ApplicationSchedule)
        .filter(
            and_(
                ApplicationSchedule.application_id == application_id,
                ApplicationSchedule.schedule_type == schedule_type
            )
        )
        .order_by(ApplicationSchedule.start_date.asc())
        .all()
    )

def get_user_schedules_by_month(
    db: Session,
    user_id: str,
    year: int,
    month: int
) -> List[tuple]:
    """사용자의 특정 월 일정 조회"""
    return (
        db.query(
            CompanyApplication.company_name,
            ApplicationSchedule.schedule_type,
            ApplicationSchedule.start_date,
            ApplicationSchedule.end_date,
            ApplicationSchedule.notes
        )
        .join(CompanyApplication, ApplicationSchedule.application_id == CompanyApplication.id)
        .filter(
            and_(
                CompanyApplication.user_id == user_id,
                extract('year', ApplicationSchedule.start_date) == year,
                extract('month', ApplicationSchedule.start_date) == month
            )
        )
        .order_by(ApplicationSchedule.start_date.asc())
        .all()
    )