// 찜하기 관련 타입
export interface PersonalUser {
  user_id: string;
  name: string;
  gender: string;
  age: number;
  major: string;
  job: string;
  career_period: string;
  skills: string[];
}

export interface RandomUsersResponse {
  users: PersonalUser[];
  total_count: number;
}

export interface LikeData {
  target_user_id: string;
  message: string;
  contact_email: string;
  contact_phone: string;
  suggested_position: string;
}

export interface LikeItem {
  id: number;
  target_user_id: string;
  target_user_name: string;
  message: string;
  contact_email: string;
  contact_phone: string;
  suggested_position: string;
  company_name: string;
  hr_manager_name: string;
  created_at: string;
}

export interface LikesListResponse {
  likes: LikeItem[];
  total_count: number;
  page_size: number;
  current_page: number;
  total_pages: number;
}
