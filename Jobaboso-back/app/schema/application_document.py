from pydantic import BaseModel
from typing import Optional
from enum import Enum
from datetime import datetime

class DocumentType(str, Enum):
    resume = "resume"                # 이력서
    cover_letter = "cover_letter"    # 자기소개서
    portfolio = "portfolio"          # 포트폴리오
    certificate = "certificate"     # 자격증
    other = "other"                  # 기타

# 서류 업로드용
class ApplicationDocumentCreate(BaseModel):
    document_type: DocumentType
    file_name: str
    original_name: Optional[str] = None

# 서류 응답용
class ApplicationDocumentResponse(BaseModel):
    id: int
    application_id: int
    document_type: DocumentType
    file_name: str
    file_size: Optional[int] = None
    original_name: Optional[str] = None
    uploaded_at: datetime
    
    # 프론트엔드에서 사용할 URL들
    download_url: Optional[str] = None
    view_url: Optional[str] = None

    class Config:
        from_attributes = True

# 서류 응답용 
class ApplicationDocumentWithContentResponse(BaseModel):
    id: int
    application_id: int
    document_type: DocumentType
    file_name: str
    file_path: str
    file_size: Optional[int] = None
    original_name: Optional[str] = None
    uploaded_at: datetime
    file_content_base64: Optional[str] = None  
    mime_type: Optional[str] = None            

    class Config:
        from_attributes = True

# 서류 목록 응답용
class ApplicationDocumentListResponse(BaseModel):
    total_count: int
    documents: list[ApplicationDocumentResponse]