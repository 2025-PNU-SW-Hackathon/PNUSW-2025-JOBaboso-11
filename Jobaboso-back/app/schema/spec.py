from pydantic import BaseModel, field_validator
from typing import List, Optional
from datetime import date, datetime
from enum import Enum

class ActivityType(str, Enum):
    contest = 'contest'
    club = 'club'
    intern = 'intern'

class Skill(BaseModel):
    skill_name: Optional[str] = None

class Project(BaseModel):
    project_name: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None

    @field_validator('start_date', 'end_date', mode='before')
    @classmethod
    def parse_date(cls, value):
        if value is None or isinstance(value, date):
            return value
        try:
            return datetime.strptime(value, "%Y-%m-%d").date()
        except Exception:
            raise ValueError("날짜 형식은 YYYY-MM-DD이어야 합니다.")

class Activity(BaseModel):
    type: Optional[ActivityType] = None
    title: Optional[str] = None
    detail: Optional[str] = None
    activity_date: Optional[date] = None

    @field_validator('activity_date', mode='before')
    @classmethod
    def parse_date(cls, value):
        if value is None or isinstance(value, date):
            return value
        try:
            return datetime.strptime(value, "%Y-%m-%d").date()
        except Exception:
            raise ValueError("날짜 형식은 YYYY-MM-DD이어야 합니다.")

class Certificate(BaseModel):
    cert_name: Optional[str] = None
    score: Optional[str] = None
    certificate_date: Optional[date] = None

    @field_validator('certificate_date', mode='before')
    @classmethod
    def parse_date(cls, value):
        if value is None or isinstance(value, date):
            return value
        try:
            return datetime.strptime(value, "%Y-%m-%d").date()
        except Exception:
            raise ValueError("날짜 형식은 YYYY-MM-DD이어야 합니다.")

class Education(BaseModel):
    school_name: Optional[str] = None
    major: Optional[str] = None
    admission_year: Optional[date] = None
    graduation_year: Optional[date] = None
    status: Optional[str] = None
    score: Optional[float] = None

    @field_validator('admission_year', 'graduation_year', mode='before')
    @classmethod
    def parse_date(cls, value):
        if value is None or isinstance(value, date):
            return value
        try:
            return datetime.strptime(value, "%Y-%m-%d").date()
        except Exception:
            raise ValueError("날짜 형식은 YYYY-MM-DD이어야 합니다.")

class Hope(BaseModel):
    company: Optional[str] = None
    job: Optional[str] = None
    region: Optional[str] = None

# 개인정보 스키마
class PersonalInfo(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    birth_date: Optional[date] = None
    gender: Optional[str] = None
    profile_addr: Optional[str] = None

    @field_validator('birth_date', mode='before')
    @classmethod
    def parse_date(cls, value):
        if value is None or isinstance(value, date):
            return value
        try:
            return datetime.strptime(value, "%Y-%m-%d").date()
        except Exception:
            raise ValueError("날짜 형식은 YYYY-MM-DD이어야 합니다.")

# 스펙 생성/업데이트용 스키마 (개인정보 제외)
class SpecCreateUpdate(BaseModel):
    skills: Optional[List[Skill]] = []
    projects: Optional[List[Project]] = []
    activities: Optional[List[Activity]] = []
    certificates: Optional[List[Certificate]] = []
    education: Optional[Education] = None
    hope: Optional[Hope] = None

# 본인용 스펙 조회 (개인정보 포함)
class PersonalSpecAll(BaseModel):
    personal_info: Optional[PersonalInfo] = None
    skills: Optional[List[Skill]] = []
    projects: Optional[List[Project]] = []
    activities: Optional[List[Activity]] = []
    certificates: Optional[List[Certificate]] = []
    education: Optional[Education] = None
    hope: Optional[Hope] = None

# 공개용 스펙 조회 (개인정보 제외)
class PublicSpecAll(BaseModel):
    skills: Optional[List[Skill]] = []
    projects: Optional[List[Project]] = []
    activities: Optional[List[Activity]] = []
    certificates: Optional[List[Certificate]] = []
    education: Optional[Education] = None
    hope: Optional[Hope] = None
