#!/usr/bin/env python3
"""
외부 DB 전용 교직원 AI 프롬프트 기능 테스트
완전한 플로우 테스트와 대화형 테스트만 포함
"""

import sys
import os
from dotenv import load_dotenv

# 환경변수 로드
load_dotenv()

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_complete_flow():
    """완전한 플로우 테스트 (Gemini + 외부 DB)"""
    print("🔄 완전한 플로우 테스트")
    print("=" * 50)
    
    try:
        from app.services.gemini_service import GeminiService
        from app.services.external_db_service import ExternalDBService
        from app.db.external_session import get_external_db
        
        gemini_service = GeminiService()
        external_db_service = ExternalDBService()
        
        # 테스트 쿼리
        test_query = "삼성에 합격한 학생들만을 추려서 가지고 와."
        print(f"📝 자연어 쿼리: \"{test_query}\"")
        
        # 1. Gemini로 SQL 생성
        print("\n1️⃣ Gemini AI가 SQL 생성 중...")
        gemini_result = gemini_service.generate_sql_query(test_query)
        
        if not gemini_result["success"]:
            print(f"❌ SQL 생성 실패: {gemini_result.get('error', '알 수 없는 오류')}")
            return False
        
        sql_query = gemini_result["sql"]
        description = gemini_result.get("description", "")
        print(f"✅ SQL 생성 성공")
        print(f"📋 SQL: {sql_query}")
        print(f"📝 설명: {description}")
        
        # 2. SQL 검증
        print("\n2️⃣ SQL 보안 검증 중...")
        if not gemini_service.validate_sql_query(sql_query):
            print("❌ SQL 검증 실패")
            return False
        print("✅ SQL 검증 통과")
        
        # 3. 외부 DB에서 실행
        print("\n3️⃣ 외부 DB에서 쿼리 실행 중...")
        db_gen = get_external_db()
        db = next(db_gen)
        
        db_result = external_db_service.execute_query(db, sql_query)
        
        if db_result["success"]:
            print(f"✅ DB 쿼리 성공")
            print(f"📊 조회된 레코드 수: {db_result['count']}")
            
            if db_result['data']:
                print("📋 샘플 데이터:")
                for i, record in enumerate(db_result['data'][:3], 1):
                    print(f"   {i}. {record}")
                if len(db_result['data']) > 3:
                    print(f"   ... 외 {len(db_result['data']) - 3}개 더")
            else:
                print("📭 조회된 데이터가 없습니다.")
        else:
            print(f"❌ DB 쿼리 실패: {db_result.get('error', '알 수 없는 오류')}")
        
        db.close()
        return True
        
    except Exception as e:
        print(f"❌ 완전한 플로우 테스트 실패: {e}")
        return False

def interactive_test():
    """대화형 테스트"""
    print("\n🎯 대화형 테스트")
    print("=" * 50)
    print("자연어로 학생 정보를 조회해보세요!")
    print("예시: '삼성에 합격한 학생들', '컴퓨터공학과 학생들'")
    print("종료하려면 'quit' 또는 'exit'를 입력하세요.")
    print("-" * 50)
    
    try:
        from app.services.gemini_service import GeminiService
        from app.services.external_db_service import ExternalDBService
        from app.db.external_session import get_external_db
        
        gemini_service = GeminiService()
        external_db_service = ExternalDBService()
        
        while True:
            query = input("\n🔍 자연어 쿼리 입력: ").strip()
            
            if query.lower() in ['quit', 'exit', '종료']:
                print("👋 테스트를 종료합니다.")
                break
            
            if not query:
                print("⚠️ 쿼리를 입력해주세요.")
                continue
            
            print(f"\n🔄 처리 중: \"{query}\"")
            
            # 1. SQL 생성
            gemini_result = gemini_service.generate_sql_query(query)
            
            if gemini_result["success"]:
                sql_query = gemini_result["sql"]
                description = gemini_result.get("description", "")
                
                print(f"✅ SQL 생성 완료")
                print(f"📋 SQL: {sql_query}")
                print(f"📝 설명: {description}")
                
                # 2. DB 실행
                try:
                    db_gen = get_external_db()
                    db = next(db_gen)
                    
                    db_result = external_db_service.execute_query(db, sql_query)
                    
                    if db_result["success"]:
                        print(f"✅ 조회 완료 - {db_result['count']}개 결과")
                        if db_result['data']:
                            print("📊 결과:")
                            for i, record in enumerate(db_result['data'][:5], 1):
                                print(f"   {i}. {record}")
                            if len(db_result['data']) > 5:
                                print(f"   ... 외 {len(db_result['data']) - 5}개 더")
                        else:
                            print("📭 조회된 데이터가 없습니다.")
                    else:
                        print(f"❌ 조회 실패: {db_result.get('error', '알 수 없는 오류')}")
                    
                    db.close()
                    
                except Exception as e:
                    print(f"⚠️ DB 연결 실패: {e}")
            else:
                print(f"❌ SQL 생성 실패: {gemini_result.get('error', '알 수 없는 오류')}")
    
    except KeyboardInterrupt:
        print("\n\n👋 테스트가 중단되었습니다.")
    except Exception as e:
        print(f"❌ 대화형 테스트 중 오류 발생: {e}")

def main():
    """메인 함수"""
    print("🚀 외부 DB 전용 교직원 AI 프롬프트 기능 테스트")
    print("=" * 60)
    
    # 완전한 플로우 테스트 실행
    print(f"\n📋 완전한 플로우 테스트 실행 중...")
    if test_complete_flow():
        print("\n🎉 완전한 플로우 테스트 성공!")
        
        # 대화형 테스트 실행
        print("\n" + "=" * 60)
        choice = input("대화형 테스트를 실행하시겠습니까? (y/n): ").strip().lower()
        
        if choice in ['y', 'yes', '예']:
            interactive_test()
    else:
        print("\n⚠️ 완전한 플로우 테스트가 실패했습니다.")
    
    print("\n🎉 테스트 완료!")

if __name__ == "__main__":
    main()
