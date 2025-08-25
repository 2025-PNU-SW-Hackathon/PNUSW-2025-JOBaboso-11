from sqlalchemy import (
    Column, Integer, String, DateTime, Enum, ForeignKey
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.base import Base

class CompanyApplication(Base):
    __tablename__ = "company_applications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(20), ForeignKey("personalusers.user_id"), nullable=False)
    company_name = Column(String(100), nullable=False)
    position = Column(String(100), nullable=False)
    application_date = Column(DateTime, nullable=False)
    status = Column(
        Enum('preparing_documents', 'documents_submitted', 'documents_under_review', 'documents_passed', 'documents_failed',
             'preparing_test', 'test_completed', 'test_under_review', 'test_passed', 'test_failed',
             'preparing_assignment', 'assignment_submitted', 'assignment_under_review', 'assignment_passed', 'assignment_failed',
             'preparing_interview', 'interview_completed', 'interview_under_review', 'interview_passed', 'interview_failed',
             'final_accepted', 'final_rejected', 'offer_declined'),
        default='preparing_documents'
    )
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    personal_user = relationship("PersonalUser", backref="company_applications")
    
    documents = relationship("ApplicationDocument", back_populates="application", cascade="all, delete-orphan")
    schedules = relationship("ApplicationSchedule", back_populates="application", cascade="all, delete-orphan")