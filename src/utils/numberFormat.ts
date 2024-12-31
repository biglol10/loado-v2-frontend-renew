export const formatNumber = (value: number | string): string => {
  if (!value) return '';

  // 숫자나 문자열을 숫자로 변환
  const number = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;

  // NaN 체크
  if (isNaN(number)) return '';

  // 천 단위 콤마 추가
  return number.toLocaleString('ko-KR');
};

export const parseFormattedNumber = (value: string): number => {
  // 콤마 제거 후 숫자로 변환
  const number = parseFloat(value.replace(/,/g, ''));
  return isNaN(number) ? 0 : number;
};
