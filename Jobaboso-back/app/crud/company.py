from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from models.user import User, PersonalUser, CompanyUser
from models.company import CompanyLikesPersonal, Company
from models.spec import Skill, Activity, Education, Hope, ActivityTypeEnum
from typing import List, Dict, Any
from datetime import datetime, date

def get_random_personal_users_with_details(db: Session, limit: int = 6) -> List[Dict[str, Any]]:
    # 개인 사용자들을 랜덤으로 가져오기
    personal_users = (
        db.query(PersonalUser)
        .join(User, PersonalUser.user_id == User.user_id)
        .filter(User.user_type == 'personal')
        .order_by(func.rand()) 
        .limit(limit)
        .options(
            joinedload(PersonalUser.user)
        )
        .all()
    )
    
    result = []
    for personal_user in personal_users:
        user_data = _get_user_complete_data(db, personal_user)
        result.append(user_data)
    
    return result

def _get_user_complete_data(db: Session, personal_user: PersonalUser) -> Dict[str, Any]:
    user_id = personal_user.user_id
    
    # 나이 계산
    age = None
    if personal_user.birth_date:
        today = date.today()
        age = today.year - personal_user.birth_date.year
        if today.month < personal_user.birth_date.month or \
           (today.month == personal_user.birth_date.month and today.day < personal_user.birth_date.day):
            age -= 1
    
    # 학과 정보
    education = db.query(Education).filter(Education.user_id == user_id).first()
    major = education.major if education else None
    
    # 희망 직군
    hope = db.query(Hope).filter(Hope.user_id == user_id).first()
    job = hope.job if hope else None
    
    # 경력 기간 (인턴 경험들)
    intern_activities = (
        db.query(Activity)
        .filter(Activity.user_id == user_id, Activity.type == ActivityTypeEnum.intern)
        .all()
    )
    career_period = _calculate_career_period(intern_activities)
    
    # 스킬 2개
    skills = (
        db.query(Skill)
        .filter(Skill.user_id == user_id)
        .limit(2)
        .all()
    )
    skill_names = [skill.skill_name for skill in skills if skill.skill_name]
    
    return {
        "user_id": user_id,
        "name": personal_user.user.name,
        "gender": personal_user.gender,
        "age": age,
        "major": major,
        "job": job,
        "career_period": career_period,
        "skills": skill_names
    }

def _calculate_career_period(intern_activities: List[Activity]) -> str:
    if not intern_activities:
        return "경력 없음"
    
    # 인턴 경험 개수와 대략적인 기간 계산
    total_experiences = len(intern_activities)
    
    if total_experiences == 1:
        return "인턴 1회"
    elif total_experiences == 2:
        return "인턴 2회"
    elif total_experiences >= 3:
        return "인턴 3회 이상"
    
    return "경력 있음"


def get_total_personal_users_count(db: Session) -> int:
    return (
        db.query(PersonalUser)
        .join(User, PersonalUser.user_id == User.user_id)
        .filter(User.user_type == 'personal')
        .count()
    )



def get_company_id_by_user_id(db: Session, user_id: str) -> int:
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        return None
    
    company_user = db.query(CompanyUser).filter(CompanyUser.user_id == user_id).first()
    return company_user.company_id if company_user else None

def create_company_like(db: Session, company_user_id: str, target_user_id: str, message: str, 
                       contact_email: str = None, contact_phone: str = None, 
                       suggested_position: str = None, hr_manager_name: str = None) -> CompanyLikesPersonal:
    # 회사 ID 가져오기
    company_id = get_company_id_by_user_id(db, company_user_id)
    if not company_id:
        raise ValueError("유효한 회사 직원이 아닙니다.")
    
    # 회사 정보 가져오기 (항상 자동으로 조회)
    company = db.query(Company).filter(Company.id == company_id).first()
    if not company:
        raise ValueError("회사 정보를 찾을 수 없습니다.")
    company_name = company.company_name
    
    # 대상 사용자가 존재하는지 확인
    target_personal_user = (
        db.query(PersonalUser)
        .join(User, PersonalUser.user_id == User.user_id)
        .filter(User.user_id == target_user_id, User.user_type == 'personal')
        .first()
    )
    if not target_personal_user:
        raise ValueError("대상 사용자를 찾을 수 없습니다.")
    
    # 이미 찜했는지 확인
    existing_like = (
        db.query(CompanyLikesPersonal)
        .filter(
            CompanyLikesPersonal.company_id == company_id,
            CompanyLikesPersonal.user_id == target_user_id
        )
        .first()
    )
    if existing_like:
        raise ValueError("이미 찜한 사용자입니다.")
    
    # 찜 생성
    company_like = CompanyLikesPersonal(
        company_id=company_id,
        user_id=target_user_id,
        message=message,
        contact_email=contact_email,
        contact_phone=contact_phone,
        suggested_position=suggested_position,
        company_name=company_name,
        hr_manager_name=hr_manager_name,
        created_at=datetime.now()
    )
    
    db.add(company_like)
    db.commit()
    db.refresh(company_like)
    return company_like

def get_company_likes(db: Session, company_user_id: str, limit: int = 6, offset: int = 0) -> List[Dict[str, Any]]:
    company_id = get_company_id_by_user_id(db, company_user_id)
    if not company_id:
        return []
    
    likes = (
        db.query(CompanyLikesPersonal)
        .filter(CompanyLikesPersonal.company_id == company_id)
        .order_by(CompanyLikesPersonal.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )
    
    result = []
    for like in likes:
        target_user = db.query(User).filter(User.user_id == like.user_id).first()
        target_name = target_user.name if target_user else "알 수 없음"
        
        result.append({
            "id": like.id,
            "target_user_id": like.user_id,
            "target_user_name": target_name,
            "message": like.message,
            "contact_email": like.contact_email,
            "contact_phone": like.contact_phone,
            "suggested_position": like.suggested_position,
            "company_name": like.company_name,
            "hr_manager_name": like.hr_manager_name,
            "created_at": like.created_at.strftime("%Y-%m-%d %H:%M:%S") if like.created_at else None
        })
    
    return result

def get_company_likes_count(db: Session, company_user_id: str) -> int:
    company_id = get_company_id_by_user_id(db, company_user_id)
    if not company_id:
        return 0
    
    return (
        db.query(CompanyLikesPersonal)
        .filter(CompanyLikesPersonal.company_id == company_id)
        .count()
    )

def delete_company_like(db: Session, company_user_id: str, like_id: int) -> bool:
    company_id = get_company_id_by_user_id(db, company_user_id)
    if not company_id:
        return False
    
    like = (
        db.query(CompanyLikesPersonal)
        .filter(
            CompanyLikesPersonal.id == like_id,
            CompanyLikesPersonal.company_id == company_id
        )
        .first()
    )
    
    if not like:
        return False
    
    db.delete(like)
    db.commit()
    return True 