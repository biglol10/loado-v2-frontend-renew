import { create } from 'zustand';

export interface ISelectedItemToView {
  itemId: string;
  itemName: string;
}

interface IItemPriceStore {
  selectedItemToView?: ISelectedItemToView;
  setSelectedItemToView: (value?: ISelectedItemToView) => void;
}

const itemPriceStore = create<IItemPriceStore>((set) => ({
  selectedItemToView: undefined,
  setSelectedItemToView: (value) => set({ selectedItemToView: value }),
}));

export default itemPriceStore;
