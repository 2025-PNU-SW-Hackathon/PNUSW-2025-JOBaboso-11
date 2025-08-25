import React, { useRef, useState, useEffect } from 'react';
import ScrollArrowButton from '../common/ScrollArrowButton';

interface JobPosting {
  id: number;
  companyType: string;
  deadline: string;
  jobTitle: string;
  companyName: string;
  location: string;
  experience: string;
  education: string;
}

const RecommendedJobs: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // 추천 채용 공고 목데이터
  const jobs: JobPosting[] = [
    {
      id: 1,
      companyType: '스타트업 A',
      deadline: 'D-7',
      jobTitle: '[마케팅팀] 대졸 신입/경력 채용',
      companyName: '(주)스타트업A',
      location: '부산 금정구',
      experience: '경력무관',
      education: '대졸↑',
    },
    {
      id: 2,
      companyType: '중견기업 B',
      deadline: 'D-14',
      jobTitle: '[개발팀] 프론트엔드 개발자',
      companyName: '(주)중견기업B',
      location: '서울 강남구',
      experience: '신입',
      education: '대졸↑',
    },
    {
      id: 3,
      companyType: '대기업 C',
      deadline: 'D-21',
      jobTitle: '[영업팀] 신입 영업직원',
      companyName: '(주)대기업C',
      location: '부산 해운대구',
      experience: '신입',
      education: '대졸↑',
    },
    {
      id: 4,
      companyType: '스타트업 D',
      deadline: 'D-30',
      jobTitle: '[디자인팀] UI/UX 디자이너',
      companyName: '(주)스타트업D',
      location: '서울 마포구',
      experience: '경력 2년↑',
      education: '대졸↑',
    },
    {
      id: 5,
      companyType: '중견기업 E',
      deadline: 'D-45',
      jobTitle: '[기획팀] 서비스 기획자',
      companyName: '(주)중견기업E',
      location: '부산 사하구',
      experience: '경력무관',
      education: '대졸↑',
    },
  ];

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition(); // 초기 상태 확인

      return () => {
        scrollContainer.removeEventListener('scroll', checkScrollPosition);
      };
    }
  }, []);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -448, // 카드 너비(448px)만큼 왼쪽으로 스크롤
        behavior: 'smooth',
      });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 448, // 카드 너비(448px)만큼 오른쪽으로 스크롤
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="mt-20 w-full">
      <div className="mx-auto w-[1528px]">
        <div className="text-h2 font-semibold text-gray-700">추천 채용 공고</div>
        <div className="mt-2 text-bodyMd text-gray-700">
          비슷한 스펙의 사람들이 지원하고 있는 기업들을 확인해보세요.
        </div>

        <div className="relative mt-8">
          <div ref={scrollContainerRef} className="scrollbar-hide flex gap-4 overflow-x-auto pb-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="h-[239px] w-[448px] flex-shrink-0 cursor-pointer rounded-2xl border border-[#D6D6D6] bg-white p-11 transition-shadow hover:shadow-lg"
              >
                <div className="flex flex-col items-start gap-6">
                  {/* 상단: 회사 유형과 마감일 */}
                  <div className="flex w-full flex-row items-center justify-between">
                    <span className="text-bodyLg text-gray-400">{job.companyType}</span>
                    <span className="text-h4 font-medium text-gray-400">{job.deadline}</span>
                  </div>

                  {/* 중간: 직무 제목과 회사명 */}
                  <div className="flex flex-col items-start gap-3 text-h4">
                    <h3 className="w-full font-medium text-black">{job.jobTitle}</h3>
                    <p className="w-full text-bodyLg text-[#898989]">{job.companyName}</p>
                    {/* 하단: 위치, 경력, 학력 */}
                    <div className="flex flex-row items-center gap-1.5 text-bodyLg text-gray-400">
                      <span>{job.location}</span>
                      <span className="text-gray-200">|</span>
                      <span>{job.experience}</span>
                      <span className="text-gray-200">|</span>
                      <span>{job.education}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 화살표 버튼들 */}
          <ScrollArrowButton direction="left" onClick={handleScrollLeft} visible={canScrollLeft} />
          <ScrollArrowButton
            direction="right"
            onClick={handleScrollRight}
            visible={canScrollRight}
          />
        </div>
      </div>
    </div>
  );
};

export default RecommendedJobs;
