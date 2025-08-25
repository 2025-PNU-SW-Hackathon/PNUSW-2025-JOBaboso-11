import React, { useState } from 'react';
import LikeModal from './LikeModal';
import { maskNameMiddle } from '../../utils/nameMasking';

interface UserCardProps {
  id: string | number;
  name: string;
  age?: number;
  gender?: string;
  major?: string;
  job?: string;
  career_period?: string;
  skills?: string[];
  isLiked?: boolean;
  onLike?: (
    id: string | number,
    data: {
      message: string;
      contact_email: string;
      contact_phone: string;
      suggested_position: string;
    }
  ) => void;
  onUnlike?: (id: string | number) => void;
  onClick?: () => void;
}

const UserCard: React.FC<UserCardProps> = ({
  id,
  name,
  age,
  gender,
  major,
  job,
  career_period,
  skills = [],
  isLiked = false,
  onLike,
  onUnlike,
  onClick,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleHeartClick = () => {
    if (isLiked && onUnlike) {
      // 이미 좋아요가 되어 있으면 삭제
      onUnlike(id);
    } else if (!isLiked && onLike) {
      // 좋아요가 되어 있지 않으면 모달 열기
      setIsModalOpen(true);
    }
  };

  const handleModalSubmit = (data: {
    message: string;
    contact_email: string;
    contact_phone: string;
    suggested_position: string;
  }) => {
    if (onLike) {
      onLike(id, data);
    }
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className="relative cursor-pointer rounded-2xl border border-[#E5E7EB] bg-white p-6 transition-shadow hover:shadow-lg"
        onClick={onClick}
        style={{
          fontFamily: 'Pretendard, sans-serif',
        }}
      >
        {/* 그리드 레이아웃: column1(프로필), column2(정보), column3(하트) */}
        <div className="grid h-full grid-cols-[69px_1fr_28px] gap-4">
          {/* Column 1: 프로필 이미지 */}
          <div className="flex h-[69px] w-[69px] flex-shrink-0 items-center justify-center rounded-full border border-[#E5E7EB] bg-[#F3F4F6]">
            <svg
              className="h-[53px] w-[53px] text-[#9CA3AF]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>

          {/* Column 2: 이름, 나이, 대학 정보, 스킬 태그들 */}
          <div className="flex flex-col">
            {/* 이름과 나이 */}
            <div className="mb-3 flex items-center gap-2">
              <span className="text-2xl font-semibold leading-[34px] text-[#374151]">
                {maskNameMiddle(name)}
              </span>
              <span className="text-xs leading-5 text-[#4B5563]">
                ({gender === '여' ? '여' : '남'}, 만 {age}세)
              </span>
            </div>

            {/* 대학 정보 */}
            <div className="mb-3 flex flex-col gap-1">
              <span className="text-base font-medium leading-6 text-[#4B5563]">{major}</span>
              <span className="text-sm leading-[22px] text-[#4B5563]">{career_period}</span>
            </div>

            <div className="mb-1 flex flex-col gap-1">
              <div className="flex">
                <span className="rounded border border-gray-200 bg-white px-2 py-1 text-xs text-gray-600">
                  {job}
                </span>
              </div>

              {/* 스킬 태그들 */}
              <div className="flex flex-row flex-wrap gap-2">
                {skills.length > 0 &&
                  skills.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded border border-gray-200 bg-gray-100 px-[6px] py-[2px] text-xs leading-5 text-[#4B5563]"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Column 3: 하트 버튼 */}
          <div className="flex justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleHeartClick();
              }}
              className="h-7 w-7 text-[#4B5563] transition-colors hover:text-red-500"
            >
              <svg className="h-full w-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 좋아요 모달 */}
      <LikeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        userName={name}
      />
    </>
  );
};

export default UserCard;
