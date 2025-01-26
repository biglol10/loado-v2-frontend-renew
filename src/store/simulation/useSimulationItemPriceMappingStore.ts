import { create } from 'zustand';

export interface IItemPriceMapping {
  [id: string]: number;
}

export interface ISimulationItemPrice {
  itemPriceMapping: IItemPriceMapping | null;
  setItemPriceMapping: (value: IItemPriceMapping) => void;
}

const useSimulationItemPriceMappingStore = create<ISimulationItemPrice>((set) => ({
  itemPriceMapping: null,
  setItemPriceMapping: (value) => set({ itemPriceMapping: value }),
}));

export default useSimulationItemPriceMappingStore;
