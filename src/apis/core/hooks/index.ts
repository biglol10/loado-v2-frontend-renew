/**
 * API 코어 훅 모듈
 *
 * 이 모듈은 API 통신에 사용되는 커스텀 훅들을 내보냅니다.
 *
 * 이점:
 * 1. 중앙화된 임포트: 모든 API 훅을 단일 지점에서 임포트 가능
 * 2. 명확한 의존성: 모듈 간의 의존성 명확하게 표현
 * 3. 코드 간소화: 훅 사용 시 개별 파일 경로 지정 불필요
 */

export { default as useApiQuery } from './useApiQuery';
export { default as useApiMutation } from './useApiMutation';
export { default as useInfiniteApiQuery } from './useInfiniteApiQuery';
