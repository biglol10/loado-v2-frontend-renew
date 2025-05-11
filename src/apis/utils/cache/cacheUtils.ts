import { QueryKey } from '@tanstack/react-query';
import queryClient from '../queryClient';

/**
 * 특정 캐시 키에 해당하는 쿼리를 무효화합니다.
 * @param queryKey 무효화할 쿼리 키
 */
export const invalidateCache = async (queryKey: QueryKey) => {
  await queryClient.invalidateQueries({ queryKey });
};

/**
 * 특정 캐시 키에 해당하는 쿼리를 미리 가져옵니다.
 * @param queryKey 쿼리 키
 * @param queryFn 데이터를 가져오는 함수
 */
export const prefetchCache = async (queryKey: QueryKey, queryFn: () => Promise<any>) => {
  await queryClient.prefetchQuery({
    queryKey,
    queryFn,
  });
};

/**
 * 특정 캐시 키에 해당하는 데이터를 직접 설정합니다.
 * @param queryKey 쿼리 키
 * @param data 설정할 데이터
 */
export const setCache = (queryKey: QueryKey, data: any) => {
  queryClient.setQueryData(queryKey, data);
};

/**
 * 특정 캐시 키에 해당하는 데이터를 가져옵니다.
 * @param queryKey 쿼리 키
 * @returns 캐시된 데이터 또는 undefined
 */
export const getCache = <T>(queryKey: QueryKey): T | undefined => {
  return queryClient.getQueryData<T>(queryKey);
};

/**
 * 특정 캐시 키에 해당하는 데이터를 삭제합니다.
 * @param queryKey 쿼리 키
 */
export const removeCache = (queryKey: QueryKey) => {
  queryClient.removeQueries({ queryKey });
};

/**
 * 특정 캐시 데이터를 강제로 최신화합니다.
 * @param queryKey 쿼리 키
 */
export const refetchCache = async (queryKey: QueryKey) => {
  await queryClient.refetchQueries({ queryKey });
};

/**
 * 특정 파라미터에 해당하는 커스텀 캐싱 만료 시간을 설정합니다.
 * @param queryKey 쿼리 키
 * @param staleTime 만료 시간 (밀리초)
 */
export const setStaleTime = (queryKey: QueryKey, staleTime: number) => {
  const query = queryClient.getQueryCache().find({ queryKey });
  if (query) {
    query.setOptions({
      ...query.options,
      staleTime: staleTime,
    } as any);
  }
};
