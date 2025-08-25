import Sidebar, { SidebarSection } from './Sidebar';

const EmploymentSidebar = () => {
  const sections: SidebarSection[] = [
    {
      title: '나의 취업 현황',
      links: [
        { to: '/employment/status', label: '전체 지원 현황' },
        { to: '/employment/apply', label: '지원하기' },
        { to: '/employment/calendar', label: '캘린더' },
        { to: '/employment/touch', label: '찜 제안' },
      ],
    },
    {
      title: '취업 후기',
      links: [
        { to: '/employment/review', label: '나의 취업 후기' },
        { to: '/employment/review/write', label: '취업 후기 작성하기' },
      ],
    },
  ];

  return <Sidebar title="나의 취업 현황" sections={sections} />;
};

export default EmploymentSidebar;
