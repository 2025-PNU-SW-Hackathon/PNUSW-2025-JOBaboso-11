import { Outlet } from 'react-router-dom';
import Header from './header/Header';
import Footer from './footer/Footer';
import ScrollToTop from '@components/common/ScrollToTop';

const CompanyContentsLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <ScrollToTop />
      <Header />

      {/* 메인 콘텐츠 */}
      <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8">
        <div className="mx-auto w-[1160px]">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CompanyContentsLayout;
