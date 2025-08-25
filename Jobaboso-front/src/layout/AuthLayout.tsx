import { Outlet } from 'react-router-dom';
import Header from './header/Header';
import Footer from './footer/Footer';
import ScrollToTop from '@components/common/ScrollToTop';

const SignLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />

      <main className="flex-1 overflow-y-auto bg-white">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default SignLayout;
