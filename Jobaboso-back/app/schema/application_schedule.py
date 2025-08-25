from pydantic import BaseModel
from typing import Optional
from enum import Enum
from datetime import datetime

class ScheduleType(str, Enum):
    document_deadline = "document_deadline"                        # 서류 제출 마감
    document_result_announcement = "document_result_announcement"  # 서류 심사 결과 발표
    test_date = "test_date"                                       # 시험 일정
    test_result_announcement = "test_result_announcement"         # 시험 결과 발표
    assignment_deadline = "assignment_deadline"                   # 과제 제출 마감
    interview_date = "interview_date"                             # 면접 일정
    interview_result_announcement = "interview_result_announcement" # 면접 결과 발표
    final_result_announcement = "final_result_announcement"       # 최종 결과 발표

# 일정 생성용
class ApplicationScheduleCreate(BaseModel):
    schedule_type: ScheduleType
    start_date: datetime
    end_date: datetime
    notes: Optional[str] = None

# 일정 응답용
class ApplicationScheduleResponse(BaseModel):
    id: int
    application_id: int
    schedule_type: ScheduleType
    start_date: datetime
    end_date: datetime
    notes: Optional[str] = None
    is_completed: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# 일정 수정용
class ApplicationScheduleUpdate(BaseModel):
    schedule_type: Optional[ScheduleType] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    notes: Optional[str] = None
    is_completed: Optional[bool] = None

# 일정 목록 응답용
class ApplicationScheduleListResponse(BaseModel):
    total_count: int
    schedules: list[ApplicationScheduleResponse]

# 캘린더용 일정 응답
class CalendarScheduleResponse(BaseModel):
    company_name: str
    schedule_type: ScheduleType
    start_date: datetime
    end_date: datetime
    notes: Optional[str] = None

    class Config:
        from_attributes = True

# 월별 캘린더 응답용
class MonthlyCalendarResponse(BaseModel):
    year: int
    month: int
    schedules: list[CalendarScheduleResponse]