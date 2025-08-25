import Sidebar, { SidebarSection } from './Sidebar';

const BenchmarkSidebar = () => {
  const sections: SidebarSection[] = [
    {
      title: '벤치마크',
      links: [{ to: '/benchmark/list', label: '벤치마크' }],
    },
  ];

  return <Sidebar title="벤치마크" sections={sections} />;
};

export default BenchmarkSidebar;
