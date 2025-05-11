import { useQuery } from '@tanstack/react-query';
import httpService from '../utils/AxiosInstance';
import { IGraphData } from '@/pages/item-price/types';
import { cacheKeys, getCachingConfig } from '../utils/cache';

interface IItemPriceQueryParams {
  itemId: string;
  yearValue: number;
  monthValue: number;
  enabled?: boolean;
}

const generateQueryKey = (itemId: string, yearValue: number, monthValue: number) => {
  return [...cacheKeys.itemPrice.all, 'item', itemId, 'year', yearValue, 'month', monthValue];
};

export const useSingleItemPriceQuery = (params: IItemPriceQueryParams) => {
  const { itemId, yearValue, monthValue, enabled = false } = params;

  // 매달 가격 정보는 자주 변하지 않으므로, static 설정 사용
  const cacheConfig = getCachingConfig('static');

  const fetchFn = async (
    itemId: string,
    yearValue: number,
    monthValue: number,
    enabled: boolean
  ) => {
    return await httpService.get<IGraphData[]>(
      '/api/loadoPrice/getPeriodYearMonthMarketItemPrice',
      {
        itemId,
        year: yearValue,
        month: monthValue,
        enabled,
      }
    );
  };

  const query = useQuery({
    queryKey: generateQueryKey(itemId, yearValue, monthValue),
    queryFn: () => fetchFn(itemId, yearValue, monthValue, enabled),
    staleTime: cacheConfig.staleTime,
    gcTime: cacheConfig.gcTime,
    select: (result) => result.data,
    enabled: enabled && !!itemId && !!yearValue && !!monthValue,
  });

  return query;
};
