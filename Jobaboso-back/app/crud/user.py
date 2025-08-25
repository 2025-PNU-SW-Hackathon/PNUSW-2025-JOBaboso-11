from sqlalchemy.orm import Session
from models.user import User, PersonalUser, UniversityStaff,CompanyUser
from models.company import Company
from schema.user import PersonalUserCreate, CompanyUserCreate, UniversityStaffCreate, CompanyCreate
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_personal_user(db: Session, user: PersonalUserCreate) -> User:
    db_user = User(
        user_id=user.user_id,
        password=get_password_hash(user.password),
        user_type=user.user_type,
        name=user.name,
        phone=user.phone,
        email=user.email
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    db_personal = PersonalUser(
        user_id=db_user.user_id,
        birth_date=user.birth_date,
        gender=user.gender,
        profile_addr=user.profile_addr
    )
    db.add(db_personal)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_company_user_with_company(db: Session, user: CompanyUserCreate) -> User:
    db_company = Company(
        company_type=user.company.company_type,
        registration_name=user.company.registration_name,
        company_name=user.company.company_name,
        company_address=user.company.company_address,
        business_license_no=user.company.business_license_no,
        is_partner=user.company.is_partner
    )
    db.add(db_company)
    db.commit()
    db.refresh(db_company)
    db_user = User(
        user_id=user.user_id,
        password=get_password_hash(user.password),
        user_type=user.user_type,
        name=user.name,
        phone=user.phone,
        email=user.email
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    db_company_user = CompanyUser(
        user_id=db_user.user_id,
        company_id=db_company.id
    )
    db.add(db_company_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_university_staff_user(db: Session, user: UniversityStaffCreate) -> User:
    db_user = User(
        user_id=user.user_id,
        password=get_password_hash(user.password),
        user_type=user.user_type,
        name=user.name,
        phone=user.phone,
        email=user.email
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    db_staff = UniversityStaff(
        user_id=db_user.user_id,
        univ_name=user.univ_name,
        Field=user.Field
    )
    db.add(db_staff)
    db.commit()
    db.refresh(db_user)
    return db_user
