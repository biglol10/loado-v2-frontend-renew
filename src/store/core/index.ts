/**
 * 상태 관리 코어 모듈
 *
 * 이 모듈은 상태 관리에 사용되는 핵심 유틸리티와 타입을 제공합니다.
 *
 * 이점:
 * 1. 중앙화된 임포트: 모든 상태 관리 코어 기능을 단일 지점에서 임포트 가능
 * 2. 일관된 상태 관리: 애플리케이션 전체에서 동일한 상태 관리 패턴 적용
 * 3. 코드 간소화: 상태 관리 관련 기능 사용 시 개별 파일 경로 지정 불필요
 */

// 스토어 생성 함수 및 비동기 처리 유틸리티 재내보내기
export { createStore, handleAsync } from './createStore';

// 선택자 유틸리티 함수 재내보내기
export {
  selectProperty,
  selectProperties,
  selectIf,
  selectDerived,
  asyncSelectors,
  createSelector,
} from './selectors';

// 타입 정의 재내보내기
export type {
  CommonState,
  PaginationState,
  FilterState,
  StateHistoryItem,
  AsyncStatus,
  AsyncState,
  MaterializedState,
} from './types';
