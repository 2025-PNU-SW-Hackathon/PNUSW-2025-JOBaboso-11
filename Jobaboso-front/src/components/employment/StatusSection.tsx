// components/OverallStatusSection.tsx
import React from 'react';
import { StatusCard } from './StatusCard';
import {
  CheckCircleIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  UsersIcon,
  TrophyIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

interface StatusSectionProps {
  applications: Array<{
    status: string;
  }>;
}

export const StatusSection: React.FC<StatusSectionProps> = ({ applications }) => {
  // 통계 계산
  const totalApplications = applications.length;
  const documentsPassed = applications.filter((app) => app.status === 'documents_passed').length;
  const interviewCount = applications.filter((app) =>
    [
      'preparing_interview',
      'interview_completed',
      'interview_under_review',
      'interview_passed',
      'interview_failed',
      'final_accepted',
      'final_rejected',
      'offer_declined',
    ].includes(app.status)
  ).length;
  const finalAccepted = applications.filter((app) =>
    ['final_accepted', 'offer_declined'].includes(app.status)
  ).length;

  const statsData = {
    지원완료: `${totalApplications}곳`,
    자소서: '3개',
    서류합격: `${documentsPassed}곳`,
    면접: `${interviewCount}회`,
    최종합격: `${finalAccepted}개`,
    찜: '1회',
  };

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatusCard
          icon={<CheckCircleIcon className="h-5 w-5 text-[#27B122]" />}
          label="지원 완료"
          value={statsData.지원완료}
        />
        <StatusCard
          icon={<DocumentTextIcon className="h-5 w-5 text-[#E66B32]" />}
          label="준비한 자소서"
          value={statsData.자소서}
        />
        <StatusCard
          icon={<BriefcaseIcon className="h-5 w-5 text-[#1779FA]" />}
          label="서류 합격"
          value={statsData.서류합격}
        />
        <StatusCard
          icon={<UsersIcon className="h-5 w-5 text-[#81529D]" />}
          label="면접"
          value={statsData.면접}
        />
        <StatusCard
          icon={<TrophyIcon className="h-5 w-5 text-[#EABB25]" />}
          label="최종 합격"
          value={statsData.최종합격}
        />
        <StatusCard
          icon={<HeartIcon className="h-5 w-5 text-[#E5522D]" />}
          label="찜"
          value={statsData.찜}
        />
      </div>
    </section>
  );
};
