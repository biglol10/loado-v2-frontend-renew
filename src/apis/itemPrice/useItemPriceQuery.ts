import { keepPreviousData, useQueries } from '@tanstack/react-query';
import httpService from '../utils/AxiosInstance';
import { IItemData } from './types';
import { IApiResponseTemplate } from '../utils/types';
import { cacheKeys, getCachingConfig } from '../utils/cache';

type TItemPriceResponse = IApiResponseTemplate<IItemData[]> | undefined;

interface IItemPriceQueryParams {
  searchDate: string;
  staleTime?: number;
}

const categoryCodes = ['44410', '50010', '50020', '51100', '210000']; // '44420' 앜패로 인한 직업각인서 제회

const generateQueryKey = (searchDate: string, categoryCode: string) => {
  return [...cacheKeys.itemPrice.all, 'category', categoryCode, 'date', searchDate];
};

export const useItemPriceQuery = (params: IItemPriceQueryParams) => {
  const { searchDate, staleTime } = params;

  // 아이템 가격은 중간 주기로 업데이트되는 데이터이므로 'moderate' 설정 사용
  const cacheConfig = getCachingConfig('moderate');

  const fetchFn = async (categoryCode: string, signal?: AbortSignal) => {
    return await httpService.get<IItemData[]>(
      '/api/loadoPrice/getMarketPriceByCategoryCode',
      {
        categoryCode,
        timeValue: searchDate,
      },
      undefined,
      signal
    );
  };

  const queryResults = useQueries({
    queries: categoryCodes.map((categoryCode) => {
      return {
        queryKey: generateQueryKey(searchDate, categoryCode),
        queryFn: ({ signal }: { signal: AbortSignal }) => fetchFn(categoryCode, signal),
        staleTime: staleTime ?? cacheConfig.staleTime,
        gcTime: cacheConfig.gcTime,
        placeholderData: keepPreviousData,
      };
    }),
    combine: (result) => {
      const isAllQueriesFetched = result.every((item) => item.isFetched);

      return {
        isSuccess: result.every((e) => e.isSuccess),
        isError: result.some((e) => e.isError),
        isFetched: isAllQueriesFetched,
        isFetching: result.some((e) => e.isFetching),
        data: result.map((item) => item.data as TItemPriceResponse),
        isLoading: result.some((e) => e.isLoading),
      };
    },
  });

  return queryResults;
};

useItemPriceQuery.generateQueryKey = generateQueryKey;
