import { QueryClient } from '@tanstack/react-query';
import { cacheKeys } from './cacheKeys';

/**
 * 캐시 무효화 유틸리티
 *
 * 이 모듈은 애플리케이션 전체에서 일관된 방식으로 캐시를 무효화하는 기능을 제공합니다.
 *
 * 이점:
 * 1. 일관성: 모든 컴포넌트에서 동일한 패턴으로 캐시 무효화
 * 2. 정확성: 구체적인 캐시 항목 또는 전체 캐시 카테고리 무효화 지원
 * 3. 유지보수: 캐시 무효화 로직 변경 시 한 곳만 수정하면 됨
 * 4. 데이터 신선도: 데이터 변경 시 관련된 모든 캐시를 정확히 무효화하여 신선한 데이터 유지
 */
export const invalidateQueries = {
  /**
   * 아이템 가격 캐시 무효화
   *
   * @param queryClient - React Query 클라이언트 인스턴스
   * @param id - 무효화할 특정 아이템 ID (없으면 모든 아이템 가격 캐시 무효화)
   */
  invalidateItemPrice: (queryClient: QueryClient, id?: string) => {
    if (id) {
      // 특정 아이템 가격만 무효화
      return queryClient.invalidateQueries({ queryKey: cacheKeys.itemPrice.detail(id) });
    }
    // 모든 아이템 가격 데이터 무효화
    return queryClient.invalidateQueries({ queryKey: cacheKeys.itemPrice.all });
  },

  /**
   * 시뮬레이션 결과 캐시 무효화
   *
   * @param queryClient - React Query 클라이언트 인스턴스
   * @param params - 무효화할 특정 시뮬레이션 파라미터 (없으면 모든 시뮬레이션 결과 캐시 무효화)
   */
  invalidateSimulation: (queryClient: QueryClient, params?: string) => {
    if (params) {
      // 특정 파라미터의 시뮬레이션 결과만 무효화
      return queryClient.invalidateQueries({ queryKey: cacheKeys.simulation.result(params) });
    }
    // 모든 시뮬레이션 결과 무효화
    return queryClient.invalidateQueries({ queryKey: cacheKeys.simulation.all });
  },
};
