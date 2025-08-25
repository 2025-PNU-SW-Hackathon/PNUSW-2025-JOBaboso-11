from pydantic import BaseModel
from typing import Optional, List
from datetime import date, datetime

class StudentAnonymizedInfo(BaseModel):
    student_id: str  
    gender: Optional[str]
    score: Optional[float]
    total_score: Optional[float] 
    status: str
    graduation_year: Optional[date]
    success_rate: float

class StudentListResponse(BaseModel):
    students: List[StudentAnonymizedInfo]
    total_count: int

class StudentQueryParams(BaseModel):
    grade: Optional[int] = None
    sort_by: Optional[str] = "success_rate"
    sort_order: Optional[str] = "desc"

class CompanyPreferenceItem(BaseModel):
    company: str
    count: int
    percentage: float

class CompanyPreferenceResponse(BaseModel):
    preferences: List[CompanyPreferenceItem]
    total_students: int

class ApplicationInfo(BaseModel):
    company_name: str
    position: str
    application_date: datetime
    status: str
    success: bool

class SkillInfo(BaseModel):
    skill_name: str

class ProjectInfo(BaseModel):
    project_name: str
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

class ActivityInfo(BaseModel):
    type: Optional[str] = None
    title: Optional[str] = None
    detail: Optional[str] = None
    date: Optional[date] = None

class CertificateInfo(BaseModel):
    cert_name: str
    score: Optional[str] = None
    date: Optional[date] = None

class StudentSpecs(BaseModel):
    skills: List[SkillInfo] = []
    projects: List[ProjectInfo] = []
    activities: List[ActivityInfo] = []
    certificates: List[CertificateInfo] = []

class StudentDetailInfo(BaseModel):
    student_id: str
    gender: Optional[str]
    score: Optional[float]
    status: str
    graduation_year: Optional[date]
    success_rate: float
    total_applications: int
    successful_applications: int
    applications: List[ApplicationInfo]
    target_company: Optional[str] = None
    target_job: Optional[str] = None
    target_region: Optional[str] = None
    specs: StudentSpecs

class StudentDetailResponse(BaseModel):
    student: StudentDetailInfo