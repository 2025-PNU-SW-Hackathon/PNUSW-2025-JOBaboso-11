import google.generativeai as genai
import os
from typing import Optional, Dict, Any
import re

class GeminiService:
    def __init__(self):
        """Gemini 서비스 초기화"""
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY 환경변수가 설정되지 않았습니다.")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
        # 학생 테이블 스키마 정보 (실제 데이터베이스 구조)
        self.table_schema = """
        -- 사용자 기본 정보
        CREATE TABLE users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id VARCHAR(20) UNIQUE NOT NULL,
            name VARCHAR(50),
            email VARCHAR(100),
            phone VARCHAR(20),
            user_type ENUM('personal','company','university_staff')
        );
        
        -- 교육 정보
        CREATE TABLE educations (
            user_id VARCHAR(20) NOT NULL,
            school_name VARCHAR(20),
            major VARCHAR(20),
            admission_year DATE,
            graduation_year DATE,
            status VARCHAR(10),
            score FLOAT
        );
        
        -- 회사 지원 정보 (합격/불합격 상태 포함)
        CREATE TABLE company_applications (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id VARCHAR(20) NOT NULL,
            company_name VARCHAR(100) NOT NULL,
            position VARCHAR(100) NOT NULL,
            application_date DATETIME NOT NULL,
            status ENUM('preparing_documents','documents_submitted','documents_under_review','documents_passed','documents_failed','test_passed','final_accepted','final_rejected')
        );
        
        -- 면접 후기 (면접 결과만 포함)
        CREATE TABLE job_reviews (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id VARCHAR(20) NOT NULL,
            company_name VARCHAR(100) NOT NULL,
            final_result ENUM('final_pass','second_pass','first_pass','fail')
        );
        
        -- 희망 회사/직무
        CREATE TABLE hopes (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id VARCHAR(20) NOT NULL,
            company VARCHAR(20),
            job VARCHAR(30)
        );
        
        중요: 합격/불합격 정보는 주로 company_applications.status에서 확인합니다:
        - 'final_accepted': 최종 합격
        - 'final_rejected': 최종 불합격
        - 'test_passed': 필기시험 통과
        """
    
    def generate_sql_query(self, natural_language_query: str) -> Dict[str, Any]:
        """
        자연어 쿼리를 SQL로 변환
        
        Args:
            natural_language_query: 자연어로 된 쿼리
            
        Returns:
            Dict containing SQL query and metadata
        """
        try:
            # 프롬프트 구성
            prompt = f"""
당신은 데이터베이스 전문가입니다. 다음 테이블 스키마를 기반으로 자연어 쿼리를 SQL로 변환해주세요.

테이블 스키마:
{self.table_schema}

자연어 쿼리: "{natural_language_query}"

중요한 가이드라인:
1. 합격/불합격 정보는 주로 company_applications.status에서 확인하세요:
   - 'final_accepted' = 최종 합격
   - 'final_rejected' = 최종 불합격
   - 'test_passed' = 필기시험 통과
   - 'documents_passed' = 서류 합격
   - 'documents_failed' = 서류 불합격
   - 'interview_completed' = 면접 완료
2. "서류 합격자"는 'documents_passed' 상태를 의미합니다
3. "최종 합격자"는 'final_accepted' 상태를 의미합니다
4. 회사명 매핑:
   - "당근" = "당근마켓"
   - "토스" = "토스"
   - "삼성" = "삼성전자"
5. job_reviews는 면접 후기 정보이며, 실제 합격 여부는 company_applications에서 확인합니다
6. 회사 지원 현황을 조회할 때는 company_applications 테이블을 우선적으로 사용하세요
7. JSON_OBJECT나 GROUP_CONCAT 같은 복잡한 함수는 사용하지 말고, 일반적인 SELECT 컬럼만 사용하세요
8. 컬럼명은 영어로 사용하세요 (user_id, name, company_name, position, status 등)

요구사항:
1. SELECT 문만 생성하세요 (INSERT, UPDATE, DELETE 금지)
2. 보안을 위해 LIMIT 100을 추가하세요
3. 민감한 정보(이메일, 전화번호)는 기본적으로 제외하세요
4. 한국어로 된 컬럼명과 값에 맞는 쿼리를 생성하세요
5. 쿼리는 JSON 형태로 반환하세요: {{"sql": "실제 SQL 쿼리", "description": "쿼리 설명"}}

예시 응답:
{{
    "sql": "SELECT u.user_id, u.name, ca.company_name, ca.position, ca.status FROM users u JOIN company_applications ca ON u.user_id = ca.user_id WHERE ca.company_name LIKE '%삼성%' AND ca.status = 'final_accepted' LIMIT 100",
    "description": "삼성에 최종 합격한 학생들의 정보를 조회"
}}

주의: JSON_OBJECT, GROUP_CONCAT 등 복잡한 함수는 사용하지 말고, 일반적인 SELECT 컬럼만 사용하세요.

응답:
"""
            
            # Gemini API 호출
            response = self.model.generate_content(prompt)
            
            # 응답 파싱
            response_text = response.text.strip()
            
            # JSON 형태로 파싱 시도
            try:
                import json
                # JSON 부분만 추출
                json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
                if json_match:
                    result = json.loads(json_match.group())
                    return {
                        "success": True,
                        "sql": result.get("sql", ""),
                        "description": result.get("description", ""),
                        "raw_response": response_text
                    }
                else:
                    # JSON이 아닌 경우 SQL만 추출
                    sql_match = re.search(r'SELECT.*?;', response_text, re.IGNORECASE | re.DOTALL)
                    if sql_match:
                        return {
                            "success": True,
                            "sql": sql_match.group().strip(),
                            "description": "자동 생성된 쿼리",
                            "raw_response": response_text
                        }
            except json.JSONDecodeError:
                pass
            
            # 기본 SQL 추출
            sql_match = re.search(r'SELECT.*?;', response_text, re.IGNORECASE | re.DOTALL)
            if sql_match:
                return {
                    "success": True,
                    "sql": sql_match.group().strip(),
                    "description": "자동 생성된 쿼리",
                    "raw_response": response_text
                }
            
            return {
                "success": False,
                "error": "SQL 쿼리를 생성할 수 없습니다.",
                "raw_response": response_text
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Gemini API 호출 중 오류 발생: {str(e)}",
                "raw_response": ""
            }
    
    def validate_sql_query(self, sql_query: str) -> bool:
        """
        SQL 쿼리 보안 검증
        
        Args:
            sql_query: 검증할 SQL 쿼리
            
        Returns:
            bool: 안전한 쿼리인지 여부
        """
        # 위험한 키워드 체크
        dangerous_keywords = [
            'DROP', 'DELETE', 'INSERT', 'UPDATE', 'ALTER', 'CREATE', 
            'TRUNCATE', 'EXEC', 'EXECUTE', 'UNION', '--', '/*', '*/'
        ]
        
        sql_upper = sql_query.upper()
        
        # SELECT로 시작하는지 확인
        if not sql_upper.strip().startswith('SELECT'):
            return False
        
        # 위험한 키워드가 포함되어 있는지 확인
        for keyword in dangerous_keywords:
            if keyword in sql_upper:
                return False
        
        return True
