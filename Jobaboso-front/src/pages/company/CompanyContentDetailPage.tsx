import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getCompanyContentById,
  getNextContentId,
  getPreviousContentId,
} from '../../mocks/companyContentData';
import {
  getCorporateContentById,
  getNextCorporateContentId,
  getPreviousCorporateContentId,
} from '../../mocks/corporatePageData';
import { EllipsisVerticalIcon, CheckBadgeIcon, UserCircleIcon } from '@heroicons/react/24/solid';

const CompanyContentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  if (!id) {
    return <div>콘텐츠를 찾을 수 없습니다.</div>;
  }

  // company 콘텐츠와 corporate 콘텐츠 모두에서 찾기
  let content: any = getCompanyContentById(id);
  let nextId = getNextContentId(id);
  let prevId = getPreviousContentId(id);

  // company 콘텐츠에서 찾지 못했다면 corporate 콘텐츠에서 찾기
  if (!content) {
    content = getCorporateContentById(id);
    if (content) {
      nextId = getNextCorporateContentId(id);
      prevId = getPreviousCorporateContentId(id);
    }
  }

  if (!content) {
    return <div>콘텐츠를 찾을 수 없습니다.</div>;
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}. ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } catch (error) {
      // 날짜 파싱에 실패한 경우 원본 문자열 반환
      return dateString;
    }
  };

  const handleEdit = () => {
    // 수정 페이지로 이동 (구현 필요)
    console.log('Edit content:', id);
    setShowDropdown(false);
  };

  const handleDelete = () => {
    if (window.confirm('정말로 이 콘텐츠를 삭제하시겠습니까?')) {
      // 삭제 로직 구현 (구현 필요)
      console.log('Delete content:', id);
      navigate('/corporate');
    }
    setShowDropdown(false);
  };

  // 뒤로가기 함수
  const handleBack = () => {
    navigate('/corporate');
  };

  return (
    <div className="mx-auto my-8 px-6 py-8">
      {/* 헤더 영역 */}
      <div>
        <h1 className="mb-4 text-h1 font-bold text-gray-700">{content.title}</h1>

        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
              <span className="font-medium text-gray-700">
                {content.companyName || content.author}
              </span>
              <CheckBadgeIcon className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="text-gray-600">
          {content.createdAt ? formatDate(content.createdAt) : `${content.date} ${content.time}`}
        </div>
      </div>

      {/* 날짜와 본문 사이 구분선 */}
      <div className="my-8 border-t border-gray-300"></div>

      {/* 콘텐츠 본문 */}
      <div className="mb-8">
        {/* 콘텐츠 텍스트 */}
        <div className="prose mb-8 max-w-none">
          <div className="space-y-4 text-base leading-relaxed text-gray-700">
            <p>{content.content || content.description}</p>
          </div>
        </div>

        {/* 이미지 */}
        {(content.imageUrl || content.image_url) && (
          <div className="mb-8">
            <img
              src={content.imageUrl || content.image_url}
              alt={content.title}
              className="w-full rounded-lg object-cover"
            />
          </div>
        )}

        {/* 해시태그 */}
        <div className="flex flex-wrap gap-2">
          {(content.hashtags || content.tags).map((tag: string, index: number) => (
            <span
              key={index}
              className="rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-sm text-gray-500"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyContentDetailPage;
