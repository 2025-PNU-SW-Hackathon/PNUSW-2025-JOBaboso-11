import { useState } from 'react';

interface TagInputProps {
  id: string;
  label: string;
  placeholder: string;
  value: string[]; // 외부에서 전달된 태그 리스트
  onChange: (tags: string[]) => void; // 외부 상태 변경 함수
  error?: string;
}

const TagInput = ({ id, label, placeholder = ' ', value, onChange, error }: TagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() && !isComposing) {
      e.preventDefault();
      const newTag = inputValue.trim();
      if (!value.includes(newTag)) {
        onChange([...value, newTag]); // 외부 상태 업데이트
      }
      setInputValue('');
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false);
    const target = e.target as HTMLInputElement;
    setInputValue(target.value);
  };

  const handleRemove = (index: number) => {
    const updated = [...value];
    updated.splice(index, 1);
    onChange(updated); // 외부 상태 업데이트
  };

  return (
    <div className="mx-auto my-0 w-full">
      <label htmlFor={id} className="mb-2 block p-1 text-h4 font-medium text-gray-700">
        {label}
      </label>

      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
        {value.map((tag, index) => (
          <span
            key={index}
            className="flex items-center gap-1 rounded-full bg-subLightBlue px-4 py-1 text-h4 text-gray-600"
          >
            {tag}
            <button
              type="button"
              className="ml-2 text-gray-600 hover:text-gray-800"
              onClick={() => handleRemove(index)}
            >
              ×
            </button>
          </span>
        ))}

        <input
          id={id}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          placeholder={placeholder}
          className="min-w-[120px] flex-1 border-none bg-transparent p-1 text-h4 focus:outline-none"
        />
      </div>

      <p className="mt-1 text-[12px] text-[#FF3636]">{error ?? '\u00A0'}</p>
    </div>
  );
};

export default TagInput;
