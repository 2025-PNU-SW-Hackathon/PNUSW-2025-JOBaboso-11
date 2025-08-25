import Sidebar, { SidebarSection } from './Sidebar';

const MySidebar = () => {
  const sections: SidebarSection[] = [
    {
      title: '나의 목표, 직군, 스펙',
      links: [
        { to: '/my/spec', label: '미리보기' },
        { to: '/my/spec/edit', label: '등록 및 수정하기' },
      ],
    },
  ];

  return <Sidebar title="마이페이지" sections={sections} />;
};

export default MySidebar;
