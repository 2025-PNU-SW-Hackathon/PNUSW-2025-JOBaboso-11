import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { useNavigate } from 'react-router-dom';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  buttonPosition: { x: number; y: number };
}

const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose, buttonPosition }) => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const navigate = useNavigate();

  console.log('AIModal 렌더링:', { isOpen, buttonPosition });

  // 모달이 닫힐 때 상태 초기화
  React.useEffect(() => {
    if (!isOpen) {
      setMessage('');
      setChatMessages([]);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log('메시지 전송:', message);
      // 모달 닫기
      onClose();
      // URL에 쿼리 파라미터로 메시지 추가하여 페이지 이동
      navigate(`/staff/students?ai_query=${encodeURIComponent(message.trim())}`);
    }
  };

  // 화면 중앙 위치 계산
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] bg-black/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="fixed right-48 h-[366px] w-[821px] overflow-hidden rounded-3xl bg-white p-12 shadow-2xl"
            style={{
              top: 'calc(61% - 45px)',
              transform: 'translateY(-50%)',
              transformOrigin: 'right bottom',
            }}
            initial={{
              scale: 0,
              borderRadius: '50%',
              // 시작 위치: 우측 하단에서 시작
              x: 0,
              y: 100,
            }}
            animate={{
              scale: 1,
              borderRadius: '16px',
              x: 0,
              y: 0,
            }}
            exit={{
              scale: 0,
              borderRadius: '50%',
              // 퇴장도 우측 하단으로
              x: 0,
              y: 100,
            }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 25,
              duration: 0.6,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* X 버튼 */}
            <div className="mb-14">
              <div className="flex justify-center items-center my-6 w-12 h-12">
                <img src="/staff/ai.svg" alt="AI" className="w-12 h-12" />
              </div>
              <div className="space-y-1">
                <h2 className="font-semibold text-gray-800 text-h2">안녕하세요, 잡메이트예요.</h2>
                <p className="font-semibold text-gray-800 text-h2">
                  학생들에 대해 궁금한 점을 물어보세요!
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex absolute top-6 right-6 z-10 justify-center items-center w-8 h-8 text-gray-500 rounded-full transition-colors hover:bg-gray-100 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* 입력 영역 */}
            <div className="border-t border-gray-100">
              <form onSubmit={handleSubmit} className="relative">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="무엇이든 물어보세요. 예시 : 부산 기업에 합격한 23년도 졸업생을 보여줘"
                  className="px-4 py-3 pr-14 w-full rounded-lg border border-gray-300 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="flex absolute right-2 top-1/2 justify-center items-center w-8 h-8 bg-gray-200 rounded-full transition-colors -translate-y-1/2 group hover:bg-blue-600"
                >
                  <ArrowRightIcon className="w-4 h-4 font-bold text-gray-400 group-hover:text-white" />
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIModal;
