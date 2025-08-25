import api from './api';
import {
  SignUpCompanyRequestDto,
  SignUpUniversityRequestDto,
  SignUpPersonalRequestDto,
  SignInRequestDto,
} from '@type/auth/SignUpDTO';

// 개인유저 스펙 조회 응답 타입
export interface PersonalSpecResponse {
  personal_info: {
    name: string;
    phone: string;
    email: string;
    birth_date: string;
    gender: string;
    profile_addr: string;
  };
  skills: any[];
  projects: any[];
  activities: any[];
  certificates: any[];
  education: {
    school_name: string;
    major: string;
    admission_year: string;
    graduation_year: string;
    status: string;
    score: number;
  };
  hope: {
    company: string;
    job: string;
    region: string;
  };
}

// 공개 스펙 조회 응답 타입
export interface PublicSpecResponse {
  skills: any[];
  projects: any[];
  activities: any[];
  certificates: any[];
  education: {
    school_name: string;
    major: string;
    admission_year: string;
    graduation_year: string;
    status: string;
    score: number;
  };
  hope: {
    company: string;
    job: string;
    region: string;
  };
}

export const postSignUpPersonal = async (request: SignUpPersonalRequestDto) => {
  const response = await api.post('/user/register/personal', request);
  return response.data;
};

export const postSignUpCompany = async (request: SignUpCompanyRequestDto) => {
  const response = await api.post('/user/register/company', request);
  return response.data;
};

export const postSignUpUniversity = async (request: SignUpUniversityRequestDto) => {
  const response = await api.post('/user/register/university_staff', request);
  return response.data;
};

export const signin = async (request: SignInRequestDto) => {
  const response = await api.post('/user/login', request);
  return response.data;
};

// 개인유저 스펙 조회 API
export const getPersonalSpec = async (): Promise<PersonalSpecResponse> => {
  const response = await api.get('/spec/all');
  return response.data;
};

export const getPublicSpec = async (userId: string): Promise<PublicSpecResponse> => {
  const response = await api.get(`/spec/public/${userId}`);
  return response.data;
};
