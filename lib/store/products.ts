import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Product } from "@/lib/api/products";

export type CartItem = {
  product: Product;
  quantity: number;
};

type ProductStore = {
  cart: CartItem[];
  favorites: Product[];
  hasHydrated: boolean;
  addToCart: (product: Product) => void;
  clearCart: () => void;
  removeFromCart: (productId: Product["id"]) => void;
  setCartQuantity: (productId: Product["id"], quantity: number) => void;
  toggleFavorite: (product: Product) => void;
  removeFavorite: (productId: Product["id"]) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

function getStoredProduct(product: Product): Product {
  return {
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    thumbnail: product.thumbnail,
    category: product.category,
    brand: product.brand,
    rating: product.rating,
    stock: product.stock,
  };
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      cart: [],
      favorites: [],
      hasHydrated: false,
      addToCart: (product) =>
        set((state) => {
          const existingItem = state.cart.find(
            (item) => item.product.id === product.id,
          );
          const storedProduct = getStoredProduct(product);

          return {
            cart: existingItem
              ? state.cart.map((item) =>
                  item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item,
                )
              : [...state.cart, { product: storedProduct, quantity: 1 }],
          };
        }),
      clearCart: () => set({ cart: [] }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.product.id !== productId),
        })),
      setCartQuantity: (productId, quantity) =>
        set((state) => ({
          cart:
            quantity <= 0
              ? state.cart.filter((item) => item.product.id !== productId)
              : state.cart.map((item) =>
                  item.product.id === productId ? { ...item, quantity } : item,
                ),
        })),
      toggleFavorite: (product) =>
        set((state) => ({
          favorites: state.favorites.some((item) => item.id === product.id)
            ? state.favorites.filter((item) => item.id !== product.id)
            : [...state.favorites, getStoredProduct(product)],
        })),
      removeFavorite: (productId) =>
        set((state) => ({
          favorites: state.favorites.filter((item) => item.id !== productId),
        })),
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
    }),
    {
      name: "medo-tore-products",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: ({ cart, favorites }) => ({ cart, favorites }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Failed to restore saved products from local storage.", error);
        }
        state?.setHasHydrated(true);
      },
    },
  ),
);
