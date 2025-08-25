from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class StudentQueryRequest(BaseModel):
    """학생 정보 쿼리 요청 스키마"""
    query: str = Field(..., description="자연어로 된 쿼리", example="삼성에 합격한 학생들만을 추려서 가지고 와.")
    include_sensitive_info: bool = Field(False, description="민감한 정보(이메일, 전화번호) 포함 여부")
    limit: int = Field(100, description="조회할 최대 레코드 수", ge=1, le=1000)

class StudentData(BaseModel):
    """학생 데이터 스키마 (실제 DB 구조에 맞춤)"""
    # 기본 사용자 정보
    user_id: Optional[str] = Field(None, description="사용자 ID")
    name: Optional[str] = Field(None, description="이름")
    email: Optional[str] = Field(None, description="이메일")
    phone: Optional[str] = Field(None, description="전화번호")
    
    # 교육 정보
    school_name: Optional[str] = Field(None, description="학교명")
    major: Optional[str] = Field(None, description="전공")
    graduation_year: Optional[str] = Field(None, description="졸업년도")
    gpa: Optional[float] = Field(None, description="학점")
    
    # 지원/취업 정보
    company_name: Optional[str] = Field(None, description="회사명")
    position: Optional[str] = Field(None, description="직무")
    application_status: Optional[str] = Field(None, description="지원 상태")
    final_result: Optional[str] = Field(None, description="최종 결과")
    
    # 추가 정보
    created_at: Optional[str] = Field(None, description="생성일")
    updated_at: Optional[str] = Field(None, description="수정일")

class StudentQueryResponse(BaseModel):
    """학생 정보 쿼리 응답 스키마"""
    success: bool = Field(..., description="요청 성공 여부")
    data: List[StudentData] = Field(default_factory=list, description="학생 데이터 리스트")
    count: int = Field(0, description="조회된 레코드 수")
    query: Optional[str] = Field(None, description="실행된 SQL 쿼리")
    description: Optional[str] = Field(None, description="쿼리 설명")
    error: Optional[str] = Field(None, description="오류 메시지")
    execution_time: Optional[float] = Field(None, description="실행 시간(초)")

class EmploymentStatistics(BaseModel):
    """취업 통계 스키마"""
    total_students: int = Field(0, description="전체 학생 수")
    employed_students: int = Field(0, description="취업 완료 학생 수")
    job_seeking_students: int = Field(0, description="취업 준비 중인 학생 수")
    employment_rate: float = Field(0.0, description="취업률(%)")

class StatisticsResponse(BaseModel):
    """통계 응답 스키마"""
    success: bool = Field(..., description="요청 성공 여부")
    statistics: Optional[EmploymentStatistics] = Field(None, description="취업 통계")
    error: Optional[str] = Field(None, description="오류 메시지")
