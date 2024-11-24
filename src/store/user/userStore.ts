import { create } from 'zustand';

interface IUserStore {
  isMobile: boolean;
  setIsMobile: (value: boolean) => void;
}

const userStore = create<IUserStore>((set) => ({
  isMobile: false,
  setIsMobile: (value) => set({ isMobile: value }),
}));

export default userStore;
