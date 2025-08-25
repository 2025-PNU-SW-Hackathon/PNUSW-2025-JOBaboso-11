import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './header/Header';
import LoungeSidebar from './sidebar/LoungeSidebar';
import Footer from './footer/Footer';
import ScrollToTop from '@components/common/ScrollToTop';

interface LoungeLayoutProps {
  title?: string;
}

const LoungeLayout: React.FC<LoungeLayoutProps> = ({ title }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  // 페이지별 제목 매핑
  const getPageTitle = () => {
    if (title) return title;

    switch (location.pathname) {
      case '/lounge/community':
        return '취업 이야기';
      case '/lounge/corporate':
        return '기업 콘텐츠';
      default:
        return '';
    }
  };

  const pageTitle = getPageTitle();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <ScrollToTop />
      {/* Header에 토글 버튼 추가 */}
      <Header onToggleSidebar={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        {/* PC용 사이드바 */}
        <aside className="hidden w-[260px] shrink-0 border-r border-gray-200 md:block">
          <div className="h-full">
            <LoungeSidebar />
          </div>
        </aside>

        {/* 모바일용 사이드바 (오버레이) */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden">
            {/* 오버레이 */}
            <div className="fixed inset-0 bg-black bg-opacity-30" onClick={closeSidebar} />
            {/* 사이드바 */}
            <aside className="relative z-50 w-[240px] border-r border-gray-200 bg-white shadow-md">
              <LoungeSidebar />
            </aside>
          </div>
        )}

        {/* 메인 콘텐츠 */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
          <div className="mx-auto w-[1096px]">
            {pageTitle && (
              <h2 className="mb-8 mt-8 text-[40px] font-bold text-gray-800">{pageTitle}</h2>
            )}
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default LoungeLayout;
