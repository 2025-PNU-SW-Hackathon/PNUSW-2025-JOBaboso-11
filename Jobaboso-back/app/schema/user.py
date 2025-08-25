from pydantic import BaseModel, EmailStr, constr
from typing import Optional
from enum import Enum
from datetime import date

class UserType(str, Enum):
    personal = 'personal'
    company = 'company'
    university_staff = 'university_staff'

class GenderType(str, Enum):
    M = 'M'
    W = 'W'

# Personal User 회원가입용
class PersonalUserCreate(BaseModel):
    user_id: constr(max_length=20)
    password: constr(min_length=4, max_length=255)
    user_type: UserType
    name: str
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    birth_date: Optional[date] = None
    gender: Optional[GenderType] = None
    profile_addr: Optional[str] = None
    privacy_consent: Optional[bool] = False

# Company 정보 생성용
class CompanyCreate(BaseModel):
    company_type: Optional[str] = None
    registration_name: Optional[str] = None
    company_name: str
    company_address: Optional[str] = None
    business_license_no: Optional[str] = None
    is_partner: Optional[bool] = None

# Company User 회원가입용
class CompanyUserCreate(BaseModel):
    user_id: constr(max_length=20)
    password: constr(min_length=4, max_length=255)
    user_type: UserType
    name: str
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    company: CompanyCreate

# University Staff 회원가입용
class UniversityStaffCreate(BaseModel):
    user_id: constr(max_length=20)
    password: constr(min_length=4, max_length=255)
    user_type: UserType
    name: str
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    univ_name: Optional[str] = None
    Field: Optional[str] = None

class UserLogin(BaseModel):
    user_id: constr(max_length=20)
    password: constr(min_length=4, max_length=255)
