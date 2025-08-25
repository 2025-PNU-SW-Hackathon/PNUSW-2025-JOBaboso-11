import api from './api';
import { Schedule } from '@type/Schedules';

export interface Application {
  id: number;
  user_id: string;
  company_name: string;
  position: string;
  application_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: number;
  name: string;
  file_url: string;
  uploaded_at: string;
}

export interface ApplicationDetail extends Application {
  documents: Document[];
  schedules: Schedule[];
}

export interface CreateApplicationRequest {
  company_name: string;
  position: string;
  application_date: string;
}

export interface ApplicationsResponse {
  total_count: number;
  page: number;
  page_size: number;
  total_pages: number;
  applications: Application[];
}

// 후기 작성
export type ExperienceLevel = 'entry' | 'experienced';
export type OverallEvaluation = 'positive' | 'neutral' | 'negative';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type FinalResult = 'final_pass' | 'second_pass' | 'first_pass' | 'fail';

export interface JobPositionCreate {
  position: string;
}

export interface InterviewQuestionCreate {
  question: string;
}

export interface CreateJobReviewRequest {
  application_id?: number;
  company_name: string;
  positions: JobPositionCreate[];
  experience_level: ExperienceLevel;
  interview_date: string; // YYYY-MM-DD
  overall_evaluation: OverallEvaluation;
  difficulty: Difficulty;
  interview_questions: InterviewQuestionCreate[];
  interview_review: string;
  final_result: FinalResult;
}

export const createJobReview = async (payload: CreateJobReviewRequest) => {
  const response = await api.post('/job-reviews/', payload);
  return response.data;
};

// 나의 취업후기 목록 조회 (같은 링크로 GET)
export interface JobReviewItem {
  application_id?: number;
  company_name: string;
  positions: JobPositionCreate[];
  experience_level: ExperienceLevel;
  interview_date: string; // YYYY-MM-DD
  overall_evaluation: OverallEvaluation;
  difficulty: Difficulty;
  interview_questions: InterviewQuestionCreate[];
  interview_review: string;
  final_result: FinalResult;
  id?: number;
  created_at?: string;
}

export const getMyJobReviews = async (): Promise<JobReviewItem[]> => {
  const response = await api.get('/job-reviews/');
  const data = response.data as unknown;
  if (Array.isArray(data)) return data as JobReviewItem[];
  // 공통 응답 래핑 케이스 방어
  const candidates = data && typeof data === 'object' ? (data as any) : {};
  if (Array.isArray(candidates.results)) return candidates.results as JobReviewItem[];
  if (Array.isArray(candidates.items)) return candidates.items as JobReviewItem[];
  if (Array.isArray(candidates.reviews)) return candidates.reviews as JobReviewItem[];
  if (Array.isArray(candidates.data)) return candidates.data as JobReviewItem[];
  // 단일 객체 반환 시 배열로 래핑
  if (data && typeof data === 'object') return [data as JobReviewItem];
  return [];
};

// 단건 조회
export const getJobReview = async (reviewId: number): Promise<JobReviewItem> => {
  const response = await api.get(`/job-reviews/${reviewId}`);
  return response.data as JobReviewItem;
};

// 수정(PUT)
export const updateJobReview = async (reviewId: number, payload: CreateJobReviewRequest) => {
  const response = await api.put(`/job-reviews/${reviewId}`, payload);
  return response.data;
};

// 삭제(DELETE)
export const deleteJobReview = async (reviewId: number) => {
  const response = await api.delete(`/job-reviews/${reviewId}`);
  return response.data;
};

// 지원서 생성
export const createApplication = async (data: CreateApplicationRequest): Promise<Application> => {
  const response = await api.post('/applications', data);
  return response.data;
};

// 지원서 수정
export interface UpdateApplicationRequest {
  company_name: string;
  position: string;
  application_date: string;
  status: string;
}

export const updateApplication = async (
  id: number,
  data: UpdateApplicationRequest
): Promise<Application> => {
  const response = await api.put(`/applications/${id}`, data);
  return response.data;
};

// 지원서 상세 조회
export const getApplication = async (id: number): Promise<ApplicationDetail> => {
  const response = await api.get(`/applications/${id}`);
  return response.data;
};

// 일정 관련 타입 정의
export interface ScheduleCreate {
  schedule_type: string;
  start_date: string;
  end_date: string;
  notes: string;
}

