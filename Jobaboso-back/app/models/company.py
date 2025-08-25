from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from db.base import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, autoincrement=True)
    company_type = Column(String(30))
    registration_name = Column(String(100))
    company_name = Column(String(30))
    company_address = Column(String(200))
    business_license_no = Column(String(50))
    is_partner = Column(Boolean)

    company_users = relationship("CompanyUser", back_populates="company", cascade="all, delete-orphan")
    company_contents = relationship("CompanyContent", back_populates="company", cascade="all, delete-orphan")
    company_likes = relationship("CompanyLikesPersonal", back_populates="company", cascade="all, delete-orphan")

class CompanyContent(Base):
    __tablename__ = "company_contents"

    id = Column(Integer, primary_key=True, autoincrement=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    title = Column(String(100), nullable=False)
    body = Column(Text, nullable=False)
    file_addr = Column(String(255))
    youtube_url = Column(String(255))
    hashtags = Column(String(255))
    content_type = Column(String(30))
    created_at = Column(DateTime)

    company = relationship("Company", back_populates="company_contents")

class CompanyLikesPersonal(Base):
    __tablename__ = "company_likes_personal"

    id = Column(Integer, primary_key=True, autoincrement=True)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    user_id = Column(String(20), ForeignKey("personalusers.user_id"), nullable=False)
    message = Column(Text, nullable=False)
    contact_email = Column(String(100))
    contact_phone = Column(String(30))
    suggested_position = Column(String(50))  
    company_name = Column(String(30))
    hr_manager_name = Column(String(50))
    created_at = Column(DateTime)

    company = relationship("Company", back_populates="company_likes")
    personal_user = relationship("PersonalUser", back_populates="company_likes") 