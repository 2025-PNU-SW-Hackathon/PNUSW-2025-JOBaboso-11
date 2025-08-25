import React from 'react';

interface InputWithButtonProps {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
  buttonText: string;
  onButtonClick: () => void;
  error?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const InputWithButton: React.FC<InputWithButtonProps> = ({
  id,
  label,
  placeholder,
  type = 'text',
  buttonText,
  onButtonClick,
  error,
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className="mx-auto my-0 w-full">
      {/* 레이블 */}
      <label htmlFor={id} className="mb-2 block p-1 text-h4 font-medium text-gray-700">
        {label}
      </label>

      {/* input + button wrapper */}
      <div className="flex">
        {/* 인풋 */}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="h-[66px] flex-1 rounded-l-xl border border-r-0 border-gray-200 bg-white px-4 py-[20px] text-h4 text-gray-700 placeholder-gray-400 focus:border-mainBlue focus:outline-none focus:ring-1 focus:ring-mainBlue"
          disabled={disabled}
        />

        {/* 버튼 */}
        <button
          type="button"
          onClick={onButtonClick}
          className="h-[66px] w-1/4 rounded-r-xl border border-l-0 border-gray-200 bg-mainBlue text-h4 font-medium text-white hover:opacity-50 disabled:cursor-not-allowed disabled:opacity-30"
          disabled={disabled}
        >
          {buttonText}
        </button>
      </div>

      {/* 에러 메시지 */}
      <p className="mt-1 text-[12px] text-[#FF3636]">{error ?? '\u00A0'}</p>
    </div>
  );
};
