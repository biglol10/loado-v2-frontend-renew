export type TActiveTabType = 'ALL' | 'BOOK' | 'MATERIAL' | 'MY_LIST' | 'ESDER_AND_GEM';

export interface IItemData {
  recordId: string;
  itemName: string;
  itemId: string;
  categoryCode: number;
  date: string;
  minCurrentMinPrice: number;
  maxCurrentMinPrice: number;
  avgCurrentMinPrice: number;
}
