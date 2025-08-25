import Sidebar, { SidebarSection } from './Sidebar';

const MissionSidebar = () => {
  const sections: SidebarSection[] = [
    {
      title: '미션',
      links: [{ to: '/mission/history', label: '미션 목록' }],
    },
  ];

  return <Sidebar title="미션" sections={sections} />;
};

export default MissionSidebar;
