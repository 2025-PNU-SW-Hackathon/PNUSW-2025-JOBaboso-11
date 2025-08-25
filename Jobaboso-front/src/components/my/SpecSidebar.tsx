import React, { useState, useEffect, useRef } from 'react';

interface ResumeSidebarProps {
  onSectionClick: (section: string) => void;
  onSave: () => void;
  isAgreed: boolean;
}

const sidebarItems = [
  {
    icon: (isActive: boolean) => (
      <div className={`rounded-full border p-2 ${isActive ? 'bg-mainBlue' : 'bg-gray-300'}`}>
        <img src="/ic_sidebar_profile.svg"></img>
      </div>
    ),
    label: '인적사항',
  },
  {
    icon: (isActive: boolean) => (
      <div className={`rounded-full border p-2 ${isActive ? 'bg-mainBlue' : 'bg-gray-300'}`}>
        <img src="/ic_sidebar_education.svg"></img>
      </div>
    ),
    label: '학력',
  },
  {
    icon: (isActive: boolean) => (
      <div className={`rounded-full border p-2 ${isActive ? 'bg-mainBlue' : 'bg-gray-300'}`}>
        <img src="/ic_sidebar_hope.svg"></img>
      </div>
    ),
    label: '희망근무조건',
  },
  {
    icon: (isActive: boolean) => (
      <div className={`rounded-full border p-2 ${isActive ? 'bg-mainBlue' : 'bg-gray-300'}`}>
        <img src="/ic_sidebar_skill_1.svg"></img>
      </div>
    ),
    label: '보유역량',
  },
  {
    icon: (isActive: boolean) => (
      <div className={`rounded-full border p-2 ${isActive ? 'bg-mainBlue' : 'bg-gray-300'}`}>
        <img src="/ic_sidebar_skill_2.svg"></img>
      </div>
    ),
    label: '스킬',
  },
];

export default function ResumeSidebar({ onSectionClick, onSave, isAgreed }: ResumeSidebarProps) {
  const [activeSection, setActiveSection] = useState('인적사항');
  const activeSectionRef = useRef(activeSection);

  // activeSection이 변경될 때마다 ref 업데이트
  useEffect(() => {
    activeSectionRef.current = activeSection;
  }, [activeSection]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;

      // 각 섹션의 제목 위치를 확인하여 현재 스크롤 위치에 맞는 섹션 찾기
      const sections = ['인적사항', '학력', '희망근무조건', '보유역량', '스킬'];
      let newActiveSection = '인적사항'; // 기본값을 인적사항으로 설정

      // 각 섹션의 제목이 화면에 보이는지 확인하여 현재 활성 섹션 찾기
      let visibleSections: { label: string; offsetTop: number }[] = [];

      for (let i = 0; i < sections.length; i++) {
        const sectionLabel = sections[i];

        // 실제 ID 매핑
        let sectionId = '';
        switch (sectionLabel) {
          case '인적사항':
            sectionId = 'section-personal';
            break;
          case '학력':
            sectionId = 'section-education';
            break;
          case '희망근무조건':
            sectionId = 'section-hope';
            break;
          case '보유역량':
            sectionId = 'section-ability';
            break;
          case '스킬':
            sectionId = 'section-skill';
            break;
          default:
            sectionId = '';
        }

        if (sectionId) {
          const sectionElement = document.getElementById(sectionId);
          if (sectionElement) {
            // h2 태그를 찾되, 더 구체적인 선택자 사용
            const titleElement = sectionElement.querySelector('h2.text-h2');
            if (titleElement) {
              const { offsetTop } = titleElement as HTMLElement;
              const titleHeight = (titleElement as HTMLElement).offsetHeight;

              // 제목이 화면에 보이는지 확인
              // 제목의 상단이 화면 하단보다 위에 있고, 제목의 하단이 화면 상단보다 아래에 있으면 보이는 것
              const isTitleVisible =
                offsetTop < scrollTop + windowHeight && offsetTop + titleHeight > scrollTop;

              // 스크롤이 맨 위에 가까울 때는 인적사항을 우선적으로 보이도록 처리
              if (sectionLabel === '인적사항' && scrollTop < 100) {
                visibleSections.push({ label: sectionLabel, offsetTop });
              } else if (isTitleVisible) {
                visibleSections.push({ label: sectionLabel, offsetTop });
              }
            } else {
            }
          } else {
          }
        }
      }

      // 보이는 섹션이 있으면 가장 위에 있는 섹션을 활성화
      if (visibleSections.length > 0) {
        // offsetTop이 가장 작은(가장 위에 있는) 섹션을 선택
        visibleSections.sort((a, b) => a.offsetTop - b.offsetTop);
        newActiveSection = visibleSections[0].label;
      } else {
        // 보이는 섹션이 없으면 스크롤 위치에 따라 가장 가까운 섹션을 찾기
        let closestSection = '인적사항';
        let minDistance = Infinity;

        for (let i = 0; i < sections.length; i++) {
          const sectionLabel = sections[i];
          let sectionId = '';
          switch (sectionLabel) {
            case '인적사항':
              sectionId = 'section-personal';
              break;
            case '학력':
              sectionId = 'section-education';
              break;
            case '희망근무조건':
              sectionId = 'section-hope';
              break;
            case '보유역량':
              sectionId = 'section-ability';
              break;
            case '스킬':
              sectionId = 'section-skill';
              break;
            default:
              sectionId = '';
          }

          if (sectionId) {
            const sectionElement = document.getElementById(sectionId);
            if (sectionElement) {
              const titleElement = sectionElement.querySelector('h2.text-h2');
              if (titleElement) {
                const { offsetTop } = titleElement as HTMLElement;
                const distance = Math.abs(offsetTop - scrollTop);
                if (distance < minDistance) {
                  minDistance = distance;
                  closestSection = sectionLabel;
                }
              }
            }
          }
        }
        newActiveSection = closestSection;
      }

      // 새로운 섹션이 발견되었을 때만 상태 업데이트
      if (newActiveSection !== activeSectionRef.current) {
        setActiveSection(newActiveSection);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // 초기 로드 시에도 한 번 실행
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="w-[240px] rounded-2xl border border-gray-200 bg-white px-6 py-7 shadow-sm">
        <div className="mb-4 text-lg font-semibold text-gray-700">스펙 항목</div>
        <div className="mb-4 border-b border-gray-200" />
        <ul className="flex flex-col gap-4">
          {sidebarItems.map((item) => {
            const isActive = activeSection === item.label;
            return (
              <li
                key={item.label}
                className={`flex cursor-pointer items-center gap-3 ${isActive ? 'font-semibold text-mainBlue' : 'text-gray-400'}`}
                onClick={() => onSectionClick(item.label)}
              >
                <span>{item.icon(isActive)}</span>
                <span className={`text-base ${isActive ? 'text-mainBlue' : 'text-gray-400'}`}>
                  {item.label}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      <button
        className={`mt-6 h-12 w-[240px] rounded-xl text-lg font-semibold ${
          isAgreed
            ? 'cursor-pointer bg-mainBlue text-white hover:bg-blue-600'
            : 'cursor-not-allowed bg-gray-300 text-gray-500'
        }`}
        onClick={isAgreed ? onSave : undefined}
        disabled={!isAgreed}
      >
        등록하기
      </button>
    </div>
  );
}
