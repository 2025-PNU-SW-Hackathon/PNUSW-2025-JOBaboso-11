import React, { useState } from 'react';
import { InputWithButton } from '@components/common/InputWithButton';
import { InputField } from '@components/common/InputField';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface Props {
  userId: string;
  onChangeUserId: (v: string) => void;
  password: string;
  onChangePassword: (v: string) => void;
  passwordConfirm: string;
  onChangePasswordConfirm: (v: string) => void;
  name: string;
  onChangeName: (v: string) => void;
  onCheckUsername: () => void;
  nameError?: string;
  usernameError?: string;
  passwordError?: string;
  passwordConfirmError?: string;
  isCheckingUsername?: boolean;
}

export const AccountInfoSection: React.FC<Props> = ({
  userId,
  onChangeUserId,
  password,
  onChangePassword,
  passwordConfirm,
  onChangePasswordConfirm,
  name,
  onChangeName,
  onCheckUsername,
  nameError,
  usernameError,
  passwordError,
  passwordConfirmError,
  isCheckingUsername = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  return (
    <div className="space-y-3">
      {/* 아이디 */}
      <InputWithButton
        id="username"
        value={userId}
        onChange={(e) => onChangeUserId(e.target.value)}
        label="아이디"
        placeholder="아이디를 입력 후 중복 확인해 주세요."
        buttonText="중복확인"
        onButtonClick={onCheckUsername}
        error={usernameError}
        disabled={isCheckingUsername}
      />

      {/* 비밀번호 */}
      <InputField
        id="password"
        label="비밀번호"
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => onChangePassword(e.target.value)}
        placeholder="8~16자 사이의 영문, 숫자, 특수문자를 포함해서 입력해 주세요."
        error={passwordError}
        rightIcon={showPassword ? <FiEye size={24} /> : <FiEyeOff size={24} />}
        onRightIconClick={() => setShowPassword((prev) => !prev)}
      />

      {/* 비밀번호 확인 */}
      <InputField
        id="passwordConfirm"
        label="비밀번호 확인"
        type={showPasswordConfirm ? 'text' : 'password'}
        value={passwordConfirm}
        onChange={(e) => onChangePasswordConfirm(e.target.value)}
        placeholder="위에서 입력하신 비밀번호를 다시 입력해 주세요."
        error={passwordConfirmError}
        rightIcon={showPasswordConfirm ? <FiEye size={24} /> : <FiEyeOff size={24} />}
        onRightIconClick={() => setShowPasswordConfirm((prev) => !prev)}
      />
      <InputField
        id="name"
        label="이름"
        value={name}
        onChange={(e) => onChangeName(e.target.value)}
        placeholder="이름을 입력해 주세요."
        error={nameError}
      />
    </div>
  );
};
