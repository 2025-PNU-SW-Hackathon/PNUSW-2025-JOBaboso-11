from pydantic import BaseModel, Field
from typing import Optional, List
from enum import Enum
from datetime import datetime, date

class ExperienceLevel(str, Enum):
    entry = "entry"
    experienced = "experienced"

class OverallEvaluation(str, Enum):
    positive = "positive"
    neutral = "neutral"
    negative = "negative"

class Difficulty(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"

class FinalResult(str, Enum):
    final_pass = "final_pass"
    second_pass = "second_pass"
    first_pass = "first_pass"
    fail = "fail"

# 직무 생성/응답용
class JobPositionCreate(BaseModel):
    position: str = Field(..., max_length=100, description="직무명")

class JobPositionResponse(BaseModel):
    id: int
    position: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# 면접질문 생성/응답용
class InterviewQuestionCreate(BaseModel):
    question: str = Field(..., max_length=1000, description="면접 질문")

class InterviewQuestionResponse(BaseModel):
    id: int
    question: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# 취업 후기 생성용
class JobReviewCreate(BaseModel):
    application_id: Optional[int] = Field(None, description="지원서 ID")
    
    # 기본 정보
    company_name: str = Field(..., max_length=100, description="기업명")
    positions: List[JobPositionCreate] = Field(..., min_items=1, max_items=5, description="직무 (최대 5개)")
    experience_level: ExperienceLevel = Field(..., description="면접 당시 경력")
    interview_date: date = Field(..., description="면접일자")
    
    # 평가 항목
    overall_evaluation: OverallEvaluation = Field(..., description="전반적 면접 평가")
    difficulty: Difficulty = Field(..., description="난이도")
    
    interview_questions: List[InterviewQuestionCreate] = Field(default_factory=list, description="면접 질문들")
    
    # 후기 내용
    interview_review: str = Field(..., min_length=10, max_length=5000, description="면접후기")
    
    # 합격여부
    final_result: FinalResult = Field(..., description="합격여부")

# 취업 후기 응답용
class JobReviewResponse(BaseModel):
    id: int
    user_id: str
    application_id: Optional[int]
    
    # 기본 정보
    company_name: str
    positions: List[JobPositionResponse]
    experience_level: ExperienceLevel
    interview_date: date
    
    # 평가 항목
    overall_evaluation: OverallEvaluation
    difficulty: Difficulty
    
    # 면접질문
    interview_questions: List[InterviewQuestionResponse]
    
    # 후기 내용
    interview_review: str
    
    # 합격여부
    final_result: FinalResult
    
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# 취업 후기 수정용
class JobReviewUpdate(BaseModel):
    # 기본 정보
    company_name: Optional[str] = Field(None, max_length=100)
    positions: Optional[List[JobPositionCreate]] = Field(None, min_items=1, max_items=5)
    experience_level: Optional[ExperienceLevel] = None
    interview_date: Optional[date] = None
    
    # 평가 항목
    overall_evaluation: Optional[OverallEvaluation] = None
    difficulty: Optional[Difficulty] = None
    
    # 면접질문
    interview_questions: Optional[List[InterviewQuestionCreate]] = None
    
    # 후기 내용
    interview_review: Optional[str] = Field(None, min_length=10, max_length=5000)
    
    # 합격여부
    final_result: Optional[FinalResult] = None

# 취업 후기 목록용 
class JobReviewListItem(BaseModel):
    id: int
    user_id: str
    application_id: Optional[int]
    company_name: str
    positions: List[str]  
    final_result: FinalResult
    interview_date: date
    created_at: datetime

    class Config:
        from_attributes = True

# 취업 후기 목록 응답용
class JobReviewListResponse(BaseModel):
    total_count: int
    page: int
    page_size: int
    total_pages: int
    reviews: list[JobReviewListItem]

# 공개 후기 목록 아이템용 
class PublicJobReviewListItem(BaseModel):
    id: int
    company_name: str
    positions: List[str]
    experience_level: ExperienceLevel
    overall_evaluation: OverallEvaluation
    difficulty: Difficulty
    final_result: FinalResult
    review_length: int
    interview_date: date
    school_name: Optional[str] = None
    major: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# 공개 후기 목록 응답용
class PublicJobReviewListResponse(BaseModel):
    total_count: int
    page: int
    page_size: int
    total_pages: int
    reviews: list[PublicJobReviewListItem]