// components/Callout.tsx
import React from 'react';
import { MdLightbulb } from 'react-icons/md';

interface CalloutProps {
  text: string;
}

export const Callout: React.FC<CalloutProps> = ({ text }) => {
  return (
    <div className="flex w-full items-center gap-2 rounded-[16px] bg-subLightBlue px-6 py-4">
      <MdLightbulb className="h-6 w-6 text-[#FBC02D]" />
      <span className="text-h4 text-gray-800">{text}</span>
    </div>
  );
};
