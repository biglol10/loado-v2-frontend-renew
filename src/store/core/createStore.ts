import { create, StateCreator, StoreApi, UseBoundStore } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware/devtools';

/**
 * 상태 관리 - 스토어 생성 유틸리티
 *
 * 이 파일은 Zustand 스토어를 생성하기 위한 표준화된 함수를 제공합니다.
 *
 * 이점:
 * 1. 일관성: 모든 스토어가 동일한 미들웨어와 구성으로 생성됨
 * 2. 개발 편의성: 자동으로 devtools, immer, persist 미들웨어 적용
 * 3. 유지보수성: 미들웨어 구성 변경 시 한 곳만 수정하면 모든 스토어에 적용
 * 4. 타입 안전성: 제네릭을 통한 완전한 타입 안전성 보장
 * 5. 코드 중복 감소: 반복적인 스토어 설정 코드 제거
 */

/**
 * 표준 Zustand 스토어 생성 함수
 *
 * @template T 스토어 상태 타입
 * @param initializer 스토어 상태 및 액션 초기화 함수
 * @param options 추가 구성 옵션
 * @returns Zustand 스토어 훅
 */
export function createStore<T>(
  initializer: StateCreator<T, [['zustand/immer', never]]>,
  options?: {
    name?: string;
    persist?: boolean | Partial<PersistOptions<T, T>>;
  }
): any {
  // 기본 옵션
  const name = options?.name ?? 'store';
  const shouldPersist = options?.persist ?? false;

  // 미들웨어 체인 구성
  let storeCreator: (initializer: StateCreator<T, [['zustand/immer', never]]>) => any = create;

  // Immer 미들웨어 적용
  storeCreator = (fn) => create(immer(fn));

  // Devtools 미들웨어 적용 (개발 환경에서만)
  if (process.env.NODE_ENV === 'development') {
    const prevStoreCreator = storeCreator;
    storeCreator = (fn) =>
      prevStoreCreator((set, get, store) => {
        return fn(
          (state: any) => {
            set(state);
            // 개발 환경에서 상태 변경 로깅
            const newState = get();
            console.log(`[${name}] State updated:`, newState);
            return newState;
          },
          get,
          store
        );
      });

    storeCreator = (fn) => create(devtools(immer(fn), { name }));
  }

  // Persist 미들웨어 적용 (옵션에 따라)
  if (shouldPersist) {
    const persistOptions: PersistOptions<T, T> =
      typeof shouldPersist === 'object'
        ? {
            name: `${name}-storage`,
            ...shouldPersist,
          }
        : {
            name: `${name}-storage`,
          };

    return create(persist(immer(initializer), persistOptions));
  }

  // 최종 스토어 생성
  return storeCreator(initializer);
}

/**
 * 비동기 액션 처리를 위한 유틸리티 함수
 *
 * @template S 스토어 상태 타입
 * @template R 비동기 함수의 반환 타입
 * @param set 상태 설정 함수
 * @param loadingKey 로딩 상태를 표시할 상태 키
 * @param errorKey 에러를 저장할 상태 키
 * @param asyncFn 실행할 비동기 함수
 * @param onSuccess 성공 시 호출할 콜백
 * @param onError 에러 발생 시 호출할 콜백
 * @returns 비동기 함수의 결과
 */
export async function handleAsync<S, R>(
  set: (fn: (state: S) => void) => void,
  loadingKey: keyof S,
  errorKey: keyof S,
  asyncFn: () => Promise<R>,
  onSuccess?: (result: R) => void,
  onError?: (error: Error) => void
): Promise<R | null> {
  // 로딩 상태 설정
  set((state: S) => {
    (state[loadingKey] as any) = true;
    (state[errorKey] as any) = null;
  });

  try {
    // 비동기 함수 실행
    const result = await asyncFn();

    // 로딩 상태 해제
    set((state: S) => {
      (state[loadingKey] as any) = false;
    });

    // 성공 콜백 호출
    onSuccess?.(result);

    return result;
  } catch (error) {
    // 에러 상태 설정
    set((state: S) => {
      (state[loadingKey] as any) = false;
      (state[errorKey] as any) = error instanceof Error ? error.message : 'Unknown error';
    });

    // 에러 콜백 호출
    if (error instanceof Error) {
      onError?.(error);
    }

    console.error('[Store Error]:', error);
    return null;
  }
}
