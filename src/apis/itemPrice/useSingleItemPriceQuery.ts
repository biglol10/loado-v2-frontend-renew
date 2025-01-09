import { useQuery } from '@tanstack/react-query';
import httpService from '../utils/AxiosInstance';
import { IGraphData } from '@/pages/item-price/types';

interface IItemPriceQueryParams {
  itemId: string;
  yearValue: number;
  monthValue: number;
  enabled?: boolean;
}

const generateQueryKey = (itemId: string, yearValue: number, monthValue: number) => {
  return ['itemPrice', itemId, yearValue, monthValue];
};

export const useSingleItemPriceQuery = (params: IItemPriceQueryParams) => {
  const { itemId, yearValue, monthValue, enabled = false } = params;

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
    staleTime: 1000 * 60 * 5,
    select: (result) => result.data,
    enabled: enabled && !!itemId && !!yearValue && !!monthValue,
  });

  return query;
};
