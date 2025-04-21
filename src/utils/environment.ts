/**
 * 개발 환경 여부를 확인하는 함수
 *
 * @returns 개발 환경이면 true, 아니면 false
 */
export const isDev = () => {
  return (
    process.env.NODE_ENV === 'development' ||
    process.env.MODE === 'local' ||
    process.env.MODE === 'development'
  );
};
