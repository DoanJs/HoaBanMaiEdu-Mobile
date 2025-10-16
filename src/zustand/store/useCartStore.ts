import { create } from 'zustand';

interface CartState {
  carts: any[];
  loading: boolean;
  error: string | null;
  setCarts: (carts: any[]) => void;
  addCart: (cart: any) => void;
  editCart: (id: string, cart: any) => void;
  removeCart: (id: string) => void;
  clearCarts: () => void;
}

const useCartStore = create<CartState>(set => ({
  carts: [],
  loading: false,
  error: null,

  setCarts: (carts: any[]) => set({ carts }),
  addCart: (cart: any) =>
    set((state: any) => ({ carts: [...state.carts, cart] })),
  editCart: (id: string, cart: any) =>
    set((state: any) => {
      const index = state.carts.findIndex((item: any) => item.id === id);
      state.carts[index] = cart;
      return { carts: [...state.carts] };
    }),
  removeCart: (id: string) =>
    set((state: any) => ({
      carts: state.carts.filter((item: any) => item.id !== id),
    })),
  clearCarts: () => set({ carts: [] }),
}));

export default useCartStore;
