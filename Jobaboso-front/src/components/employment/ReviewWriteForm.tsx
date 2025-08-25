import React, { useEffect, useState } from 'react';
import { CompanyInfoSection } from './CompanyInfoSection';
import { InterviewInfoSection } from './InterviewInfoSection';
import { PassInfoSection } from './PassInfoSection';
import Button from '@components/common/Button';

export interface ReviewFormData {
  applicationId: number | null;
  companyName: string;
  positions: string[];
  interviewExperience: 'newcomer' | 'experienced' | null;
  interviewYear: string;
  interviewMonth: string;
  overallRating: string | null;
  difficulty: string | null;
  interviewQuestion: string;
  interviewReview: string;
  passStatus: string | null;
}

interface ReviewWriteFormProps {
  onSubmit?: (data: ReviewFormData) => void;
  initialData?: ReviewFormData;
  submitLabel?: string;
}

export const ReviewWriteForm: React.FC<ReviewWriteFormProps> = ({
  onSubmit,
  initialData,
  submitLabel = '등록하기',
}) => {
  const [formData, setFormData] = useState<ReviewFormData>(
    initialData ?? {
      applicationId: null,
      companyName: '',
      positions: [],
      interviewExperience: null,
      interviewYear: '2025',
      interviewMonth: '8',
      overallRating: null,
      difficulty: null,
      interviewQuestion: '',
      interviewReview: '',
      passStatus: null,
    }
  );

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(formData);
    } else {
      console.log('폼 데이터:', formData);
    }
  };

  const updateFormData = (updates: Partial<ReviewFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  return (
    <div className="w-full">
      <CompanyInfoSection formData={formData} onUpdate={updateFormData} />

      <InterviewInfoSection formData={formData} onUpdate={updateFormData} />

      <PassInfoSection formData={formData} onUpdate={updateFormData} />

      <div className="mt-40 flex justify-end">
        <Button onClick={handleSubmit} className="h-[66px] w-auto px-[68px]">
          {submitLabel}
        </Button>
      </div>
    </div>
  );
};
