import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { companies, Company } from '../../data/companyPositions';
import { createApplication } from '../../apis/employment';

const ApplyListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // 검색 필터링 - 기업명, 업종으로 검색 가능
  const filteredCompanies = companies.filter((company) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      company.name.toLowerCase().includes(searchLower) ||
      company.industry.toLowerCase().includes(searchLower) ||
      company.companyType.toLowerCase().includes(searchLower)
    );
  });

  const handleApply = async (company: Company) => {
    try {
      const today = new Date().toISOString();

      const response = await createApplication({
        company_name: company.name,
        position: '', // 빈칸으로 설정
        application_date: today,
      });

      // 응답을 받은 후 해당 지원서 상세 페이지로 이동
      navigate(`/employment/applications/${response.id}`);
    } catch (error) {
      console.error('지원서 생성 실패:', error);
      alert('지원서 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="space-y-6">
      {/* 검색바 */}
      <div className="relative w-full">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-600" />
        <input
          type="text"
          placeholder="지원하고 싶은 기업을 검색해보세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="font-bodyLg w-full rounded-[8px] border border-gray-300 p-3 pl-10 focus:border-transparent focus:ring-mainBlue"
        />
      </div>

      {/* 검색 결과 */}
      <div className="space-y-4">
        {filteredCompanies.map((company) => (
          <div key={company.id} className="rounded-[16px] border border-gray-300 px-8 py-5">
            {/* 기업 정보 */}
            <div className="flex items-center gap-4">
              <div className="flex h-[90px] w-[90px] items-center justify-center overflow-hidden rounded-[45px] border border-gray-200 bg-white">
                <img
                  src={company.logo}
                  alt={`${company.name} 로고`}
                  className="h-12 w-12 object-contain"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-h3 text-gray-700">{company.name}</h3>
                <p className="text-bodylg text-gray-700">
                  {company.industry} · {company.companyType} · 업력 {company.yearsInBusiness}년차
                </p>
              </div>
              <button
                onClick={() => handleApply(company)}
                className="rounded-[8px] bg-mainBlue px-6 py-2 font-medium text-white transition-colors hover:bg-blue-700"
              >
                지원하기
              </button>
            </div>
          </div>
        ))}

        {filteredCompanies.length === 0 && searchQuery && (
          <div className="py-12 text-center">
            <p className="text-lg text-gray-500">검색 결과가 없습니다.</p>
            <p className="text-sm text-gray-400">다른 키워드로 검색해보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyListPage;
