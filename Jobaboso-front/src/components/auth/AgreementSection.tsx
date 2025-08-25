// src/components/auth/AgreementSection.tsx
import React, { ChangeEvent, useState, useEffect } from 'react';

interface Agreement {
  id: string;
  label: string;
  required: boolean;
}

const agreementsData: Agreement[] = [
  { id: 'terms', label: '이용 약관 동의', required: true },
  { id: 'privacy', label: '개인정보 수집 및 이용 동의', required: true },
  { id: 'optPersonal', label: '개인정보 수집 및 이용 동의', required: false },
  { id: 'optEmail', label: '광고성 정보 이메일 수신 동의', required: false },
  { id: 'optSms', label: '광고성 정보 SMS 수신 동의', required: false },
];

interface Props {
  onAllChecked: (allChecked: boolean) => void;
}

export const AgreementSection: React.FC<Props> = ({ onAllChecked }) => {
  const [checkedAll, setCheckedAll] = useState(false);
  const [checkedList, setCheckedList] = useState<Record<string, boolean>>(
    Object.fromEntries(agreementsData.map((a) => [a.id, false]))
  );

  const handleCheckAll = (e: ChangeEvent<HTMLInputElement>) => {
    const all = e.target.checked;
    setCheckedAll(all);
    setCheckedList(Object.fromEntries(agreementsData.map((a) => [a.id, all])));
  };

  const handleCheck = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    const next = { ...checkedList, [id]: checked };
    setCheckedList(next);
    setCheckedAll(agreementsData.every((a) => next[a.id]));
  };

  useEffect(() => {
    onAllChecked(checkedAll);
  }, [checkedAll, onAllChecked]);

  return (
    <div className="space-y-8 rounded-xl border border-gray-200 px-[30px] py-[40px]">
      {/* 전체 동의: 텍스트 왼쪽, 체크박스 오른쪽 */}
      <div className="flex items-center justify-between">
        <span className="text-h3 text-gray-700">
          필수 동의 항목 및 개인정보 수집 및 이용 동의(선택), <br /> 광고성 정보 수신(선택)에 모두
          동의합니다.
        </span>
        <input
          type="checkbox"
          className="h-5 w-5 rounded border-gray-300 accent-mainBlue"
          checked={checkedAll}
          onChange={handleCheckAll}
        />
      </div>

      <div className="h-0 w-[530px] border-t border-gray-200" />

      {/* 개별 동의 리스트 */}
      <ul className="space-y-3">
        {agreementsData.map((a) => (
          <li key={a.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-h4">
                {a.required ? (
                  <>
                    <span className="text-mainBlue">[필수]&nbsp;</span>
                    <span className="text-gray-600">{a.label}</span>
                  </>
                ) : (
                  <>
                    <span className="text-gray-600">[선택]&nbsp;</span>
                    <span className="text-gray-600">{a.label}</span>
                  </>
                )}
              </span>
              {/* <button
                type="button"
                className="text-blue-600 text-sm hover:underline"
              >
                내용보기
              </button> */}
            </div>
            <input
              type="checkbox"
              id={a.id}
              className="h-5 w-5 rounded border-gray-300 accent-mainBlue"
              checked={checkedList[a.id]}
              onChange={handleCheck}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};
