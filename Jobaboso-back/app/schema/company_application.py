from pydantic import BaseModel
from typing import Optional, List
from enum import Enum
from datetime import datetime
from .application_document import ApplicationDocumentResponse
from .application_schedule import ApplicationScheduleResponse

class ApplicationStatus(str, Enum):
    preparing_documents = "preparing_documents"
    documents_submitted = "documents_submitted"
    documents_under_review = "documents_under_review"
    documents_passed = "documents_passed"
    documents_failed = "documents_failed"
    preparing_test = "preparing_test"
    test_completed = "test_completed"
    test_under_review = "test_under_review"
    test_passed = "test_passed"
    test_failed = "test_failed"
    preparing_assignment = "preparing_assignment"
    assignment_submitted = "assignment_submitted"
    assignment_under_review = "assignment_under_review"
    assignment_passed = "assignment_passed"
    assignment_failed = "assignment_failed"
    preparing_interview = "preparing_interview"
    interview_completed = "interview_completed"
    interview_under_review = "interview_under_review"
    interview_passed = "interview_passed"
    interview_failed = "interview_failed"
    final_accepted = "final_accepted"
    final_rejected = "final_rejected"
    offer_declined = "offer_declined"

# 기업 지원 생성용
class CompanyApplicationCreate(BaseModel):
    company_name: str
    position: str
    application_date: datetime

# 기업 지원 응답용 
class CompanyApplicationResponse(BaseModel):
    id: int
    user_id: str
    company_name: str
    position: str
    application_date: datetime
    status: ApplicationStatus
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# 기업 지원 상세 응답용 
class CompanyApplicationDetailResponse(BaseModel):
    id: int
    user_id: str
    company_name: str
    position: str
    application_date: datetime
    status: ApplicationStatus
    created_at: datetime
    updated_at: datetime
    documents: Optional[List[ApplicationDocumentResponse]] = []
    schedules: Optional[List[ApplicationScheduleResponse]] = []

    class Config:
        from_attributes = True



# 기업 지원 수정용
class CompanyApplicationUpdate(BaseModel):
    company_name: Optional[str] = None
    position: Optional[str] = None
    application_date: Optional[datetime] = None
    status: Optional[ApplicationStatus] = None

# 기업 지원 목록 페이지네이션 응답용
class CompanyApplicationListResponse(BaseModel):
    total_count: int
    page: int
    page_size: int
    total_pages: int
    applications: List[CompanyApplicationResponse]
