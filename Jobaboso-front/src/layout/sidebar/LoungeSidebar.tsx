import Sidebar, { SidebarSection } from './Sidebar';

const LoungeSidebar = () => {
  const sections: SidebarSection[] = [
    {
      title: '커뮤니티',
      links: [{ to: '/lounge/community', label: '취업이야기' }],
    },
    {
      title: '기업 콘텐츠',
      links: [{ to: '/lounge/corporate', label: '기업 콘텐츠' }],
    },
  ];

  return <Sidebar title="커리어 라운지" sections={sections} />;
};

export default LoungeSidebar;
