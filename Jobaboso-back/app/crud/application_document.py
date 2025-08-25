from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from models.application_document import ApplicationDocument
from schema.application_document import ApplicationDocumentCreate

def create_application_document(
    db: Session,
    document: ApplicationDocumentCreate,
    application_id: int,
    file_path: str,
    file_size: Optional[int] = None
) -> ApplicationDocument:
    """서류 업로드"""
    db_document = ApplicationDocument(
        application_id=application_id,
        document_type=document.document_type,
        file_name=document.file_name,
        file_path=file_path,
        file_size=file_size,
        original_name=document.original_name
    )
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    return db_document

def get_application_documents(
    db: Session,
    application_id: int
) -> List[ApplicationDocument]:
    """특정 지원서의 서류 목록 조회"""
    return (
        db.query(ApplicationDocument)
        .filter(ApplicationDocument.application_id == application_id)
        .order_by(ApplicationDocument.uploaded_at.desc())
        .all()
    )

def get_application_document(
    db: Session,
    document_id: int
) -> Optional[ApplicationDocument]:
    """서류 단일 조회"""
    return db.query(ApplicationDocument).filter(ApplicationDocument.id == document_id).first()

def delete_application_document(
    db: Session,
    document_id: int,
    application_id: int
) -> bool:
    """서류 삭제"""
    db_document = db.query(ApplicationDocument).filter(
        and_(
            ApplicationDocument.id == document_id,
            ApplicationDocument.application_id == application_id
        )
    ).first()
    
    if not db_document:
        return False
    
    db.delete(db_document)
    db.commit()
    return True

def get_documents_by_type(
    db: Session,
    application_id: int,
    document_type: str
) -> List[ApplicationDocument]:
    """서류 타입별 조회"""
    return (
        db.query(ApplicationDocument)
        .filter(
            and_(
                ApplicationDocument.application_id == application_id,
                ApplicationDocument.document_type == document_type
            )
        )
        .order_by(ApplicationDocument.uploaded_at.desc())
        .all()
    )