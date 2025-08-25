// 토큰 관련 유틸리티 함수들

/**
 * 자동 로그아웃을 실행하는 함수
 */
export const performAutoLogout = (): void => {
  try {
    // 브라우저 환경 체크
    if (typeof window === 'undefined') {
      return;
    }

    // 이미 로그아웃 처리 중인지 확인
    if (localStorage.getItem('logout_processing') === 'true') {
      return;
    }

    // 로그아웃 처리 중 플래그 설정
    localStorage.setItem('logout_processing', 'true');

    // 사용자에게 알림
    alert('로그인 세션이 만료되었습니다.\n다시 로그인해 주세요.');

    // 로컬 스토리지 정리
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('name');
    localStorage.removeItem('logout_processing');

    // 로그인 페이지로 리다이렉트
    window.location.href = '/auth/signin';
  } catch (error) {
    console.error('자동 로그아웃 실행 중 오류 발생:', error);
    // 오류 발생 시 기본 로그아웃 처리
    try {
      localStorage.clear();
      window.location.href = '/auth/signin';
    } catch (fallbackError) {
      console.error('폴백 로그아웃 처리 중 오류 발생:', fallbackError);
    }
  }
};
