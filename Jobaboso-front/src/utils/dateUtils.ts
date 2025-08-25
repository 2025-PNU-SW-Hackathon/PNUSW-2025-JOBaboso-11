// YYYY-MM-DD 또는 YYYY-MM 형식을 "YYYY년 MM월" 형식으로 변환하는 함수
export const formatDateToKorean = (dateString: string): string => {
  if (!dateString) return '';

  // YYYY-MM-DD 형식인 경우
  const match = dateString.match(/^(\d{4})-(\d{2})-\d{2}$/);
  if (match) {
    const year = match[1];
    const month = parseInt(match[2], 10).toString(); // 앞의 0 제거
    return `${year}년 ${month}월`;
  }

  // YYYY-MM 형식인 경우
  const yearMonthMatch = dateString.match(/^(\d{4})-(\d{2})$/);
  if (yearMonthMatch) {
    const year = yearMonthMatch[1];
    const month = parseInt(yearMonthMatch[2], 10).toString(); // 앞의 0 제거
    return `${year}년 ${month}월`;
  }

  // 이미 "YYYY년 MM월" 형식인 경우 그대로 반환
  if (dateString.includes('년') && dateString.includes('월')) {
    return dateString;
  }

  return dateString;
};

// "0000년 0월" 형식을 "0000-00-01" 형식으로 변환하는 함수
export const parseYearMonthKorean = (dateString: string): string => {
  if (!dateString) return '';

  // "2021년 3월" 형식을 "2021-03-01"로 변환
  const yearMatch = dateString.match(/(\d{4})년/);
  const monthMatch = dateString.match(/(\d{1,2})월/);

  if (yearMatch && monthMatch) {
    const year = yearMatch[1];
    const month = monthMatch[1].padStart(2, '0');
    return `${year}-${month}-01`;
  }

  return dateString;
};

// "0000년 0월" 형식으로 입력 필드 포맷팅
export const formatYearMonthKoreanInput = (value: string): string => {
  if (!value) return '';

  // 숫자와 "년", "월"만 허용
  const cleaned = value.replace(/[^\d년월]/g, '');

  // "년"과 "월" 제거 후 숫자만 추출
  const numbers = cleaned.replace(/[년월]/g, '');

  if (numbers.length <= 4) {
    return numbers;
  } else if (numbers.length <= 6) {
    const year = numbers.slice(0, 4);
    const month = parseInt(numbers.slice(4), 10).toString(); // 앞의 0 제거
    return `${year}년 ${month}월`;
  } else {
    const year = numbers.slice(0, 4);
    const month = parseInt(numbers.slice(4, 6), 10).toString(); // 앞의 0 제거
    return `${year}년 ${month}월`;
  }
};

// 생년월일로부터 나이 계산하는 함수
export const calculateAge = (birthDate: string): number => {
  if (!birthDate) return 0;

  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  // 생일이 지나지 않았으면 나이에서 1을 빼줌
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

// 생년월일을 한국어 형식으로 변환하는 함수
export const formatBirthDate = (birthDate: string): string => {
  if (!birthDate) return '';

  const date = new Date(birthDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}년 ${month}월 ${day}일`;
};

// 날짜 형식을 YYYY-MM-DD로 변환하는 함수
export const parseDate = (dateString: string): string => {
  if (!dateString) return '';

  // "2021년 3월" 형식을 "2021-03-01"로 변환
  const yearMatch = dateString.match(/(\d{4})년/);
  const monthMatch = dateString.match(/(\d{1,2})월/);

  if (yearMatch && monthMatch) {
    const year = yearMatch[1];
    const month = monthMatch[1].padStart(2, '0');
    return `${year}-${month}-01`;
  }

  return dateString;
};

// 날짜 입력 필드 포맷팅 (YYYY-MM-DD)
export const formatDateInput = (value: string): string => {
  if (!value) return '';

  // 숫자와 하이픈만 허용
  const cleaned = value.replace(/[^\d-]/g, '');

  // 하이픈 제거 후 숫자만 추출
  const numbers = cleaned.replace(/-/g, '');

  if (numbers.length <= 4) {
    return numbers;
  } else if (numbers.length <= 6) {
    return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
  } else {
    return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}`;
  }
};

// 년월 입력 필드 포맷팅 (YYYY-MM)
export const formatYearMonthInput = (value: string): string => {
  if (!value) return '';

  // 숫자와 하이픈만 허용
  const cleaned = value.replace(/[^\d-]/g, '');

  // 하이픈 제거 후 숫자만 추출
  const numbers = cleaned.replace(/-/g, '');

  if (numbers.length <= 4) {
    return numbers;
  } else {
    return `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}`;
  }
};
