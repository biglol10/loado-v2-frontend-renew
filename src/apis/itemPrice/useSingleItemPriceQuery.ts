import { useQuery } from '@tanstack/react-query';
import httpService from '../utils/AxiosInstance';
import { IGraphData } from '@/pages/item-price/types';

interface IItemPriceQueryParams {
  itemId: string;
  yearValue: number;
  monthValue: number;
}

const generateQueryKey = (itemId: string, yearValue: number, monthValue: number) => {
  return ['itemPrice', itemId, yearValue, monthValue];
};

export const useSingleItemPriceQuery = (params: IItemPriceQueryParams) => {
  const { itemId, yearValue, monthValue } = params;

  const fetchFn = async (itemId: string, yearValue: number, monthValue: number) => {
    return await httpService.get<IGraphData[]>(
      '/api/loadoPrice/getPeriodYearMonthMarketItemPrice',
      {
        itemId,
        yearValue,
        monthValue,
      }
    );
  };

  const query = useQuery({
    queryKey: generateQueryKey(itemId, yearValue, monthValue),
    queryFn: () => fetchFn(itemId, yearValue, monthValue),
    staleTime: 1000 * 60 * 5,
    select: (result) => result.data,
  });

  return query;
};
