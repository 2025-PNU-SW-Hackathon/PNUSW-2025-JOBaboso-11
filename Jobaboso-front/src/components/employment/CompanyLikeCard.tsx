import React from 'react';
import {
  CalendarIcon,
  ChatBubbleLeftRightIcon,
  BriefcaseIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

import { EllipsisVerticalIcon, CheckBadgeIcon, UserCircleIcon } from '@heroicons/react/24/solid';

interface CompanyLikeData {
  id: number;
  company_id: number;
  company_name: string;
  message: string;
  contact_email: string;
  contact_phone: string;
  suggested_position: string;
  hr_manager_name: string;
  created_at: string;
}

interface CompanyLikeCardProps {
  like: CompanyLikeData;
  onClick?: () => void;
}

const CompanyLikeCard: React.FC<CompanyLikeCardProps> = ({ like, onClick }) => {
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
      className="cursor-pointer rounded-2xl border border-[#E5E7EB] bg-white p-6"
      onClick={onClick}
      style={{
        fontFamily: 'Pretendard, sans-serif',
      }}
    >
      {/* 구분선 위 정보들 */}
      <div className="mb-4 space-y-2">
        {/* 회사명 */}
        {like.company_name && (
          <div className="text-h1 font-bold text-gray-700">{like.company_name}</div>
        )}

        {/* HR 매니저 이름 */}
        {like.hr_manager_name && (
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
              <span className="font-medium text-gray-700">{like.hr_manager_name}</span>
              <CheckBadgeIcon className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        )}
      </div>

      {/* 구분선 */}
      <div className="my-4 border-t border-[#E5E7EB]"></div>

      {/* 구분선 아래 정보들 */}
      <div className="space-y-3">
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
          <div className="flex items-start space-x-2">
            <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100">
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

        {/* 연락처 이메일 */}
        {like.contact_email && (
          <div className="flex items-center space-x-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
              <EnvelopeIcon className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-base font-medium leading-6 text-[#4B5563]">
              {like.contact_email}
            </span>
          </div>
        )}

        {/* 연락처 전화번호 */}
        {like.contact_phone && (
          <div className="flex items-center space-x-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
              <PhoneIcon className="h-4 w-4 text-blue-600" />
            </div>
            <span className="text-base font-medium leading-6 text-[#4B5563]">
              {like.contact_phone}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyLikeCard;
