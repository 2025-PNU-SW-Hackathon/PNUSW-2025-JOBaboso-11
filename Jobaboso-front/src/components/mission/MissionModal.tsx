import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Mission, MissionHistory } from '@mocks/missionData';

interface MissionModalProps {
  isOpen: boolean;
  isEditMode: boolean;
  todayMission: Mission;
  selectedMission: MissionHistory | null;
  answerContent: string;
  onClose: () => void;
  onAnswerChange: (content: string) => void;
  onSave: () => void;
}

const MissionModal: React.FC<MissionModalProps> = ({
  isOpen,
  isEditMode,
  todayMission,
  selectedMission,
  answerContent,
  onClose,
  onAnswerChange,
  onSave,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-8">
        {/* 모달 헤더 */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-h2 font-semibold text-gray-700">
            {isEditMode
              ? `${new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}의 미션`
              : `${selectedMission?.date}의 미션`}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
          >
            <XMarkIcon className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        {/* 미션 아이콘과 제목 */}
        <div className="mb-8 flex items-start rounded-[16px] border border-gray-200 bg-gray-50 px-8 py-6">
          <div className="flexitems-center mr-4 justify-center">
            <img
              src={isEditMode ? todayMission.icon : '/file.svg'}
              alt="미션 아이콘"
              className="h-11 w-11"
            />
          </div>
          <div className="flex-1">
            <h3 className="mb-3 text-h4 font-semibold text-gray-600">
              {isEditMode ? todayMission.title : <>{selectedMission?.title}</>}
            </h3>

            {/* 가이드 (오늘의 미션일 때만 표시) */}
            {isEditMode && (
              <p className="text-bodyLg leading-relaxed text-gray-600">{todayMission.guide}</p>
            )}

            {/* 가이드 (미션 히스토리일 때도 표시) */}
            {!isEditMode && selectedMission?.guide && (
              <p className="leading-relaxed text-gray-700">{selectedMission.guide}</p>
            )}
          </div>
        </div>

        {/* 질문 */}
        <div className="mb-6">
          <div className="mb-3 flex items-end">
            <span className="mr-2 text-h2 font-bold text-mainBlue">Q.</span>
            <span className="text-h4 font-medium text-gray-700">
              {isEditMode ? todayMission.question : selectedMission?.question}
            </span>
          </div>
        </div>

        {/* 답변 영역 */}
        <div className="mb-8">
          {isEditMode ? (
            // 편집 모드: textarea로 수정 가능
            <textarea
              value={answerContent}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="자유롭게 답변을 작성해보세요!"
              className="h-48 w-full resize-none rounded-xl border border-gray-200 p-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            // 읽기 전용 모드: 기존 답변 표시
            <div className="h-48 w-full overflow-y-auto rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="whitespace-pre-wrap leading-relaxed text-gray-700">
                {selectedMission?.content}
              </p>
            </div>
          )}
        </div>

        {/* 저장 버튼 (편집 모드일 때만 표시) */}
        {isEditMode && (
          <div className="flex justify-end">
            <button
              onClick={onSave}
              className="rounded-lg bg-mainBlue px-8 py-2 text-h4 font-medium text-white transition-colors hover:bg-blue-700"
            >
              저장하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionModal;
