/**
 * API 코어 타입 정의
 *
 * 이 파일은 API 통신에 사용되는 공통 타입 정의를 제공합니다.
 *
 * 이점:
 * 1. 타입 안전성: 일관된 타입 정의로 런타임 오류 감소
 * 2. 코드 가독성: 명확한 인터페이스 정의로 API 응답 구조 이해 용이
 * 3. 자동완성: IDE에서 API 응답 구조에 대한 자동완성 지원
 */

/**
 * API 응답 템플릿 인터페이스
 *
 * 모든 API 응답의 표준 형식을 정의합니다.
 *
 * @template T 응답 데이터의 타입
 */
export interface ApiResponse<T = any> {
  result: 'success' | string; // 응답 결과 상태
  data: T; // 응답 데이터
  message?: string; // 선택적 메시지
  timestamp?: string; // 선택적 타임스탬프
}

/**
 * 페이지네이션 파라미터 인터페이스
 *
 * 페이지네이션 요청에 공통적으로 사용되는 파라미터를 정의합니다.
 */
export interface PaginationParams {
  page?: number; // 페이지 번호 (1부터 시작)
  pageSize?: number; // 페이지 크기
  sortBy?: string; // 정렬 기준 필드
  sortOrder?: 'asc' | 'desc'; // 정렬 방향
}

/**
 * 페이지네이션 응답 인터페이스
 *
 * 페이지네이션된 API 응답의 표준 형식을 정의합니다.
 *
 * @template T 항목 타입
 */
export interface PaginatedResponse<T> {
  items: T[]; // 현재 페이지의 항목들
  totalItems: number; // 전체 항목 수
  totalPages: number; // 전체 페이지 수
  currentPage: number; // 현재 페이지 번호
}

/**
 * API 상태 인터페이스
 *
 * 컴포넌트 내에서 API 요청 상태를 추적하기 위한 인터페이스입니다.
 */
export interface ApiStatus {
  loading: boolean; // 로딩 중 여부
  error: string | null; // 에러 메시지 (있는 경우)
  success: boolean; // 성공 여부
}

/**
 * HTTP 메서드 타입
 *
 * 지원되는 HTTP 메서드를 정의합니다.
 */
export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';
