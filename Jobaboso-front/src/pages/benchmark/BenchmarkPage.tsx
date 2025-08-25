import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { employmentCards, EmploymentCard } from '@mocks/benchmarkData';
import Pagination from '@components/common/Pagination';
import SpecCard from '@components/benchmark/SpecCard';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { getPersonalSpec, PersonalSpecResponse } from '@apis/auth';

const BenchmarkPage: React.FC = () => {
  // MissionLayout에서 전달된 refreshPoints 함수 받기
  const { refreshPoints } = useOutletContext<{ refreshPoints: () => void }>();

  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('전체');
  const [userName, setUserName] = useState('');
  const [userSchool, setUserSchool] = useState('');
  const [userMajor, setUserMajor] = useState('');
  const cardsPerPage = 15; // 한 페이지당 15개

  // 현재 페이지의 카드들 계산
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = employmentCards.slice(indexOfFirstCard, indexOfLastCard);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(employmentCards.length / cardsPerPage);

  // 3개씩 5줄로 표시하기 위해 현재 페이지 데이터를 그룹화
  const groupedCards: EmploymentCard[][] = [];
  for (let i = 0; i < currentCards.length; i += 3) {
    groupedCards.push(currentCards.slice(i, i + 3));
  }

  // 사용자 이름과 학교 정보 가져오기
  useEffect(() => {
    const name = localStorage.getItem('name');
    if (name) {
      setUserName(name);
    }

    // 사용자 학교 정보 가져오기
    const fetchUserInfo = async () => {
      try {
        const specData = await getPersonalSpec();
        setUserSchool(specData.education.school_name);
        setUserMajor(specData.education.major);
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        // 기본값 설정
        setUserSchool('부산대');
        setUserMajor('컴퓨터공학과');
      }
    };

    fetchUserInfo();
  }, []);

  // 페이지 변경 함수
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 탭 변경 함수
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCurrentPage(1); // 탭 변경 시 첫 페이지로 이동
  };

  // 탭별 콘텐츠 렌더링
  const renderTabContent = () => {
    switch (activeTab) {
      case '전체':
        return (
          <>
            {/* 벤치마크 카드 그리드 */}
            <div className="space-y-6">
              {groupedCards.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-3 gap-6">
                  {row.map((card) => (
                    <SpecCard
                      key={card.id}
                      company={card.company}
                      position={card.position}
                      internships={card.internships}
                      certificates={card.certificates}
                      university={card.university}
                      major={card.major}
                      gpa={card.gpa}
                      gpaScale={card.gpaScale}
                      acceptanceRate={card.acceptanceRate}
                      pointCost={card.pointCost}
                      result={card.result}
                      onRefresh={refreshPoints}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="mt-8 mb-8"
            />
          </>
        );
      case '나와 비슷한 스펙':
        // 상위 3개는 고정, 나머지 9개는 페이지네이션
        const remainingCards = employmentCards.slice(3); // 상위 3개 제외한 나머지
        const remainingCardsPerPage = 9; // 한 페이지당 9개
        const remainingIndexOfLastCard = currentPage * remainingCardsPerPage;
        const remainingIndexOfFirstCard = remainingIndexOfLastCard - remainingCardsPerPage;
        const currentRemainingCards = remainingCards.slice(
          remainingIndexOfFirstCard,
          remainingIndexOfLastCard
        );
        const totalRemainingPages = Math.ceil(remainingCards.length / remainingCardsPerPage);

        // 9개를 3개씩 3줄로 그룹화
        const groupedRemainingCards: EmploymentCard[][] = [];
        for (let i = 0; i < currentRemainingCards.length; i += 3) {
          groupedRemainingCards.push(currentRemainingCards.slice(i, i + 3));
        }

        return (
          <div className="space-y-6">
            {/* 카드 개수 표시 */}
            <div className="mt-7 text-left text-gray-600 text-bodyLg">총 1,070건</div>

            {/* 상위 3개 고정 카드 */}
            <div className="px-5 py-7 bg-gray-50 rounded-xl">
              <div className="flex gap-2 items-center">
                <img src="/benchmark/ic_person.svg" className="h-[24px] w-[24px]"></img>
                <div className="text-h3">{userName} 님과 가장 비슷한 지원자</div>
              </div>
              <div className="px-8 py-3 text-bodyLg">
                AI가 선별한 {userName} 님과 가장 비슷한 지원자예요.
              </div>
              <div className="grid grid-cols-3 gap-6 px-6">
                <SpecCard
                  company="토스"
                  position="프론트엔드"
                  internships="인턴 및 대외활동 8회"
                  certificates="자격증 2개"
                  university="부산대"
                  major="컴퓨터공학과"
                  gpa="4.2"
                  gpaScale="4.5"
                  acceptanceRate="98%"
                  pointCost={10}
                  result="final_accepted"
                />
                <SpecCard
                  company="토스"
                  position="프론트엔드"
                  internships="인턴 및 대외활동 1회"
                  certificates="자격증 4개"
                  university="부산대"
                  major="컴퓨터공학과"
                  gpa="4.2"
                  gpaScale="4.5"
                  acceptanceRate="98%"
                  pointCost={10}
                  result="final_accepted"
                />
                <SpecCard
                  company="토스"
                  position="프론트엔드"
                  internships="인턴 및 대외활동 8회"
                  certificates="자격증 2개"
                  university="부산대"
                  major="컴퓨터공학과"
                  gpa="4.2"
                  gpaScale="4.5"
                  acceptanceRate="98%"
                  pointCost={10}
                  result="final_accepted"
                />
              </div>
            </div>

            {/* 나머지 9개 카드 (페이지네이션) */}
            <div className="pt-3 space-y-6">
              {groupedRemainingCards.map((row, rowIndex) => (
                <div key={rowIndex} className="grid grid-cols-3 gap-6">
                  {row.map((card) => (
                    <SpecCard
                      key={card.id}
                      company={card.company}
                      position={card.position}
                      internships={card.internships}
                      certificates={card.certificates}
                      university={card.university}
                      major={card.major}
                      gpa={card.gpa}
                      gpaScale={card.gpaScale}
                      acceptanceRate={card.acceptanceRate}
                      pointCost={card.pointCost}
                      result={card.result}
                      onRefresh={refreshPoints}
                    />
                  ))}
                </div>
              ))}
            </div>

            {/* 페이지네이션 */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalRemainingPages}
              onPageChange={handlePageChange}
              className="mt-8 mb-8"
            />
          </div>
        );
      case '관심 기업':
        return (
          <div className="space-y-6">
            {/* 카드 개수 표시 */}
            <div className="mt-7 text-left text-gray-600 text-bodyLg">총 1,070건</div>

            {/* 검색창 */}
            <div className="relative">
              <div className="flex absolute inset-y-0 left-0 items-center pl-5 pointer-events-none">
                <MagnifyingGlassIcon className="w-7 h-7 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="기업을 검색해보세요. 해당 기업에 지원한 지원자들의 스펙을 볼 수 있습니다."
                className="block py-4 pr-3 pl-16 w-full placeholder-gray-400 text-gray-900 rounded-lg border border-gray-200 text-bodyLg focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
              />
            </div>

            <div className="flex items-center px-5 py-4 bg-gray-100 rounded-lg">
              <img src="/benchmark/ic_idea.svg" className="h-[24px] w-[24px]"></img>
              <div className="ml-3 text-bodyLg">아래는 {userName} 님이 관심 기업으로 설정한</div>
              <div className="ml-2 rounded-lg bg-gray-600 px-[8px] py-[2px] text-bodyMd text-white">
                부산기업 A
              </div>
              <div className="ml-1 rounded-lg bg-gray-600 px-[8px] py-[2px] text-bodyMd text-white">
                부산기업 B
              </div>
              <div className="ml-2 text-bodyLg">에 지원한 사람들의 스펙입니다.</div>
            </div>

            <div className="pt-3">
              <div className="text-h3">{userName} 님의 관심 기업 A의 지원자들</div>

              {/* 카드 3개씩 2줄 */}
              <div className="mt-6 space-y-6">
                {/* 첫 번째 줄 */}
                <div className="grid grid-cols-3 gap-6">
                  <SpecCard
                    company="부산기업 A"
                    position="프론트엔드"
                    internships="인턴 및 대외활동 5회"
                    certificates="자격증 3개"
                    university="부산대"
                    major="컴퓨터공학과"
                    gpa="4.1"
                    gpaScale="4.5"
                    acceptanceRate="95%"
                    pointCost={10}
                    result="final_accepted"
                  />
                  <SpecCard
                    company="부산기업 A"
                    position="백엔드"
                    internships="인턴 및 대외활동 3회"
                    certificates="자격증 1개"
                    university="부경대"
                    major="소프트웨어공학과"
                    gpa="3.9"
                    gpaScale="4.5"
                    acceptanceRate="92%"
                    pointCost={10}
                    result="final_accepted"
                  />
                  <SpecCard
                    company="부산기업 A"
                    position="프론트엔드"
                    internships="인턴 및 대외활동 7회"
                    certificates="자격증 4개"
                    university="동아대"
                    major="컴퓨터공학과"
                    gpa="4.3"
                    gpaScale="4.5"
                    acceptanceRate="97%"
                    pointCost={10}
                    result="final_accepted"
                  />
                </div>

                {/* 두 번째 줄 */}
                <div className="grid grid-cols-3 gap-6">
                  <SpecCard
                    company="부산기업 A"
                    position="백엔드"
                    internships="인턴 및 대외활동 2회"
                    certificates="자격증 2개"
                    university="동서대"
                    major="정보통신공학과"
                    gpa="3.8"
                    gpaScale="4.5"
                    acceptanceRate="89%"
                    pointCost={10}
                    result="final_accepted"
                  />
                  <SpecCard
                    company="부산기업 A"
                    position="프론트엔드"
                    internships="인턴 및 대외활동 6회"
                    certificates="자격증 3개"
                    university="동의대"
                    major="컴퓨터공학과"
                    gpa="4.0"
                    gpaScale="4.5"
                    acceptanceRate="94%"
                    pointCost={10}
                    result="final_accepted"
                  />
                  <SpecCard
                    company="부산기업 A"
                    position="백엔드"
                    internships="인턴 및 대외활동 4회"
                    certificates="자격증 2개"
                    university="부경대"
                    major="소프트웨어공학과"
                    gpa="3.7"
                    gpaScale="4.5"
                    acceptanceRate="91%"
                    pointCost={10}
                    result="final_accepted"
                  />
                </div>
              </div>
            </div>
            <div className="pt-5">
              <div className="text-h3">{userName} 님의 관심 기업 B의 지원자들</div>

              {/* 카드 3개씩 2줄 */}
              <div className="mt-6 space-y-6">
                {/* 첫 번째 줄 */}
                <div className="grid grid-cols-3 gap-6">
                  <SpecCard
                    company="부산기업 B"
                    position="프론트엔드"
                    internships="인턴 및 대외활동 5회"
                    certificates="자격증 3개"
                    university="동아대"
                    major="컴퓨터공학과"
                    gpa="4.1"
                    gpaScale="4.5"
                    acceptanceRate="95%"
                    pointCost={10}
                    result="final_accepted"
                  />
                  <SpecCard
                    company="부산기업 B"
                    position="백엔드"
                    internships="인턴 및 대외활동 3회"
                    certificates="자격증 1개"
                    university="동서대"
                    major="소프트웨어공학과"
                    gpa="3.9"
                    gpaScale="4.5"
                    acceptanceRate="92%"
                    pointCost={10}
                    result="final_accepted"
                  />
                  <SpecCard
                    company="부산기업 B"
                    position="프론트엔드"
                    internships="인턴 및 대외활동 7회"
                    certificates="자격증 4개"
                    university="동의대"
                    major="컴퓨터공학과"
                    gpa="4.3"
                    gpaScale="4.5"
                    acceptanceRate="97%"
                    pointCost={10}
                    result="final_accepted"
                  />
                </div>

                {/* 두 번째 줄 */}
                <div className="grid grid-cols-3 gap-6">
                  <SpecCard
                    company="부산기업 B"
                    position="백엔드"
                    internships="인턴 및 대외활동 2회"
                    certificates="자격증 2개"
                    university="부경대"
                    major="정보통신공학과"
                    gpa="3.8"
                    gpaScale="4.5"
                    acceptanceRate="89%"
                    pointCost={10}
                    result="final_accepted"
                  />
                  <SpecCard
                    company="부산기업 B"
                    position="프론트엔드"
                    internships="인턴 및 대외활동 6회"
                    certificates="자격증 3개"
                    university="동아대"
                    major="컴퓨터공학과"
                    gpa="4.0"
                    gpaScale="4.5"
                    acceptanceRate="94%"
                    pointCost={10}
                    result="final_accepted"
                  />
                  <SpecCard
                    company="부산기업 B"
                    position="백엔드"
                    internships="인턴 및 대외활동 4회"
                    certificates="자격증 2개"
                    university="동서대"
                    major="소프트웨어공학과"
                    gpa="3.7"
                    gpaScale="4.5"
                    acceptanceRate="91%"
                    pointCost={10}
                    result="final_accepted"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case '동일 학교':
        return (
          <div className="space-y-6">
            {/* 카드 개수 표시 */}
            <div className="mt-7 text-left text-gray-600 text-bodyLg">총 1,070건</div>

            <div className="pt-3">
              <div className="text-h3">{userSchool} 학생들의 스펙</div>

              {/* 카드 3개씩 2줄 */}
              <div className="mt-6 space-y-6">
                {/* 첫 번째 줄 */}
                <div className="grid grid-cols-3 gap-6">
                  <SpecCard
                    company="삼성전자"
                    position="프론트엔드"
                    internships="인턴 및 대외활동 6회"
                    certificates="자격증 3개"
                    university={userSchool}
                    major="소프트웨어공학과"
                    gpa="4.2"
                    gpaScale="4.5"
                    acceptanceRate="96%"
                    pointCost={10}
                    result="final_accepted"
                  />
                  <SpecCard
                    company="LG전자"
                    position="백엔드"
                    internships="인턴 및 대외활동 4회"
                    certificates="자격증 2개"
                    university={userSchool}
                    major="정보통신공학과"
                    gpa="3.9"
                    gpaScale="4.5"
                    acceptanceRate="93%"
                    pointCost={10}
                    result="final_accepted"
                  />
                  <SpecCard
                    company="네이버"
                    position="프론트엔드"
                    internships="인턴 및 대외활동 8회"
                    certificates="자격증 5개"
                    university={userSchool}
                    major="컴퓨터공학과"
                    gpa="4.4"
                    gpaScale="4.5"
                    acceptanceRate="98%"
                    pointCost={10}
                    result="final_accepted"
                  />
                </div>

                {/* 두 번째 줄 */}
                <div className="grid grid-cols-3 gap-6">
                  <SpecCard
                    company="카카오"
                    position="백엔드"
                    internships="인턴 및 대외활동 3회"
                    certificates="자격증 1개"
                    university={userSchool}
                    major="전자공학과"
                    gpa="3.8"
                    gpaScale="4.5"
                    acceptanceRate="91%"
                    pointCost={10}
                    result="final_accepted"
                  />
                  <SpecCard
                    company="토스"
                    position="프론트엔드"
                    internships="인턴 및 대외활동 7회"
                    certificates="자격증 4개"
                    university={userSchool}
                    major="산업공학과"
                    gpa="4.1"
                    gpaScale="4.5"
                    acceptanceRate="95%"
                    pointCost={10}
                    result="final_accepted"
                  />
                  <SpecCard
                    company="쿠팡"
                    position="백엔드"
                    internships="인턴 및 대외활동 5회"
                    certificates="자격증 3개"
                    university={userSchool}
                    major="기계공학과"
                    gpa="3.7"
                    gpaScale="4.5"
                    acceptanceRate="89%"
                    pointCost={10}
                    result="final_accepted"
                  />
                </div>
              </div>
            </div>
            <div className="pt-5">
              <div className="text-h3">
                {userSchool} {userMajor} 학생들의 스펙
              </div>

              {/* 카드 3개씩 2줄 */}
              <div className="mt-6 space-y-6">
                {/* 첫 번째 줄 */}
                <div className="grid grid-cols-3 gap-6">
                  <SpecCard
                    company="삼성전자"
                    position="프론트엔드"
                    internships="인턴 및 대외활동 5회"
                    certificates="자격증 3개"
                    university={userSchool}
                    major={userMajor}
                    gpa="4.1"
                    gpaScale="4.5"
                    acceptanceRate="95%"
                    pointCost={10}
                    result="final_accepted"
                  />
                  <SpecCard
                    company="LG전자"
                    position="백엔드"
                    internships="인턴 및 대외활동 3회"
                    certificates="자격증 1개"
                    university={userSchool}
                    major={userMajor}
                    gpa="3.9"
                    gpaScale="4.5"
                    acceptanceRate="92%"
                    pointCost={10}
                    result="final_accepted"
                  />
                  <SpecCard
                    company="네이버"
                    position="프론트엔드"
                    internships="인턴 및 대외활동 7회"
                    certificates="자격증 4개"
                    university={userSchool}
                    major={userMajor}
                    gpa="4.3"
                    gpaScale="4.5"
                    acceptanceRate="97%"
                    pointCost={10}
                    result="final_accepted"
                  />
                </div>

                {/* 두 번째 줄 */}
                <div className="grid grid-cols-3 gap-6">
                  <SpecCard
                    company="카카오"
                    position="백엔드"
                    internships="인턴 및 대외활동 2회"
                    certificates="자격증 2개"
                    university={userSchool}
                    major={userMajor}
                    gpa="3.8"
                    gpaScale="4.5"
                    acceptanceRate="89%"
                    pointCost={10}
                    result="final_accepted"
                  />
                  <SpecCard
                    company="토스"
                    position="프론트엔드"
                    internships="인턴 및 대외활동 6회"
                    certificates="자격증 3개"
                    university={userSchool}
                    major={userMajor}
                    gpa="4.0"
                    gpaScale="4.5"
                    acceptanceRate="94%"
                    pointCost={10}
                    result="final_accepted"
                  />
                  <SpecCard
                    company="쿠팡"
                    position="백엔드"
                    internships="인턴 및 대외활동 4회"
                    certificates="자격증 2개"
                    university={userSchool}
                    major={userMajor}
                    gpa="3.7"
                    gpaScale="4.5"
                    acceptanceRate="91%"
                    pointCost={10}
                    result="final_accepted"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* 벤치마크 카드 그리드 1/2 (조건 맞아야 노출) */}
      <div className="px-10 py-6 bg-gray-50 rounded-xl">
        <div className="flex gap-2 items-center">
          <img src="/benchmark/ic_star.svg" className="h-[32px] w-[32px]"></img>
          <div className="text-h4">잡메이트 분석 결과</div>
        </div>
        <div className="pt-4 pl-10 whitespace-pre-line text-bodyLg">
          {`합격자와 비교했을 때, 상대적으로 인턴 역량이 부족해요. 평균적으로 합격자들은 ‘인턴’ 이력을 1개 이상 보유하고 있어요.
          이 부분을 보완하시면, 더 좋은 결과를 얻을 수 있을 거예요! ☺️`}
        </div>
      </div>

      {/* 벤치마크 카드 그리드 2/2 (조건 맞아야 노출) */}
      <div className="pt-10 pb-10">
        <div className="text-h2">합격 가능성을 넓히는 기회! ✨</div>
        <div className="mt-4 text-bodyLg">
          현재 스펙과 유사한 수준을 요구하는 기업을 추천드려요. 합격 가능성이 높은 곳부터 확인해
          보세요!
        </div>
        <div className="grid grid-cols-3 gap-6 mt-4">
          <div className="rounded-xl border-[1.5px] border-gray-300 px-7 py-6">
            <div className="flex gap-4">
              <div className="h-[40px] w-[40px] rounded-full bg-gray-300"></div>
              <div className="mt-1 text-h3">부산교통공사</div>
            </div>
            <div className="ml-14 text-bodyLg">서버 인프라 관리직 채용 (정규직)</div>
          </div>
          <div className="rounded-xl border-[1.5px] border-gray-300 px-7 py-6">
            <div className="flex gap-4">
              <div className="h-[40px] w-[40px] rounded-full bg-gray-300"></div>
              <div className="mt-1 text-h3">네이버 클라우드</div>
            </div>
            <div className="ml-14 text-bodyLg">서버 보안 엔지니어 채용 (계약직</div>
          </div>
          <div className="rounded-xl border-[1.5px] border-gray-300 px-7 py-6">
            <div className="flex gap-4">
              <div className="h-[40px] w-[40px] rounded-full bg-gray-300"></div>
              <div className="mt-1 text-h3">IT 인프라 운영직 채용 (신입)</div>
            </div>
            <div className="ml-14 text-bodyLg">서버 인프라 관리직 채용 (정규직)</div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="">
        <div className="flex space-x-8">
          {['전체', '나와 비슷한 스펙', '관심 기업', '동일 학교'].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 text-h3 font-medium transition-colors ${
                activeTab === tab
                  ? 'border-b-[3px] border-mainBlue text-gray-900'
                  : 'border-b-[3px] border-white text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 선택된 탭의 총 건수 표시 */}
        {activeTab === '전체' && (
          <div className="mt-7 text-left text-gray-600 text-bodyLg">총 1,070건</div>
        )}
      </div>

      {/* 탭별 콘텐츠 */}
      {renderTabContent()}
    </div>
  );
};

export default BenchmarkPage;
