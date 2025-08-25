from sqlalchemy import (
    Column, Integer, String, DateTime, Enum, ForeignKey, Boolean, Text
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.base import Base

class ApplicationSchedule(Base):
    __tablename__ = "application_schedules"

    id = Column(Integer, primary_key=True, autoincrement=True)
    application_id = Column(Integer, ForeignKey("company_applications.id", ondelete="CASCADE"), nullable=False)
    schedule_type = Column(
        Enum('document_deadline', 'document_result_announcement', 'test_date', 'test_result_announcement',
             'assignment_deadline', 'interview_date', 'interview_result_announcement', 'final_result_announcement'),
        nullable=False
    )
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    notes = Column(Text)
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())

    application = relationship("CompanyApplication", back_populates="schedules")