from fastapi import APIRouter, HTTPException, Depends, status, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, case
from db.session import get_db
from models.user import User, PersonalUser, UniversityStaff
from models.spec import Education, Hope, Skill, Project, Activity, Certificate
from models.company_application import CompanyApplication
from schema.university_staff import (
    StudentListResponse, StudentAnonymizedInfo, CompanyPreferenceResponse, 
    CompanyPreferenceItem, StudentDetailResponse, StudentDetailInfo, ApplicationInfo,
    SkillInfo, ProjectInfo, ActivityInfo, CertificateInfo, StudentSpecs
)
from utils.jwt import verify_token
from typing import Optional
from datetime import datetime
import hashlib

router = APIRouter(prefix="/university-staff")
security = HTTPBearer()

@router.get("/students", response_model=StudentListResponse)
def get_anonymized_students(
    grade: Optional[int] = None,
    sort_by: Optional[str] = "success_rate",
    sort_order: Optional[str] = "desc",
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if not user_id:
        raise HTTPException(status_code=401, detail="유효하지 않은 토큰입니다.")
    
    if user_type != "university_staff":
        raise HTTPException(status_code=403, detail="교직원 권한이 필요합니다.")
    
    current_staff = db.query(UniversityStaff).filter(UniversityStaff.user_id == user_id).first()
    if not current_staff:
        raise HTTPException(status_code=404, detail="교직원 정보를 찾을 수 없습니다.")
    
    if not current_staff.univ_name:
        raise HTTPException(status_code=400, detail="교직원의 대학교 정보가 없습니다.")
    
    if not current_staff.Field:
        raise HTTPException(status_code=400, detail="교직원의 학과 정보가 없습니다.")
    
    query = db.query(
        PersonalUser.gender,
        Education.score,
        Education.status,
        Education.graduation_year,
        User.user_id
    ).join(
        User, PersonalUser.user_id == User.user_id
    ).join(
        Education, User.user_id == Education.user_id
    ).filter(
        PersonalUser.privacy_consent == True,
        Education.school_name == current_staff.univ_name,
        Education.major == current_staff.Field
    )
    
    results = query.all()
    
    student_data = []
    for result in results:
        applications = db.query(CompanyApplication).filter(
            CompanyApplication.user_id == result.user_id
        ).all()
        
        total_applications = len(applications)
        if total_applications == 0:
            success_rate = 0.0
        else:
            successful_applications = len([
                app for app in applications 
                if app.status == 'final_accepted'
            ])
            success_rate = (successful_applications / total_applications) * 100
        
        graduation_year = None
        if result.status == "졸업" and result.graduation_year:
            graduation_year = result.graduation_year
        
        # 익명화된 학생 ID 생성
        student_id = hashlib.sha256(f"{current_staff.user_id}:{result.user_id}".encode()).hexdigest()[:12]
        
        student_data.append(StudentAnonymizedInfo(
            student_id=student_id,
            gender=result.gender,
            score=result.score,
            total_score=result.score,
            status=result.status,
            graduation_year=graduation_year,
            success_rate=success_rate
        ))
    
    if sort_by == "success_rate":
        student_data.sort(
            key=lambda x: x.success_rate, 
            reverse=(sort_order == "desc")
        )
    elif sort_by == "recent_success":
        applications_with_dates = db.query(CompanyApplication).filter(
            CompanyApplication.status == 'final_accepted'
        ).order_by(CompanyApplication.updated_at.desc()).all()
        
        user_success_dates = {}
        for app in applications_with_dates:
            if app.user_id not in user_success_dates:
                user_success_dates[app.user_id] = app.updated_at
        
        def get_success_date(student):
            user_id = next((r.user_id for r in results 
                           if r.gender == student.gender and r.score == student.score), None)
            return user_success_dates.get(user_id, datetime.min)
        
        student_data.sort(
            key=get_success_date,
            reverse=(sort_order == "desc")
        )
    
    return StudentListResponse(
        students=student_data,
        total_count=len(student_data)
    )

@router.get("/company-preferences", response_model=CompanyPreferenceResponse)
def get_company_preferences(
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if not user_id:
        raise HTTPException(status_code=401, detail="유효하지 않은 토큰입니다.")
    
    if user_type != "university_staff":
        raise HTTPException(status_code=403, detail="교직원 권한이 필요합니다.")
    
    current_staff = db.query(UniversityStaff).filter(UniversityStaff.user_id == user_id).first()
    if not current_staff:
        raise HTTPException(status_code=404, detail="교직원 정보를 찾을 수 없습니다.")
    
    if not current_staff.univ_name:
        raise HTTPException(status_code=400, detail="교직원의 대학교 정보가 없습니다.")
    
    if not current_staff.Field:
        raise HTTPException(status_code=400, detail="교직원의 학과 정보가 없습니다.")
    
    # 해당 대학교/학과 학생들의 목표 기업 집계
    preferences_query = db.query(
        Hope.company,
        func.count(Hope.company).label('count')
    ).join(
        User, Hope.user_id == User.user_id
    ).join(
        PersonalUser, User.user_id == PersonalUser.user_id
    ).join(
        Education, User.user_id == Education.user_id
    ).filter(
        PersonalUser.privacy_consent == True,
        Education.school_name == current_staff.univ_name,
        Education.major == current_staff.Field,
        Hope.company.isnot(None),
        Hope.company != ""
    ).group_by(
        Hope.company
    ).order_by(
        func.count(Hope.company).desc()
    ).all()
    
    total_students = sum(pref.count for pref in preferences_query)
    
    if total_students == 0:
        return CompanyPreferenceResponse(
            preferences=[],
            total_students=0
        )
    
    preferences_data = []
    for pref in preferences_query:
        percentage = round((pref.count / total_students) * 100, 1)
        preferences_data.append(CompanyPreferenceItem(
            company=pref.company,
            count=pref.count,
            percentage=percentage
        ))
    
    return CompanyPreferenceResponse(
        preferences=preferences_data,
        total_students=total_students
    )

@router.get("/student/{student_id}", response_model=StudentDetailResponse)
def get_student_detail(
    student_id: str,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if not user_id:
        raise HTTPException(status_code=401, detail="유효하지 않은 토큰입니다.")
    
    if user_type != "university_staff":
        raise HTTPException(status_code=403, detail="교직원 권한이 필요합니다.")
    
    current_staff = db.query(UniversityStaff).filter(UniversityStaff.user_id == user_id).first()
    if not current_staff:
        raise HTTPException(status_code=404, detail="교직원 정보를 찾을 수 없습니다.")
    
    if not current_staff.univ_name or not current_staff.Field:
        raise HTTPException(status_code=400, detail="교직원의 대학교/학과 정보가 없습니다.")
    
    students_query = db.query(
        PersonalUser.gender,
        Education.score,
        Education.status,
        Education.graduation_year,
        User.user_id
    ).join(
        User, PersonalUser.user_id == User.user_id
    ).join(
        Education, User.user_id == Education.user_id
    ).filter(
        PersonalUser.privacy_consent == True,
        Education.school_name == current_staff.univ_name,
        Education.major == current_staff.Field
    ).all()
    
    target_user_id = None
    target_student = None
    
    for student in students_query:
        generated_id = hashlib.sha256(f"{current_staff.user_id}:{student.user_id}".encode()).hexdigest()[:12]
        if generated_id == student_id:
            target_user_id = student.user_id
            target_student = student
            break
    
    if not target_user_id:
        raise HTTPException(status_code=404, detail="해당 학생을 찾을 수 없습니다.")
    
    # 지원 내역 조회
    applications = db.query(CompanyApplication).filter(
        CompanyApplication.user_id == target_user_id
    ).order_by(CompanyApplication.application_date.desc()).all()
    
    # 희망 정보 조회
    hope = db.query(Hope).filter(Hope.user_id == target_user_id).first()
    
    # 스펙 정보 조회
    skills = db.query(Skill).filter(Skill.user_id == target_user_id).all()
    projects = db.query(Project).filter(Project.user_id == target_user_id).all()
    activities = db.query(Activity).filter(Activity.user_id == target_user_id).all()
    certificates = db.query(Certificate).filter(Certificate.user_id == target_user_id).all()
    
    # 지원 정보 가공
    application_infos = []
    successful_count = 0
    
    for app in applications:
        is_success = app.status == 'final_accepted'
        if is_success:
            successful_count += 1
            
        application_infos.append(ApplicationInfo(
            company_name=app.company_name,
            position=app.position,
            application_date=app.application_date,
            status=app.status,
            success=is_success
        ))
    
    # 합격률 계산
    total_applications = len(applications)
    success_rate = (successful_count / total_applications * 100) if total_applications > 0 else 0.0
    
    # 졸업년도 처리
    graduation_year = None
    if target_student.status == "졸업" and target_student.graduation_year:
        graduation_year = target_student.graduation_year
    
    # 스펙 정보 가공
    skill_infos = [SkillInfo(skill_name=skill.skill_name) for skill in skills]
    
    project_infos = [ProjectInfo(
        project_name=project.project_name,
        description=project.description,
        start_date=project.start_date,
        end_date=project.end_date
    ) for project in projects]
    
    activity_infos = [ActivityInfo(
        type=activity.type.value if activity.type else None,
        title=activity.title,
        detail=activity.detail,
        date=activity.date
    ) for activity in activities]
    
    certificate_infos = [CertificateInfo(
        cert_name=certificate.cert_name,
        score=certificate.score,
        date=certificate.date
    ) for certificate in certificates]
    
    specs = StudentSpecs(
        skills=skill_infos,
        projects=project_infos,
        activities=activity_infos,
        certificates=certificate_infos
    )
    
    student_detail = StudentDetailInfo(
        student_id=student_id,
        gender=target_student.gender,
        score=target_student.score,
        status=target_student.status,
        graduation_year=graduation_year,
        success_rate=round(success_rate, 1),
        total_applications=total_applications,
        successful_applications=successful_count,
        applications=application_infos,
        target_company=hope.company if hope else None,
        target_job=hope.job if hope else None,
        target_region=hope.region if hope else None,
        specs=specs
    )
    
    return StudentDetailResponse(student=student_detail)