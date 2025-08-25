from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.variable import *

# 외부 학생 데이터베이스 연결
external_engine = create_engine(
    SQLALCHEMY_DATABASE_URL_USER.replace('mysql://', 'mysql+pymysql://'), 
    pool_recycle=3600, 
    pool_pre_ping=True,
    echo=False  # SQL 로그 비활성화
)

ExternalSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=external_engine)

def get_external_db():
    """외부 데이터베이스 세션을 반환하는 함수"""
    db = ExternalSessionLocal()
    try:
        yield db
    finally:
        db.close()
