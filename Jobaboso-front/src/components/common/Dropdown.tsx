import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const Dropdown: React.FC<DropdownProps> = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((option) => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;
  const textColor = selectedOption ? 'text-gray-900' : 'text-gray-400';

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`${isOpen ? 'min-h-[46px]' : 'h-[46px]'} w-full rounded-lg border border-gray-300 bg-white px-6 py-2 text-bodyLg ${textColor} focus-within:border-gray-300 focus-within:outline-none focus-within:ring-1 focus-within:ring-gray-300`}
      >
        <div className="flex items-center justify-between">
          <span className="truncate">{displayText}</span>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-center"
          >
            <ChevronDownIcon
              className={`h-6 w-6 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {isOpen && (
          <div className="mt-2">
            {options.map((option, index) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className="w-full cursor-pointer py-3 text-left text-base text-gray-400 transition-colors hover:bg-gray-50"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dropdown;
