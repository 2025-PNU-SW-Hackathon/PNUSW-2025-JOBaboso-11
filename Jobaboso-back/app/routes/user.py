from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from db.session import get_db
from models.user import User
from schema.user import PersonalUserCreate, CompanyUserCreate, UniversityStaffCreate, UserLogin
from crud.user import create_personal_user, create_company_user_with_company, create_university_staff_user
from passlib.context import CryptContext
from utils.jwt import create_access_token, create_refresh_token

router = APIRouter(
    prefix="/user",
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#회원가입
@router.post("/register/personal", status_code=201)
def register_personal_user(user: PersonalUserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.user_id == user.user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="이미 존재하는 아이디입니다.")
    return create_personal_user(db, user)

@router.post("/register/company", status_code=201)
def register_company_user(user: CompanyUserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.user_id == user.user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="이미 존재하는 아이디입니다.")
    return create_company_user_with_company(db, user)

@router.post("/register/university_staff", status_code=201)
def register_university_staff_user(user: UniversityStaffCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.user_id == user.user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="이미 존재하는 아이디입니다.")
    return create_university_staff_user(db, user)


#로그인
@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.user_id == user.user_id).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="존재하지 않는 아이디입니다.")
    if not pwd_context.verify(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="비밀번호가 일치하지 않습니다.")
    access_token = create_access_token({"user_id": db_user.user_id, "user_type": db_user.user_type})
    refresh_token = create_refresh_token({"user_id": db_user.user_id, "user_type": db_user.user_type})
    return {"access_token": access_token, "refresh_token": refresh_token, "name": db_user.name, "user_type": db_user.user_type}