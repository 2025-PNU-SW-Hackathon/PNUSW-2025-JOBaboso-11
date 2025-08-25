from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import time
import logging

from app.db.external_session import get_external_db
from app.services.gemini_service import GeminiService
from app.services.external_db_service import ExternalDBService
from app.schema.staff_ai_search import (
    StudentQueryRequest, 
    StudentQueryResponse, 
    StatisticsResponse,
    EmploymentStatistics
)

# 로깅 설정
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/staff-ai-search", tags=["staff_ai_search"])

# 서비스 인스턴스 생성
gemini_service = GeminiService()
external_db_service = ExternalDBService()

@router.post("", response_model=StudentQueryResponse)
async def query_students(
    request: StudentQueryRequest,
    db: Session = Depends(get_external_db)
):
    """
    자연어 쿼리를 통해 학생 정보를 조회.
    
    - **query**: 자연어로 된 쿼리 (예: "삼성에 합격한 학생들만을 추려서 가지고 와.")
    - **include_sensitive_info**: 민감한 정보 포함 여부
    - **limit**: 조회할 최대 레코드 수
    """
    start_time = time.time()
    
    try:
        # 1단계: Gemini를 통해 SQL 쿼리 생성
        logger.info(f"자연어 쿼리 처리 시작: {request.query}")
        
        gemini_result = gemini_service.generate_sql_query(request.query)
        
        if not gemini_result["success"]:
            return StudentQueryResponse(
                success=False,
                error=f"SQL 쿼리 생성 실패: {gemini_result.get('error', '알 수 없는 오류')}",
                execution_time=time.time() - start_time
            )
        
        sql_query = gemini_result["sql"]
        description = gemini_result.get("description", "")
        
        # 2단계: SQL 쿼리 보안 검증
        if not gemini_service.validate_sql_query(sql_query):
            return StudentQueryResponse(
                success=False,
                error="보안상 안전하지 않은 쿼리입니다.",
                query=sql_query,
                execution_time=time.time() - start_time
            )
        
        # 3단계: 민감한 정보 포함 여부에 따른 쿼리 수정
        if not request.include_sensitive_info:
            # email, phone 컬럼 제거
            if "email" in sql_query.lower() or "phone" in sql_query.lower():
                # SELECT 절에서 email, phone 제거
                import re
                select_pattern = r'SELECT\s+(.*?)\s+FROM'
                match = re.search(select_pattern, sql_query, re.IGNORECASE)
                if match:
                    columns = match.group(1)
                    # email, phone 제거
                    columns = re.sub(r'email\s*,?\s*', '', columns, flags=re.IGNORECASE)
                    columns = re.sub(r'phone\s*,?\s*', '', columns, flags=re.IGNORECASE)
                    columns = re.sub(r',\s*,', ',', columns)  # 연속된 쉼표 정리
                    columns = re.sub(r',\s*$', '', columns)   # 끝의 쉼표 제거
                    sql_query = re.sub(select_pattern, f'SELECT {columns} FROM', sql_query, flags=re.IGNORECASE)
        
        # 4단계: LIMIT 추가 (이미 있으면 유지)
        if "limit" not in sql_query.lower():
            sql_query = sql_query.rstrip(';') + f" LIMIT {request.limit};"
        
        # 5단계: 데이터베이스에서 데이터 조회
        logger.info(f"SQL 쿼리 실행: {sql_query}")
        
        db_result = external_db_service.execute_query(db, sql_query)
        
        if not db_result["success"]:
            return StudentQueryResponse(
                success=False,
                error=f"데이터베이스 조회 실패: {db_result.get('error', '알 수 없는 오류')}",
                query=sql_query,
                execution_time=time.time() - start_time
            )
        
        # 6단계: 응답 데이터 구성
        execution_time = time.time() - start_time
        
        return StudentQueryResponse(
            success=True,
            data=db_result["data"],
            count=db_result["count"],
            query=sql_query,
            description=description,
            execution_time=execution_time
        )
        
    except Exception as e:
        logger.error(f"학생 쿼리 처리 중 오류 발생: {str(e)}")
        return StudentQueryResponse(
            success=False,
            error=f"서버 내부 오류: {str(e)}",
            execution_time=time.time() - start_time
        )


