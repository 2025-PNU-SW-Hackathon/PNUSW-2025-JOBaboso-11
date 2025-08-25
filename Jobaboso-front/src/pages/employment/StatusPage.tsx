// pages/OverallEmploymentPage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApplicationTable, ApplicationRow } from '@components/employment/ApplicationTable';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { StatusSection } from '@components/employment/StatusSection';
import { getApplications, Application } from '../../apis/employment';
import { Status, StatusLabelMap, StatusStyleMap } from '../../type/Status';
import { companies, Company } from '../../data/companyPositions';

const ResumeEditPage: React.FC = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await getApplications(page, 10);
        setApplications(response.applications);
        setTotalPages(response.total_pages);
      } catch (err) {
        setError('지원 목록을 불러오는데 실패했습니다.');
        console.error('Error fetching applications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [page]);

  // API 응답을 ApplicationRow 형식으로 변환
  const convertToApplicationRows = (apps: Application[]): ApplicationRow[] => {
    return apps.map((app) => {
      // 회사명으로 로고 찾기
      const companyInfo = companies.find((company) => company.name === app.company_name);

      return {
        id: app.id,
        company: app.company_name,
        position: app.position || '미지정',
        date: new Date(app.application_date).toLocaleString('ko-KR'),
        status: getStatusText(app.status),
        originalStatus: app.status, // 원본 상태값 저장
        companyLogo: companyInfo?.logo, // 회사 로고 추가
      };
    });
  };

  // 상태 텍스트 변환
  const getStatusText = (status: string): string => {
    // Status 타입에 해당하는 경우 StatusLabelMap에서 한국어 텍스트 반환
    if (status in StatusLabelMap) {
      return StatusLabelMap[status as Status];
    }

    // 기타 상태에 대한 매핑 (한국어 텍스트로 변환)
    const statusMap: { [key: string]: string } = {
      document_accepted: '서류합격',
      pending: '대기중',
      rejected: '불합격',
    };
    return statusMap[status] || '진행중';
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    );
  }

  const applicationRows = convertToApplicationRows(applications);

  // 행 클릭 시 해당 지원서 상세 페이지로 이동
  const handleRowClick = (id: number) => {
    navigate(`/employment/applications/${id}`);
  };

  return (
    <>
      <StatusSection applications={applications} />
      <div className="mb-4 mt-20 flex items-center gap-2 text-bodyLg text-gray-800">
        <InformationCircleIcon className="h-5 w-5 shrink-0 self-center" />
        <span className="leading-none">지원한 기업들이 최신순으로 정렬되어 나열됩니다.</span>
      </div>
      <ApplicationTable rows={applicationRows} onRowClick={handleRowClick} />
    </>
  );
};

export default ResumeEditPage;
