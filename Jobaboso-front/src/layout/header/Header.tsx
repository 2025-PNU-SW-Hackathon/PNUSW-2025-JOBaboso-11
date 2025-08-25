import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import NavigationLink from './NavigationLink';
import ProfileSection from './ProfileSection';
import AuthButtons from './AuthButtons';
import HeaderIcons from './HeaderIcons';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const name = localStorage.getItem('name');
    const type = localStorage.getItem('user_type');

    if (accessToken && name) {
      setIsLoggedIn(true);
      setUserName(name);
      setUserType(type);
    } else {
      setIsLoggedIn(false);
      setUserName('');
      setUserType(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_type');
    localStorage.removeItem('name');
    setIsLoggedIn(false);
    setUserName('');
    setUserType(null);
    window.location.href = '/';
  };

  return (
    <>
      {/* 고정된 헤더 */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-header w-full items-center justify-between border-b border-gray-200 bg-white px-6 text-gray-800 shadow-[0px_4px_8px_rgba(0,0,0,0.08)]">
        {/* 왼쪽: 햄버거 + 로고 */}
        <div className="flex items-center gap-3">
          {/* 햄버거 버튼: 모바일에서만 보임 */}
          <button onClick={onToggleSidebar} className="md:hidden" aria-label="사이드바 열기">
            <Bars3Icon className="h-6 w-6 text-gray-700" />
          </button>

          <Link
            to={
              userType === 'company'
                ? '/company/contents'
                : userType === 'university_staff'
                  ? '/staff/department'
                  : userType === 'personal'
                    ? '/home'
                    : '/'
            }
            className="ml-[30px] flex items-center"
          >
            <img src="/jobmate.svg" alt="JobMate" className="h-[42px] w-[145px]" />
          </Link>

          {/* 네비게이션 메뉴 - 로그인된 경우에만 표시 */}
          {isLoggedIn && (
            <nav className="ml-20 hidden items-center space-x-[76px] md:flex">
              {userType === 'personal' ? (
                <>
                  <NavigationLink to="/employment/status" pathPrefix="/employment">
                    나의 취업 현황
                  </NavigationLink>
                  <NavigationLink to="/benchmark" pathPrefix="/benchmark">
                    스펙 벤치마크
                  </NavigationLink>
                  <NavigationLink to="/mission" pathPrefix="/mission">
                    나의 미션
                  </NavigationLink>
                  <NavigationLink to="/lounge/community" pathPrefix="/lounge">
                    커리어 라운지
                  </NavigationLink>
                </>
              ) : userType === 'company' ? (
                <>
                  <NavigationLink to="/company/contents" pathPrefix="/company/contents">
                    기업 콘텐츠
                  </NavigationLink>
                  <NavigationLink to="/company/likes" pathPrefix="/company/likes">
                    찜하기
                  </NavigationLink>
                </>
              ) : userType === 'university_staff' ? (
                <>
                  <NavigationLink to="/staff/department" pathPrefix="/staff/department">
                    우리 학과 취업 현황
                  </NavigationLink>
                  <NavigationLink to="/staff/students" pathPrefix="/staff/students">
                    학생 스펙 확인하기
                  </NavigationLink>
                </>
              ) : null}
            </nav>
          )}
        </div>

        {/* 오른쪽: 로그인 상태에 따라 다른 UI */}
        <nav className="flex items-center space-x-4 font-sans text-bodyMd">
          {isLoggedIn ? (
            <>
              <HeaderIcons />
              <ProfileSection userName={userName} userType={userType} />
            </>
          ) : (
            <AuthButtons />
          )}
        </nav>
      </header>

      {/* 헤더 높이만큼의 공간을 만들어서 콘텐츠가 헤더 뒤로 숨지 않도록 함 */}
      <div className="h-header"></div>
    </>
  );
};

export default Header;
