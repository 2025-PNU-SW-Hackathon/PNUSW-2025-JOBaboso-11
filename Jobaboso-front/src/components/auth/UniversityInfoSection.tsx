import React from 'react';
import { InputField } from '@components/common/InputField';
import { FiChevronDown, FiSearch, FiHelpCircle } from 'react-icons/fi';

interface UniversityInfoSectionProps {
  univName: string;
  onChangeUnivName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  field: string;
  onChangeField: (e: React.ChangeEvent<HTMLInputElement>) => void;
  univNameError?: string;
  fieldError?: string;
}

export const UniversityInfoSection: React.FC<UniversityInfoSectionProps> = ({
  univName,
  onChangeUnivName,
  field,
  onChangeField,
  univNameError,
  fieldError,
}) => {
  return (
    <div className="space-y-3">
      <InputField
        id="UniversityName"
        label="대학교명"
        placeholder="대학교를 선택해 주세요."
        rightIcon={<FiChevronDown size={24} />}
        onRightIconClick={() => {}}
        value={univName}
        onChange={onChangeUnivName}
        error={univNameError}
      />

      {/* 학과명 작성 */}
      <InputField
        id="DepartmentName"
        label="학과명"
        placeholder="학과명을 입력해 주세요."
        value={field}
        onChange={onChangeField}
        error={fieldError}
      />

      {/* 재직증명서 */}
      <InputField
        id="CertificationOfEmployment"
        label="재직증명서"
        placeholder="재직증명서를 첨부해주세요."
        value={''}
        onChange={() => {}}
      />
    </div>
  );
};
