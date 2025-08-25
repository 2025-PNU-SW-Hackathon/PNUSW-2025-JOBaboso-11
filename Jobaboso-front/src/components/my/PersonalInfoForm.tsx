import React from 'react';
import { InputField } from '@components/common/InputField';

interface PersonalInfoFormProps {
  form: {
    name: string;
    phone: string;
    gender: string;
    birth: string;
    email: string;
  };
  onChange: (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ form, onChange, onPhoneChange }) => {
  return (
    <div className="mb-16">
      <h2 className="mb-10 text-h2 font-semibold text-gray-800">인적사항</h2>
      <div className="grid grid-cols-[700px] gap-6">
        <div className="grid grid-cols-[212px_278px_149px] gap-6">
          {/* 1행 */}
          <InputField
            id="name"
            label="이름"
            placeholder="이름을 입력하세요"
            value={form.name}
            onChange={onChange('name')}
          />
          <InputField
            id="phone"
            label="전화번호"
            placeholder="010-1234-5678"
            value={form.phone}
            onChange={onPhoneChange}
          />
          <div>
            <label htmlFor="gender" className="mb-2 block p-1 text-h4 font-medium text-gray-700">
              성별
            </label>
            <select
              id="gender"
              value={form.gender}
              onChange={(e) => onChange('gender')({ target: { value: e.target.value } } as any)}
              className="h-[66px] w-full rounded-lg border border-gray-200 bg-white px-4 py-[20px] text-h4 text-gray-600 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
            >
              <option value="여성">여성</option>
              <option value="남성">남성</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-[212px_278px_149px] gap-6">
          {/* 2행 */}
          <InputField
            id="birth"
            label="생년월일"
            placeholder="YYYY-MM-DD"
            value={form.birth}
            onChange={onChange('birth')}
          />
          <InputField
            id="email"
            label="이메일"
            placeholder="이메일을 입력하세요"
            value={form.email}
            onChange={onChange('email')}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;
