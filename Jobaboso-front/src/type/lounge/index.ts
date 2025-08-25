// 커뮤니티 게시글 타입
export interface CommunityPost {
  type: string;
  tags: string[];
  title: string;
  body: string;
  date: string;
  commentCount: number;
}

// 기업 정보 타입
export interface CorporateCompany {
  name: string;
  industry: string;
  description: string;
  logo: string;
  followers: number;
  posts: number;
}

// 필터 옵션 타입
export interface FilterOption {
  value: string;
  label: string;
}

// 검색 결과 타입
export interface SearchResult {
  query: string;
  results: CommunityPost[];
  totalCount: number;
}
