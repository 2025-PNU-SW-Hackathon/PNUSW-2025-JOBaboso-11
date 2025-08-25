from sqlalchemy import (
    Column, Integer, String, DateTime, Enum, ForeignKey
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.base import Base

class ApplicationDocument(Base):
    __tablename__ = "application_documents"

    id = Column(Integer, primary_key=True, autoincrement=True)
    application_id = Column(Integer, ForeignKey("company_applications.id", ondelete="CASCADE"), nullable=False)
    document_type = Column(
        Enum('resume', 'cover_letter', 'portfolio', 'certificate', 'other'),
        nullable=False
    )
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer)
    original_name = Column(String(255))
    uploaded_at = Column(DateTime, default=func.now())

    application = relationship("CompanyApplication", back_populates="documents")