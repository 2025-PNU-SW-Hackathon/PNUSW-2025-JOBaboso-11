from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class PrivacyConsentUpdate(BaseModel):
    privacy_consent: bool

class CompanyLikeResponse(BaseModel):
    id: int
    company_id: int
    company_name: Optional[str]
    message: str
    contact_email: Optional[str]
    contact_phone: Optional[str]
    suggested_position: Optional[str]
    hr_manager_name: Optional[str]
    created_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class CompanyLikeListResponse(BaseModel):
    total_count: int
    likes: List[CompanyLikeResponse]