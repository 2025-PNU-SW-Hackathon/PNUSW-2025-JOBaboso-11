import React from 'react';
import { InputField } from '@components/common/InputField';
import { FiChevronDown, FiSearch, FiHelpCircle } from 'react-icons/fi';

interface CompanyInfoSectionProps {
  companyType: string;
  onChangeCompanyType: (e: React.ChangeEvent<HTMLInputElement>) => void;
  registrationName: string;
  onChangeRegistrationName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  companyName: string;
  onChangeCompanyName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  companyAddress: string;
  onChangeCompanyAddress: (e: React.ChangeEvent<HTMLInputElement>) => void;
  businessLicenseNo: string;
  onChangeBusinessLicenseNo: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isPartner: boolean;
  onChangeIsPartner: (value: boolean) => void;
  companyTypeError?: string;
  registrationNameError?: string;
  companyNameError?: string;
  companyAddressError?: string;
  businessLicenseNoError?: string;
}

export const CompanyInfoSection: React.FC<CompanyInfoSectionProps> = ({
  companyType,
  onChangeCompanyType,
  registrationName,
  onChangeRegistrationName,
  companyName,
  onChangeCompanyName,
  companyAddress,
  onChangeCompanyAddress,
  businessLicenseNo,
  onChangeBusinessLicenseNo,
  isPartner,
  onChangeIsPartner,
  companyTypeError,
  registrationNameError,
  companyNameError,
  companyAddressError,
  businessLicenseNoError,
}) => {
  return (
    <div className="space-y-3">
      {/* 기업 형태 + 아이콘 (드롭다운 유도용) */}
      <InputField
        id="companyType"
        label="기업 형태"
        placeholder="기업 형태를 선택해 주세요."
        rightIcon={<FiChevronDown size={24} />}
        onRightIconClick={() => {}}
        value={companyType}
        onChange={onChangeCompanyType}
        error={companyTypeError}
      />

      {/* 사업자등록명 */}
      <InputField
        id="businessName"
        label="사업자등록명"
        placeholder="사업자등록명을 입력해 주세요."
        value={registrationName}
        onChange={onChangeRegistrationName}
        error={registrationNameError}
      />

      {/* 회사명 */}
      <InputField
        id="companyName"
        label="회사명"
        placeholder="회사명을 입력해 주세요."
        value={companyName}
        onChange={onChangeCompanyName}
        error={companyNameError}
      />

      {/* 회사 주소 + 검색 아이콘 */}
      <InputField
        id="companyAddress"
        label="회사 주소"
        placeholder="회사 주소를 입력해 주세요."
        rightIcon={<FiSearch size={24} />}
        onRightIconClick={() => {}}
        value={companyAddress}
        onChange={onChangeCompanyAddress}
        error={companyAddressError}
      />

      {/* 기업 인증 + 도움말 아이콘 */}
      <InputField
        id="companyCert"
        label="기업 인증"
        placeholder="사업자등록증명원 발급번호를 입력해 주세요."
        rightIcon={<FiHelpCircle size={24} />}
        onRightIconClick={() => {}}
        error={
          businessLicenseNoError || '* 발급일 90일 이내사업자등록증명원의 발급번호만 가능합니다.'
        }
        value={businessLicenseNo}
        onChange={onChangeBusinessLicenseNo}
      />
    </div>
  );
};
