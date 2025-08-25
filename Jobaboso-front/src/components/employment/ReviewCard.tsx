import React, { useState } from 'react';
import { HiOutlineDotsVertical } from 'react-icons/hi';

interface ReviewCardProps {
  reviewId: number;
  company: string;
  status: string;
  content: string;
  date: string;
  logoUrl?: string;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

const statusStyleMap: Record<string, string> = {
  최종합격: 'bg-[#E9F2FD] text-[#1779FA] border border-[#1779FA]',
  '1차합격': 'bg-[#FFF3C9] text-[#B7962C] border border-[#B7962C]',
  '2차합격': 'bg-[#D8FDD9] text-[#27B122] border border-[#27B122]',
  불합격: 'bg-[#FFD9D1] text-[#D84D4D] border border-[#D84D4D]',
};

const ReviewCard: React.FC<ReviewCardProps> = ({
  reviewId,
  company,
  status,
  content,
  date,
  logoUrl,
  onEdit,
  onDelete,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white px-5 py-8 transition-shadow duration-200 hover:shadow-md">
      {/* 상단: 프로필 + 기업명 + 점 세 개 */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={`${company} 로고`}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-300" />
          )}
          <h3 className="text-h3 font-semibold text-gray-600">{company}</h3>
        </div>
        <button
          type="button"
          className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-600"
          onClick={() => setOpen((v) => !v)}
          aria-label="옵션 열기"
        >
          <HiOutlineDotsVertical className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="absolute right-3 top-10 z-10 w-36 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md">
          <button
            type="button"
            className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => {
              setOpen(false);
              onEdit && onEdit(reviewId);
            }}
          >
            수정하기
          </button>
          <button
            type="button"
            className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            onClick={() => {
              setOpen(false);
              onDelete && onDelete(reviewId);
            }}
          >
            삭제하기
          </button>
        </div>
      )}

      {/* 아래 내용 전체를 기업명 기준 왼쪽 정렬 */}
      <div className="space-y-2 pl-11">
        <span
          className={`inline-flex h-[26px] items-center justify-center rounded-[4px] p-2 text-xs font-medium ${statusStyleMap[status] || 'border border-gray-300 bg-gray-200 text-gray-700'}`}
        >
          {status}
        </span>

        <p className="line-clamp-4 text-sm text-gray-600">{content}</p>
        <p className="text-xs text-gray-400">{date}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
