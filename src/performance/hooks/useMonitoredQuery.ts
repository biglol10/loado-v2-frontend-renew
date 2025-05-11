import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import PerformanceManager from '../PerformanceManager';

/**
 * 성능 모니터링이 포함된 useQuery 훅
 * React Query의 표준 useQuery 훅을 사용하되, 성능 측정 기능을 추가합니다.
 *
 * @param queryKey 쿼리 키
 * @param queryFn 쿼리 함수
 * @param options 쿼리 옵션
 * @returns 표준 UseQueryResult
 */
export function useMonitoredQuery<
  TQueryFnData = unknown,
  TError = unknown,
  TData = TQueryFnData,
  TQueryKey extends unknown[] = unknown[],
>(
  queryKey: TQueryKey,
  queryFn: (context: any) => Promise<TQueryFnData>,
  options?: Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, 'queryKey' | 'queryFn'>
): UseQueryResult<TData, TError> {
  const perfManager = PerformanceManager.getInstance();
  const measurementIdRef = useRef<string>('');
  const queryUrl =
    typeof queryFn.toString === 'function' ? queryFn.toString().substring(0, 100) : 'unknown';

  // 원래 쿼리 함수를 래핑하여 성능 측정을 추가
  const monitoredQueryFn = async (context: any) => {
    // API 호출 측정 시작
    measurementIdRef.current = perfManager.startApiMeasurement(
      `Query: ${queryKey[0]}`,
      'React Query'
    );

    try {
      // 원래 쿼리 함수 실행
      const result = await queryFn(context);
      // 성공 시 측정 종료
      perfManager.endApiMeasurement(measurementIdRef.current, 200);
      return result;
    } catch (error) {
      // 실패 시 측정 종료
      perfManager.endApiMeasurement(measurementIdRef.current, 500);
      throw error;
    }
  };

  // 실제 쿼리 실행 (모니터링이 포함된 함수로 원래 함수를 대체)
  const result = useQuery<TQueryFnData, TError, TData, TQueryKey>({
    queryKey,
    queryFn: monitoredQueryFn,
    ...options,
  });

  // 쿼리 상태 변경 시 추가 정보 기록
  useEffect(() => {
    if (result.isLoading) {
      console.debug(`🔄 Query loading: ${queryKey[0]}`);
    } else if (result.isError) {
      console.debug(`❌ Query error: ${queryKey[0]}`, result.error);
    } else if (result.isSuccess) {
      console.debug(`✅ Query success: ${queryKey[0]}`);
    }
  }, [result.isLoading, result.isError, result.isSuccess, queryKey]);

  return result;
}

/**
 * 성능 모니터링이 포함된 useQueries 래퍼 생성 (필요할 경우)
 */
// export function useMonitoredQueries(...) { ... }
