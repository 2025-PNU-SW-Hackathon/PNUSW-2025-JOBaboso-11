from sqlalchemy import Column, String, Integer, Date, Float, Enum, Text, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from db.base import Base
import enum


class ActivityTypeEnum(enum.Enum):
    contest = 'contest'
    club = 'club'
    intern = 'intern'

class Skill(Base):
    __tablename__ = 'skills'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(20), ForeignKey('users.user_id'))
    skill_name = Column(String(20))
    user = relationship('User', back_populates='skills')

class Project(Base):
    __tablename__ = 'projects'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(20), ForeignKey('users.user_id'))
    project_name = Column(String(20))
    description = Column(String(300))
    start_date = Column(Date)
    end_date = Column(Date)
    user = relationship('User', back_populates='projects')

class Activity(Base):
    __tablename__ = 'activities'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(20), ForeignKey('users.user_id'))
    type = Column(Enum(ActivityTypeEnum))
    title = Column(String(30))
    detail = Column(String(300))
    date = Column(Date)
    user = relationship('User', back_populates='activities')

class Certificate(Base):
    __tablename__ = 'certificates'
    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(20), ForeignKey('users.user_id'))
    cert_name = Column(String(20))
    score = Column(String(20))
    date = Column(Date)
    user = relationship('User', back_populates='certificates')

class Education(Base):
    __tablename__ = 'educations'
    user_id = Column(String(20), ForeignKey('users.user_id'), primary_key=True)
    school_name = Column(String(20))
    major = Column(String(20))
    admission_year = Column(Date)
    graduation_year = Column(Date)
    status = Column(String(10))
    score = Column(Float)
    user = relationship('User', back_populates='educations')

class Hope(Base):
    __tablename__ = 'hopes'
    user_id = Column(String(20), ForeignKey('users.user_id'), primary_key=True)
    company = Column(String(20))
    job = Column(String(30))
    region = Column(String(20))
    user = relationship('User', back_populates='hopes')