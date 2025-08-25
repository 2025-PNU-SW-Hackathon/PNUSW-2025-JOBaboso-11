import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { mockCompanyContents } from '@mocks/companyContentData';
import { EllipsisVerticalIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

const CompanyContentsPage: React.FC = () => {
  const [contents, setContents] = useState(mockCompanyContents);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const location = useLocation();

  // 페이지가 마운트되거나 location이 변경될 때마다 목록 새로고침
  useEffect(() => {
    setContents([...mockCompanyContents]);
  }, [location]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}. ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const handleMenuToggle = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleEdit = (id: string) => {
    // 수정 로직 구현
    console.log('Edit content:', id);
    setOpenMenuId(null);
  };

  const handleDelete = (id: string) => {
    // 삭제 로직 구현
    console.log('Delete content:', id);
    setOpenMenuId(null);
  };

  return (
    <div>
      {/* 헤더 영역 */}
      <div className="mb-12 mt-10 flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-800">기업 콘텐츠</h1>
        <Link
          to="/company/contents/write"
          className="rounded-lg bg-mainBlue px-6 py-3 text-lg font-semibold text-white transition-colors hover:bg-blue-700"
        >
          새 콘텐츠 작성하기
        </Link>
      </div>

      {/* 콘텐츠 목록 */}
      <div className="space-y-6">
        {contents.map((content) => (
          <div
            key={content.id}
            className="rounded-[16px] border border-gray-300 bg-white p-8 transition-shadow hover:shadow-sm"
          >
            {/* 제목과 날짜를 같은 줄에 */}
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-h2 font-semibold text-gray-600">{content.title}</h3>
              <div className="flex w-48 items-center justify-between">
                <span className="flex-shrink-0 text-sm text-gray-500">
                  {formatDate(content.createdAt)}
                </span>
                <div className="relative">
                  <button
                    className="p-1 text-gray-400 hover:text-gray-600"
                    onClick={() => handleMenuToggle(content.id)}
                  >
                    <EllipsisVerticalIcon className="h-5 w-5" />
                  </button>

                  {/* 드롭다운 메뉴 */}
                  {openMenuId === content.id && (
                    <div className="absolute right-0 z-10 mt-2 w-32 rounded-md border border-gray-200 bg-white shadow-lg">
                      <button
                        onClick={() => handleEdit(content.id)}
                        className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <PencilIcon className="mr-2 h-4 w-4" />
                        수정하기
                      </button>
                      <button
                        onClick={() => handleDelete(content.id)}
                        className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        <TrashIcon className="mr-2 h-4 w-4" />
                        삭제하기
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 내용, 태그와 썸네일을 같은 줄에 */}
            <Link to={`/company/contents/${content.id}`} className="block rounded-lg">
              <div className="flex space-x-6">
                {/* 콘텐츠 본문과 해시태그 */}
                <div className="flex flex-1 flex-col">
                  <p className="mb-6 text-lg leading-relaxed text-gray-700">
                    {content.content.replace(/\*\*.*?\*\*/g, '').substring(0, 300)}...
                  </p>

                  {/* 해시태그 */}
                  <div className="mt-auto flex flex-wrap gap-2">
                    {content.hashtags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="rounded-[4px] bg-gray-100 px-2 py-1 text-sm text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 썸네일 이미지 */}
                <div className="w-48 flex-shrink-0">
                  <img
                    src={content.imageUrl || '/company_porfile/busantransport.svg'}
                    alt={content.title}
                    className="h-auto w-48 rounded-lg bg-gray-100 object-cover"
                  />
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyContentsPage;
