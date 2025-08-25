import React, { useEffect, useState } from 'react';
import { InputField } from '@components/common/InputField';
import Button from '@components/common/Button';
import { ReviewFormData } from './ReviewWriteForm';
import { companies } from '@data/companyPositions';
import api from '../../apis/api';

interface CompanyInfoSectionProps {
  formData: ReviewFormData;
  onUpdate: (updates: Partial<ReviewFormData>) => void;
}

interface Application {
  id: number;
  user_id: string;
  company_name: string;
  position: string;
  application_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Company {
  id: string; // 회사명 키로 사용 (API 실패시), 기본은 application id -> string
  name: string;
  logo: string;
  industry: string;
  type: string;
  reviewCount: number;
}

export const CompanyInfoSection: React.FC<CompanyInfoSectionProps> = ({ formData, onUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
  const [companyPositionsMap, setCompanyPositionsMap] = useState<Record<string, string[]>>({});
  const [companyApplicationIdMap, setCompanyApplicationIdMap] = useState<Record<string, number>>(
    {}
  );
  // 편집 모드 등으로 폼 데이터가 채워졌을 때, 내부 선택 상태에 반영
  useEffect(() => {
    if (Array.isArray(formData.positions)) {
      setSelectedJobs(formData.positions.slice(0, 5));
    }
  }, [formData.positions]);

  const handleSearchCompany = () => {
    setIsModalOpen(true);
    // 모달이 열리면 바로 기업 목록 로드
    loadCompanyList();
  };

  const handleSearchPosition = () => {
    setIsJobModalOpen(true);
  };

  const handleJobSelection = (job: string) => {
    if (selectedJobs.includes(job)) {
      setSelectedJobs(selectedJobs.filter((j) => j !== job));
    } else if (selectedJobs.length < 5) {
      setSelectedJobs([...selectedJobs, job]);
    }
  };

  const handleConfirmJobSelection = () => {
    // 선택된 직무를 formData에 업데이트
    onUpdate({ positions: selectedJobs });
    setIsJobModalOpen(false);
  };

  const loadCompanyList = async () => {
    setIsLoading(true);

    try {
      const response = await api.get('/job-reviews/available-applications');
      const applications: Application[] = response.data;

      // 회사명 기준으로 직무 그룹핑 및 유니크 회사 목록 생성
      const companyToPositionsSet: Record<string, Set<string>> = applications.reduce(
        (acc, app) => {
          const companyName = app.company_name;
          if (!acc[companyName]) {
            acc[companyName] = new Set<string>();
          }
          if (app.position) {
            acc[companyName].add(app.position);
          }
          return acc;
        },
        {} as Record<string, Set<string>>
      );

      // 회사별 최신 application id 매핑 (application_date 기준 최신 선택)
      const companyToLatestApplicationId: Record<string, number> = applications.reduce(
        (acc, app) => {
          const companyName = app.company_name;
          const currentId = acc[companyName];
          if (!currentId) {
            acc[companyName] = app.id;
          } else {
            // 기존 저장된 id의 날짜와 비교하여 더 최신이면 교체
            const prevApp = applications.find((a) => a.id === currentId);
            const prevDate = prevApp ? new Date(prevApp.application_date).getTime() : 0;
            const curDate = new Date(app.application_date).getTime();
            if (curDate > prevDate) {
              acc[companyName] = app.id;
            }
          }
          return acc;
        },
        {} as Record<string, number>
      );

      const matchedCompanies: Company[] = Object.keys(companyToPositionsSet).map((companyName) => {
        const companyData = companies.find((comp) => comp.name === companyName);
        if (companyData) {
          return {
            id: companyName,
            name: companyData.name,
            logo: companyData.logo || '🏢',
            industry: companyData.industry,
            type: companyData.companyType,
            reviewCount: Math.floor(Math.random() * 5000) + 100,
          };
        }
        return {
          id: companyName,
          name: companyName,
          logo: '🏢',
          industry: '정보 없음',
          type: '정보 없음',
          reviewCount: 0,
        };
      });

      setCompanyPositionsMap(
        Object.fromEntries(
          Object.entries(companyToPositionsSet).map(([name, set]) => [name, Array.from(set)])
        )
      );
      setCompanyApplicationIdMap(companyToLatestApplicationId);
      setSearchResults(matchedCompanies);
    } catch (error) {
      console.error('기업 목록을 불러오는데 실패했습니다:', error);

      // API 오류 시 더미 데이터 표시
      const dummyCompanies: Company[] = [
        {
          id: '1',
          name: '삼성전자',
          logo: '/company_porfile/samsung.svg',
          industry: '이동전화기 제조업',
          type: '대기업',
          reviewCount: 3192,
        },
        {
          id: '2',
          name: 'LG전자',
          logo: '/company_porfile/lg.svg',
          industry: '통신 및 방송 장비 제조업',
          type: '대기업',
          reviewCount: 1098,
        },
        {
          id: '3',
          name: '현대자동차',
          logo: '/company_porfile/hyundai.svg',
          industry: '승용차 및 기타 여객용 자동차 제조업',
          type: '대기업',
          reviewCount: 967,
        },
        {
          id: '4',
          name: '네이버클라우드',
          logo: '/company_porfile/navercloud.svg',
          industry: '포털 및 기타 인터넷 정보매개 서비스',
          type: '대기업',
          reviewCount: 543,
        },
        {
          id: '5',
          name: '비바리퍼블리카 (Toss)',
          logo: '/company_porfile/toss.svg',
          industry: '그 외 기타 금융 지원 서비스업',
          type: '스타트업',
          reviewCount: 789,
        },
      ];

      setSearchResults(dummyCompanies);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCompany = (company: Company) => {
    setSelectedCompanyId(company.id);
  };

  const handleConfirmSelection = () => {
    if (selectedCompanyId) {
      const selectedCompany = searchResults.find((c) => c.id === selectedCompanyId);
      if (selectedCompany) {
        const positions =
          companyPositionsMap[selectedCompany.name] ||
          companyPositionsMap[selectedCompany.id] ||
          [];
        const uniquePositions = Array.from(new Set(positions)).slice(0, 5);
        const applicationId =
          companyApplicationIdMap[selectedCompany.name] ??
          companyApplicationIdMap[selectedCompany.id] ??
          null;
        onUpdate({ companyName: selectedCompany.name, positions: uniquePositions, applicationId });
        setSelectedJobs(uniquePositions);
        setIsModalOpen(false);
        setSearchResults([]);
        setSelectedCompanyId(null);
      }
    }
  };

  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 3; i <= currentYear + 5; i++) {
      years.push(String(i));
    }
    return years;
  };

  const generateMonths = () => {
    const months = [];
    for (let i = 1; i <= 12; i++) {
      months.push(String(i));
    }
    return months;
  };

  return (
    <>
      <div className="mb-4 text-h2">기업 정보</div>
      <div className="mb-20">
        {/* 기업명 입력 및 검색 */}
        <div className="mb-6">
          <div className="flex w-[1096px] items-center gap-4">
            <InputField
              id="company-search"
              label="기업명 *"
              placeholder="기업명을 입력하세요."
              value={formData.companyName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onUpdate({ companyName: e.target.value })
              }
              className="!mx-0 w-[880px]"
            />
            <Button
              onClick={handleSearchCompany}
              className="mt-5 h-[66px] w-auto whitespace-nowrap rounded-lg !border !border-mainBlue !bg-white px-[16px] !text-mainBlue"
            >
              입사지원 기업 검색하기
            </Button>
          </div>
        </div>

        {/* 직무 입력 및 검색 */}
        <div className="mb-6">
          <div className="flex w-[1096px] items-center gap-4">
            <InputField
              id="position-search"
              label="직무 *"
              placeholder="직무를 선택하세요. (최대 5개까지 선택 가능)"
              value={selectedJobs.length > 0 ? selectedJobs.join(', ') : ''}
              onChange={() => {}}
              className="!mx-0 w-[880px]"
              disabled={false}
            />
            <Button
              onClick={handleSearchPosition}
              className="mt-5 h-[66px] w-auto whitespace-nowrap rounded-lg !border !border-mainBlue !bg-white px-[16px] !text-mainBlue"
            >
              직무 선택하기
            </Button>
          </div>
        </div>

        {/* 면접 당시 경력 */}
        <div className="mb-12">
          <label className="mb-2 block p-1 text-h4 font-medium text-gray-700">
            면접 당시 경력 <span className="text-red-500">*</span>
          </label>
          <div className="flex w-[400px] gap-4">
            <button
              type="button"
              className={`flex h-[66px] flex-1 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${formData.interviewExperience === 'newcomer' ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => onUpdate({ interviewExperience: 'newcomer' })}
            >
              신입
            </button>
            <button
              type="button"
              className={`flex h-[66px] flex-1 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${formData.interviewExperience === 'experienced' ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => onUpdate({ interviewExperience: 'experienced' })}
            >
              경력
            </button>
          </div>
        </div>

        {/* 면접 일자 */}
        <div className="mb-8">
          <label className="mb-2 block p-1 text-h4 font-medium text-gray-700">
            면접 일자 <span className="text-red-500">*</span>
          </label>
          <div className="mb-4 ml-1 text-bodyMd text-gray-600">
            최근 3년 이내 진행한 면접만 등록 가능합니다.
          </div>
          <div className="flex w-[400px] gap-4">
            <div className="relative flex-1">
              <select
                value={formData.interviewYear}
                onChange={(e) => onUpdate({ interviewYear: e.target.value })}
                className="h-[66px] w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-10 text-h4 font-medium text-gray-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-mainBlue"
              >
                {generateYears().map((year) => (
                  <option key={year} value={year}>
                    {year}년
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="h-4 w-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
            <div className="relative flex-1">
              <select
                value={formData.interviewMonth}
                onChange={(e) => onUpdate({ interviewMonth: e.target.value })}
                className="h-[66px] w-full appearance-none rounded-lg border border-gray-200 bg-white px-4 py-2 pr-10 text-h4 font-medium text-gray-700 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-mainBlue"
              >
                {generateMonths().map((month) => (
                  <option key={month} value={month}>
                    {month}월
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="h-4 w-4 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 기업 검색 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 배경 오버레이 */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsModalOpen(false)}
          />

          {/* 모달 컨테이너 */}
          <div className="relative max-h-[80vh] w-[1000px] overflow-hidden rounded-3xl bg-white p-4">
            {/* 헤더 */}
            <div className="flex flex-col border-gray-200 p-6">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-h2 font-semibold">입사지원 기업</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 transition-colors hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-bodyLg text-gray-600">취업 후기를 작성할 기업을 선택해 주세요.</p>
            </div>

            {/* 기업 목록 */}
            <div className="max-h-[400px] overflow-y-auto p-6">
              {isLoading ? (
                <div className="py-8 text-center text-gray-500">로딩중...</div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-3">
                  {searchResults.map((company) => (
                    <button
                      key={company.id}
                      onClick={() => handleSelectCompany(company)}
                      className={`w-full rounded-lg border p-4 text-left transition-all hover:shadow-md ${
                        selectedCompanyId === company.id
                          ? 'border-mainBlue bg-subLightBlue'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full border-[1px] border-gray-200 bg-white text-lg">
                            {company.logo.startsWith('/') ? (
                              <img src={company.logo} alt={company.name} className="h-10 w-10" />
                            ) : (
                              company.logo
                            )}
                          </div>
                          <div className="flex items-center text-left">
                            <div className="text-[18px] text-base font-semibold text-gray-700">
                              {company.name}
                            </div>
                            <div className="ml-2 text-bodyMd text-gray-700">
                              {company.industry} · {company.type}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-bodyMd text-gray-500">
                          <span className="text-yellow-500">📝</span>
                          <span>{company.reviewCount.toLocaleString()}개의 후기</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  기업 목록을 불러올 수 없습니다.
                </div>
              )}
            </div>

            {/* 푸터 버튼 */}
            <div className="flex justify-end gap-3 border-gray-200 p-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-[126px] rounded-lg bg-gray-100 px-6 py-2 text-h4 text-gray-700 transition-colors hover:bg-gray-200"
              >
                닫기
              </button>
              <button
                onClick={handleConfirmSelection}
                disabled={!selectedCompanyId}
                className="w-[126px] rounded-lg bg-mainBlue px-6 py-2 text-h4 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                선택하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 직무 선택 모달 */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 배경 오버레이 */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsJobModalOpen(false)}
          />

          {/* 모달 컨테이너 */}
          <div className="relative max-h-[80vh] w-[1000px] overflow-hidden rounded-3xl bg-white p-4 shadow-xl">
            {/* 헤더 */}
            <div className="flex flex-col border-gray-200 p-6">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-h2 font-semibold">직무</h2>
                <button
                  onClick={() => setIsJobModalOpen(false)}
                  className="text-gray-400 transition-colors hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-bodyLg text-gray-600">
                지원했던 직무를 선택해 주세요. 최대 5개까지 선택할 수 있습니다.
              </p>
            </div>

            {/* 직무 목록 */}
            <div className="max-h-[400px] overflow-y-auto p-6">
              <div className="grid grid-cols-5 gap-3">
                {/* 기획·전략 */}
                <button
                  onClick={() => handleJobSelection('기획·전략')}
                  className={`flex h-16 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${selectedJobs.includes('기획·전략') ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                >
                  기획·전략
                </button>

                {/* 마케팅·홍보·조사 */}
                <button
                  onClick={() => handleJobSelection('마케팅·홍보·조사')}
                  className={`flex h-16 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${selectedJobs.includes('마케팅·홍보·조사') ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                >
                  마케팅·홍보·조사
                </button>

                {/* 회계·세무·재무 */}
                <button
                  onClick={() => handleJobSelection('회계·세무·재무')}
                  className={`flex h-16 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${selectedJobs.includes('회계·세무·재무') ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                >
                  회계·세무·재무
                </button>

                {/* 인사·노무·HRD */}
                <button
                  onClick={() => handleJobSelection('인사·노무·HRD')}
                  className={`flex h-16 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${selectedJobs.includes('인사·노무·HRD') ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                >
                  인사·노무·HRD
                </button>

                {/* 총무·법무·사무 */}
                <button
                  onClick={() => handleJobSelection('총무·법무·사무')}
                  className={`flex h-16 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${selectedJobs.includes('총무·법무·사무') ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                >
                  총무·법무·사무
                </button>

                {/* 영업·판매·무역 */}
                <button
                  onClick={() => handleJobSelection('영업·판매·무역')}
                  className={`flex h-16 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${selectedJobs.includes('영업·판매·무역') ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                >
                  영업·판매·무역
                </button>

                {/* 고객상담·TM */}
                <button
                  onClick={() => handleJobSelection('고객상담·TM')}
                  className={`flex h-16 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${selectedJobs.includes('고객상담·TM') ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                >
                  고객상담·TM
                </button>

                {/* 구매·자재·물류 */}
                <button
                  onClick={() => handleJobSelection('구매·자재·물류')}
                  className={`flex h-16 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${selectedJobs.includes('구매·자재·물류') ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                >
                  구매·자재·물류
                </button>

                {/* 상품기획·MD */}
                <button
                  onClick={() => handleJobSelection('상품기획·MD')}
                  className={`flex h-16 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${selectedJobs.includes('상품기획·MD') ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                >
                  상품기획·MD
                </button>

                {/* 운전·운송·배송 */}
                <button
                  onClick={() => handleJobSelection('운전·운송·배송')}
                  className={`flex h-16 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${selectedJobs.includes('운전·운송·배송') ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                >
                  운전·운송·배송
                </button>

                {/* 서비스·공공·복지 */}
                <button
                  onClick={() => handleJobSelection('서비스·공공·복지')}
                  className={`flex h-16 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${selectedJobs.includes('서비스·공공·복지') ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                >
                  서비스·공공·복지
                </button>

                {/* 생산 */}
                <button
                  onClick={() => handleJobSelection('생산')}
                  className={`flex h-16 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${selectedJobs.includes('생산') ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                >
                  생산
                </button>

                {/* IT개발·데이터 */}
                <button
                  onClick={() => handleJobSelection('IT개발·데이터')}
                  className={`flex h-16 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${selectedJobs.includes('IT개발·데이터') ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                >
                  IT개발·데이터
                </button>

                {/* 디자인 */}
                <button
                  onClick={() => handleJobSelection('디자인')}
                  className={`flex h-16 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${selectedJobs.includes('디자인') ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                >
                  디자인
                </button>

                {/* 건설·건축 */}
                <button
                  onClick={() => handleJobSelection('건설·건축')}
                  className={`flex h-16 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${selectedJobs.includes('건설·건축') ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                >
                  건설·건축
                </button>

                {/* 의료 */}
                <button
                  onClick={() => handleJobSelection('의료')}
                  className={`flex h-16 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${selectedJobs.includes('의료') ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                >
                  의료
                </button>

                {/* 연구·R&D */}
                <button
                  onClick={() => handleJobSelection('연구·R&D')}
                  className={`flex h-16 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${selectedJobs.includes('연구·R&D') ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                >
                  연구·R&D
                </button>

                {/* 교육 */}
                <button
                  onClick={() => handleJobSelection('교육')}
                  className={`flex h-16 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${selectedJobs.includes('교육') ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                >
                  교육
                </button>

                {/* 미디어·문화·스포츠 */}
                <button
                  onClick={() => handleJobSelection('미디어·문화·스포츠')}
                  className={`flex h-16 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${selectedJobs.includes('미디어·문화·스포츠') ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                >
                  미디어·문화·스포츠
                </button>

                {/* 금융·보험 */}
                <button
                  onClick={() => handleJobSelection('금융·보험')}
                  className={`flex h-16 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${selectedJobs.includes('금융·보험') ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
                >
                  금융·보험
                </button>
              </div>
            </div>

            {/* 푸터 버튼 */}
            <div className="flex justify-end gap-3 border-gray-200 p-6">
              <button
                onClick={() => setIsJobModalOpen(false)}
                className="w-[126px] rounded-lg bg-gray-100 px-6 py-2 text-h4 text-gray-700 transition-colors hover:bg-gray-200"
              >
                닫기
              </button>
              <button
                onClick={handleConfirmJobSelection}
                disabled={selectedJobs.length === 0}
                className="w-[126px] rounded-lg bg-mainBlue px-6 py-2 text-h4 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                선택하기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
