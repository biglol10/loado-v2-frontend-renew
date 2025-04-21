import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { ApiResponse } from '../types';
import { ApiError } from '../ApiError';
import { queryClient } from '../QueryProvider';

/**
 * API 뮤테이션 커스텀 훅
 *
 * React Query의 useMutation을 래핑하여 애플리케이션 특화 로직을 추가합니다.
 *
 * 이점:
 * 1. 일관된 에러 처리: API 응답 형식 및 에러 처리 표준화
 * 2. 타입 안전성: 제네릭을 통한 API 응답 타입 추론 강화
 * 3. 자동 캐시 무효화: 관련 쿼리 자동 무효화로 데이터 일관성 유지
 * 4. 코드 간소화: 반복적인 useMutation 설정 코드 제거
 *
 * @template TData 응답 데이터 타입
 * @template TVariables 뮤테이션 변수 타입
 * @template TError 에러 타입
 * @template TContext 롤백 컨텍스트 타입
 * @param mutationFn 데이터를 변경하는 비동기 함수
 * @param options useMutation에 전달할 추가 옵션
 * @returns UseMutationResult 인스턴스
 */
export function useApiMutation<
  TData = unknown,
  TVariables = void,
  TError = ApiError,
  TContext = unknown,
>(
  mutationFn: (variables: TVariables) => Promise<ApiResponse<TData>>,
  options?: Omit<UseMutationOptions<TData, TError, TVariables, TContext>, 'mutationFn'> & {
    invalidateQueries?: string | string[];
  }
): UseMutationResult<TData, TError, TVariables, TContext> {
  const { invalidateQueries, ...mutationOptions } = options || {};

  return useMutation<ApiResponse<TData>, TError, TVariables, TContext>({
    mutationFn,
    // 뮤테이션 성공 후 처리
    onSuccess: async (response: ApiResponse<TData>, variables, context) => {
      // API 오류 응답 처리
      if (response.result !== 'success') {
        throw new ApiError('api_error', response.message || '요청 처리 중 오류가 발생했습니다.', {
          response,
        });
      }

      // 관련 쿼리 자동 무효화 (선택 사항)
      if (invalidateQueries) {
        const queriesToInvalidate = Array.isArray(invalidateQueries)
          ? invalidateQueries
          : [invalidateQueries];

        // 모든 관련 쿼리 무효화 (병렬 처리)
        await Promise.all(
          queriesToInvalidate.map((queryKey) =>
            queryClient.invalidateQueries({ queryKey: [queryKey] })
          )
        );
      }

      // 사용자 지정 onSuccess 콜백 호출 (있는 경우)
      await mutationOptions?.onSuccess?.(response.data as unknown as TData, variables, context);
    },
    // 기본 옵션과 사용자 지정 옵션 병합
    ...mutationOptions,
  }) as UseMutationResult<TData, TError, TVariables, TContext>;
}

export default useApiMutation;
