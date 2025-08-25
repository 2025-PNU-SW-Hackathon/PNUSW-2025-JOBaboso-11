import { Outlet, useLocation } from 'react-router-dom';
import { useState, useCallback } from 'react';
import Header from './header/Header';
import Footer from './footer/Footer';
import ScrollToTop from '@components/common/ScrollToTop';
import PointDisplay from '@components/common/PointDisplay';

interface StaffLayoutProps {
  title?: string;
}

const StaffLayout: React.FC<StaffLayoutProps> = ({ title }) => {
  const location = useLocation();
  const [refreshKey, setRefreshKey] = useState(0);

  // 포인트 새로고침 함수
  const refreshPoints = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  // 페이지별 제목 매핑
  const getPageTitle = () => {
    if (title) return title;

    switch (location.pathname) {
      case '/staff/students':
        return '학생 스펙 확인하기';
      default:
        return '';
    }
  };

  const pageTitle = getPageTitle();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <ScrollToTop />
      <Header />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <div className="mx-auto w-[894px]">
          <div className="flex items-center justify-between">
            {pageTitle && (
              <h2 className="mb-8 mt-8 text-[40px] font-bold text-gray-800">{pageTitle}</h2>
            )}
          </div>
          <Outlet context={{ refreshPoints }} />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default StaffLayout;
