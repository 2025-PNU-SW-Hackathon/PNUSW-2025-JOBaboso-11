from fastapi import APIRouter, HTTPException, Depends, Security, status, UploadFile, File, Form
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
from datetime import datetime
from db.session import get_db
from schema.company_application import *
from schema.application_document import *
from schema.application_schedule import *
from crud.company_application import *
from crud.application_document import *
from crud.application_schedule import *
from utils.jwt import verify_token
from urllib.parse import quote

router = APIRouter(
    prefix="/applications",
    tags=["company_applications"]
)

security = HTTPBearer()

@router.post("/", response_model=CompanyApplicationResponse, status_code=status.HTTP_201_CREATED)
def create_application(
    application: CompanyApplicationCreate,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """기업 지원 등록"""
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    
    if user_type != "personal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="개인 사용자만 접근할 수 있습니다."
        )
    
    try:
        db_application = create_company_application(db, application, user_id)
        return db_application
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="지원 등록에 실패했습니다."
        )

@router.get("/", response_model=CompanyApplicationListResponse)
def get_my_applications(
    page: int = 1,
    page_size: int = 10,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """내 기업 지원 목록 조회"""
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if user_type != "personal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="개인 사용자만 접근할 수 있습니다."
        )
    
    if page < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="페이지는 1 이상이어야 합니다."
        )
    
    if page_size < 1 or page_size > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="페이지 크기는 1-100 사이여야 합니다."
        )
    
    skip = (page - 1) * page_size
    
    applications = get_user_company_applications(db, user_id, skip, page_size)
    total_count = get_user_company_applications_count(db, user_id)
    
    total_pages = (total_count + page_size - 1) // page_size
    
    return CompanyApplicationListResponse(
        total_count=total_count,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        applications=applications
    )

# =============================================================================
# 캘린더 관련
# =============================================================================

@router.get("/calendar/{year}/{month}", response_model=MonthlyCalendarResponse)
def get_monthly_calendar(
    year: int,
    month: int,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """월별 캘린더 조회"""
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if user_type != "personal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="개인 사용자만 접근할 수 있습니다."
        )
    
    # 유효한 연월 검증
    if year < 2000 or year > 2100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="유효하지 않은 연도입니다."
        )
    
    if month < 1 or month > 12:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="유효하지 않은 월입니다."
        )
    
    # 월별 일정 조회
    schedule_data = get_user_schedules_by_month(db, user_id, year, month)
    
    # 응답 형식으로 변환
    schedules = []
    for company_name, schedule_type, start_date, end_date, notes in schedule_data:
        schedules.append(CalendarScheduleResponse(
            company_name=company_name,
            schedule_type=schedule_type,
            start_date=start_date,
            end_date=end_date,
            notes=notes
        ))
    
    return MonthlyCalendarResponse(
        year=year,
        month=month,
        schedules=schedules
    )

@router.get("/{application_id}", response_model=CompanyApplicationDetailResponse)
def get_application_detail(
    application_id: int,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """기업 지원 상세 조회"""
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if user_type != "personal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="개인 사용자만 접근할 수 있습니다."
        )
    
    application = get_company_application_with_details(db, application_id)
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="지원 정보를 찾을 수 없습니다."
        )
    
    if application.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="접근 권한이 없습니다."
        )
    
    # 서류들에 URL 추가
    for document in application.documents:
        document.download_url = f"/applications/{application_id}/documents/{document.id}/download"
        document.view_url = f"/applications/{application_id}/documents/{document.id}/view"
    
    # 일정들을 날짜순으로 정렬
    application.schedules = sorted(application.schedules, key=lambda x: x.start_date)
    
    return application

@router.put("/{application_id}", response_model=CompanyApplicationResponse)
def update_application(
    application_id: int,
    application_update: CompanyApplicationUpdate,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """기업 지원 정보 수정"""
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    
    if user_type != "personal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="개인 사용자만 접근할 수 있습니다."
        )
    
    updated_application = update_company_application(
        db, application_id, user_id, application_update
    )
    if not updated_application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="지원 정보를 찾을 수 없습니다."
        )
    return updated_application


@router.delete("/{application_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_application(
    application_id: int,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """기업 지원 삭제"""
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    
    if user_type != "personal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="개인 사용자만 접근할 수 있습니다."
        )
    
    success = delete_company_application(db, application_id, user_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="지원 정보를 찾을 수 없습니다."
        )

