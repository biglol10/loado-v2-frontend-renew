import { useApiQuery } from '../core/hooks';
import { ApiResponse } from '../core/types';
import { useQueries } from '@tanstack/react-query';
import {
  fetchItemPricesByCategory,
  fetchSingleItemPrice,
  fetchItemPriceHistory,
  // 사용하지 않는 import 제거
} from './api';
import {
  ItemData,
  ItemPriceQueryParams,
  SingleItemPriceQueryParams,
  ItemPriceTimeSeries,
  ITEM_CATEGORIES,
  ItemCategoryCode,
} from './types';

/**
 * 아이템 가격 정보 React Query 훅 모듈
 *
 * 이 모듈은 아이템 가격 정보 관련 React Query 훅들을 제공합니다.
 *
 * 이점:
 * 1. 데이터 페칭 자동화: 로딩/에러 상태 자동 관리 및 캐싱
 * 2. 선언적 데이터 관리: UI와 데이터 페칭 로직 분리
 * 3. 상태 일관성: 동일한 데이터에 대한 여러 컴포넌트의 상태 일관성 보장
 * 4. 성능 최적화: 자동 캐싱 및 불필요한 리렌더링 방지
 */

/**
 * 캐시 키 생성 유틸리티
 */
export const itemPriceKeys = {
  all: ['itemPrices'] as const,
  lists: () => [...itemPriceKeys.all, 'list'] as const,
  list: (params: Partial<ItemPriceQueryParams>) => [...itemPriceKeys.lists(), params] as const,
  details: () => [...itemPriceKeys.all, 'detail'] as const,
  detail: (id: string) => [...itemPriceKeys.details(), id] as const,
  history: (id: string, timeRange?: string) =>
    [...itemPriceKeys.detail(id), 'history', { timeRange }] as const,
};

/**
 * 카테고리별 아이템 가격 목록 조회 훅
 *
 * @param params 조회 파라미터
 * @param options useQuery 추가 옵션
 * @returns 아이템 가격 데이터 배열과 쿼리 상태
 */
export function useItemPricesByCategory(params: ItemPriceQueryParams, options = {}) {
  return useApiQuery<ItemData[]>(
    [...itemPriceKeys.list(params)] as unknown[],
    () => fetchItemPricesByCategory(params),
    {
      // 가격 데이터는 자주 변경되므로 5분으로 staleTime 설정
      staleTime: 5 * 60 * 1000,
      ...options,
    }
  );
}

/**
 * 단일 아이템 가격 정보 조회 훅
 *
 * @param params 조회 파라미터
 * @param options useQuery 추가 옵션
 * @returns 단일 아이템 가격 데이터와 쿼리 상태
 */
export function useSingleItemPrice(params: SingleItemPriceQueryParams, options = {}) {
  return useApiQuery<ItemData>(
    [...itemPriceKeys.detail(params.itemId)] as unknown[],
    () => fetchSingleItemPrice(params),
    {
      staleTime: 5 * 60 * 1000,
      ...options,
    }
  );
}

/**
 * 아이템 가격 이력 조회 훅
 *
 * @param itemId 아이템 ID
 * @param timeRange 시간 범위 (기본값: 'month')
 * @param options useQuery 추가 옵션
 * @returns 아이템 가격 이력 데이터와 쿼리 상태
 */
export function useItemPriceHistory(
  itemId: string,
  timeRange: 'day' | 'week' | 'month' | 'year' = 'month',
  options = {}
) {
  return useApiQuery<ItemPriceTimeSeries[]>(
    [...itemPriceKeys.history(itemId, timeRange)] as unknown[],
    () => fetchItemPriceHistory(itemId, timeRange),
    {
      staleTime: 30 * 60 * 1000, // 이력 데이터는 자주 변경되지 않으므로 30분으로 설정
      ...options,
    }
  );
}

/**
 * 여러 카테고리의 아이템 가격 정보를 병렬로 조회하는 훅
 *
 * @param searchDate 검색 날짜 (YYYY-MM-DD 형식)
 * @param categoryCodes 조회할 카테고리 코드 배열 (기본값: 모든 카테고리)
 * @param options useQueries 추가 옵션
 * @returns 병합된 쿼리 결과
 */
export function useMultiCategoryItemPrices(
  searchDate: string,
  categoryCodes: ItemCategoryCode[] = Object.values(ITEM_CATEGORIES),
  options = {}
) {
  // useQueries 훅을 사용하여 여러 카테고리를 병렬로 요청
  const results = useQueries({
    queries: categoryCodes.map((categoryCode) => {
      const params: ItemPriceQueryParams = {
        categoryCode,
        timeValue: searchDate,
      };

      return {
        queryKey: [...itemPriceKeys.list(params)] as unknown[],
        queryFn: () => fetchItemPricesByCategory(params),
        staleTime: 5 * 60 * 1000,
        ...options,
      };
    }),
  });

  // 결과 병합 로직
  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);
  const error = results.find((result) => result.error)?.error || null;
  const data = results.map((result) => result.data).filter(Boolean);

  return {
    isLoading,
    isError,
    error,
    data,
    // 모든 쿼리가 성공적으로 완료된 경우에만 success = true
    isSuccess: results.every((result) => result.isSuccess),
    // 모든 쿼리의 refetch 함수를 호출
    refetch: () => Promise.all(results.map((result) => result.refetch())),
  };
}
