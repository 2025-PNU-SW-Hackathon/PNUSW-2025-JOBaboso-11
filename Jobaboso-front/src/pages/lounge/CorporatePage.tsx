import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { corporatePageData, CorporateContent } from '../../mocks/corporatePageData';
import SearchInput from '../../components/common/SearchInput';

const CorporatePage: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const handleContentClick = (contentId: string) => {
    navigate(`/lounge/corporate/${contentId}`);
  };

  return (
    <div className="w-full">
      {/* 검색바 */}
      <div className="mb-8">
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 bg-white py-4 pl-12 pr-4 text-lg text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="태그와 기업명으로 검색해주세요."
          />
        </div>
      </div>

      {/* 콘텐츠 요약 및 정렬 정보 */}
      <div className="mb-8 flex items-center justify-between">
        <div className="text-xl font-bold text-gray-900">총 {corporatePageData.length} 건</div>
        <div className="text-sm text-gray-500">모든 글들이 최신순으로 정렬되어 보여집니다.</div>
      </div>

      {/* 콘텐츠 리스트 */}
      <div>
        {corporatePageData.map((content: CorporateContent) => (
          <div
            key={content.id}
            className="cursor-pointer overflow-hidden border-t border-solid border-t-gray-300 bg-white p-8 transition-colors hover:bg-gray-50"
            onClick={() => handleContentClick(content.id)}
          >
            <div className="flex">
              {/* 이미지 (왼쪽) */}
              <div className="w-1/3">
                <img
                  src={content.imageUrl}
                  alt={content.title}
                  className="h-64 w-full rounded-lg object-cover"
                />
              </div>

              {/* 텍스트 콘텐츠 (오른쪽) */}
              <div className="flex w-2/3 flex-col justify-between px-8 py-2">
                <div>
                  {/* 제목 */}
                  <h2 className="mb-4 text-h2 font-semibold leading-tight text-gray-600">
                    {content.title}
                  </h2>

                  {/* 설명 */}
                  <p className="mb-6 line-clamp-3 text-lg leading-relaxed text-gray-700">
                    {content.description || content.content}
                  </p>

                  {/* 작성자 및 날짜 */}
                  <div className="mb-6 flex items-center">
                    <div className="mr-2 h-7 w-7 flex-shrink-0 rounded-full border border-gray-300 bg-gray-50"></div>
                    <span className="text-lg text-gray-600">
                      {content.author || content.companyName} | {content.date} {content.time}
                    </span>
                  </div>
                </div>

                {/* 태그 */}
                <div className="flex flex-wrap gap-2">
                  {(content.tags || content.hashtags).map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="box-border flex flex-row items-center justify-center gap-2 rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5 text-sm text-gray-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CorporatePage;
