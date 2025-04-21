import { useQueries } from '@tanstack/react-query';
import httpService from '../utils/AxiosInstance';
import { IItemData } from './types';
import { cacheKeys } from '../utils/cache/cacheKeys';
import { cacheConfig } from '../utils/cache/cacheConfig';
// import { AxiosError, AxiosHeaders } from 'axios';

/**
 * 아이템 가격 조회 쿼리 훅
 *
 * 이 훅은 여러 카테고리의 아이템 가격 정보를 병렬로 조회하고 캐싱합니다.
 *
 * 캐싱 전략 개선:
 * 1. 구조화된 캐시 키: 일관된 구조의 캐시 키로 관리 용이성 향상
 * 2. 최적화된 캐싱 설정: 데이터 특성에 맞는 staleTime과 cacheTime 설정
 * 3. 선택적 캐싱 기간: 필요에 따라 staleTime 커스터마이즈 가능
 * 4. 자동 에러 재시도: 실패한 요청에 대한 자동 재시도 처리
 *
 * 이점:
 * - 네트워크 요청 최소화: 효율적인 캐싱으로 중복 요청 방지
 * - 데이터 신선도 관리: 적절한 staleTime으로 최신 데이터 보장
 * - UX 향상: 캐시된 데이터로 빠른 화면 렌더링
 */
interface IItemPriceQueryParams {
  searchDate: string;
  staleTime?: number; // 선택적 staleTime 오버라이드
}

// 조회할 아이템 카테고리 코드
const categoryCodes = ['44410', '50010', '50020', '51100', '210000']; // '44420' 앜패로 인한 직업각인서 제외

/**
 * 캐시 키 생성 함수
 * cacheKeys 시스템을 활용하여 일관된 구조의 캐시 키 생성
 */
const generateQueryKey = (searchDate: string, categoryCode: string) => {
  return [...cacheKeys.itemPrice.list(searchDate), categoryCode];
};

/**
 * 아이템 가격 조회 훅
 *
 * @param params - 검색 날짜와 선택적 staleTime
 * @returns 결합된 쿼리 결과
 */
export const useItemPriceQuery = (params: IItemPriceQueryParams) => {
  const { searchDate, staleTime } = params;

  /**
   * 아이템 가격 데이터 가져오기 함수
   *
   * @param categoryCode - 아이템 카테고리 코드
   * @returns 해당 카테고리의 아이템 가격 데이터
   */
  const fetchFn = async (categoryCode: string) => {
    // ? handleError 테스트용 코드 (주석 처리됨)
    // throw new AxiosError(
    //   'Simulated API Error',
    //   'ECONNABORTED',
    //   {
    //     headers: new AxiosHeaders(),
    //     config: {} as any,
    //     request: {},
    //   },
    //   null,
    //   {
    //     status: 500,
    //     statusText: 'Internal Server Error',
    //     headers: new AxiosHeaders(),
    //     config: {} as AxiosHeaders,
    //     data: { message: '서버 에러가 발생했습니다.' },
    //   }
    // );

    return await httpService.get<IItemData[]>('/api/loadoPrice/getMarketPriceByCategoryCode', {
      categoryCode,
      timeValue: searchDate,
    });
  };

  /**
   * 여러 카테고리의 쿼리를 병렬로 실행하고 결과 결합
   */
  const queryResults = useQueries({
    queries: categoryCodes.map((categoryCode) => {
      return {
        // 구조화된 캐시 키 사용
        queryKey: generateQueryKey(searchDate, categoryCode),
        queryFn: () => fetchFn(categoryCode),
        // 사용자 지정 staleTime 또는 기본 설정 사용
        staleTime: staleTime || cacheConfig.dynamicData.staleTime,
        // 캐시 유지 기간 설정 (cacheTime -> gcTime으로 변경됨)
        gcTime: cacheConfig.dynamicData.cacheTime,
        // 실패 시 재시도 횟수
        retry: cacheConfig.dynamicData.retry,
        // 이전 데이터 유지하여 UX 개선
        keepPreviousData: true,
      };
    }),
    // 여러 쿼리 결과를 하나로 결합
    combine: (result) => {
      const isAllQueriesFetched = result.every((item) => item.isFetched);

      return {
        isSuccess: result.every((e) => e.isSuccess),
        isError: result.some((e) => e.isError),
        isFetched: isAllQueriesFetched,
        isFetching: result.every((e) => e.isFetching),
        data: result.map((item) => item.data),
        isLoading: result.every((e) => e.isLoading),
      };
    },
  });

  return queryResults;
};

// 외부에서 캐시 키 생성 로직에 접근할 수 있도록 export
useItemPriceQuery.generateQueryKey = generateQueryKey;
