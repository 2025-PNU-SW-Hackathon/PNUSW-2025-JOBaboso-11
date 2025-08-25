// 전화번호 자동 하이픈 추가 함수
export const formatPhoneNumber = (value: string): string => {
  if (!value) return '';

  // 숫자와 하이픈만 허용
  const cleaned = value.replace(/[^\d-]/g, '');

  // 하이픈 제거 후 숫자만 추출
  const numbers = cleaned.replace(/-/g, '');

  if (numbers.length <= 3) {
    return numbers;
  } else if (numbers.length <= 7) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
  } else {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  }
};
