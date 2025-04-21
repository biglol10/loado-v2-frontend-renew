import {
  useInfiniteQuery,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import { ApiResponse, PaginatedResponse } from '../types';
import { ApiError } from '../ApiError';

/**
 * 무한 스크롤 API 쿼리 커스텀 훅
 *
 * React Query의 useInfiniteQuery를 래핑하여 페이지네이션 로직을 추가합니다.
 *
 * 이점:
 * 1. 페이지네이션 자동화: 페이지 기반 쿼리의 복잡성 추상화
 * 2. 무한 스크롤 지원: 끝없이 로드 가능한 목록 구현 용이
 * 3. 타입 안전성: 제네릭을 통한 API 응답 타입 추론 강화
 * 4. 코드 간소화: 반복적인 useInfiniteQuery 설정 코드 제거
 *
 * @template TData 각 항목의 데이터 타입
 * @template TError 에러 타입
 * @param queryKey 쿼리 키 (React Query 캐싱에 사용)
 * @param fetchFn 페이지별 데이터를 가져오는 비동기 함수
 * @param options useInfiniteQuery에 전달할 추가 옵션
 * @returns UseInfiniteQueryResult 인스턴스
 */
export function useInfiniteApiQuery<TData = unknown, TError = ApiError>(
  queryKey: unknown[],
  fetchFn: (page: number) => Promise<ApiResponse<PaginatedResponse<TData>>>,
  options?: Omit<
    UseInfiniteQueryOptions<
      ApiResponse<PaginatedResponse<TData>>,
      TError,
      PaginatedResponse<TData>
    >,
    'queryKey' | 'queryFn' | 'getNextPageParam'
  >
): UseInfiniteQueryResult<PaginatedResponse<TData>, TError> {
  return useInfiniteQuery<ApiResponse<PaginatedResponse<TData>>, TError, PaginatedResponse<TData>>({
    queryKey,
    queryFn: ({ pageParam = 1 }) => fetchFn(pageParam as number),
    // 다음 페이지 파라미터 추출 로직
    getNextPageParam: (lastPage) => {
      // API 오류 응답 처리
      if (lastPage.result !== 'success') {
        return undefined;
      }

      const { currentPage, totalPages } = lastPage.data;
      // 다음 페이지가 있으면 해당 페이지 번호 반환, 없으면 undefined
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    // 기본 옵션과 사용자 지정 옵션 병합
    ...options,
  }) as UseInfiniteQueryResult<PaginatedResponse<TData>, TError>;
}

export default useInfiniteApiQuery;
