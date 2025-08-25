import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon, EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { staffStudentsData, StudentSpec } from '../../mocks/staffStudentsData';
import AIModal from '../../components/staff/AIModal';
import { useSearchParams, useNavigate } from 'react-router-dom';

const StaffStudentsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const aiQuery = searchParams.get('ai_query');
  const sortQuery = searchParams.get('sort_query') || 'high';

  const [students, setStudents] = useState<StudentSpec[]>(staffStudentsData);
  const [filteredStudents, setFilteredStudents] = useState<StudentSpec[]>(staffStudentsData);
  const [sortOrder, setSortOrder] = useState<'high' | 'low' | 'recent'>(
    sortQuery as 'high' | 'low' | 'recent'
  );
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const aiButtonRef = useRef<HTMLButtonElement>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openSortDropdown, setOpenSortDropdown] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{ columnName: string; value: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('th') && !target.closest('.sort-dropdown')) {
        setOpenDropdown(null);
        setOpenSortDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // URL 쿼리에서 정렬 상태 초기화
  useEffect(() => {
    const currentSortQuery = sortQuery as 'high' | 'low' | 'recent';
    if (currentSortQuery !== sortOrder) {
      setSortOrder(currentSortQuery);
    }
  }, [sortQuery, sortOrder]);

  const handleSortSelect = (newSortOrder: 'high' | 'low' | 'recent') => {
    const sorted = [...filteredStudents].sort((a, b) => {
      if (newSortOrder === 'high') {
        return b.acceptanceRate - a.acceptanceRate;
      } else if (newSortOrder === 'low') {
        return a.acceptanceRate - b.acceptanceRate;
      } else {
        // recent - 랜덤 정렬
        return Math.random() - 0.5;
      }
    });
    setFilteredStudents(sorted);
    setSortOrder(newSortOrder);
    setOpenSortDropdown(false);

    // URL에 정렬 쿼리 추가
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('sort_query', newSortOrder);
    setSearchParams(newSearchParams);
  };

  const getSortLabel = () => {
    switch (sortOrder) {
      case 'high':
        return '합격률 높은 순';
      case 'low':
        return '합격률 낮은 순';
      case 'recent':
        return '최근 합격순';
      default:
        return '합격률 높은 순';
    }
  };

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleCheckDetailedSpec = (student: StudentSpec) => {
    console.log('세부 스펙 확인하기:', student);
    setOpenMenuId(null);
  };

  const handleCheckApplicationStatus = (student: StudentSpec) => {
    console.log('전체 지원 현황 확인하기:', student);
    setOpenMenuId(null);
  };

  const handleAICall = () => {
    console.log('AI 버튼 클릭됨');
    console.log('버튼 위치:', getButtonPosition());
    setIsAIModalOpen(true);
  };

  const getButtonPosition = () => {
    if (aiButtonRef.current) {
      const rect = aiButtonRef.current.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }
    // 기본값으로 화면 오른쪽 하단 위치 반환
    return {
      x: window.innerWidth - 200,
      y: window.innerHeight - 100,
    };
  };

  const toggleDropdown = (columnName: string) => {
    setOpenDropdown(openDropdown === columnName ? null : columnName);
  };

  const handleFilterSelect = (columnName: string, value: string) => {
    console.log(`${columnName} 필터 선택:`, value);
    setOpenDropdown(null);

    // 이미 선택된 필터인지 확인
    const existingFilter = activeFilters.find(
      (filter) => filter.columnName === columnName && filter.value === value
    );

    // 중복이 아닌 경우에만 추가
    if (!existingFilter) {
      setActiveFilters([...activeFilters, { columnName, value }]);
    }
  };

  const handleClearAIQuery = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('ai_query');
    setSearchParams(newSearchParams);
  };

  const removeFilter = (index: number) => {
    const updatedFilters = [...activeFilters];
    updatedFilters.splice(index, 1);
    setActiveFilters(updatedFilters);
  };

  const getFilterDisplayName = (columnName: string) => {
    switch (columnName) {
      case 'gender':
        return '성별';
      case 'gpa':
        return '학점';
      case 'acceptanceRate':
        return '합격률';
      case 'status':
        return '상태';
      default:
        return columnName;
    }
  };

  // 필터링 함수들
  const applyFilters = (studentsToFilter: StudentSpec[]) => {
    return studentsToFilter.filter((student) => {
      return activeFilters.every((filter) => {
        switch (filter.columnName) {
          case 'gender':
            return student.gender === filter.value;
          
          case 'gpa':
            switch (filter.value) {
              case '4.0 이상':
                return student.gpa >= 4.0;
              case '3.5 이상':
                return student.gpa >= 3.5 && student.gpa < 4.0;
              case '3.0 이상':
                return student.gpa >= 3.0 && student.gpa < 3.5;
              case '3.0 미만':
                return student.gpa < 3.0;
              default:
                return true;
            }
          
          case 'acceptanceRate':
            switch (filter.value) {
              case '80% 이상':
                return student.acceptanceRate >= 80;
              case '50% 이상':
                return student.acceptanceRate >= 50 && student.acceptanceRate < 80;
              case '30% 이상':
                return student.acceptanceRate >= 30 && student.acceptanceRate < 50;
              case '30% 미만':
                return student.acceptanceRate < 30;
              default:
                return true;
            }
          
          case 'status':
            return student.status === filter.value;
          
          default:
            return true;
        }
      });
    });
  };

  // AI 쿼리 변경 시 로딩 처리
  useEffect(() => {
    if (aiQuery) {
      setIsLoading(true);
      // 2초 후 로딩 완료
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, [aiQuery]);

  // 필터 적용 및 정렬 useEffect
  useEffect(() => {
    let filtered = students;
    
    // 기존 필터 적용
    filtered = applyFilters(students);
    
    // AI 쿼리가 있을 때 추가로 졸업 필터 적용
    if (aiQuery) {
      filtered = filtered.filter(student => student.status === '졸업');
    }
    
    // 정렬 적용
    filtered = filtered.sort((a, b) => {
      if (sortOrder === 'high') {
        return b.acceptanceRate - a.acceptanceRate;
      } else if (sortOrder === 'low') {
        return a.acceptanceRate - b.acceptanceRate;
      } else {
        // recent - 랜덤 정렬
        return Math.random() - 0.5;
      }
    });
    
    setFilteredStudents(filtered);
  }, [activeFilters, students, sortOrder, aiQuery]);

  // 드롭다운 옵션 정의
  const dropdownOptions = {
    gender: ['남성', '여성'],
    gpa: ['4.0 이상', '3.5 이상', '3.0 이상', '3.0 미만'],
    acceptanceRate: ['80% 이상', '50% 이상', '30% 이상', '30% 미만'],
    status: ['졸업', '재학'],
  };

  return (
    <div className="relative">
      {/* AI 호출 버튼 - 오른쪽 고정, 스크롤 따라오는 애니메이션 */}
      <button
        ref={aiButtonRef}
        onClick={handleAICall}
        className="fixed right-48 z-50 flex h-[90px] w-[90px] items-center justify-center rounded-[46px] border border-gray-300 bg-white p-6 shadow-[0px_0px_24px_rgba(0,0,0,0.12)] transition-all duration-300 ease-out hover:shadow-[0px_0px_32px_rgba(0,0,0,0.16)]"
        style={{
          boxSizing: 'border-box',
          bottom: `calc(6rem + ${scrollY * 0.05}px)`,
          transform: 'none',
        }}
      >
        <img src="/staff/ai.svg" alt="AI 호출" className="w-11 h-11" />
      </button>

      {/* AI 모달 */}
      <AIModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        buttonPosition={getButtonPosition()}
      />

      <h2 className="text-gray-700 text-bodyLg">
        우리 학과 학생 개개인의 스펙을 확인할 수 있어요.
      </h2>

      <div>
        <div className="flex justify-end items-center mb-4">
          <div className="relative sort-dropdown">
            <button
              onClick={() => setOpenSortDropdown(!openSortDropdown)}
              className="flex flex-row gap-1 items-center px-3 py-2 bg-white rounded-lg border border-gray-400 transition-colors hover:bg-gray-50"
            >
              <span className="text-base font-normal leading-6 text-gray-500">
                {getSortLabel()}
              </span>
              <ChevronDownIcon className="w-6 h-6 text-gray-500" />
            </button>
            {openSortDropdown && (
              <div className="absolute right-0 top-full z-20 mt-1 w-48 bg-white rounded-md border border-gray-200 shadow-lg">
                <div className="py-1">
                  <button
                    onClick={() => handleSortSelect('high')}
                    className={`block w-full px-4 py-2 text-left text-bodyLg hover:bg-gray-100 ${
                      sortOrder === 'high' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    합격률 높은 순
                  </button>
                  <button
                    onClick={() => handleSortSelect('low')}
                    className={`block w-full px-4 py-2 text-left text-bodyLg hover:bg-gray-100 ${
                      sortOrder === 'low' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    합격률 낮은 순
                  </button>
                  <button
                    onClick={() => handleSortSelect('recent')}
                    className={`block w-full px-4 py-2 text-left text-bodyLg hover:bg-gray-100 ${
                      sortOrder === 'recent' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                    }`}
                  >
                    최근 합격순
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 활성 필터 및 AI 쿼리 태그 영역 */}
        {(activeFilters.length > 0 || aiQuery) && (
          <div className="flex flex-wrap gap-2 items-center p-3 mb-4 rounded-md border border-gray-200">
            {/* AI 쿼리 태그 */}
            {aiQuery && (
              <span className="flex gap-1 items-center px-4 py-1 text-blue-700 rounded-full bg-subLightBlue text-bodyLg">
                AI 검색: {aiQuery}
                <button
                  type="button"
                  className="ml-2 text-blue-700 hover:text-blue-900"
                  onClick={handleClearAIQuery}
                >
                  ×
                </button>
              </span>
            )}
            {/* 필터 태그들 */}
            {activeFilters.map((filter, index) => (
              <span
                key={index}
                className="flex gap-1 items-center px-4 py-1 text-gray-700 rounded-full bg-subLightBlue text-bodyLg"
              >
                {getFilterDisplayName(filter.columnName)}: {filter.value}
                <button
                  type="button"
                  className="ml-2 text-gray-600 hover:text-gray-800"
                  onClick={() => removeFilter(index)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="mb-96">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="flex flex-col items-center space-y-4">
                <img src="/staff/ic_loading.svg" alt="로딩" className="w-12 h-12 animate-spin" />
                <p className="text-gray-600">AI가 검색 결과를 분석하고 있어요...</p>
              </div>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="h-12 bg-gray-100 border-gray-300 border-y">
                <th className="relative px-4 py-3 text-left">
                  <button
                    onClick={() => toggleDropdown('gender')}
                    className="flex gap-1 items-center h-6 hover:text-gray-700"
                  >
                    <span className="text-base font-normal leading-6 text-gray-500">성별</span>
                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                  </button>
                  {openDropdown === 'gender' && (
                    <div className="absolute left-0 top-full z-20 mt-1 w-32 bg-white rounded-md border border-gray-200 shadow-lg">
                      <div className="py-1">
                        {dropdownOptions.gender.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleFilterSelect('gender', option)}
                            className="block px-4 py-2 w-full text-left text-gray-600 text-bodyLg hover:bg-gray-100"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </th>
                <th className="relative px-4 py-3 text-left">
                  <button
                    onClick={() => toggleDropdown('gpa')}
                    className="flex gap-1 items-center h-6 hover:text-gray-700"
                  >
                    <span className="text-base font-normal leading-6 text-gray-500">학점</span>
                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                  </button>
                  {openDropdown === 'gpa' && (
                    <div className="absolute left-0 top-full z-20 mt-1 w-32 bg-white rounded-md border border-gray-200 shadow-lg">
                      <div className="py-1">
                        {dropdownOptions.gpa.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleFilterSelect('gpa', option)}
                            className="block px-4 py-2 w-full text-left text-gray-600 text-bodyLg hover:bg-gray-100"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </th>
                <th className="relative px-4 py-3 text-left">
                  <button
                    onClick={() => toggleDropdown('acceptanceRate')}
                    className="flex gap-1 items-center h-6 hover:text-gray-700"
                  >
                    <span className="text-base font-normal leading-6 text-gray-500">
                      최종합격률
                    </span>
                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                  </button>
                  {openDropdown === 'acceptanceRate' && (
                    <div className="absolute left-0 top-full z-20 mt-1 w-32 bg-white rounded-md border border-gray-200 shadow-lg">
                      <div className="py-1">
                        {dropdownOptions.acceptanceRate.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleFilterSelect('acceptanceRate', option)}
                            className="block px-4 py-2 w-full text-left text-gray-600 text-bodyLg hover:bg-gray-100"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </th>
                <th className="relative px-4 py-3 text-left">
                  <button
                    onClick={() => toggleDropdown('status')}
                    className="flex gap-1 items-center h-6 hover:text-gray-700"
                  >
                    <span className="text-base font-normal leading-6 text-gray-500">상태</span>
                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                  </button>
                  {openDropdown === 'status' && (
                    <div className="absolute left-0 top-full z-20 mt-1 w-40 bg-white rounded-md border border-gray-200 shadow-lg">
                      <div className="py-1">
                        {dropdownOptions.status.map((option) => (
                          <button
                            key={option}
                            onClick={() => handleFilterSelect('status', option)}
                            className="block px-4 py-2 w-full text-left text-gray-600 text-bodyLg hover:bg-gray-100"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </th>
                <th className="px-4 py-3 text-center">
                  <div className="flex gap-1 justify-center items-center mx-auto h-6 w-15">
                    <span className="text-base font-normal leading-6 text-gray-500">세부 스펙</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {(aiQuery ? filteredStudents.slice(0, 3) : filteredStudents).map((student) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-4 text-gray-600 text-bodyLg">{student.gender}</td>
                  <td className="px-4 py-4 text-gray-600 text-bodyLg">{student.gpa}</td>
                  <td className="px-4 py-4 text-gray-600 text-bodyLg">
                    {student.acceptanceRate}% ({student.acceptedApplications}개 중{' '}
                    {student.totalApplications}개)
                  </td>
                  <td className="px-4 py-4 text-gray-600 text-bodyLg">{student.status}</td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex relative justify-center">
                      <button
                        onClick={() => toggleMenu(student.id)}
                        className="p-1 rounded-full transition-colors hover:bg-gray-100"
                      >
                        <EllipsisVerticalIcon className="w-5 h-5 text-gray-500" />
                      </button>

                      {openMenuId === student.id && (
                        <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md border border-gray-200 shadow-lg">
                          <div className="py-1">
                            <button
                              onClick={() => handleCheckDetailedSpec(student)}
                              className="block px-4 py-2 w-full text-sm text-left text-gray-700 hover:bg-gray-100"
                            >
                              세부 스펙 확인하기
                            </button>
                            <button
                              onClick={() => handleCheckApplicationStatus(student)}
                              className="block px-4 py-2 w-full text-sm text-left text-gray-700 hover:bg-gray-100"
                            >
                              전체 지원 현황 확인하기
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default StaffStudentsPage;
