import { useQueries } from '@tanstack/react-query';
import httpService from '../utils/AxiosInstance';
import { IItemData } from './types';

interface IItemPriceQueryParams {
  searchDate: string;
  staleTime: number;
}

const categoryCodes = ['44410', '44420', '50010', '50020', '51100', '210000'];

const generateQueryKey = (searchDate: string, categoryCode: string) => {
  return ['itemPrice', searchDate, categoryCode];
};

export const useItemPriceQuery = (params: IItemPriceQueryParams) => {
  const { searchDate, staleTime } = params;

  const fetchFn = async (categoryCode: string) => {
    return await httpService.get<IItemData[]>('/api/loadoPrice/getMarketPriceByCategoryCode', {
      categoryCode,
      timeValue: searchDate,
    });
  };

  const queryResults = useQueries({
    queries: categoryCodes.map((categoryCode) => {
      return {
        queryKey: generateQueryKey(searchDate, categoryCode),
        queryFn: () => fetchFn(categoryCode),
        staleTime,
      };
    }),
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

useItemPriceQuery.generateQueryKey = generateQueryKey;
