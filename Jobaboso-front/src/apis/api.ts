import axios from 'axios';
import { performAutoLogout } from '@utils/authUtils';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 매 요청마다 Authorization 헤더에 토큰 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 토큰 만료 시 자동 로그아웃
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 상태 코드 (인증 실패) 또는 403 상태 코드 (권한 없음) 발생 시
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('토큰이 만료되었습니다. 자동 로그아웃을 실행합니다.');

      // 사용자에게 토큰 만료 알림
      if (typeof window !== 'undefined') {
        // 이미 로그아웃 처리 중인지 확인 (중복 실행 방지)
        if (localStorage.getItem('logout_processing') === 'true') {
          return Promise.reject(error);
        }

        // 자동 로그아웃 실행
        performAutoLogout();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
