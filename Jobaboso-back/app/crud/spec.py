from sqlalchemy.orm import Session, selectinload
from models.spec import Skill, Project, Activity, Certificate, Education, Hope
from models.user import PersonalUser, User
from schema.spec import SpecCreateUpdate, PersonalSpecAll, PublicSpecAll

def create_or_update_all_spec(db: Session, spec_data: SpecCreateUpdate, user_id: str):
    # 기존 데이터 삭제
    db.query(Skill).filter(Skill.user_id == user_id).delete()
    db.query(Project).filter(Project.user_id == user_id).delete()
    db.query(Activity).filter(Activity.user_id == user_id).delete()
    db.query(Certificate).filter(Certificate.user_id == user_id).delete()
    db.query(Education).filter(Education.user_id == user_id).delete()
    db.query(Hope).filter(Hope.user_id == user_id).delete()
    db.commit()

    # 새 데이터 저장
    for skill in spec_data.skills or []:
        db_skill = Skill(user_id=user_id, skill_name=skill.skill_name)
        db.add(db_skill)
    for project in spec_data.projects or []:
        db_project = Project(user_id=user_id, project_name=project.project_name, description=project.description, start_date=project.start_date, end_date=project.end_date)
        db.add(db_project)
    for activity in spec_data.activities or []:
        db_activity = Activity(user_id=user_id, type=activity.type.value if activity.type else None, title=activity.title, detail=activity.detail, date=activity.activity_date)
        db.add(db_activity)
    for certificate in spec_data.certificates or []:
        db_certificate = Certificate(user_id=user_id, cert_name=certificate.cert_name, score=certificate.score, date=certificate.certificate_date)
        db.add(db_certificate)
    if spec_data.education:
        edu = spec_data.education
        db_education = Education(user_id=user_id, school_name=edu.school_name, major=edu.major, admission_year=edu.admission_year, graduation_year=edu.graduation_year, status=edu.status, score=edu.score)
        db.add(db_education)
    if spec_data.hope:
        hope = spec_data.hope
        db_hope = Hope(user_id=user_id, company=hope.company, job=hope.job, region=hope.region)
        db.add(db_hope)
    db.commit()
    return {"msg": "스펙이 성공적으로 저장되었습니다."}

def get_all_spec(db: Session, user_id: str):
    user = db.query(User).options(
        selectinload(User.skills),
        selectinload(User.projects),
        selectinload(User.activities),
        selectinload(User.certificates),
        selectinload(User.educations),
        selectinload(User.hopes),
        selectinload(User.personaluser)
    ).filter(User.user_id == user_id).first()
    
    if not user:
        # 사용자가 없으면 빈 데이터 반환
        return PersonalSpecAll(
            personal_info=None,
            skills=[], projects=[], activities=[], 
            certificates=[], education=None, hope=None
        )
    

    from schema.spec import Skill as SkillSchema, Project as ProjectSchema, Activity as ActivitySchema
    from schema.spec import Certificate as CertificateSchema, Education as EducationSchema, Hope as HopeSchema
    from schema.spec import PersonalInfo
    
    # 개인정보 추가
    personal_info = PersonalInfo(
        name=user.name,
        phone=user.phone,
        email=user.email,
        birth_date=user.personaluser.birth_date if user.personaluser else None,
        gender=user.personaluser.gender if user.personaluser else None,
        profile_addr=user.personaluser.profile_addr if user.personaluser else None
    )
    
    skills_data = [SkillSchema(skill_name=skill.skill_name) for skill in user.skills]
    projects_data = [ProjectSchema(
        project_name=project.project_name,
        description=project.description,
        start_date=project.start_date,
        end_date=project.end_date
    ) for project in user.projects]
    activities_data = [ActivitySchema(
        type=activity.type,
        title=activity.title,
        detail=activity.detail,
        activity_date=activity.date
    ) for activity in user.activities]
    certificates_data = [CertificateSchema(
        cert_name=certificate.cert_name,
        score=certificate.score,
        certificate_date=certificate.date
    ) for certificate in user.certificates]
    
    education_data = None
    if user.educations:
        education = user.educations[0]
        education_data = EducationSchema(
            school_name=education.school_name,
            major=education.major,
            admission_year=education.admission_year,
            graduation_year=education.graduation_year,
            status=education.status,
            score=education.score
        )
    
    hope_data = None
    if user.hopes:
        hope = user.hopes[0]
        hope_data = HopeSchema(
            company=hope.company,
            job=hope.job,
            region=hope.region
        )
    
    return PersonalSpecAll(
        personal_info=personal_info,
        skills=skills_data,
        projects=projects_data,
        activities=activities_data,
        certificates=certificates_data,
        education=education_data,
        hope=hope_data
    )

def get_public_spec(db: Session, user_id: str):
    user = db.query(User).options(
        selectinload(User.skills),
        selectinload(User.projects),
        selectinload(User.activities),
        selectinload(User.certificates),
        selectinload(User.educations),
        selectinload(User.hopes)
    ).filter(User.user_id == user_id).first()
    
    if not user:
        return PublicSpecAll(
            skills=[], projects=[], activities=[], 
            certificates=[], education=None, hope=None
        )
    
    from schema.spec import Skill as SkillSchema, Project as ProjectSchema, Activity as ActivitySchema
    from schema.spec import Certificate as CertificateSchema, Education as EducationSchema, Hope as HopeSchema
    
    skills_data = [SkillSchema(skill_name=skill.skill_name) for skill in user.skills]
    projects_data = [ProjectSchema(
        project_name=project.project_name,
        description=project.description,
        start_date=project.start_date,
        end_date=project.end_date
    ) for project in user.projects]
    activities_data = [ActivitySchema(
        type=activity.type,
        title=activity.title,
        detail=activity.detail,
        activity_date=activity.date
    ) for activity in user.activities]
    certificates_data = [CertificateSchema(
        cert_name=certificate.cert_name,
        score=certificate.score,
        certificate_date=certificate.date
    ) for certificate in user.certificates]
    
    education_data = None
    if user.educations:
        education = user.educations[0]
        education_data = EducationSchema(
            school_name=education.school_name,
            major=education.major,
            admission_year=education.admission_year,
            graduation_year=education.graduation_year,
            status=education.status,
            score=education.score
        )
    
    hope_data = None
    if user.hopes:
        hope = user.hopes[0]
        hope_data = HopeSchema(
            company=hope.company,
            job=hope.job,
            region=hope.region
        )
    
    return PublicSpecAll(
        skills=skills_data,
        projects=projects_data,
        activities=activities_data,
        certificates=certificates_data,
        education=education_data,
        hope=hope_data
    )