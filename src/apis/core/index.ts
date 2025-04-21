/**
 * API 코어 모듈
 *
 * 이 모듈은 API 통신을 위한 핵심 구성 요소들을 내보냅니다.
 *
 * 이점:
 * 1. 중앙화된 임포트: 모든 API 코어 컴포넌트를 단일 지점에서 임포트 가능
 * 2. 명확한 의존성: 모듈 간의 의존성 명확하게 표현
 * 3. 재사용성 향상: 애플리케이션 전체에서 쉽게 재사용 가능한 모듈화된 구성 요소
 */

export { apiClient } from './ApiClient';
export { ApiError, type ApiErrorCode } from './ApiError';
export { RequestCanceler } from './RequestCanceler';
export { QueryProvider, queryClient } from './QueryProvider';

// 상수 및 유틸리티 재내보내기
export * from './types';
export * from './hooks';
