import React from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export const InfoTooltip: React.FC = () => {
  return (
    <div className="group relative inline-block">
      {/* 아이콘 */}
      <InformationCircleIcon className="h-5 w-5 cursor-pointer text-gray-400 group-hover:text-gray-600" />

      {/* 말풍선 */}
      <div className="absolute left-1/2 top-6 z-10 hidden w-[280px] -translate-x-1/2 whitespace-nowrap rounded-[12px] bg-white px-4 py-3 text-sm text-gray-800 shadow-md group-hover:block">
        {/* 말풍선 꼬리 */}
        <div className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-white shadow-md" />

        {/* 내용 */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full border border-yellow-700" />
            <span>
              <span className="font-bold text-yellow-700">[서류]</span> 서류 마감 일정은 노란색으로
              표시돼요.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full border border-blue-500" />
            <span>
              <span className="font-bold text-blue-500">[면접]</span> 면접 일정은 파란색으로
              표시돼요.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
