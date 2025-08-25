// types/Result.ts
export type Result =
  | 'documents_passed'
  | 'documents_failed'
  | 'test_passed'
  | 'test_failed'
  | 'assignment_passed'
  | 'assignment_failed'
  | 'interview_passed'
  | 'interview_failed'
  | 'final_accepted'
  | 'final_rejected'
  | 'offer_declined';

export const ResultLabelMap: Record<Result, string> = {
  documents_passed: '서류 합격',
  documents_failed: '서류 불합격',
  test_passed: '시험 합격',
  test_failed: '시험 불합격',
  assignment_passed: '과제 합격',
  assignment_failed: '과제 불합격',
  interview_passed: '면접 합격',
  interview_failed: '면접 불합격',
  final_accepted: '최종 합격',
  final_rejected: '최종 불합격',
  offer_declined: '합격 포기',
};

export const ResultStyleMap: Record<Result, string> = {
  documents_passed: 'bg-blue-100 text-blue-600 border-blue-500',
  documents_failed: 'bg-red-100 text-red-600 border-red-500',
  test_passed: 'bg-blue-100 text-blue-600 border-blue-500',
  test_failed: 'bg-red-100 text-red-600 border-red-500',
  assignment_passed: 'bg-blue-100 text-blue-600 border-blue-500',
  assignment_failed: 'bg-red-100 text-red-600 border-red-500',
  interview_passed: 'bg-blue-100 text-blue-600 border-blue-500',
  interview_failed: 'bg-red-100 text-red-600 border-red-500',
  final_accepted: 'bg-green-100 text-green-600 border-green-500',
  final_rejected: 'bg-red-100 text-red-600 border-red-500',
  offer_declined: 'bg-gray-100 text-gray-600 border-gray-400',
};
