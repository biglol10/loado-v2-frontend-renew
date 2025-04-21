/**
 * 현재 환경이 로컬 환경인지 확인
 * @returns 로컬 환경 여부
 */
export const isLocalEnvironment = (): boolean => {
  return process.env.MODE === 'local';
};

/**
 * 현재 환경이 개발 환경인지 확인
 * @returns 개발 환경 여부
 */
export const isDevEnvironment = (): boolean => {
  return process.env.MODE === 'development';
};

/**
 * 현재 환경이 로컬 또는 개발 환경인지 확인
 * @returns 로컬 또는 개발 환경 여부
 */
export const isLocalOrDevEnvironment = (): boolean => {
  return isLocalEnvironment() || isDevEnvironment();
};
