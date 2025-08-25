import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getApplication,
  ApplicationDetail,
  DocumentResponse as Document,
  updateApplication,
  createSchedules,
  getApplicationSchedules,
  deleteSchedule,
  ScheduleResponse,
  uploadDocuments,
  deleteDocument,
  downloadDocument,
  DocumentResponse,
} from '../../apis/employment';
import { Status, StatusLabelMap, StatusStyleMap } from '../../type/Status';
import { Schedule as ScheduleType, ScheduleLabelMap, ScheduleStyleMap } from '../../type/Schedules';
import { Result, ResultLabelMap, ResultStyleMap } from '../../type/Result';
import Button from '../../components/common/Button';
import Dropdown from '../../components/common/Dropdown';
import { TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { companies } from '../../data/companyPositions';

interface ScheduleItem {
  id: string;
  type: ScheduleType;
  start_date: string;
  end_date: string;
  notes?: string;
}

const ApplicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // 폼 상태
  const [companyName, setCompanyName] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [status, setStatus] = useState<Status>('preparing_documents');
  const [documents, setDocuments] = useState<DocumentResponse[]>([]);

  // 일정 입력 상태
  const [scheduleType, setScheduleType] = useState<ScheduleType>('document_deadline');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [scheduleNotes, setScheduleNotes] = useState('');

  // 지원 일시 상태
  const [applicationDate, setApplicationDate] = useState('');

  // 문서 관련 상태
  const [uploadingDocuments, setUploadingDocuments] = useState(false);
  const [deletingDocument, setDeletingDocument] = useState<number | null>(null);

  const [documentTypes, setDocumentTypes] = useState<string[]>([]);

  // 지원 부문 옵션
  const positionOptions = [
    'SW개발',
    'AI/ML',
    '데이터분석',
    '클라우드/인프라',
    '보안',
    '네트워크',
    '하드웨어개발',
    '반도체설계',
    '제품기획',
    'UX/UI디자인',
    '마케팅',
    '영업',
    '고객지원',
    '인사',
    '재무',
    '법무',
    '구매/자재',
    '물류/운송',
    '품질관리',
    '생산관리',
    '연구개발',
    '기술지원',
    '기타',
  ];

  // 상태 옵션 (Status 타입 사용)
  const statusOptions: Status[] = [
    'preparing_documents',
    'documents_submitted',
    'documents_under_review',
    'documents_passed',
    'documents_failed',
    'preparing_test',
    'test_completed',
    'test_under_review',
    'test_passed',
    'test_failed',
    'preparing_assignment',
    'assignment_submitted',
    'assignment_under_review',
    'assignment_passed',
    'assignment_failed',
    'preparing_interview',
    'interview_completed',
    'interview_under_review',
    'interview_passed',
    'interview_failed',
    'final_accepted',
    'final_rejected',
    'offer_declined',
  ];

  useEffect(() => {
    const fetchApplication = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await getApplication(parseInt(id));
        setApplication(data);

        // 기존 데이터로 폼 초기화
        if (data) {
          setCompanyName(data.company_name || '');
          setSelectedPosition(data.position || '');
          setStatus((data.status as Status) || 'preparing_documents');
          setApplicationDate(data.application_date ? data.application_date.split('T')[0] : '');
          // Document 타입을 DocumentResponse로 변환
          const convertedDocuments = (data.documents || []).map((doc: any) => ({
            id: doc.id,
            application_id: parseInt(id),
            document_type: doc.document_type || 'resume',
            file_name: doc.file_name || doc.name || 'document',
            file_size: doc.file_size || 0,
            original_name: doc.original_name || doc.name || 'document',
            uploaded_at: doc.uploaded_at || new Date().toISOString(),
            download_url: doc.download_url || doc.file_url || '',
            view_url: doc.view_url || doc.file_url || '',
          }));
          setDocuments(convertedDocuments);
        }

        // 일정 데이터 별도로 조회
        await fetchSchedules();
      } catch (err) {
        setError('지원서를 불러오는데 실패했습니다.');
        console.error('Error fetching application:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  // 일정 데이터 조회
  const fetchSchedules = async () => {
    if (!id) return;

    try {
      const schedulesData = await getApplicationSchedules(parseInt(id));
      const formattedSchedules = schedulesData.schedules.map((schedule: ScheduleResponse) => ({
        id: schedule.id.toString(),
        type: (schedule.schedule_type as ScheduleType) || 'document_deadline',
        start_date: schedule.start_date,
        end_date: schedule.end_date,
        notes: schedule.notes,
      }));
      setSchedules(formattedSchedules);
    } catch (err) {
      console.error('Error fetching schedules:', err);
    }
  };

  // 일정 추가
  const addSchedule = async () => {
    if (!id || !scheduleType || !startDate) return;

    try {
      const newSchedule = {
        schedule_type: scheduleType,
        start_date: `${startDate}T09:00:00.000Z`,
        end_date: endDate ? `${endDate}T18:00:00.000Z` : `${startDate}T18:00:00.000Z`,
        notes: scheduleNotes || '',
      };

      const createdSchedules = await createSchedules(parseInt(id), [newSchedule]);

      if (createdSchedules.length > 0) {
        const newScheduleItem: ScheduleItem = {
          id: createdSchedules[0].id.toString(),
          type: scheduleType,
          start_date: startDate,
          end_date: endDate || startDate,
          notes: scheduleNotes,
        };

        const updatedSchedules = [...schedules, newScheduleItem].sort((a, b) => {
          const dateA = new Date(a.start_date);
          const dateB = new Date(b.start_date);
          return dateA.getTime() - dateB.getTime();
        });

        setSchedules(updatedSchedules);
        setScheduleType('document_deadline');
        setStartDate('');
        setEndDate('');
        setScheduleNotes('');
      }
    } catch (err) {
      console.error('Error adding schedule:', err);
      alert('일정 추가에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 일정 삭제
  const removeSchedule = async (scheduleId: string) => {
    if (!id) return;

    try {
      await deleteSchedule(parseInt(id), parseInt(scheduleId));
      setSchedules(schedules.filter((schedule) => schedule.id !== scheduleId));
    } catch (err) {
      console.error('Error deleting schedule:', err);
      alert('일정 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 파일 선택 핸들러
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      try {
        setUploadingDocuments(true);

        // 파일들을 바로 업로드
        const filesArray = Array.from(selectedFiles);
        const types = filesArray.map(() => 'resume'); // 기본 타입은 이력서

        const uploadedDocuments = await uploadDocuments(parseInt(id!), filesArray, types);

        // 기존 문서 목록에 새로 업로드된 문서들 추가
        setDocuments((prev) => [...prev, ...uploadedDocuments]);

        alert('문서가 성공적으로 업로드되었습니다.');
      } catch (err) {
        console.error('Error uploading documents:', err);
        alert('문서 업로드에 실패했습니다. 다시 시도해주세요.');
      } finally {
        setUploadingDocuments(false);
        // input 초기화
        e.target.value = '';
      }
    }
  };

  // 파일 삭제 핸들러
  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setDocumentTypes((prev) => prev.filter((_, i) => i !== index));
  };

  // 문서 업로드 핸들러
  const handleDocumentUpload = async () => {
    if (!id || files.length === 0) return;

    try {
      setUploadingDocuments(true);

      // 문서 타입이 설정되지 않은 경우 기본값 설정
      const types = documentTypes.length > 0 ? documentTypes : files.map(() => 'resume');

      const uploadedDocuments = await uploadDocuments(parseInt(id), files, types);

      // 기존 문서 목록에 새로 업로드된 문서들 추가
      setDocuments((prev) => [...prev, ...uploadedDocuments]);

      // 파일 목록과 문서 타입 초기화
      setFiles([]);
      setDocumentTypes([]);

      alert('문서가 성공적으로 업로드되었습니다.');
    } catch (err) {
      console.error('Error uploading documents:', err);
      alert('문서 업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setUploadingDocuments(false);
    }
  };

  // 문서 삭제 핸들러
  const handleDocumentDelete = async (documentId: number) => {
    if (!id || !confirm('정말로 이 문서를 삭제하시겠습니까?')) return;

    try {
      setDeletingDocument(documentId);
      await deleteDocument(parseInt(id), documentId);

      // 문서 목록에서 삭제된 문서 제거
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));

      alert('문서가 삭제되었습니다.');
    } catch (err) {
      console.error('Error deleting document:', err);
      alert('문서 삭제에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setDeletingDocument(null);
    }
  };

  // 문서 다운로드 핸들러
  const handleDocumentDownload = async (documentId: number, fileName: string) => {
    if (!id) return;

    try {
      const downloadUrl = await downloadDocument(parseInt(id), documentId);

      // 다운로드 링크 생성 및 클릭
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error downloading document:', err);
      alert('문서 다운로드에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 문서 타입 변경 핸들러
  const handleDocumentTypeChange = (index: number, type: string) => {
    const newTypes = [...documentTypes];
    newTypes[index] = type;
    setDocumentTypes(newTypes);
  };

  // 지원하기 버튼 클릭 핸들러
  const handleSubmit = async () => {
    if (!id || !application) return;

    try {
      setUpdating(true);

      // API 요청 데이터 준비
      const updateData = {
        company_name: companyName,
        position: selectedPosition,
        application_date: applicationDate
          ? `${applicationDate}T00:00:00.000Z`
          : new Date().toISOString(),
        status: status,
      };

      // 지원서 수정 API 호출
      const updatedApplication = await updateApplication(parseInt(id), updateData);

      // 성공 메시지 표시 (실제로는 토스트나 알림 컴포넌트 사용 권장)
      alert('지원 정보가 성공적으로 수정되었습니다.');

      // 전체 지원 현황 페이지로 리다이렉트
      navigate('/employment/status');
    } catch (err) {
      console.error('Error updating application:', err);
      alert('지원 정보 수정에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-600">{error || '지원서를 찾을 수 없습니다.'}</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 지원 정보 카드 */}
      <div className="mb-6 rounded-[16px] border border-gray-300 bg-white p-8">
        <div className="mb-6">
          <h2 className="mb-2 text-xl font-semibold text-mainBlue">
            <div className="flex gap-3 items-center">
              <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[45px] border border-gray-300 bg-white">
                {(() => {
                  const company = companies.find((c) => c.name === companyName);
                  const logoPath = company?.logo;

                  if (logoPath) {
                    return (
                      <img
                        src={logoPath}
                        alt={`${companyName} 로고`}
                        className="object-contain w-6 h-6"
                        onError={(e) => {
                          // 이미지 로드 실패 시 기본 회사 아이콘 표시
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    );
                  }

                  return null;
                })()}
              </div>
              {companyName} 입사 지원
            </div>
          </h2>
        </div>

        {/* 제목 아래 구분선 */}
        <div className="mb-8 w-full h-px bg-gray-200"></div>

        <div className="space-y-10">
          <div>
            <label className="block mb-3 font-semibold text-gray-600 text-h4">지원 일시</label>
            <input
              type="date"
              value={applicationDate}
              onChange={(e) => setApplicationDate(e.target.value)}
              className="h-[46px] w-full rounded-lg border border-gray-300 bg-white px-6 py-2 text-bodyLg text-gray-900 focus-within:border-gray-300 focus-within:outline-none focus-within:ring-1 focus-within:ring-gray-300"
              placeholder="지원 일시를 선택해주세요."
            />
          </div>

          {/* 지원부문 */}
          <div>
            <label className="block mb-3 font-semibold text-gray-600 text-h4">지원부문</label>
            <Dropdown
              options={positionOptions.map((pos) => ({ value: pos, label: pos }))}
              value={selectedPosition}
              onChange={setSelectedPosition}
              placeholder="지원 부문을 선택해주세요."
            />
          </div>

          {/* 이력서 및 첨부 문서 */}
          <div>
            <label className="block mb-3 font-semibold text-gray-600 text-h4">
              이력서 및 첨부 문서
            </label>

            <div className="p-8 text-center rounded-lg border-2 border-gray-300 border-dashed transition-colors hover:border-mainBlue">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
                id="resume-upload"
                multiple
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <div className="flex flex-col justify-center items-center">
                  <p className="mb-4 text-gray-600 text-400 text-bodyMd">
                    첨부할 파일을 여기에 끌어다 놓거나, 파일 첨부 버튼을 클릭해주세요.
                  </p>
                  <div className="flex gap-2 items-center px-6 py-2 bg-white rounded-lg border border-mainBlue text-mainBlue">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                    파일 첨부
                  </div>
                </div>
              </label>
            </div>

            {/* 등록된 문서 표시 */}
            {documents.length > 0 && (
              <div className="mt-6 space-y-2">
                <div className="block mb-1 text-gray-600 text-bodyMd">등록된 문서</div>
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex gap-3 items-center">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <button
                        onClick={() => handleDocumentDownload(doc.id, doc.original_name)}
                        className="text-sm text-gray-700 cursor-pointer hover:text-blue-600 hover:underline"
                      >
                        {doc.original_name}
                      </button>
                    </div>
                    <div className="flex gap-4 items-center mr-4">
                      <button
                        onClick={() => handleDocumentDownload(doc.id, doc.original_name)}
                        className="flex gap-1 items-center text-sm text-green-600 hover:text-green-800"
                      >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDocumentDelete(doc.id)}
                        disabled={deletingDocument === doc.id}
                        className="flex gap-1 items-center text-sm text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 등록된 문서 리스트 */}
            {files.length > 0 && (
              <div className="mt-6">
                <div className="block mb-1 text-gray-600 text-bodyMd">등록된 문서</div>
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex gap-3 items-center">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                          />
                        </svg>
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                      <div className="flex gap-2 items-center">
                        <select
                          value={documentTypes[index] || 'resume'}
                          onChange={(e) => handleDocumentTypeChange(index, e.target.value)}
                          className="px-2 py-1 text-sm rounded border border-gray-300"
                        >
                          <option value="resume">이력서</option>
                          <option value="cover_letter">자기소개서</option>
                          <option value="portfolio">포트폴리오</option>
                          <option value="certificate">자격증</option>
                          <option value="other">기타</option>
                        </select>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={handleDocumentUpload}
                    disabled={uploadingDocuments}
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {uploadingDocuments ? '업로드 중...' : '문서 업로드'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 취업 일정 입력 */}
          <div>
            <label className="block mb-3 font-semibold text-gray-600 text-h4">취업 일정 입력</label>
            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-4">
                <div>
                  <div className="block mb-1 text-gray-600 text-bodyMd">일정 유형</div>
                  <Dropdown
                    options={Object.entries(ScheduleLabelMap).map(([key, label]) => ({
                      value: key,
                      label,
                    }))}
                    value={scheduleType}
                    onChange={(value) => setScheduleType(value as ScheduleType)}
                    placeholder="일정의 유형을 선택해주세요."
                  />
                </div>
                <div>
                  <div className="block mb-1 text-gray-600 text-bodyMd">시작일</div>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-[46px] w-full rounded-lg border border-gray-300 bg-white px-6 py-2 text-bodyLg text-gray-900 focus-within:border-gray-300 focus-within:outline-none focus-within:ring-1 focus-within:ring-gray-300"
                    placeholder="시작일을 선택해주세요."
                  />
                </div>
                <div>
                  <div className="block mb-1 text-gray-600 text-bodyMd">종료일</div>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate}
                    className="h-[46px] w-full rounded-lg border border-gray-300 bg-white px-6 py-2 text-bodyLg text-gray-900 focus-within:border-gray-300 focus-within:outline-none focus-within:ring-1 focus-within:ring-gray-300"
                    placeholder="종료일을 선택해주세요."
                  />
                </div>
                <div>
                  <div className="block mb-1 text-gray-600 text-bodyMd">메모</div>
                  <input
                    type="text"
                    value={scheduleNotes}
                    onChange={(e) => setScheduleNotes(e.target.value)}
                    className="h-[46px] w-full rounded-lg border border-gray-300 bg-white px-6 py-2 text-bodyLg text-gray-900 focus-within:border-gray-300 focus-within:outline-none focus-within:ring-1 focus-within:ring-gray-300"
                    placeholder="메모를 입력하세요"
                  />
                </div>
                <div>
                  <div className="block mb-1 text-gray-600 text-bodyMd">&nbsp;</div>
                  <button
                    onClick={addSchedule}
                    disabled={!startDate}
                    className="h-[46px] w-full rounded-lg bg-mainBlue text-white hover:bg-subDarkBlue disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    일정 추가
                  </button>
                </div>
              </div>
            </div>

            {/* 일정 리스트 */}
            {schedules.length > 0 && (
              <div className="mt-6">
                <div className="block mb-1 text-gray-600 text-bodyMd">등록된 일정</div>
                <div className="space-y-2">
                  {schedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex gap-3 items-center">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-medium ${ScheduleStyleMap[schedule.type]}`}
                        >
                          {ScheduleLabelMap[schedule.type]}
                        </span>
                        <div className="flex gap-2 items-center">
                          <span className="text-sm text-gray-600">
                            {schedule.start_date.split('T')[0]}
                            {schedule.end_date &&
                              schedule.start_date.split('T')[0] !==
                                schedule.end_date.split('T')[0] && (
                                <span className="text-gray-600">
                                  {' '}
                                  ~ {schedule.end_date.split('T')[0]}
                                </span>
                              )}
                          </span>
                        </div>
                        {schedule.notes && (
                          <span className="text-sm text-gray-500">({schedule.notes})</span>
                        )}
                      </div>
                      <button
                        onClick={() => removeSchedule(schedule.id)}
                        className="mr-4 text-red-500 hover:text-red-700"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 상태 */}
          <div>
            <label className="block mb-3 font-semibold text-gray-600 text-h4">상태</label>
            <Dropdown
              options={statusOptions.map((status) => ({
                value: status,
                label: StatusLabelMap[status],
              }))}
              value={status}
              onChange={(value) => setStatus(value as Status)}
              placeholder="상태를 선택해주세요."
            />
          </div>
        </div>
        {/* 지원하기 버튼 */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={updating || !selectedPosition || !applicationDate}
            className="px-10 py-2 mt-14 text-white rounded-lg bg-mainBlue text-h4 hover:bg-subDarkBlue disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {updating ? '수정 중...' : '지원하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailPage;
