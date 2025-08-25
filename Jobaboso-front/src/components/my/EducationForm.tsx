import React from 'react';
import { InputField } from '@components/common/InputField';
import { formatYearMonthKoreanInput } from '@utils/dateUtils';

interface EducationFormProps {
  form: {
    university: string;
    major: string;
    gpa: string;
    startDate: string;
    endDate: string;
    status: string;
  };
  onChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDateChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStartDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEndDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({
  form,
  onChange,
  onDateChange,
  onStartDateChange,
  onEndDateChange,
}) => {
  return (
    <div className="mb-16">
      <h2 className="mb-10 text-h2 font-semibold text-gray-800">학력</h2>
      <div className="grid grid-cols-[700px] gap-6">
        <div className="grid grid-cols-[212px_278px] gap-6">
          {/* 1행: 학교명, 주전공 */}
          <InputField
            id="university"
            label="학교명"
            placeholder="학교명을 입력하세요"
            value={form.university}
            onChange={onChange('university')}
          />
          <InputField
            id="major"
            label="주전공"
            placeholder="주전공을 입력하세요"
            value={form.major}
            onChange={onChange('major')}
          />
        </div>

        <div className="grid grid-cols-[149px_200px_200px_149px] gap-6">
          {/* 2행: 학점, 입학년도, 졸업년도, 상태 */}
          <InputField
            id="gpa"
            label="학점"
            placeholder="4.0"
            value={form.gpa}
            onChange={onChange('gpa')}
          />
          <InputField
            id="startDate"
            label="입학년도"
            placeholder="2021년 3월"
            value={form.startDate}
            onChange={onStartDateChange}
          />
          <InputField
            id="endDate"
            label="졸업년도"
            placeholder="2026년 2월"
            value={form.endDate}
            onChange={onEndDateChange}
          />
          <div>
            <label htmlFor="status" className="mb-2 block p-1 text-h4 font-medium text-gray-700">
              상태
            </label>
            <select
              id="status"
              value={form.status}
              onChange={(e) => onChange('status')({ target: { value: e.target.value } } as any)}
              className="h-[66px] w-full rounded-lg border border-gray-200 bg-white px-4 py-[20px] text-h4 text-gray-600 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
            >
              <option value="재학중">재학중</option>
              <option value="졸업">졸업</option>
              <option value="휴학">휴학</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationForm;