@router.get("/status/{status}", response_model=CompanyApplicationListResponse)
def get_applications_by_status_endpoint(
    status: ApplicationStatus,
    page: int = 1,
    page_size: int = 10,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """상태별 기업 지원 조회"""
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if user_type != "personal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="개인 사용자만 접근할 수 있습니다."
        )
    
    # 페이지 검증
    if page < 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="페이지는 1 이상이어야 합니다."
        )
    
    if page_size < 1 or page_size > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="페이지 크기는 1-100 사이여야 합니다."
        )
    
    skip = (page - 1) * page_size
    
    applications = get_applications_by_status(db, user_id, status, skip, page_size)
    
    total_count = len(get_applications_by_status(db, user_id, status, 0, 1000))
    
    total_pages = (total_count + page_size - 1) // page_size
    
    return CompanyApplicationListResponse(
        total_count=total_count,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        applications=applications
    )

# =============================================================================
# 서류 제출 관련 
# =============================================================================

@router.post("/{application_id}/documents", response_model=List[ApplicationDocumentResponse])
def upload_documents(
    application_id: int,
    files: List[UploadFile] = File(...),
    document_types: List[str] = Form(...),
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """서류 업로드 (여러 파일 지원)"""
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if user_type != "personal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="개인 사용자만 접근할 수 있습니다."
        )
    
    application = get_company_application(db, application_id)
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="지원 정보를 찾을 수 없습니다."
        )
    
    if application.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="접근 권한이 없습니다."
        )
    
    # 파일과 타입 개수 확인
    if len(files) != len(document_types):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="파일 개수와 문서 타입 개수가 일치하지 않습니다."
        )
    
    # 파일 저장 경로 생성
    upload_dir = f"uploads/applications/{application_id}/documents"
    os.makedirs(upload_dir, exist_ok=True)
    
    uploaded_documents = []
    saved_files = []
    
    try:
        for file, doc_type in zip(files, document_types):
            try:
                document_type = DocumentType(doc_type)
            except ValueError:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"잘못된 문서 타입입니다: {doc_type}"
                )
            
            # 고유한 파일명 생성
            file_extension = file.filename.split(".")[-1] if "." in file.filename else ""
            unique_filename = f"{uuid.uuid4()}.{file_extension}" if file_extension else str(uuid.uuid4())
            file_path = os.path.join(upload_dir, unique_filename)
            
            # 파일 저장
            with open(file_path, "wb") as buffer:
                content = file.file.read()
                buffer.write(content)
            
            saved_files.append(file_path)
            
            # 데이터베이스에 저장
            document_create = ApplicationDocumentCreate(
                document_type=document_type,
                file_name=unique_filename,
                original_name=file.filename
            )
            
            db_document = create_application_document(
                db, document_create, application_id, file_path, len(content)
            )
            
            uploaded_documents.append(db_document)
        
        return uploaded_documents
    
    except Exception as e:
        for file_path in saved_files:
            if os.path.exists(file_path):
                os.remove(file_path)
        
        if isinstance(e, HTTPException):
            raise e
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="파일 업로드에 실패했습니다."
        )

@router.delete("/{application_id}/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    application_id: int,
    document_id: int,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """서류 삭제"""
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if user_type != "personal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="개인 사용자만 접근할 수 있습니다."
        )
    
    application = get_company_application(db, application_id)
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="지원 정보를 찾을 수 없습니다."
        )
    
    if application.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="접근 권한이 없습니다."
        )
    
    document = get_application_document(db, document_id)
    if document and document.application_id == application_id:
        if os.path.exists(document.file_path):
            os.remove(document.file_path)
    
    # 데이터베이스에서 삭제
    success = delete_application_document(db, document_id, application_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="서류를 찾을 수 없습니다."
        )

@router.get("/{application_id}/documents/{document_id}/download")
def download_document(
    application_id: int,
    document_id: int,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """서류 파일 다운로드"""
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if user_type != "personal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="개인 사용자만 접근할 수 있습니다."
        )
    
    application = get_company_application(db, application_id)
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="지원 정보를 찾을 수 없습니다."
        )
    
    if application.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="접근 권한이 없습니다."
        )
    
    document = get_application_document(db, document_id)
    if not document or document.application_id != application_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="서류를 찾을 수 없습니다."
        )
    
    if not os.path.exists(document.file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="파일이 존재하지 않습니다."
        )
    
    # 원본 파일명으로 다운로드 (한글 파일명 지원)
    filename = document.original_name or document.file_name
    
    return FileResponse(
        path=document.file_path,
        filename=filename,
        media_type='application/octet-stream'
    )

