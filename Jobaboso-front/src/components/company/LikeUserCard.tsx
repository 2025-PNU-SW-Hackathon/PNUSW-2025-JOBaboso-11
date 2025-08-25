import React from 'react';
import { LikeItem } from '../../type/emp';
import { maskNameMiddle } from '../../utils/nameMasking';
import { CalendarIcon, ChatBubbleLeftRightIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

interface LikeUserCardProps {
  like: LikeItem;
  onUnlike: (likeId: string | number) => void;
  onClick?: () => void;
}

const LikeUserCard: React.FC<LikeUserCardProps> = ({ like, onUnlike, onClick }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div
      className="cursor-pointer rounded-2xl border border-[#E5E7EB] bg-white p-6 transition-shadow hover:shadow-lg"
      onClick={onClick}
      style={{
        fontFamily: 'Pretendard, sans-serif',
      }}
    >
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* 프로필 이미지 */}
          <div className="flex h-[69px] w-[69px] items-center justify-center rounded-full border border-[#E5E7EB] bg-[#F3F4F6]">
            <svg
              className="h-[53px] w-[53px] text-[#9CA3AF]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>

          {/* 이름 */}
          <span className="text-2xl font-semibold leading-[34px] text-[#374151]">
            {maskNameMiddle(like.target_user_name)}
          </span>
        </div>

        {/* 찜하기 취소 버튼 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onUnlike(like.id);
          }}
          className="h-7 w-7 text-red-500 transition-colors hover:text-red-700"
          title="찜하기 취소"
        >
          <svg className="h-full w-full" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* 구분선 */}
      <div className="my-4 border-t border-[#E5E7EB]"></div>

      {/* 제안 정보들 */}
      <div className="space-y-3">
        {/* 제안 날짜 */}
        {like.created_at && (
          <div className="flex items-center space-x-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
              <CalendarIcon className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-base font-medium leading-6 text-[#4B5563]">
              {formatDate(like.created_at)}
            </span>
          </div>
        )}

        {/* 제안 메시지 */}
        {like.message && (
          <div className="flex items-center space-x-2">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
              <ChatBubbleLeftRightIcon className="h-4 w-4 text-blue-600" />
            </div>
            <span className="min-w-0 flex-1 whitespace-normal break-words text-base font-medium leading-6 text-[#4B5563]">
              {like.message}
            </span>
          </div>
        )}

        {/* 제안 직무 */}
        {like.suggested_position && (
          <div className="flex items-center space-x-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
              <BriefcaseIcon className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-base font-medium leading-6 text-[#4B5563]">
              {like.suggested_position}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikeUserCard;
