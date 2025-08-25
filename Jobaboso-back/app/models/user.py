from sqlalchemy import (
    Column, Integer, String, Boolean, Enum, Date, ForeignKey
)
from sqlalchemy.orm import relationship
from db.base import Base
from models.spec import Skill, Project, Activity, Certificate, Education, Hope

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(20), unique=True, nullable=False)
    password = Column(String(255))
    user_type = Column(Enum('personal', 'company', 'university_staff'))
    name = Column(String(50))
    phone = Column(String(20))
    email = Column(String(100))
    points = Column(Integer, default=100, nullable=False)

    personaluser = relationship("PersonalUser", back_populates="user", uselist=False, cascade="all, delete-orphan")
    university_staff = relationship("UniversityStaff", back_populates="user", uselist=False, cascade="all, delete-orphan")
    company_users = relationship("CompanyUser", back_populates="user", cascade="all, delete-orphan")
    skills = relationship('Skill', back_populates='user')
    projects = relationship('Project', back_populates='user')
    activities = relationship('Activity', back_populates='user')
    certificates = relationship('Certificate', back_populates='user')
    educations = relationship('Education', back_populates='user')
    hopes = relationship('Hope', back_populates='user')

class PersonalUser(Base):
    __tablename__ = "personalusers"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(20), ForeignKey("users.user_id"), nullable=False)
    birth_date = Column(Date)
    gender = Column(String(1))
    profile_addr = Column(String(300))
    privacy_consent = Column(Boolean, default=False, nullable=False)

    user = relationship("User", back_populates="personaluser")
    company_likes = relationship("CompanyLikesPersonal", back_populates="personal_user", cascade="all, delete-orphan")


class UniversityStaff(Base):
    __tablename__ = "university_staff"

    user_id = Column(String(20), ForeignKey("users.user_id"), primary_key=True, nullable=False)
    univ_name = Column(String(20))
    Field = Column(String(255))

    user = relationship("User", back_populates="university_staff")


class CompanyUser(Base):
    __tablename__ = "company_users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(20), ForeignKey("users.user_id"), nullable=False)
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)

    user = relationship("User", back_populates="company_users")
    company = relationship("Company", back_populates="company_users")