export interface ScheduleResponse {
  id: number;
  application_id: number;
  schedule_type: string;
  start_date: string;
  end_date: string;
  notes: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface SchedulesResponse {
  total_count: number;
  schedules: ScheduleResponse[];
}

// 일정 생성
export const createSchedules = async (
  applicationId: number,
  schedules: ScheduleCreate[]
): Promise<ScheduleResponse[]> => {
  const response = await api.post(`/applications/${applicationId}/schedules`, schedules);
  return response.data;
};

// 일정 목록 조회
export const getApplicationSchedules = async (
  applicationId: number
): Promise<SchedulesResponse> => {
  const response = await api.get(`/applications/${applicationId}/schedules`);
  return response.data;
};

// 일정 삭제
export const deleteSchedule = async (applicationId: number, scheduleId: number): Promise<void> => {
  await api.delete(`/applications/${applicationId}/schedules/${scheduleId}`);
};

// 내 기업 지원 목록 조회
export const getApplications = async (
  page: number = 1,
  pageSize: number = 10
): Promise<ApplicationsResponse> => {
  const response = await api.get('/applications', {
    params: {
      page,
      page_size: pageSize,
    },
  });
  return response.data;
};

// 문서 관련 타입 정의
export interface DocumentUploadRequest {
  files: File[];
  document_types: string[];
}

export interface DocumentResponse {
  id: number;
  application_id: number;
  document_type: string;
  file_name: string;
  file_size: number;
  original_name: string;
  uploaded_at: string;
  download_url: string;
  view_url: string;
}

// 문서 업로드
export const uploadDocuments = async (
  applicationId: number,
  files: File[],
  documentTypes: string[]
): Promise<DocumentResponse[]> => {
  const formData = new FormData();

  files.forEach((file, index) => {
    formData.append('files', file);
    formData.append('document_types', documentTypes[index] || 'resume');
  });

  const response = await api.post(`/applications/${applicationId}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// 문서 삭제
export const deleteDocument = async (applicationId: number, documentId: number): Promise<void> => {
  await api.delete(`/applications/${applicationId}/documents/${documentId}`);
};

// 문서 다운로드
export const downloadDocument = async (
  applicationId: number,
  documentId: number
): Promise<string> => {
  const response = await api.get(`/applications/${applicationId}/documents/${documentId}/download`);
  return response.data;
};

// 문서 보기 (미리보기 URL)
export const getDocumentViewUrl = async (
  applicationId: number,
  documentId: number
): Promise<string> => {
  const response = await api.get(`/applications/${applicationId}/documents/${documentId}/view`);
  return response.data;
};

// 월별 캘린더 조회
export interface CalendarSchedule {
  company_name: string;
  schedule_type: Schedule;
  start_date: string;
  end_date: string;
  notes: string;
}

export interface CalendarResponse {
  year: number;
  month: number;
  schedules: CalendarSchedule[];
}

export const getMonthlyCalendar = async (
  year: number,
  month: number
): Promise<CalendarResponse> => {
  const response = await api.get(`/applications/calendar/${year}/${month}`);
  return response.data;
};

// 다가오는 취업 일정 조회 (현재 시간 기준, 이번달 + 다음달까지)
export const getUpcomingSchedules = async (limit: number = 4): Promise<CalendarSchedule[]> => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1부터 시작

  let allSchedules: CalendarSchedule[] = [];

  try {
    // 이번달 일정 가져오기
    const currentMonthData = await getMonthlyCalendar(currentYear, currentMonth);
    allSchedules.push(...currentMonthData.schedules);

    // 현재 시간 기준으로 upcoming 일정만 필터링
    let upcomingSchedules = allSchedules
      .filter((schedule) => new Date(schedule.start_date) > now)
      .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

    // 이번달 upcoming 일정이 limit보다 적으면 다음달도 가져오기
    if (upcomingSchedules.length < limit) {
      const nextMonth = currentMonth === 12 ? 1 : currentMonth + 1;
      const nextYear = currentMonth === 12 ? currentYear + 1 : currentYear;

      const nextMonthData = await getMonthlyCalendar(nextYear, nextMonth);
      allSchedules.push(...nextMonthData.schedules);

      // 전체 일정을 다시 필터링하고 정렬
      upcomingSchedules = allSchedules
        .filter((schedule) => new Date(schedule.start_date) > now)
        .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
    }

    // 최종적으로 limit만큼 반환
    return upcomingSchedules.slice(0, limit);
  } catch (error) {
    console.error('Upcoming schedules 조회 실패:', error);
    return [];
  }
};
