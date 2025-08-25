// src/components/common/BinarySelector.tsx
import React from 'react';

interface BinarySelectorProps<T extends string> {
  label: string;
  options: [T, T];
  value: T | '';
  onChange: (value: T) => void;
  labels?: [string, string];
  error?: string;
}

export const BinarySelector = <T extends string>({
  label,
  options,
  value,
  onChange,
  labels = options,
  error,
}: BinarySelectorProps<T>) => {
  return (
    <div>
      <label className="mb-2 block p-1 text-h4 font-medium text-gray-700">{label}</label>
      <div className="mt-1 flex space-x-4">
        {options.map((option, idx) => (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            className={`h-[66px] flex-1 rounded-xl border py-3 transition-all ${
              value === option
                ? 'border-mainBlue bg-mainBlue text-white'
                : 'border-gray-200 bg-white text-gray-400'
            }`}
          >
            {labels[idx]}
          </button>
        ))}
      </div>
      <p className="mt-1 text-[12px] text-[#FF3636]">{error ?? '\u00A0'}</p>
    </div>
  );
};
