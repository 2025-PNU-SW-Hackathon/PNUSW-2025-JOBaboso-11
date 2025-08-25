from fastapi import APIRouter, Depends, HTTPException,Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from schema.spec import SpecCreateUpdate, PersonalSpecAll, PublicSpecAll
from crud import spec as crud_spec
from utils.jwt import verify_token
from models.user import User
from db.session import get_db

router = APIRouter(
    prefix="/spec",
)
security = HTTPBearer()


@router.post("/all")
def create_or_update_all_spec(
    spec_data: SpecCreateUpdate,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    payload = verify_token(credentials.credentials)
    current_user = db.query(User).filter(User.user_id == payload["user_id"]).first()
    if current_user.user_type != "personal":
        raise HTTPException(status_code=403, detail="권한이 없습니다.")
    return crud_spec.create_or_update_all_spec(db, spec_data, current_user.user_id)


@router.get("/all", response_model=PersonalSpecAll)
def get_all_spec(
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    payload = verify_token(credentials.credentials)
    current_user = db.query(User).filter(User.user_id == payload["user_id"]).first()
    if current_user.user_type != "personal":
        raise HTTPException(status_code=403, detail="권한이 없습니다.")
    return crud_spec.get_all_spec(db, current_user.user_id)


@router.get("/public/{user_id}", response_model=PublicSpecAll)
def get_public_spec(
    user_id: str,
    db: Session = Depends(get_db)
):


    target_user = db.query(User).filter(User.user_id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    return crud_spec.get_public_spec(db, user_id)

