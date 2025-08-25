from sqlalchemy import (
    Column, Integer, String, DateTime, Enum, ForeignKey, Text, UniqueConstraint, Date
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from db.base import Base

class JobReview(Base):
    __tablename__ = "job_reviews"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(20), ForeignKey("personalusers.user_id"), nullable=False)
    application_id = Column(Integer, ForeignKey("company_applications.id"), nullable=True)
    
    # 기본 정보
    company_name = Column(String(100), nullable=False)
    experience_level = Column(Enum('entry', 'experienced'), nullable=False)
    interview_date = Column(Date, nullable=False)
    
    # 평가 항목
    overall_evaluation = Column(Enum('positive', 'neutral', 'negative'), nullable=False)
    difficulty = Column(Enum('easy', 'medium', 'hard'), nullable=False)
    
    # 후기 내용
    interview_review = Column(Text, nullable=False)
    
    # 합격여부
    final_result = Column(Enum('final_pass', 'second_pass', 'first_pass', 'fail'), nullable=False)
    
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    personal_user = relationship("PersonalUser", backref="job_reviews")
    application = relationship("CompanyApplication", backref="job_review", uselist=False)
    positions = relationship("JobPosition", back_populates="job_review", cascade="all, delete-orphan")
    interview_questions = relationship("InterviewQuestion", back_populates="job_review", cascade="all, delete-orphan")
    
    __table_args__ = (
        UniqueConstraint('application_id', name='unique_review_per_application'),
    )

class JobPosition(Base):
    __tablename__ = "job_positions"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    job_review_id = Column(Integer, ForeignKey("job_reviews.id", ondelete="CASCADE"), nullable=False)
    position = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=func.now())
    
    job_review = relationship("JobReview", back_populates="positions")

class InterviewQuestion(Base):
    __tablename__ = "interview_questions"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    job_review_id = Column(Integer, ForeignKey("job_reviews.id", ondelete="CASCADE"), nullable=False)
    question = Column(Text, nullable=False)
    created_at = Column(DateTime, default=func.now())
    
    job_review = relationship("JobReview", back_populates="interview_questions")