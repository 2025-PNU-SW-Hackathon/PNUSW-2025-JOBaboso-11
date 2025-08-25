import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_register_personal_user_success():
    data = {
        "user_id": "personal1",
        "password": "test1234",
        "user_type": "personal",
        "name": "홍길동",
        "phone": "010-1111-2222",
        "email": "personal1@example.com",
        "birth_date": "2000-01-01",
        "gender": "M",
        "profile_addr": "부산시 금정구"
    }
    response = client.post("/register/personal", json=data)
    assert response.status_code == 201

def test_register_company_user_success():
    data = {
        "user_id": "company1",
        "password": "test1234",
        "user_type": "company",
        "name": "아무개개",
        "phone": "010-2222-3333",
        "email": "company1@example.com",
        "company": {
            "company_type": "IT",
            "registration_name": "주식회사 테스트",
            "company_name": "테스트컴퍼니",
            "company_address": "부산시 해운대구",
            "business_license_no": "123-45-67890",
            "is_partner": False
        }
    }
    response = client.post("/register/company", json=data)
    assert response.status_code == 201

def test_register_university_staff_user_success():
    data = {
        "user_id": "staff1",
        "password": "test1234",
        "user_type": "university_staff",
        "name": "교직원",
        "phone": "010-3333-4444",
        "email": "staff1@example.com",
        "univ_name": "부산대학교",
        "Field": "컴퓨터공학"
    }
    response = client.post("/register/university_staff", json=data)
    assert response.status_code == 201

def test_register_duplicate_user_id():
    data = {
        "user_id": "dupuser",
        "password": "test1234",
        "user_type": "personal",
        "name": "중복",
        "phone": "010-5555-6666",
        "email": "dupuser@example.com"
    }

    response1 = client.post("/register/personal", json=data)
    assert response1.status_code == 201
    response2 = client.post("/register/personal", json=data)
    assert response2.status_code == 400
    assert "이미 존재하는 아이디" in response2.json()["detail"] 