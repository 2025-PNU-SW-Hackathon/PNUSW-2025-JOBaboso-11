import React, { useState } from 'react';
import Button from '@components/common/Button';
import { ReviewFormData } from './ReviewWriteForm';

interface PassInfoSectionProps {
  formData: ReviewFormData;
  onUpdate: (updates: Partial<ReviewFormData>) => void;
}

export const PassInfoSection: React.FC<PassInfoSectionProps> = ({ formData, onUpdate }) => {
  const [newQuestion, setNewQuestion] = useState('');
  return (
    <>
      <div className="mb-4 text-h2">합격 정보</div>
      <div className="mb-20">
        {/* 면접 질문 */}
        <div className="mb-6">
          <label className="block pb-3 pl-1 text-h4 font-medium text-gray-700">
            면접 질문 <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute left-4 top-1/2 z-10 -translate-y-1/2 transform">
                <span className="text-h4 font-bold text-mainBlue">Q.</span>
              </div>
              <input
                type="text"
                placeholder="ex. 우리 회사에 지원한 이유는 무엇입니까?"
                value={newQuestion}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setNewQuestion(e.target.value)
                }
                className="h-[66px] w-[949px] rounded-lg border border-gray-200 bg-white pl-12 pr-4 text-h4 text-gray-700 placeholder-gray-400 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
              />
            </div>
            <Button
              onClick={() => {
                const trimmed = newQuestion.trim();
                if (!trimmed) return;
                const combined = formData.interviewQuestion
                  ? `${formData.interviewQuestion}\n${trimmed}`
                  : trimmed;
                onUpdate({ interviewQuestion: combined });
                setNewQuestion('');
              }}
              className="h-[66px] w-auto whitespace-nowrap rounded-lg !border !border-mainBlue !bg-white px-[16px] !text-mainBlue"
            >
              질문 추가하기
            </Button>
          </div>
          {formData.interviewQuestion && (
            <div className="mt-4">
              <ul className="space-y-3">
                {formData.interviewQuestion
                  .split('\n')
                  .filter(Boolean)
                  .map((q, idx) => (
                    <li key={idx}>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 z-10 -translate-y-1/2 transform">
                          <span className="text-h4 font-bold text-mainBlue">Q.</span>
                        </div>
                        <div className="flex h-[66px] w-[949px] items-center rounded-lg border border-gray-200 bg-white pl-12 pr-12 text-h4 text-gray-700">
                          {q}
                        </div>
                        <button
                          type="button"
                          aria-label="질문 삭제"
                          onClick={() => {
                            const items = formData.interviewQuestion.split('\n').filter(Boolean);
                            items.splice(idx, 1);
                            onUpdate({ interviewQuestion: items.join('\n') });
                          }}
                          className="font-regular absolute right-12 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded text-[20px] text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                          ×
                        </button>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        {/* 면접 후기 */}
        <div className="mb-6">
          <label className="mb-2 block p-1 text-h4 font-medium text-gray-700">
            면접 후기 <span className="text-red-500">*</span>
          </label>
          <textarea
            placeholder="면접의 분위기, 답변 예시 등을 공유해 주세요! 면접 준비자들에게 큰 도움이 될 거예요."
            value={formData.interviewReview}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              onUpdate({ interviewReview: e.target.value })
            }
            className="h-[200px] w-[1096px] resize-none rounded-lg border border-gray-200 bg-white p-4 text-h4 text-gray-700 placeholder-gray-400 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
          />
        </div>

        {/* 합격 여부 */}
        <div className="mb-8">
          <label className="mb-2 block p-1 text-h4 font-medium text-gray-700">
            합격 여부 <span className="text-red-500">*</span>
          </label>
          <div className="flex w-[800px] gap-4">
            <button
              type="button"
              className={`flex h-[66px] flex-1 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${formData.passStatus === '최종합격' ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => onUpdate({ passStatus: '최종합격' })}
            >
              최종합격
            </button>
            <button
              type="button"
              className={`flex h-[66px] flex-1 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${formData.passStatus === '2차합격' ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => onUpdate({ passStatus: '2차합격' })}
            >
              2차합격
            </button>
            <button
              type="button"
              className={`flex h-[66px] flex-1 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${formData.passStatus === '1차합격' ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => onUpdate({ passStatus: '1차합격' })}
            >
              1차합격
            </button>
            <button
              type="button"
              className={`flex h-[66px] flex-1 items-center justify-center rounded-lg border text-h4 font-medium transition-colors ${formData.passStatus === '불합격' ? 'border-mainBlue bg-subLightBlue text-mainBlue' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
              onClick={() => onUpdate({ passStatus: '불합격' })}
            >
              불합격
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
