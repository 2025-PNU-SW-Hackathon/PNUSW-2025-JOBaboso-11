import React, { useRef, useState, useEffect } from 'react';
import pinIcon from '/pin.svg';
import { Link } from 'react-router-dom';
import ScrollArrowButton from '../common/ScrollArrowButton';

interface EmploymentInsightsProps {
  userName: string;
}

const EmploymentInsights: React.FC<EmploymentInsightsProps> = ({ userName }) => {
  // 뉴스 섹션 스크롤 관련
  const newsScrollRef = useRef<HTMLDivElement>(null);
  const [canNewsScrollLeft, setCanNewsScrollLeft] = useState(false);
  const [canNewsScrollRight, setCanNewsScrollRight] = useState(true);

  // 지원 프로그램 섹션 스크롤 관련
  const supportScrollRef = useRef<HTMLDivElement>(null);
  const [canSupportScrollLeft, setCanSupportScrollLeft] = useState(false);
  const [canSupportScrollRight, setCanSupportScrollRight] = useState(true);

  // 스크롤 위치 확인 함수
  const checkNewsScrollPosition = () => {
    if (newsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = newsScrollRef.current;
      setCanNewsScrollLeft(scrollLeft > 0);
      setCanNewsScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const checkSupportScrollPosition = () => {
    if (supportScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = supportScrollRef.current;
      setCanSupportScrollLeft(scrollLeft > 0);
      setCanSupportScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // 스크롤 이벤트 리스너 설정
  useEffect(() => {
    const newsContainer = newsScrollRef.current;
    const supportContainer = supportScrollRef.current;

    if (newsContainer) {
      newsContainer.addEventListener('scroll', checkNewsScrollPosition);
      checkNewsScrollPosition();
    }

    if (supportContainer) {
      supportContainer.addEventListener('scroll', checkSupportScrollPosition);
      checkSupportScrollPosition();
    }

    return () => {
      if (newsContainer) {
        newsContainer.removeEventListener('scroll', checkNewsScrollPosition);
      }
      if (supportContainer) {
        supportContainer.removeEventListener('scroll', checkSupportScrollPosition);
      }
    };
  }, []);

  // 스크롤 핸들러 함수들
  const handleNewsScrollLeft = () => {
    if (newsScrollRef.current) {
      newsScrollRef.current.scrollBy({ left: -240, behavior: 'smooth' });
    }
  };

  const handleNewsScrollRight = () => {
    if (newsScrollRef.current) {
      newsScrollRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  const handleSupportScrollLeft = () => {
    if (supportScrollRef.current) {
      supportScrollRef.current.scrollBy({ left: -208, behavior: 'smooth' });
    }
  };

  const handleSupportScrollRight = () => {
    if (supportScrollRef.current) {
      supportScrollRef.current.scrollBy({ left: 208, behavior: 'smooth' });
    }
  };

  return (
    <div className="mt-20 w-full bg-subLightBlue py-12">
      <div className="mx-auto w-[1528px]">
        <div className="text-h2">취업 인사이트 📊</div>
        <div className="mt-2 text-bodyMd">취업에 인사이트가 될 수 있는 정보들을 제공합니다.</div>

        {/* 상단 두 개의 큰 카드 */}
        <div className="mt-8 grid grid-cols-3 gap-6">
          {/* 부산대학교 정보컴퓨터공학과 합격 통계 */}
          <div className="col-span-2 rounded-2xl bg-white p-10">
            <div className="text-h3 font-semibold text-gray-700">
              부산대학교 정보컴퓨터공학과 합격 통계
            </div>
            <div className="mt-2 text-bodyMd text-gray-700">
              {userName} 님의 학교, 학과의 올해 통계예요.
            </div>

            <div className="mt-8 grid grid-cols-11 gap-6">
              {/* 합격률 - 도넛 차트 */}
              <div className="col-span-3 rounded-2xl bg-gray-50 p-6">
                <div className="mb-2 text-h4 font-medium text-gray-700">합격률</div>
                <div className="relative mx-auto h-36 w-36">
                  {/* 배경 원 */}
                  <svg className="-rotate-270 h-36 w-36 transform" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="#00228B" strokeWidth="12" />
                    {/* 75% 채워진 부분 */}
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke="#1779FA"
                      strokeWidth="12"
                      strokeDasharray="197.9 263.9"
                      strokeDashoffset="0"
                    />
                  </svg>
                  {/* 중앙 퍼센트 */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      style={{
                        fontFamily: 'Pretendard',
                        fontStyle: 'normal',
                        fontWeight: '700',
                        fontSize: '28px',
                        lineHeight: '33px',
                        background: 'linear-gradient(180deg, #374151 0%, #1779FA 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      75.0%
                    </span>
                  </div>
                </div>
              </div>

              {/* 가장 많이 합격한 기업 */}
              <div className="col-span-4 rounded-2xl bg-gray-50 p-6">
                <div className="mb-4 text-h4 font-medium text-gray-700">가장 많이 합격한 기업</div>
                <div className="space-y-2">
                  {[
                    { name: '부산교통공사', percentage: '41.2%', medal: 'ic_gold_medal.svg' },
                    { name: '부산도시철도', percentage: '12.1%', medal: 'ic_silver_medal.svg' },
                    { name: '부산부산부산', percentage: '10.9%', medal: 'ic_bronze_medal.svg' },
                  ].map((company, index) => (
                    <div
                      key={index}
                      className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gradient-to-r from-white to-blue-50 px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={`/staff/${company.medal}`}
                          alt={`${index + 1}위 메달`}
                          className="h-5 w-5"
                        />
                        <span className="text-sm">{company.name}</span>
                      </div>
                      <span className="text-bodySm text-gray-700">{company.percentage}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 가장 인기 있는 기업 */}
              <div className="col-span-4 rounded-2xl bg-gray-50 p-6">
                <div className="mb-4 text-h4 font-medium text-gray-700">가장 인기 있는 기업</div>
                <div className="space-y-2">
                  {[
                    { name: '부산교통공사', percentage: '41.2%', medal: 'ic_gold_medal.svg' },
                    { name: '부산도시철도', percentage: '12.1%', medal: 'ic_silver_medal.svg' },
                    { name: '부산부산부산', percentage: '10.9%', medal: 'ic_bronze_medal.svg' },
                  ].map((company, index) => (
                    <div
                      key={index}
                      className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gradient-to-r from-white to-blue-50 px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={`/staff/${company.medal}`}
                          alt={`${index + 1}위 메달`}
                          className="h-5 w-5"
                        />
                        <span className="text-sm">{company.name}</span>
                      </div>
                      <span className="text-bodySm text-gray-700">{company.percentage}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 개발자 관련 최신 이슈 */}
          <div className="col-span-1 rounded-xl bg-white p-10 pb-3">
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="text-h3 font-semibold">📰 개발자 관련 최신 이슈</div>
              </div>
              <Link to="#" className="hover:none text-sm text-gray-600">
                전체보기 {'>'}
              </Link>
            </div>

            <div className="relative">
              <div ref={newsScrollRef} className="scrollbar-hide flex gap-4 overflow-x-auto pb-4">
                {[
                  {
                    image: '/corporate.jpg',
                    source: 'Google Cloud 조사',
                    headline: '게임 개발자 87% AI 에이전트 활용…창의적 요소에도 AI 도입 급증',
                    date: '2025-08-18',
                  },
                  {
                    image: '/corporate.jpg',
                    source: 'WIRED 팟캐스트',
                    headline: '"Vibe Coding" 시대 도래…AI로 코드 생성하는 새 개발 흐름',
                    date: '2025-08-22',
                  },
                  {
                    image: '/corporate.jpg',
                    source: 'AWS CEO 코멘트',
                    headline: 'AWS CEO "주니어 개발자를 AI로 대체하는 건 어리석은 일" 강조',
                    date: '2025-08-23',
                  },
                ].map((news, index) => (
                  <div
                    key={index}
                    className="w-60 flex-shrink-0 rounded-2xl border border-gray-200 bg-white"
                  >
                    <div className="relative h-32 overflow-hidden rounded-t-2xl bg-gray-200">
                      <img
                        src={news.image}
                        alt={news.headline}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="h-4 w-4 rounded-full bg-gray-400"></div>
                        <span className="text-bodySm text-gray-600">{news.source}</span>
                      </div>
                      <h4 className="mb-2 line-clamp-2 text-bodyMd font-medium">{news.headline}</h4>
                      <p className="text-bodySm text-gray-600">{news.date}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 뉴스 화살표 버튼들 */}
              <ScrollArrowButton
                direction="left"
                onClick={handleNewsScrollLeft}
                visible={canNewsScrollLeft}
              />
              <ScrollArrowButton
                direction="right"
                onClick={handleNewsScrollRight}
                visible={canNewsScrollRight}
              />
            </div>
          </div>
        </div>

        {/* 하단 두 개의 카드 */}
        <div className="mt-6 grid grid-cols-3 gap-6">
          {/* 부산대학교 SW센터 공지사항 */}
          <div className="col-span-1 rounded-xl bg-white p-10">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-h3 font-semibold">부산대학교 SW센터 공지사항</div>
              <Link to="#" className="hover:none text-sm text-gray-600">
                자세히 보기 {'>'}
              </Link>
            </div>

            <div className="space-y-1">
              {[
                {
                  title: '2025 취업특강 - BNK부산은행 채용설명회 개최 안내',
                  isHighlighted: true,
                  link: 'https://swedu.pusan.ac.kr/swedu/31630/subview.do?enc=Zm5jdDF8QEB8JTJGYmJzJTJGc3dlZHUlMkY2OTA2JTJGMTczNjc5MiUyRmFydGNsVmlldy5kbyUzRmJic09wZW5XcmRTZXElM0QlMjZpc1ZpZXdNaW5lJTNEZmFsc2UlMjZzcmNoQ29sdW1uJTNEJTI2cGFnZSUzRDElMjZzcmNoV3JkJTNEJTI2cmdzQmduZGVTdHIlM0QlMjZiYnNDbFNlcSUzRCUyNnBhc3N3b3JkJTNEJTI2cmdzRW5kZGVTdHIlM0QlMjY%3D',
                },
                {
                  title: '[홍보] 2025년 AI 톡톡 코딩 공모전 개최',
                  isHighlighted: false,
                  link: 'https://swedu.pusan.ac.kr/swedu/31630/subview.do?enc=Zm5jdDF8QEB8JTJGYmJzJTJGc3dlZHUlMkY2OTA2JTJGMTczNjI0NiUyRmFydGNsVmlldy5kbyUzRmJic09wZW5XcmRTZXElM0QlMjZpc1ZpZXdNaW5lJTNEZmFsc2UlMjZzcmNoQ29sdW1uJTNEJTI2cGFnZSUzRDElMjZzcmNoV3JkJTNEJTI2cmdzQmduZGVTdHIlM0QlMjZiYnNDbFNlcSUzRCUyNnBhc3N3b3JkJTNEJTI2cmdzRW5kZGVTdHIlM0QlMjY%3D',
                },
                {
                  title:
                    '[부산대 KDT] 잔여석 교육생 모집 (AI 데이터 분석 풀스택 웹 개발자 양성과정)',
                  isHighlighted: false,
                  link: 'https://swedu.pusan.ac.kr/swedu/31630/subview.do?enc=Zm5jdDF8QEB8JTJGYmJzJTJGc3dlZHUlMkY2OTA2JTJGMTczNTczMiUyRmFydGNsVmlldy5kbyUzRmJic09wZW5XcmRTZXElM0QlMjZpc1ZpZXdNaW5lJTNEZmFsc2UlMjZzcmNoQ29sdW1uJTNEJTI2cGFnZSUzRDElMjZzcmNoV3JkJTNEJTI2cmdzQmduZGVTdHIlM0QlMjZiYnNDbFNlcSUzRCUyNnBhc3N3b3JkJTNEJTI2cmdzRW5kZGVTdHIlM0QlMjY%3D',
                },
                {
                  title: '[모집] 2025 PNU SW 취업특강 - AWS 아키텍트와 함께하는 생성형 AI 실무특강',
                  isHighlighted: false,
                  link: 'https://swedu.pusan.ac.kr/swedu/31630/subview.do?enc=Zm5jdDF8QEB8JTJGYmJzJTJGc3dlZHUlMkY2OTA2JTJGMTczNTY5MyUyRmFydGNsVmlldy5kbyUzRmJic09wZW5XcmRTZXElM0QlMjZpc1ZpZXdNaW5lJTNEZmFsc2UlMjZzcmNoQ29sdW1uJTNEJTI2cGFnZSUzRDElMjZzcmNoV3JkJTNEJTI2cmdzQmduZGVTdHIlM0QlMjZiYnNDbFNlcSUzRCUyNnBhc3N3b3JkJTNEJTI2cmdzRW5kZGVTdHIlM0QlMjY%3D',
                },
                {
                  title: '[홍보] LG유플러스 유레카 SW교육과정 3기 모집(부산대학교 특전)',
                  isHighlighted: false,
                  link: 'https://swedu.pusan.ac.kr/swedu/31630/subview.do?enc=Zm5jdDF8QEB8JTJGYmJzJTJGc3dlZHUlMkY2OTA2JTJGMTczMzQ5NiUyRmFydGNsVmlldy5kbyUzRmJic09wZW5XcmRTZXElM0QlMjZpc1ZpZXdNaW5lJTNEZmFsc2UlMjZzcmNoQ29sdW1uJTNEJTI2cGFnZSUzRDElMjZzcmNoV3JkJTNEJTI2cmdzQmduZGVTdHIlM0QlMjZiYnNDbFNlcSUzRCUyNnBhc3N3b3JkJTNEJTI2cmdzRW5kZGVTdHIlM0QlMjY%3D',
                },
              ].map((announcement, index) => (
                <div key={index}>
                  <a
                    href={announcement.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex cursor-pointer items-center gap-2 rounded-lg p-2 transition-colors hover:bg-gray-50"
                  >
                    {announcement.isHighlighted ? (
                      <img src={pinIcon} alt="핀" className="h-4 w-4" />
                    ) : (
                      <div className="h-2 w-2 rounded-full bg-gray-300"></div>
                    )}
                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-800 transition-colors hover:text-mainBlue">
                      {announcement.title}
                    </span>
                  </a>
                  {announcement.isHighlighted && (
                    <div className="order-1 my-3 h-px w-full flex-none flex-grow-0 self-stretch bg-gray-200"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 나를 위한 취업 지원 */}
          <div className="col-span-2 rounded-xl bg-white p-10 pb-4">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-h3 font-semibold">나를 위한 취업 지원</div>
              <Link to="#" className="hover:none text-sm text-gray-600">
                전체보기 {'>'}
              </Link>
            </div>
            <div className="mb-4 text-bodyMd text-gray-600">
              {userName} 님이 받을 수 있는 취업 지원들이에요. 얼른 확인해보세요! ✨
            </div>

            <div className="relative">
              <div
                ref={supportScrollRef}
                className="scrollbar-hide flex gap-4 overflow-x-auto pb-4"
              >
                {[
                  {
                    title: '취업장려금',
                    description: '부산지역 대학을 졸업한 자에게만 주어지는 혜택이에요.',
                    link: '#',
                  },
                  {
                    title: '부산지역인재 \n 장학금',
                    description: '부산지역 대학의 IT 및 상경 분야 대학생 3, 4학년만 지원 가능해요.',
                    link: '#',
                  },
                  {
                    title: '정장대여 서비스',
                    description: '취업준비생 입사면접용 정장을 무료대여 할 수 있는 혜택이에요.',
                    link: '#',
                  },
                  {
                    title: '청년 일자리도약 \n 장려금',
                    description: '사업주 및 근로자를 지원하는 장려금이에요.',
                    link: '#',
                  },
                  {
                    title: '국민 취업',
                    description:
                      '근로능력과 구직 취업에 어려움을 겪는 청년을 위한 지원 프로그램이에요.',
                    link: '#',
                  },
                ].map((support, index) => (
                  <div
                    key={index}
                    className="h-48 w-52 flex-shrink-0 rounded-2xl bg-[#F5FAFF] p-4 pb-0 transition-colors hover:bg-gray-100"
                  >
                    <div className="mb-2 flex justify-end">
                      <Link
                        to={support.link}
                        className="mb-1 text-caption text-gray-600 hover:text-gray-800"
                      >
                        자세히 보기 {'>'}
                      </Link>
                    </div>
                    <div className="mb-4 h-14 whitespace-pre-line text-h3 font-semibold tracking-[0%] text-gray-700">
                      {support.title}
                    </div>
                    <div className="mt-2 text-xs text-gray-600">{support.description}</div>
                  </div>
                ))}
              </div>

              {/* 지원 프로그램 화살표 버튼들 */}
              <ScrollArrowButton
                direction="left"
                onClick={handleSupportScrollLeft}
                visible={canSupportScrollLeft}
              />
              <ScrollArrowButton
                direction="right"
                onClick={handleSupportScrollRight}
                visible={canSupportScrollRight}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmploymentInsights;
