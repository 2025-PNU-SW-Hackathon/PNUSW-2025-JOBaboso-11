import React, { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountInfoSection } from '@components/auth/AccountInfoSection';
import { ContactInfoSection } from '@components/auth/ContactInfoSection';
import { AgreementSection } from '@components/auth/AgreementSection';
import { CompanyInfoSection } from '@components/auth/CompanyInfoSection';
import { postSignUpCompany } from '@apis/auth';
import { SignUpCompanyRequestDto } from '@type/auth/SignUpDTO';

const SignupCompanyPage: React.FC = () => {
  const navigate = useNavigate();
  // useState를 함수 내부에서 선언
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [allAgreed, setAllAgreed] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false); // 인증번호 검증 완료 여부
  const [sentCode, setSentCode] = useState(''); // 실제 발송된 인증번호
  const [isRequestingCode, setIsRequestingCode] = useState(false); // 인증번호 받기 버튼 비활성화
  const [isCheckingUsername, setIsCheckingUsername] = useState(false); // 아이디 중복확인 중 여부

  // 기업 정보 state
  const [companyType, setCompanyType] = useState('');
  const [registrationName, setRegistrationName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [businessLicenseNo, setBusinessLicenseNo] = useState('');
  const [isPartner, setIsPartner] = useState(false);

  // 에러 상태 추가
  const [usernameError, setUsernameError] = useState<string | undefined>();
  const [passwordError, setPasswordError] = useState<string | undefined>();
  const [passwordConfirmError, setPasswordConfirmError] = useState<string | undefined>();
  const [nameError, setNameError] = useState<string | undefined>();
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [emailError, setEmailError] = useState<string | undefined>();
  const [companyTypeError, setCompanyTypeError] = useState<string | undefined>();
  const [registrationNameError, setRegistrationNameError] = useState<string | undefined>();
  const [companyNameError, setCompanyNameError] = useState<string | undefined>();
  const [companyAddressError, setCompanyAddressError] = useState<string | undefined>();
  const [businessLicenseNoError, setBusinessLicenseNoError] = useState<string | undefined>();

  const handleCheckUsername = () => {
    setIsCheckingUsername(true);
  };
  const handleRequestCode = () => {
    // 전화번호 형식 검증
    if (!phone) {
      alert('전화번호를 입력해 주세요.');
      return;
    }
    if (!/^\d{3}-\d{4}-\d{4}$/.test(phone)) {
      alert('전화번호는 000-0000-0000 형식으로 입력해 주세요.');
      return;
    }

    // 6자리 랜덤 인증번호 생성
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setSentCode(code);
    setIsRequestingCode(true);
    setIsVerified(false);
    setVerificationCode('');
    console.log('인증번호:', code);
    // 60초 후 버튼 다시 활성화 (예시)
    setTimeout(() => setIsRequestingCode(false), 60000);
  };
  const handleVerifyCode = () => {
    if (verificationCode === sentCode && sentCode.length === 6) {
      setIsVerified(true);
      alert('인증이 완료되었습니다.');
    } else {
      setIsVerified(false);
      alert('인증번호가 올바르지 않습니다.');
    }
  };
  const handleResendCode = () => console.log('인증번호 재전송');

  // 유효성 검사 함수
  const validate = () => {
    let valid = true;
    if (!userId) {
      setUsernameError('아이디를 입력해 주세요.');
      valid = false;
    } else {
      setUsernameError(undefined);
    }
    if (!password) {
      setPasswordError('비밀번호를 입력해 주세요.');
      valid = false;
    } else {
      setPasswordError(undefined);
    }
    if (!passwordConfirm) {
      setPasswordConfirmError('비밀번호 확인을 입력해 주세요.');
      valid = false;
    } else if (password !== passwordConfirm) {
      setPasswordConfirmError('비밀번호가 일치하지 않습니다.');
      valid = false;
    } else {
      setPasswordConfirmError(undefined);
    }
    if (!name) {
      setNameError('이름을 입력해 주세요.');
      valid = false;
    } else {
      setNameError(undefined);
    }
    if (!phone) {
      setPhoneError('전화번호를 입력해 주세요.');
      valid = false;
    } else if (!/^\d{3}-\d{4}-\d{4}$/.test(phone)) {
      setPhoneError('전화번호는 000-0000-0000 형식으로 입력해 주세요.');
      valid = false;
    } else {
      setPhoneError(undefined);
    }
    if (!email) {
      setEmailError('이메일을 입력해 주세요.');
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('이메일은 string@string.string 형식으로 입력해 주세요.');
      valid = false;
    } else {
      setEmailError(undefined);
    }
    if (!companyType) {
      setCompanyTypeError('기업 형태를 선택해 주세요.');
      valid = false;
    } else {
      setCompanyTypeError(undefined);
    }
    if (!registrationName) {
      setRegistrationNameError('사업자등록명을 입력해 주세요.');
      valid = false;
    } else {
      setRegistrationNameError(undefined);
    }
    if (!companyName) {
      setCompanyNameError('회사명을 입력해 주세요.');
      valid = false;
    } else {
      setCompanyNameError(undefined);
    }
    if (!companyAddress) {
      setCompanyAddressError('회사 주소를 입력해 주세요.');
      valid = false;
    } else {
      setCompanyAddressError(undefined);
    }
    if (!businessLicenseNo) {
      setBusinessLicenseNoError('사업자등록증명원 발급번호를 입력해 주세요.');
      valid = false;
    } else {
      setBusinessLicenseNoError(undefined);
    }
    return valid;
  };

  // onChange에서 바로 에러 해제
  const handleUserIdChange = (v: string) => {
    setUserId(v);
    if (v) setUsernameError(undefined);
  };
  const handlePasswordChange = (v: string) => {
    setPassword(v);
    if (v) setPasswordError(undefined);
  };
  const handlePasswordConfirmChange = (v: string) => {
    setPasswordConfirm(v);
    if (v && v === password) setPasswordConfirmError(undefined);
  };
  const handleNameChange = (v: string) => {
    setName(v);
    if (v) setNameError(undefined);
  };
  const handlePhoneChange = (v: string) => {
    setPhone(v);
    if (v && /^\d{3}-\d{4}-\d{4}$/.test(v)) {
      setPhoneError(undefined);
    }
  };
  const handleEmailChange = (v: string) => {
    setEmail(v);
    if (v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setEmailError(undefined);
    }
  };

  // 기업 정보 핸들러
  const handleCompanyTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyType(e.target.value);
    if (e.target.value) setCompanyTypeError(undefined);
  };
  const handleRegistrationNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegistrationName(e.target.value);
    if (e.target.value) setRegistrationNameError(undefined);
  };
  const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value);
    if (e.target.value) setCompanyNameError(undefined);
  };
  const handleCompanyAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyAddress(e.target.value);
    if (e.target.value) setCompanyAddressError(undefined);
  };
  const handleBusinessLicenseNoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessLicenseNo(e.target.value);
    if (e.target.value) setBusinessLicenseNoError(undefined);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!allAgreed) {
      alert('모든 약관에 동의해 주세요.');
      return;
    }
    if (!validate()) {
      return;
    }
    const request: SignUpCompanyRequestDto = {
      user_id: userId,
      password,
      user_type: 'company',
      name,
      phone,
      email,
      company: {
        company_type: companyType,
        registration_name: registrationName,
        company_name: companyName,
        company_address: companyAddress,
        business_license_no: businessLicenseNo,
        is_partner: isPartner,
      },
    };
    try {
      await postSignUpCompany(request);
      alert('회원가입이 완료되었습니다.');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('회원가입에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-[586px]">
        <h1 className="mb-8 text-center text-[40px] font-bold leading-[60px] text-gray-800">
          기업 회원가입
        </h1>

        <h2 className="mb-4 text-h2 text-gray-900">기업 정보</h2>
        <CompanyInfoSection
          companyType={companyType}
          onChangeCompanyType={handleCompanyTypeChange}
          registrationName={registrationName}
          onChangeRegistrationName={handleRegistrationNameChange}
          companyName={companyName}
          onChangeCompanyName={handleCompanyNameChange}
          companyAddress={companyAddress}
          onChangeCompanyAddress={handleCompanyAddressChange}
          businessLicenseNo={businessLicenseNo}
          onChangeBusinessLicenseNo={handleBusinessLicenseNoChange}
          isPartner={isPartner}
          onChangeIsPartner={setIsPartner}
          companyTypeError={companyTypeError}
          registrationNameError={registrationNameError}
          companyNameError={companyNameError}
          companyAddressError={companyAddressError}
          businessLicenseNoError={businessLicenseNoError}
        />

        <h2 className="mb-4 text-h2 text-gray-900">인사담당자 정보</h2>
        <form className="space-y-3" onSubmit={onSubmit}>
          <AccountInfoSection
            userId={userId}
            onChangeUserId={handleUserIdChange}
            password={password}
            onChangePassword={handlePasswordChange}
            passwordConfirm={passwordConfirm}
            onChangePasswordConfirm={handlePasswordConfirmChange}
            name={name}
            onChangeName={handleNameChange}
            onCheckUsername={handleCheckUsername}
            nameError={nameError}
            usernameError={usernameError}
            passwordError={passwordError}
            passwordConfirmError={passwordConfirmError}
            isCheckingUsername={isCheckingUsername}
          />

          <ContactInfoSection
            phone={phone}
            onChangePhone={handlePhoneChange}
            email={email}
            onChangeEmail={handleEmailChange}
            onRequestCode={handleRequestCode}
            onVerifyCode={handleVerifyCode}
            verificationCode={verificationCode}
            onChangeVerificationCode={setVerificationCode}
            isVerified={isVerified}
            isRequestingCode={isRequestingCode}
            canVerify={
              verificationCode.length === 6 && !isVerified && verificationCode === sentCode
            }
            onResendCode={handleResendCode}
            phoneError={phoneError}
            emailError={emailError}
          />

          <AgreementSection onAllChecked={setAllAgreed} />

          <button
            type="submit"
            className="my-9 w-full rounded-xl bg-mainBlue py-4 text-h2 text-white hover:opacity-50 disabled:opacity-30"
            disabled={
              !userId ||
              !password ||
              !passwordConfirm ||
              !name ||
              !phone ||
              !/^\d{3}-\d{4}-\d{4}$/.test(phone) ||
              !verificationCode ||
              !isVerified ||
              !email ||
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
              !companyType ||
              !registrationName ||
              !companyName ||
              !companyAddress ||
              !businessLicenseNo ||
              !allAgreed
            }
          >
            가입하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupCompanyPage;
