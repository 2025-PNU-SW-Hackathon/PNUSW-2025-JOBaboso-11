import Sidebar, { SidebarSection } from './Sidebar';

const HomeSidebar = () => {
  const sections: SidebarSection[] = [
    {
      title: '메인 메뉴',
      links: [
        { to: '/', label: '홈' },
        { to: '/my/spec', label: '마이페이지' },
        { to: '/employment/status', label: '취업 현황' },
        { to: '/lounge/community', label: '커리어 라운지' },
      ],
    },
  ];

  return <Sidebar title="JobMate" sections={sections} />;
};

export default HomeSidebar;
