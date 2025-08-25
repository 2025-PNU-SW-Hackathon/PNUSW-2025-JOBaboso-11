from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_, func
from typing import List, Optional, Tuple
from models.job_review import JobReview, JobPosition, InterviewQuestion
from models.company_application import CompanyApplication
from models.user import PersonalUser
from models.spec import Education
from schema.job_review import JobReviewCreate, JobReviewUpdate, JobReviewResponse, JobReviewListResponse, JobReviewListItem, PublicJobReviewListResponse, PublicJobReviewListItem
from fastapi import HTTPException, status

def create_job_review(
    db: Session, 
    review: JobReviewCreate, 
    user_id: str
) -> JobReviewResponse:
    # application_id가 있는 경우 검증
    if review.application_id:
        application = db.query(CompanyApplication).filter(
            and_(
                CompanyApplication.id == review.application_id,
                CompanyApplication.user_id == user_id
            )
        ).first()
        
        if not application:
            raise ValueError("해당 지원서를 찾을 수 없습니다.")
        
        # 이미 후기가 존재하는지 확인
        existing_review = db.query(JobReview).filter(
            JobReview.application_id == review.application_id
        ).first()
        
        if existing_review:
            raise ValueError("이미 해당 지원에 대한 후기가 작성되었습니다.")
    
    # JobReview 생성
    db_review = JobReview(
        user_id=user_id,
        application_id=review.application_id,
        company_name=review.company_name,
        experience_level=review.experience_level,
        interview_date=review.interview_date,
        overall_evaluation=review.overall_evaluation,
        difficulty=review.difficulty,
        interview_review=review.interview_review,
        final_result=review.final_result
    )
    
    db.add(db_review)
    db.flush()  
    
    # JobPosition들 생성
    for position_data in review.positions:
        db_position = JobPosition(
            job_review_id=db_review.id,
            position=position_data.position
        )
        db.add(db_position)
    
    # InterviewQuestion들 생성
    for question_data in review.interview_questions:
        db_question = InterviewQuestion(
            job_review_id=db_review.id,
            question=question_data.question
        )
        db.add(db_question)
    
    db.commit()
    db.refresh(db_review)
    
    return db.query(JobReview).options(
        joinedload(JobReview.positions),
        joinedload(JobReview.interview_questions)
    ).filter(JobReview.id == db_review.id).first()

def get_job_review(db: Session, review_id: int) -> Optional[JobReview]:
    return db.query(JobReview).options(
        joinedload(JobReview.positions),
        joinedload(JobReview.interview_questions)
    ).filter(JobReview.id == review_id).first()

def get_job_review_by_application(db: Session, application_id: int) -> Optional[JobReview]:
    return db.query(JobReview).options(
        joinedload(JobReview.positions),
        joinedload(JobReview.interview_questions)
    ).filter(JobReview.application_id == application_id).first()

def get_user_job_reviews_paginated(
    db: Session, 
    user_id: str, 
    page: int, 
    page_size: int
) -> JobReviewListResponse:
    skip = (page - 1) * page_size
    
    # 후기 목록 조회
    reviews_query = db.query(JobReview).options(
        joinedload(JobReview.positions)
    ).filter(JobReview.user_id == user_id).order_by(JobReview.created_at.desc())
    
    total_count = reviews_query.count()
    reviews = reviews_query.offset(skip).limit(page_size).all()
    
    # 응답 데이터 변환
    review_items = []
    for review in reviews:
        positions = [pos.position for pos in review.positions]
        review_items.append(JobReviewListItem(
            id=review.id,
            user_id=review.user_id,
            application_id=review.application_id,
            company_name=review.company_name,
            positions=positions,
            final_result=review.final_result,
            interview_date=review.interview_date,
            created_at=review.created_at
        ))
    
    total_pages = (total_count + page_size - 1) // page_size
    
    return JobReviewListResponse(
        total_count=total_count,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        reviews=review_items
    )

