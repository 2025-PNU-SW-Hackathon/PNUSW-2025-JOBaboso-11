import React from 'react';
import { InputWithButton } from '@components/common/InputWithButton';
import { InputField } from '@components/common/InputField';

interface Props {
  onRequestCode: () => void;
  onVerifyCode: () => void;
  onResendCode: () => void;
  phoneError?: string;
  verificationError?: string;
  phone: string;
  onChangePhone: (v: string) => void;
  email: string;
  onChangeEmail: (v: string) => void;
  verificationCode: string;
  onChangeVerificationCode: (v: string) => void;
  isVerified: boolean;
  isRequestingCode: boolean;
  canVerify: boolean;
  emailError?: string;
}

export const ContactInfoSection: React.FC<Props> = ({
  onRequestCode,
  onVerifyCode,
  onResendCode,
  phoneError,
  verificationError,
  phone,
  onChangePhone,
  email,
  onChangeEmail,
  verificationCode,
  onChangeVerificationCode,
  isVerified,
  isRequestingCode,
  canVerify,
  emailError,
}) => (
  <div className="space-y-3">
    {/* 전화번호 입력 */}
    <InputWithButton
      id="phone"
      label="전화번호"
      value={phone}
      onChange={(e) => onChangePhone(e.target.value)}
      placeholder="예시: 010-1234-5678"
      buttonText="인증번호 받기"
      onButtonClick={onRequestCode}
      error={phoneError}
      disabled={isRequestingCode}
    />

    {/* 인증번호 입력 + 확인 + 재전송 */}
    <div className="flex items-start space-x-2">
      <div className="flex-1">
        <InputWithButton
          id="verification"
          label="인증번호"
          value={verificationCode}
          onChange={(e) => onChangeVerificationCode(e.target.value)}
          placeholder="문자로 전송된 인증번호를 입력해 주세요."
          buttonText="확인"
          onButtonClick={onVerifyCode}
          error={verificationError}
          disabled={isVerified}
        />
      </div>

      <div className="pt-[42px]">
        <button
          type="button"
          onClick={onResendCode}
          className="h-[66px] w-[120px] rounded-xl bg-gray-200 text-h4 font-medium text-gray-400 hover:opacity-50"
        >
          재전송
        </button>
      </div>
    </div>
    <InputField
      id="email"
      label="이메일"
      value={email}
      onChange={(e) => onChangeEmail(e.target.value)}
      placeholder="이메일을 입력해 주세요."
      error={emailError}
    />
  </div>
);
