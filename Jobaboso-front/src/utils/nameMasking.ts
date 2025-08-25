/**
 * 이름을 마스킹 처리하는 함수
 * @param name 원본 이름
 * @returns 마스킹된 이름 (예: "김민정" -> "김*정")
 */
export const maskName = (name: string): string => {
  if (!name || name.length < 2) {
    return name;
  }

  if (name.length === 2) {
    // 2글자 이름: 첫 글자 + *
    return name.charAt(0) + '*';
  } else {
    // 3글자 이상: 첫 글자 + * + 마지막 글자
    return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
  }
};

/**
 * 이름을 부분 마스킹 처리하는 함수 (중간 글자만 마스킹)
 * @param name 원본 이름
 * @returns 마스킹된 이름 (예: "김민정" -> "김*정")
 */
export const maskNameMiddle = (name: string): string => {
  if (!name || name.length < 2) {
    return name;
  }

  if (name.length === 2) {
    // 2글자 이름: 첫 글자 + *
    return name.charAt(0) + '*';
  } else {
    // 3글자 이상: 첫 글자 + * + 마지막 글자
    return name.charAt(0) + '*' + name.charAt(name.length - 1);
  }
};
