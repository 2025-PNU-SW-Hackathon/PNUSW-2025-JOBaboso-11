from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import date

# 개인 사용자 정보 응답용 스키마
class PersonalUserResponse(BaseModel):
    user_id: str
    name: Optional[str]
    gender: Optional[str]
    age: Optional[int]  
    major: Optional[str]  
    job: Optional[str]  
    career_period: Optional[str]  
    skills: List[str]  

    class Config:
        from_attributes = True

# 개인 사용자 목록 응답용 스키마
class PersonalUserListResponse(BaseModel):
    users: List[PersonalUserResponse]
    total_count: int

    class Config:
        from_attributes = True

# 찜하기 요청용 스키마
class CompanyLikeCreate(BaseModel):
    target_user_id: str  
    message: str  
    contact_email: Optional[str] = None  
    contact_phone: Optional[str] = None  
    suggested_position: Optional[str] = None  

# 찜 정보 응답용 스키마
class CompanyLikeResponse(BaseModel):
    id: int
    target_user_id: str
    target_user_name: Optional[str]
    message: str
    contact_email: Optional[str]
    contact_phone: Optional[str]
    suggested_position: Optional[str] 
    company_name: Optional[str]
    hr_manager_name: Optional[str]
    created_at: Optional[str]

    class Config:
        from_attributes = True

# 찜 목록 응답용 스키마
class CompanyLikeListResponse(BaseModel):
    likes: List[CompanyLikeResponse]
    total_count: int
    page_size: int 
    current_page: int  
    total_pages: int  

    class Config:
        from_attributes = True 