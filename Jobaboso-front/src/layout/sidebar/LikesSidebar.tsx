import Sidebar, { SidebarSection } from './Sidebar';

const LikesSidebar = () => {
  const sections: SidebarSection[] = [
    {
      title: '',
      links: [
        { to: '/company/likes', label: '찜하기' },
        { to: '/company/likes/collect', label: '찜 모아보기' },
      ],
    },
  ];

  return <Sidebar title="찜하기" sections={sections} />;
};

export default LikesSidebar;
