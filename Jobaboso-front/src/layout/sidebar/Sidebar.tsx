import { Link, useLocation } from 'react-router-dom';

// 사이드바 링크 아이템 타입
export interface SidebarLinkItem {
  to: string;
  label: string;
}

// 사이드바 섹션 타입
export interface SidebarSection {
  title: string;
  links: SidebarLinkItem[];
}

// 사이드바 컴포넌트 props 타입
export interface SidebarProps {
  title: string;
  sections: SidebarSection[];
}

// 공통 사이드바 컴포넌트
const Sidebar = ({ title, sections }: SidebarProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `block hover:text-mainBlue ${isActive(path) ? 'text-mainBlue font-semibold' : 'text-gray-700'}`;

  return (
    <nav className="top-header fixed left-0 h-screen w-64 overflow-y-auto bg-white px-8 py-8 text-bodyLg shadow-sm">
      <ul className="space-y-6">
        {/* 메인 제목 */}
        <li>
          <h2 className="mb-6 text-h2 font-bold text-gray-700">{title}</h2>
        </li>

        {/* 섹션들 */}
        {sections.map((section, sectionIndex) => (
          <li key={sectionIndex}>
            <h4 className="mb-4 text-h4 font-bold text-gray-700">{section.title}</h4>
            <ul className="space-y-2">
              {section.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <Link to={link.to} className={linkClass(link.to)}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* 마지막 섹션이 아닌 경우 구분선 추가 */}
            {sectionIndex < sections.length - 1 && <hr className="mt-6 border-b border-gray-200" />}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Sidebar;