def get_public_job_reviews_paginated(
    db: Session,
    requesting_user_id: str,
    page: int,
    page_size: int,
    company_name: Optional[str] = None,
    same_school: bool = False,
    same_major: bool = False,
    experience_level: Optional[str] = None,
    overall_evaluation: Optional[str] = None,
    difficulty: Optional[str] = None,
    final_result: Optional[str] = None
) -> PublicJobReviewListResponse:
    skip = (page - 1) * page_size
    
    # 기본 쿼리
    query = db.query(JobReview).options(
        joinedload(JobReview.positions)
    ).join(PersonalUser, JobReview.user_id == PersonalUser.user_id)
    
    # 본인 후기는 제외
    query = query.filter(JobReview.user_id != requesting_user_id)
    
    # 필터링
    if company_name:
        query = query.filter(JobReview.company_name.ilike(f"%{company_name}%"))
    
    if experience_level:
        query = query.filter(JobReview.experience_level == experience_level)
    
    if overall_evaluation:
        query = query.filter(JobReview.overall_evaluation == overall_evaluation)
    
    if difficulty:
        query = query.filter(JobReview.difficulty == difficulty)
    
    if final_result:
        query = query.filter(JobReview.final_result == final_result)
    
    # 같은 학교/전공 필터
    if same_school or same_major:
        requesting_user = db.query(PersonalUser).filter(PersonalUser.user_id == requesting_user_id).first()
        if requesting_user:
            requesting_education = db.query(Education).filter(Education.user_id == requesting_user_id).first()
            if requesting_education:
                if same_school and same_major:
                    query = query.join(Education, PersonalUser.user_id == Education.user_id).filter(
                        and_(
                            Education.school_name == requesting_education.school_name,
                            Education.major == requesting_education.major
                        )
                    )
                elif same_school:
                    query = query.join(Education, PersonalUser.user_id == Education.user_id).filter(
                        Education.school_name == requesting_education.school_name
                    )
                elif same_major:
                    query = query.join(Education, PersonalUser.user_id == Education.user_id).filter(
                        Education.major == requesting_education.major
                    )
    
    total_count = query.count()
    reviews = query.order_by(JobReview.created_at.desc()).offset(skip).limit(page_size).all()
    
    # 응답 데이터 변환
    review_items = []
    for review in reviews:
        positions = [pos.position for pos in review.positions]
        
        # 작성자의 학교/전공 정보
        user_education = db.query(Education).filter(Education.user_id == review.user_id).first()
        school_name = user_education.school_name if user_education else None
        major = user_education.major if user_education else None
        
        review_items.append(PublicJobReviewListItem(
            id=review.id,
            company_name=review.company_name,
            positions=positions,
            experience_level=review.experience_level,
            overall_evaluation=review.overall_evaluation,
            difficulty=review.difficulty,
            final_result=review.final_result,
            review_length=len(review.interview_review),
            interview_date=review.interview_date,
            school_name=school_name,
            major=major,
            created_at=review.created_at
        ))
    
    total_pages = (total_count + page_size - 1) // page_size
    
    return PublicJobReviewListResponse(
        total_count=total_count,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        reviews=review_items
    )

def update_job_review(
    db: Session, 
    review_id: int, 
    user_id: str, 
    review_update: JobReviewUpdate
) -> Optional[JobReview]:
    db_review = db.query(JobReview).filter(
        and_(
            JobReview.id == review_id,
            JobReview.user_id == user_id
        )
    ).first()
    
    if not db_review:
        return None
    
    update_data = review_update.dict(exclude_unset=True, exclude={'positions', 'interview_questions'})
    for field, value in update_data.items():
        setattr(db_review, field, value)
    
    if review_update.positions is not None:
        db.query(JobPosition).filter(JobPosition.job_review_id == review_id).delete()
        
        for position_data in review_update.positions:
            db_position = JobPosition(
                job_review_id=review_id,
                position=position_data.position
            )
            db.add(db_position)
    
    if review_update.interview_questions is not None:
        db.query(InterviewQuestion).filter(InterviewQuestion.job_review_id == review_id).delete()
        
        for question_data in review_update.interview_questions:
            db_question = InterviewQuestion(
                job_review_id=review_id,
                question=question_data.question
            )
            db.add(db_question)
    
    db.commit()
    db.refresh(db_review)
    
    return db.query(JobReview).options(
        joinedload(JobReview.positions),
        joinedload(JobReview.interview_questions)
    ).filter(JobReview.id == review_id).first()

def delete_job_review(db: Session, review_id: int, user_id: str) -> bool:
    db_review = db.query(JobReview).filter(
        and_(
            JobReview.id == review_id,
            JobReview.user_id == user_id
        )
    ).first()
    
    if not db_review:
        return False
    
    db.delete(db_review)
    db.commit()
    return True

def get_completed_applications_without_review(db: Session, user_id: str) -> List[CompanyApplication]:
    completed_statuses = [
        'documents_passed', 'documents_failed', 'test_passed', 'test_failed',
        'assignment_passed', 'assignment_failed', 'interview_passed', 'interview_failed',
        'final_accepted', 'final_rejected', 'offer_declined'
    ]
    
    reviewed_application_ids = db.query(JobReview.application_id).filter(
        JobReview.application_id.isnot(None)
    ).subquery()
    
    return db.query(CompanyApplication).filter(
        and_(
            CompanyApplication.user_id == user_id,
            CompanyApplication.status.in_(completed_statuses),
            CompanyApplication.id.notin_(reviewed_application_ids)
        )
    ).order_by(CompanyApplication.updated_at.desc()).all()