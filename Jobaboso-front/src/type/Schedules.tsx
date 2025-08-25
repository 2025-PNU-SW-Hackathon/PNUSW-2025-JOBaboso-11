// types/Schedule.ts
export type Schedule =
  | 'document_deadline'
  | 'document_result_announcement'
  | 'test_date'
  | 'test_result_announcement'
  | 'assignment_deadline'
  | 'interview_date'
  | 'interview_result_announcement'
  | 'final_result_announcement';

export const ScheduleLabelMap: Record<Schedule, string> = {
  document_deadline: '서류 마감일',
  document_result_announcement: '서류 합격 발표일',
  test_date: '시험일',
  test_result_announcement: '시험 결과 발표일',
  assignment_deadline: '과제 제출 마감일',
  interview_date: '면접일',
  interview_result_announcement: '면접 결과 발표일',
  final_result_announcement: '최종 합격 발표일',
};

export const ScheduleStyleMap: Record<Schedule, string> = {
  document_deadline: 'bg-red-100 text-red-600 border-red-500',
  document_result_announcement: 'bg-blue-100 text-blue-600 border-blue-500',
  test_date: 'bg-purple-100 text-purple-600 border-purple-500',
  test_result_announcement: 'bg-blue-100 text-blue-600 border-blue-500',
  assignment_deadline: 'bg-orange-100 text-orange-600 border-orange-500',
  interview_date: 'bg-indigo-100 text-indigo-600 border-indigo-500',
  interview_result_announcement: 'bg-blue-100 text-blue-600 border-blue-500',
  final_result_announcement: 'bg-green-100 text-green-600 border-green-500',
};
