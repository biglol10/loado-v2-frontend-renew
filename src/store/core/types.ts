/**
 * 상태 관리 코어 타입 정의
 *
 * 이 파일은 상태 관리에 사용되는 공통 타입 정의를 제공합니다.
 *
 * 이점:
 * 1. 타입 안전성: 일관된 타입 정의로 런타임 오류 감소
 * 2. 코드 가독성: 명확한 인터페이스 정의로 상태 구조 이해 용이
 * 3. 재사용성: 여러 스토어에서 공통 타입 재사용으로 코드 중복 감소
 */

/**
 * 공통 상태 인터페이스
 * 모든 스토어가 공유하는 기본 상태 구조
 */
export interface CommonState {
  loading: boolean; // 로딩 상태
  error: string | null; // 에러 메시지
}

/**
 * 페이지네이션 상태 인터페이스
 * 페이지네이션이 필요한 목록 관련 스토어에 사용
 */
export interface PaginationState {
  currentPage: number; // 현재 페이지
  totalPages: number; // 전체 페이지 수
  pageSize: number; // 페이지 크기
  totalItems: number; // 전체 항목 수
}

/**
 * 필터링 상태 인터페이스
 * 필터링이 필요한 스토어에 사용
 */
export interface FilterState<T = Record<string, any>> {
  filters: T; // 필터 객체
  sortBy?: string; // 정렬 기준
  sortOrder?: 'asc' | 'desc'; // 정렬 방향
}

/**
 * 상태 변경 이력 타입
 * 상태 변경 추적을 위한 이력 항목
 */
export interface StateHistoryItem<T> {
  timestamp: number; // 변경 시간
  state: T; // 변경된 상태
  action?: string; // 변경을 일으킨 액션 이름
}

/**
 * 비동기 작업 상태
 * 비동기 작업 추적에 사용
 */
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * 비동기 작업 상태 인터페이스
 * 비동기 작업 상태를 추적하는 스토어에 사용
 */
export interface AsyncState<T = unknown, E = string> {
  status: AsyncStatus; // 비동기 작업 상태
  data: T | null; // 비동기 작업 결과 데이터
  error: E | null; // 비동기 작업 오류
  lastUpdated: number | null; // 마지막 업데이트 시간
}

/**
 * 실체화된 상태 유틸리티 타입
 * 함수 타입을 제외한 구체적인 상태 타입 추출에 사용
 */
export type MaterializedState<T> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [K in keyof T]: T[K] extends Function ? never : T[K];
};
