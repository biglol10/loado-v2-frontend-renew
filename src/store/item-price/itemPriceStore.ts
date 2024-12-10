import { create } from 'zustand';

interface IItemPriceStore {
  selectedItemIdToView?: string;
  setSelectedItemIdToView: (value?: string) => void;
}

const itemPriceStore = create<IItemPriceStore>((set) => ({
  selectedItemIdToView: undefined,
  setSelectedItemIdToView: (value) => set({ selectedItemIdToView: value }),
}));

export default itemPriceStore;
