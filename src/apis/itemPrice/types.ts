export type TActiveTabType = 'ALL' | 'T3' | 'T4';

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
