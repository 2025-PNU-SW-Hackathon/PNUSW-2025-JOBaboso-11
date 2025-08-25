import React from 'react';
import { ReviewFormData } from './ReviewWriteForm';

interface InterviewInfoSectionProps {
  formData: ReviewFormData;
  onUpdate: (updates: Partial<ReviewFormData>) => void;
}

export const InterviewInfoSection: React.FC<InterviewInfoSectionProps> = ({
  formData,
  onUpdate,
}) => {
  return (
    <>
      <div className="mb-4 text-h2">면접 정보</div>
      <div className="mb-20">
        {/* 전반적 평가 */}
        <div className="mb-8">
          <label className="mb-2 block p-1 text-h4 font-medium text-gray-700">
            전반적 평가 <span className="text-red-500">*</span>
          </label>
          <div className="flex w-[600px] gap-4">
            <button
              type="button"
              className={`flex h-[66px] flex-1 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${formData.overallRating === '긍정적' ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => onUpdate({ overallRating: '긍정적' })}
            >
              긍정적
            </button>
            <button
              type="button"
              className={`flex h-[66px] flex-1 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${formData.overallRating === '보통' ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => onUpdate({ overallRating: '보통' })}
            >
              보통
            </button>
            <button
              type="button"
              className={`flex h-[66px] flex-1 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${formData.overallRating === '부정적' ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => onUpdate({ overallRating: '부정적' })}
            >
              부정적
            </button>
          </div>
        </div>

        {/* 난이도 */}
        <div className="mb-8">
          <label className="mb-2 block p-1 text-h4 font-medium text-gray-700">
            난이도 <span className="text-red-500">*</span>
          </label>
          <div className="flex w-[600px] gap-4">
            <button
              type="button"
              className={`flex h-[66px] flex-1 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${formData.difficulty === '쉬움' ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => onUpdate({ difficulty: '쉬움' })}
            >
              쉬움
            </button>
            <button
              type="button"
              className={`flex h-[66px] flex-1 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${formData.difficulty === '보통' ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => onUpdate({ difficulty: '보통' })}
            >
              보통
            </button>
            <button
              type="button"
              className={`flex h-[66px] flex-1 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${formData.difficulty === '어려움' ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => onUpdate({ difficulty: '어려움' })}
            >
              어려움
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
