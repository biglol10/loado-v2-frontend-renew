import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { ApiResponse } from '../types';
import { ApiError } from '../ApiError';

/**
 * API 쿼리 커스텀 훅
 *
 * React Query의 useQuery를 래핑하여 애플리케이션 특화 로직을 추가합니다.
 *
 * 이점:
 * 1. 일관된 에러 처리: API 응답 형식 및 에러 처리 표준화
 * 2. 타입 안전성: 제네릭을 통한 API 응답 타입 추론 강화
 * 3. 기본 옵션 통합: 자주 사용되는 쿼리 옵션 사전 구성
 * 4. 코드 간소화: 반복적인 useQuery 설정 코드 제거
 *
 * @template TData 응답 데이터 타입
 * @template TError 에러 타입
 * @param queryKey 쿼리 키 (React Query 캐싱에 사용)
 * @param queryFn 데이터를 가져오는 비동기 함수
 * @param options useQuery에 전달할 추가 옵션
 * @returns UseQueryResult 인스턴스
 */
export function useApiQuery<TData = unknown, TError = ApiError>(
  queryKey: unknown[],
  queryFn: () => Promise<ApiResponse<TData>>,
  options?: Omit<
    UseQueryOptions<ApiResponse<TData>, TError, TData, unknown[]>,
    'queryKey' | 'queryFn'
  >
): UseQueryResult<TData, TError> {
  return useQuery<ApiResponse<TData>, TError, TData, unknown[]>({
    queryKey,
    queryFn,
    // 응답 변환: ApiResponse<TData>에서 TData로 변환
    select: (response) => {
      // API 오류 응답 처리
      if (response.result !== 'success') {
        throw new ApiError('api_error', response.message || '요청 처리 중 오류가 발생했습니다.', {
          response,
        });
      }
      return response.data;
    },
    // 기본 옵션과 사용자 지정 옵션 병합
    ...options,
  });
}

export default useApiQuery;
