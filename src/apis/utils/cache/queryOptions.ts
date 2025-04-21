import { QueryOptions } from '@tanstack/react-query';
import { cacheConfig } from './cacheConfig';

/**
 * 쿼리 옵션 생성 헬퍼 함수
 *
 * 이 함수는 React Query 쿼리 옵션을 일관된 방식으로 생성합니다.
 *
 * 이점:
 * 1. 코드 재사용: 동일한 옵션 설정 로직 반복 제거
 * 2. 일관성: 모든 쿼리가 같은 패턴과 구조로 생성됨
 * 3. 유지보수: 쿼리 옵션 생성 로직 변경 시 한 곳만 수정하면 됨
 * 4. 유연성: 기본 설정을 제공하면서도 필요한 경우 추가 옵션 지정 가능
 *
 * @param queryKey - 쿼리 캐시 키
 * @param queryFn - 데이터를 가져오는 비동기 함수
 * @param type - 데이터 유형(staticData, dynamicData, userData 중 하나)
 * @param additionalOptions - 추가 쿼리 옵션(기본 설정 덮어쓰기용)
 * @returns 완성된 쿼리 옵션 객체
 */
export function createQueryOptions<T, E = Error>(
  queryKey: readonly unknown[],
  queryFn: () => Promise<T>,
  type: keyof typeof cacheConfig = 'dynamicData', // 기본값은 동적 데이터 타입
  additionalOptions: Partial<QueryOptions<T, E>> = {}
): QueryOptions<T, E> {
  return {
    queryKey,
    queryFn,
    ...cacheConfig[type], // 데이터 유형에 맞는 캐시 설정 적용
    ...additionalOptions, // 추가 옵션으로 기본 설정 덮어쓰기 가능
  };
}
