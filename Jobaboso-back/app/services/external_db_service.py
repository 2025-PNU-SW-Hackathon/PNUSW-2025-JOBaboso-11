from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

class ExternalDBService:
    def __init__(self):
        """외부 데이터베이스 서비스 초기화"""
        pass
    
    def execute_query(self, db: Session, sql_query: str) -> Dict[str, Any]:
        """
        SQL 쿼리를 실행하여 학생 데이터를 조회
        
        Args:
            db: 데이터베이스 세션
            sql_query: 실행할 SQL 쿼리
            
        Returns:
            Dict containing query results and metadata
        """
        try:
            # 쿼리 실행
            result = db.execute(text(sql_query))
            
            # 결과를 딕셔너리 리스트로 변환
            columns = result.keys()
            rows = []
            
            for row in result.fetchall():
                row_dict = {}
                for i, column in enumerate(columns):
                    value = row[i]
                    # datetime 객체를 문자열로 변환
                    if hasattr(value, 'isoformat'):
                        row_dict[column] = value.isoformat()
                    else:
                        row_dict[column] = value
                
                # JSON_OBJECT 결과 파싱
                if len(row_dict) == 1 and any(key in list(row_dict.keys())[0] for key in ["지원현황", "사용자정보", "지원현황"]):
                    # JSON_OBJECT 결과인 경우 파싱
                    import json
                    json_key = list(row_dict.keys())[0]
                    json_value = row_dict[json_key]
                    if isinstance(json_value, str):
                        try:
                            parsed_json = json.loads(json_value)
                            row_dict.update(parsed_json)
                        except:
                            pass
                
                # 이름과 user_id만 포함하는 간단한 응답
                mapped_dict = {
                    "user_id": row_dict.get("user_id") or row_dict.get("사용자ID") or row_dict.get("user_id"),
                    "name": row_dict.get("name") or row_dict.get("이름") or row_dict.get("사용자이름")
                }
                rows.append(mapped_dict)
            
            return {
                "success": True,
                "data": rows,
                "count": len(rows),
                "query": sql_query
            }
            
        except Exception as e:
            logger.error(f"쿼리 실행 중 오류 발생: {str(e)}")
            return {
                "success": False,
                "error": f"데이터베이스 쿼리 실행 중 오류: {str(e)}",
                "data": [],
                "count": 0,
                "query": sql_query
            }
    
    def get_student_by_company(self, db: Session, company_name: str, limit: int = 100) -> Dict[str, Any]:
        """
        특정 회사에 취업한 학생들을 조회
        
        Args:
            db: 데이터베이스 세션
            company_name: 회사명
            limit: 조회할 최대 레코드 수
            
        Returns:
            Dict containing student data
        """
        try:
            sql_query = f"""
            SELECT 
                student_id, name, major, grade, 
                company_name, job_position, employment_status,
                employment_date, gpa, graduation_year
            FROM students 
            WHERE company_name LIKE '%{company_name}%' 
            AND employment_status = '취업완료'
            ORDER BY employment_date DESC
            LIMIT {limit}
            """
            
            return self.execute_query(db, sql_query)
            
        except Exception as e:
            logger.error(f"회사별 학생 조회 중 오류: {str(e)}")
            return {
                "success": False,
                "error": f"회사별 학생 조회 중 오류: {str(e)}",
                "data": [],
                "count": 0
            }
    
    def get_student_by_major(self, db: Session, major: str, limit: int = 100) -> Dict[str, Any]:
        """
        특정 전공 학생들을 조회
        
        Args:
            db: 데이터베이스 세션
            major: 전공명
            limit: 조회할 최대 레코드 수
            
        Returns:
            Dict containing student data
        """
        try:
            sql_query = f"""
            SELECT 
                student_id, name, major, grade, 
                company_name, job_position, employment_status,
                employment_date, gpa, graduation_year
            FROM students 
            WHERE major LIKE '%{major}%'
            ORDER BY grade DESC, name ASC
            LIMIT {limit}
            """
            
            return self.execute_query(db, sql_query)
            
        except Exception as e:
            logger.error(f"전공별 학생 조회 중 오류: {str(e)}")
            return {
                "success": False,
                "error": f"전공별 학생 조회 중 오류: {str(e)}",
                "data": [],
                "count": 0
            }
    
    def get_employment_statistics(self, db: Session) -> Dict[str, Any]:
        """
        취업 통계 정보 조회
        
        Args:
            db: 데이터베이스 세션
            
        Returns:
            Dict containing employment statistics
        """
        try:
            sql_query = """
            SELECT 
                COUNT(*) as total_students,
                COUNT(CASE WHEN employment_status = '취업완료' THEN 1 END) as employed_students,
                COUNT(CASE WHEN employment_status = '취업준비중' THEN 1 END) as job_seeking_students,
                ROUND(COUNT(CASE WHEN employment_status = '취업완료' THEN 1 END) * 100.0 / COUNT(*), 2) as employment_rate
            FROM students
            """
            
            return self.execute_query(db, sql_query)
            
        except Exception as e:
            logger.error(f"취업 통계 조회 중 오류: {str(e)}")
            return {
                "success": False,
                "error": f"취업 통계 조회 중 오류: {str(e)}",
                "data": [],
                "count": 0
            }