@router.get("/{application_id}/documents/{document_id}/view")
def view_document(
    application_id: int,
    document_id: int,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """서류 파일 미리보기 (브라우저에서 바로 열기)"""
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if user_type != "personal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="개인 사용자만 접근할 수 있습니다."
        )
    
    application = get_company_application(db, application_id)
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="지원 정보를 찾을 수 없습니다."
        )
    
    if application.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="접근 권한이 없습니다."
        )
    
    document = get_application_document(db, document_id)
    if not document or document.application_id != application_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="서류를 찾을 수 없습니다."
        )
    
    if not os.path.exists(document.file_path):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="파일이 존재하지 않습니다."
        )
    
    # 파일 확장자에 따른 MIME 타입 결정
    file_extension = document.file_name.split('.')[-1].lower()
    
    media_type_map = {
        'pdf': 'application/pdf',
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'txt': 'text/plain',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'xls': 'application/vnd.ms-excel',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }
    
    media_type = media_type_map.get(file_extension, 'application/octet-stream')
    filename = document.original_name or document.file_name
    
    return FileResponse(
        path=document.file_path,
        filename=filename,
        media_type=media_type
    )

# =============================================================================
# 취업 일정 관련 
# =============================================================================

@router.post("/{application_id}/schedules", response_model=List[ApplicationScheduleResponse])
def create_schedules(
    application_id: int,
    schedules: List[ApplicationScheduleCreate],
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """일정 생성"""
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if user_type != "personal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="개인 사용자만 접근할 수 있습니다."
        )
    
    application = get_company_application(db, application_id)
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="지원 정보를 찾을 수 없습니다."
        )
    
    if application.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="접근 권한이 없습니다."
        )
    
    if not schedules:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="최소 하나의 일정을 입력해야 합니다."
        )
    
    created_schedules = []
    
    try:
        for schedule in schedules:
            db_schedule = create_application_schedule(db, schedule, application_id)
            created_schedules.append(db_schedule)
        
        return created_schedules
    
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="일정 생성에 실패했습니다."
        )

@router.get("/{application_id}/schedules", response_model=ApplicationScheduleListResponse)
def get_application_schedules_list(
    application_id: int,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """지원서 일정 목록 조회"""
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if user_type != "personal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="개인 사용자만 접근할 수 있습니다."
        )
    
    application = get_company_application(db, application_id)
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="지원 정보를 찾을 수 없습니다."
        )
    
    if application.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="접근 권한이 없습니다."
        )
    
    schedules = get_application_schedules(db, application_id)
    
    return ApplicationScheduleListResponse(
        total_count=len(schedules),
        schedules=schedules
    )

@router.put("/{application_id}/schedules/{schedule_id}", response_model=ApplicationScheduleResponse)
def update_schedule(
    application_id: int,
    schedule_id: int,
    schedule_update: ApplicationScheduleUpdate,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """일정 수정"""
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if user_type != "personal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="개인 사용자만 접근할 수 있습니다."
        )
    
    application = get_company_application(db, application_id)
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="지원 정보를 찾을 수 없습니다."
        )
    
    if application.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="접근 권한이 없습니다."
        )
    
    updated_schedule = update_application_schedule(db, schedule_id, application_id, schedule_update)
    if not updated_schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="일정을 찾을 수 없습니다."
        )
    
    return updated_schedule

@router.patch("/{application_id}/schedules/{schedule_id}/complete", response_model=ApplicationScheduleResponse)
def complete_schedule(
    application_id: int,
    schedule_id: int,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """일정 완료 처리"""
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if user_type != "personal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="개인 사용자만 접근할 수 있습니다."
        )
    
    application = get_company_application(db, application_id)
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="지원 정보를 찾을 수 없습니다."
        )
    
    if application.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="접근 권한이 없습니다."
        )
    
    completed_schedule = mark_schedule_completed(db, schedule_id, application_id, True)
    if not completed_schedule:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="일정을 찾을 수 없습니다."
        )
    
    return completed_schedule

@router.delete("/{application_id}/schedules/{schedule_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_schedule(
    application_id: int,
    schedule_id: int,
    db: Session = Depends(get_db),
    credentials: HTTPAuthorizationCredentials = Security(security)
):
    """일정 삭제"""
    payload = verify_token(credentials.credentials)
    user_id = payload.get("user_id")
    user_type = payload.get("user_type")
    
    if user_type != "personal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="개인 사용자만 접근할 수 있습니다."
        )
    
    application = get_company_application(db, application_id)
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="지원 정보를 찾을 수 없습니다."
        )
    
    if application.user_id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="접근 권한이 없습니다."
        )
    
    success = delete_application_schedule(db, schedule_id, application_id)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="일정을 찾을 수 없습니다."
        )