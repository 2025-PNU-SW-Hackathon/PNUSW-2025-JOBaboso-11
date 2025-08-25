from fastapi import APIRouter, Depends, HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from db.session import get_db
from models.user import User, PersonalUser, UniversityStaff, CompanyUser
from utils.jwt import verify_token
from models.company import Company
from models.spec import Skill, Education, Hope, Activity, ActivityTypeEnum, Certificate, Project
from models.company_application import CompanyApplication
from models.application_document import ApplicationDocument
from models.application_schedule import ApplicationSchedule
from models.job_review import JobReview, JobPosition, InterviewQuestion
from crud.user import get_password_hash
from datetime import date, datetime, timedelta
import random

router = APIRouter(
    prefix="/test",
)
security = HTTPBearer()

@router.post("/create-sample-data", status_code=201)
def create_sample_data(db: Session = Depends(get_db)):
    try:
        result = {
            "personal_users": [],
            "company_users": [],
            "university_staff": []
        }

        # 1. 개인유저 10개 생성
        personal_sample_data = [
            {"name": "김민수", "major": "컴퓨터공학", "job": "백엔드 개발자", "skills": ["Python", "Java"]},
            {"name": "이지혜", "major": "소프트웨어학과", "job": "프론트엔드 개발자", "skills": ["React", "JavaScript"]},
            {"name": "박성현", "major": "정보통신공학", "job": "풀스택 개발자", "skills": ["Node.js", "Vue.js"]},
            {"name": "최유진", "major": "데이터사이언스", "job": "데이터 분석가", "skills": ["Python", "R"]},
            {"name": "정민호", "major": "컴퓨터공학", "job": "AI 엔지니어", "skills": ["TensorFlow", "PyTorch"]},
            {"name": "한서연", "major": "디자인학과", "job": "UI/UX 디자이너", "skills": ["Figma", "Sketch"]},
            {"name": "임현우", "major": "경영정보학", "job": "프로덕트 매니저", "skills": ["SQL", "Excel"]},
            {"name": "윤지원", "major": "컴퓨터공학", "job": "DevOps 엔지니어", "skills": ["Docker", "Kubernetes"]},
            {"name": "강태민", "major": "모바일소프트웨어", "job": "모바일 개발자", "skills": ["Swift", "Kotlin"]},
            {"name": "조나영", "major": "게임개발학과", "job": "게임 개발자", "skills": ["Unity", "C#"]}
        ]

        for i, data in enumerate(personal_sample_data, 1):
            user_id = f"personal{i:02d}"
            
            # User 생성
            user = User(
                user_id=user_id,
                password=get_password_hash("test1234"),
                user_type="personal",
                name=data["name"],
                phone=f"010-{random.randint(1000,9999)}-{random.randint(1000,9999)}",
                email=f"{user_id}@test.com"
            )
            db.add(user)
            
            # PersonalUser 생성
            birth_year = random.randint(1995, 2003)
            personal_user = PersonalUser(
                user_id=user_id,
                birth_date=date(birth_year, random.randint(1, 12), random.randint(1, 28)),
                gender=random.choice(["M", "W"]),
                profile_addr=f"/profiles/personal{i:02d}.jpg"
            )
            db.add(personal_user)
            
            # User와 PersonalUser를 먼저 커밋
            db.commit()
            
            # Education 생성
            education = Education(
                user_id=user_id,
                school_name="한국대학교",
                major=data["major"],
                admission_year=date(2018, 3, 1),
                graduation_year=date(2022, 2, 28),
                status="졸업",
                score=round(random.uniform(3.0, 4.5), 2)
            )
            db.add(education)
            
            # Hope 생성
            hope = Hope(
                user_id=user_id,
                company="IT기업",
                job=data["job"],
                region="서울"
            )
            db.add(hope)
            
            # Skills 생성
            for skill_name in data["skills"]:
                skill = Skill(
                    user_id=user_id,
                    skill_name=skill_name
                )
                db.add(skill)
            
            # 인턴 경험 추가 (일부 사용자)
            if i <= 5:
                activity = Activity(
                    user_id=user_id,
                    type=ActivityTypeEnum.intern,
                    title=f"인턴십 경험 {i}",
                    detail="6개월간 백엔드 개발 인턴으로 근무",
                    date=date(2021, random.randint(1, 12), random.randint(1, 28))
                )
                db.add(activity)
            
            # 프로젝트 경험 추가
            project = Project(
                user_id=user_id,
                project_name=f"프로젝트 {i}",
                description=f"{data['job']} 관련 개인 프로젝트",
                start_date=date(2022, 1, 1),
                end_date=date(2022, 6, 30)
            )
            db.add(project)
            
            # 자격증 추가 (일부 사용자)
            if i <= 3:
                certificate = Certificate(
                    user_id=user_id,
                    cert_name="정보처리기사",
                    score="합격",
                    date=date(2021, 11, 15)
                )
                db.add(certificate)
            
            # 관련 데이터들 커밋
            db.commit()
            
            result["personal_users"].append({
                "user_id": user_id,
                "name": data["name"],
                "user_type": "personal"
            })

        # 개인유저들의 취업 관련 데이터 생성
        companies_applied = [
            "네이버", "카카오", "라인", "쿠팡", "배달의민족", 
            "토스", "당근마켓", "야놀자", "마켓컬리", "직방"
        ]
        positions = [
            "백엔드 개발자", "프론트엔드 개발자", "풀스택 개발자", 
            "데이터 분석가", "AI 엔지니어", "DevOps 엔지니어", 
            "모바일 개발자", "게임 개발자"
        ]
        
        for i in range(1, 11):
            user_id = f"personal{i:02d}"
            
            # 각 개인유저마다 2-4개의 지원 데이터 생성
            for j in range(random.randint(2, 4)):
                application = CompanyApplication(
                    user_id=user_id,
                    company_name=random.choice(companies_applied),
                    position=random.choice(positions),
                    application_date=datetime.now() - timedelta(days=random.randint(1, 180)),
                    status=random.choice([
                        'documents_submitted', 'documents_passed', 'test_passed',
                        'interview_completed', 'final_accepted', 'final_rejected'
                    ])
                )
                db.add(application)
                db.commit()
                
                # 지원 서류 생성
                documents = ['resume', 'cover_letter']
                if random.choice([True, False]):
                    documents.append('portfolio')
                
                for doc_type in documents:
                    document = ApplicationDocument(
                        application_id=application.id,
                        document_type=doc_type,
                        file_name=f"{doc_type}_{user_id}_{j+1}.pdf",
                        file_path=f"/uploads/{user_id}/{doc_type}_{j+1}.pdf",
                        file_size=random.randint(100000, 5000000),
                        original_name=f"{doc_type}.pdf"
                    )
                    db.add(document)
                
                # 지원 일정 생성
                base_date = application.application_date
                schedules_to_create = [
                    ('document_deadline', base_date + timedelta(days=7)),
                    ('document_result_announcement', base_date + timedelta(days=14)),
                ]
                
                if application.status in ['test_passed', 'interview_completed', 'final_accepted', 'final_rejected']:
                    schedules_to_create.extend([
                        ('test_date', base_date + timedelta(days=21)),
                        ('test_result_announcement', base_date + timedelta(days=28))
                    ])
                
                if application.status in ['interview_completed', 'final_accepted', 'final_rejected']:
                    schedules_to_create.extend([
                        ('interview_date', base_date + timedelta(days=35)),
                        ('interview_result_announcement', base_date + timedelta(days=42))
                    ])
                
                for schedule_type, start_date in schedules_to_create:
                    schedule = ApplicationSchedule(
                        application_id=application.id,
                        schedule_type=schedule_type,
                        start_date=start_date,
                        end_date=start_date + timedelta(hours=2),
                        is_completed=start_date < datetime.now()
                    )
                    db.add(schedule)
                
                # 취업후기 생성 
                if application.status in ['final_accepted', 'final_rejected'] and random.choice([True, False]):
                    interview_date = (application.application_date + timedelta(days=random.randint(30, 60))).date()
                    
                    job_review = JobReview(
                        user_id=user_id,
                        application_id=application.id,
                        company_name=application.company_name,
                        experience_level=random.choice(['entry', 'experienced']),
                        interview_date=interview_date,
                        overall_evaluation=random.choice(['positive', 'neutral', 'negative']),
                        difficulty=random.choice(['easy', 'medium', 'hard']),
                        interview_review=f"{application.company_name} {application.position} 면접 후기입니다. " +
                                       ("좋은 경험이었고 면접관들이 친절했습니다. 기술적인 질문도 적절했습니다." 
                                        if application.status == 'final_accepted' 
                                        else "아쉬운 결과였지만 많은 것을 배웠습니다. 다음에는 더 준비해서 임하겠습니다."),
                        final_result='final_pass' if application.status == 'final_accepted' else 'fail'
                    )
                    db.add(job_review)
                    db.flush()  # ID를 얻기 위해
                    
                    # JobPosition 추가 
                    num_positions = random.randint(1, 3)
                    sample_positions = ["백엔드 개발자", "프론트엔드 개발자", "풀스택 개발자", "데이터 분석가", "AI 엔지니어"]
                    selected_positions = random.sample(sample_positions, min(num_positions, len(sample_positions)))
                    
                    for pos in selected_positions:
                        job_position = JobPosition(
                            job_review_id=job_review.id,
                            position=pos
                        )
                        db.add(job_position)
                    
                    # InterviewQuestion 추가 
                    sample_questions = [
                        "자기소개를 해주세요.",
                        "왜 우리 회사에 지원하셨나요?",
                        "본인의 강점과 약점은 무엇인가요?",
                        "가장 기억에 남는 프로젝트를 설명해주세요.",
                        "앞으로의 커리어 계획을 말씀해주세요.",
                        "팀 프로젝트에서 갈등이 생겼을 때 어떻게 해결하시나요?",
                        "기술적으로 어려운 문제를 해결한 경험이 있나요?"
                    ]
                    
                    num_questions = random.randint(2, 5)
                    selected_questions = random.sample(sample_questions, min(num_questions, len(sample_questions)))
                    
                    for question in selected_questions:
                        interview_question = InterviewQuestion(
                            job_review_id=job_review.id,
                            question=question
                        )
                        db.add(interview_question)
                
                db.commit()

        # 2. 회사 및 회사직원 5개 생성
        company_sample_data = [
            {"company_name": "테크이노베이션", "user_name": "김대표", "registration_name": "주식회사 테크이노베이션"},
            {"company_name": "스마트솔루션", "user_name": "이팀장", "registration_name": "주식회사 스마트솔루션"},
            {"company_name": "디지털크리에이터", "user_name": "박부장", "registration_name": "주식회사 디지털크리에이터"},
            {"company_name": "클라우드시스템", "user_name": "최과장", "registration_name": "주식회사 클라우드시스템"},
            {"company_name": "AI플랫폼", "user_name": "정대리", "registration_name": "주식회사 AI플랫폼"}
        ]

        for i, data in enumerate(company_sample_data, 1):
            # Company 생성
            company = Company(
                company_type="IT서비스",
                registration_name=data["registration_name"],
                company_name=data["company_name"],
                company_address=f"서울시 강남구 테헤란로 {100 + i}길 {10 + i}",
                business_license_no=f"123-45-{10000 + i}",
                is_partner=random.choice([True, False])
            )
            db.add(company)
            db.commit()
            
            # Company User 생성
            user_id = f"company{i:02d}"
            user = User(
                user_id=user_id,
                password=get_password_hash("test1234"),
                user_type="company",
                name=data["user_name"],
                phone=f"02-{random.randint(100,999)}-{random.randint(1000,9999)}",
                email=f"{user_id}@{data['company_name'].lower()}.com"
            )
            db.add(user)
            db.commit()
            
            # CompanyUser 연결
            company_user = CompanyUser(
                user_id=user_id,
                company_id=company.id
            )
            db.add(company_user)
            db.commit()
            
            result["company_users"].append({
                "user_id": user_id,
                "name": data["user_name"],
                "company_name": data["company_name"],
                "user_type": "company"
            })

        # 3. 교직원 1개 생성
        user_id = "staff01"
        user = User(
            user_id=user_id,
            password=get_password_hash("test1234"),
            user_type="university_staff",
            name="김교수",
            phone="02-123-4567",
            email="staff01@university.edu"
        )
        db.add(user)
        db.commit()
        
        university_staff = UniversityStaff(
            user_id=user_id,
            univ_name="한국대학교",
            Field="컴퓨터공학과"
        )
        db.add(university_staff)
        db.commit()
        
        result["university_staff"].append({
            "user_id": user_id,
            "name": "김교수",
            "university": "한국대학교",
            "field": "컴퓨터공학과",
            "user_type": "university_staff"
        })
        
        return {
            "message": "테스트 데이터가 성공적으로 생성되었습니다.",
            "summary": {
                "personal_users_count": len(result["personal_users"]),
                "company_users_count": len(result["company_users"]),
                "university_staff_count": len(result["university_staff"])
            },
            "data": result
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"데이터 생성 중 오류가 발생했습니다: {str(e)}")


@router.post("/points")
def update_user_points(
    points_change: int,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    payload = verify_token(credentials.credentials)
    user_id = payload["user_id"]
    try:
        user = db.query(User).filter(User.user_id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
        
        old_points = user.points
        user.points += points_change
        
        if user.points < 0:
            user.points = 0
        
        db.commit()
        
        return {
            "message": "포인트가 성공적으로 업데이트되었습니다.",
            "user_id": user_id,
            "old_points": old_points,
            "points_change": points_change,
            "new_points": user.points
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"포인트 업데이트 중 오류가 발생했습니다: {str(e)}")


@router.get("/points")
def get_user_points(
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    payload = verify_token(credentials.credentials)
    user_id = payload["user_id"]
    user = db.query(User).filter(User.user_id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    
    return {
        "user_id": user_id,
        "name": user.name,
        "current_points": user.points
    }

