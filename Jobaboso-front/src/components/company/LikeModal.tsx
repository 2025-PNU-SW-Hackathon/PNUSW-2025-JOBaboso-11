import React, { useState } from 'react';
import Button from '../common/Button';
import { InputField } from '../common/InputField';
import { maskNameMiddle } from '../../utils/nameMasking';

interface LikeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    message: string;
    contact_email: string;
    contact_phone: string;
    suggested_position: string;
  }) => void;
  userName: string;
}

const LikeModal: React.FC<LikeModalProps> = ({ isOpen, onClose, onSubmit, userName }) => {
  const [formData, setFormData] = useState({
    message: '',
    contact_email: '',
    contact_phone: '',
    suggested_position: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{maskNameMiddle(userName)}님 찜하기</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            id="message"
            label="메시지"
            type="text"
            placeholder="지원자에게 전할 메시지를 입력하세요"
            value={formData.message}
            onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
            required
          />

          <InputField
            id="contact_email"
            label="연락처 이메일"
            type="email"
            placeholder="hr@company.com"
            value={formData.contact_email}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact_email: e.target.value }))}
            required
          />

          <InputField
            id="contact_phone"
            label="연락처 전화번호"
            type="tel"
            placeholder="010-1234-5678"
            value={formData.contact_phone}
            onChange={(e) => setFormData((prev) => ({ ...prev, contact_phone: e.target.value }))}
            required
          />

          <InputField
            id="suggested_position"
            label="제안 직무"
            type="text"
            placeholder="개발자"
            value={formData.suggested_position}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, suggested_position: e.target.value }))
            }
            required
          />

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="w-auto flex-1">
              취소
            </Button>
            <Button type="submit" variant="primary" className="w-auto flex-1">
              찜하기
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LikeModal;
