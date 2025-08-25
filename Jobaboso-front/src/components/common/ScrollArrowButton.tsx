import React from 'react';

interface ScrollArrowButtonProps {
  direction: 'left' | 'right';
  onClick: () => void;
  visible: boolean;
}

const ScrollArrowButton: React.FC<ScrollArrowButtonProps> = ({ direction, onClick, visible }) => {
  if (!visible) return null;

  return (
    <button
      onClick={onClick}
      className="absolute top-1/2 z-10 flex h-[52px] w-[52px] -translate-y-1/2 transform cursor-pointer items-center justify-center rounded-[34px] bg-white shadow-[0px_0px_8px_rgba(0,0,0,0.08)] transition-colors hover:bg-gray-50"
      style={{
        left: direction === 'left' ? '0' : 'auto',
        right: direction === 'right' ? '0' : 'auto',
      }}
    >
      <div className="flex h-9 w-9 items-center justify-center">
        {direction === 'left' ? (
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="#4B5563"
            strokeWidth="3"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        ) : (
          <svg
            className="h-8 w-8"
            fill="none"
            stroke="#4B5563"
            strokeWidth="3"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>
    </button>
  );
};

export default ScrollArrowButton;
