import { StoreApi } from 'zustand';

/**
 * 선택자 유틸리티 함수 모듈
 *
 * 이 모듈은 Zustand 스토어에서 사용할 수 있는 선택자 유틸리티 함수들을 제공합니다.
 *
 * 이점:
 * 1. 성능 최적화: 불필요한 렌더링을 방지하는 최적화된 선택자
 * 2. 타입 안전성: 제네릭을 통한 타입 안전한 선택자 함수
 * 3. 재사용성: 여러 스토어에서 동일한 선택자 패턴 재사용
 */

/**
 * 상태의 특정 속성을 선택하는 선택자 생성 함수
 *
 * @template T 스토어 상태 타입
 * @template K 선택할 속성 키
 * @param key 선택할 속성 키
 * @returns 해당 속성을 선택하는 선택자 함수
 */
export function selectProperty<T, K extends keyof T>(key: K) {
  return (state: T) => state[key];
}

/**
 * 여러 속성을 객체로 선택하는 선택자 생성 함수
 *
 * @template T 스토어 상태 타입
 * @template K 선택할 속성 키 배열
 * @param keys 선택할 속성 키 배열
 * @returns 선택된 속성들을 포함하는 객체를 반환하는 선택자 함수
 */
export function selectProperties<T, K extends keyof T>(keys: K[]) {
  return (state: T) => {
    const result = {} as Pick<T, K>;
    keys.forEach((key) => {
      result[key] = state[key];
    });
    return result;
  };
}

/**
 * 조건부 선택자 생성 함수
 * 주어진 조건이 만족될 때만 특정 값을 선택
 *
 * @template T 스토어 상태 타입
 * @template R 선택 결과 타입
 * @param condition 조건 함수
 * @param selector 선택자 함수
 * @param fallback 조건이 만족되지 않을 때 반환할 값
 * @returns 조건부 선택자 함수
 */
export function selectIf<T, R>(
  condition: (state: T) => boolean,
  selector: (state: T) => R,
  fallback: R
) {
  return (state: T) => (condition(state) ? selector(state) : fallback);
}

/**
 * 파생 선택자 생성 함수
 * 상태로부터 계산된 값을 선택
 *
 * @template T 스토어 상태 타입
 * @template R 결과 타입
 * @param selector 파생 값을 계산하는 선택자 함수
 * @returns 파생 선택자 함수
 */
export function selectDerived<T, R>(selector: (state: T) => R) {
  return selector;
}

/**
 * 비동기 상태 선택자 생성 함수
 * 비동기 상태의 다양한 속성을 선택하는 유틸리티 함수들
 */
export const asyncSelectors = {
  /**
   * 로딩 상태 선택자
   *
   * @template T 비동기 상태를 포함하는 스토어 타입
   * @param key 비동기 상태 속성 키
   * @returns 로딩 상태를 선택하는 함수
   */
  isLoading:
    <T extends Record<K, { status: string }>, K extends keyof T>(key: K) =>
    (state: T) =>
      state[key].status === 'loading',

  /**
   * 성공 상태 선택자
   *
   * @template T 비동기 상태를 포함하는 스토어 타입
   * @param key 비동기 상태 속성 키
   * @returns 성공 상태를 선택하는 함수
   */
  isSuccess:
    <T extends Record<K, { status: string }>, K extends keyof T>(key: K) =>
    (state: T) =>
      state[key].status === 'success',

  /**
   * 에러 상태 선택자
   *
   * @template T 비동기 상태를 포함하는 스토어 타입
   * @param key 비동기 상태 속성 키
   * @returns 에러 상태를 선택하는 함수
   */
  isError:
    <T extends Record<K, { status: string }>, K extends keyof T>(key: K) =>
    (state: T) =>
      state[key].status === 'error',

  /**
   * 데이터 선택자
   *
   * @template T 비동기 상태를 포함하는 스토어 타입
   * @template D 데이터 타입
   * @param key 비동기 상태 속성 키
   * @returns 데이터를 선택하는 함수
   */
  getData:
    <T extends Record<K, { data: D | null }>, K extends keyof T, D = unknown>(key: K) =>
    (state: T) =>
      state[key].data,

  /**
   * 에러 메시지 선택자
   *
   * @template T 비동기 상태를 포함하는 스토어 타입
   * @template E 에러 타입
   * @param key 비동기 상태 속성 키
   * @returns 에러 메시지를 선택하는 함수
   */
  getError:
    <T extends Record<K, { error: E | null }>, K extends keyof T, E = unknown>(key: K) =>
    (state: T) =>
      state[key].error,
};

/**
 * 스토어 인스턴스에서 선택자를 생성하는 함수
 *
 * @template T 스토어 상태 타입
 * @template R 선택 결과 타입
 * @param store 스토어 인스턴스
 * @param selector 선택자 함수
 * @returns 스토어에서 값을 선택하는 함수
 */
export function createSelector<T, R>(store: StoreApi<T>, selector: (state: T) => R): () => R {
  return () => selector(store.getState());
}
