import { create } from "zustand";
import { socket } from "../socket";

export const useCartStore = create((set, get) => ({
  cart: JSON.parse(localStorage.getItem("cart")) || [],

  // ➕ Add To Cart
  addToCart: (product) =>
    set((state) => {
      const existing = state.cart.find(
        (item) =>
          item._id === product._id
      );

      let updated;

      if (existing) {
        updated = state.cart.map((item) =>
          item._id === product._id
            ? {
                ...item,
                qty: item.qty + 1,
              }
            : item
        );
      } else {
        updated = [
          ...state.cart,
          {
            ...product,
            qty: 1,
          },
        ];
      }

      localStorage.setItem(
        "cart",
        JSON.stringify(updated)
      );

      // realtime sync
      socket.emit("cartUpdated", {
        cart: updated,
      });

      return {
        cart: updated,
      };
    }),

  // ➖ Remove From Cart
  removeFromCart: (
    id,
    removeAll = false
  ) =>
    set((state) => {
      let updated = state.cart;

      const item = state.cart.find(
        (p) => p._id === id
      );

      if (!item) return state;

      if (removeAll || item.qty <= 1) {
        updated = state.cart.filter(
          (p) => p._id !== id
        );
      } else {
        updated = state.cart.map((p) =>
          p._id === id
            ? {
                ...p,
                qty: p.qty - 1,
              }
            : p
        );
      }

      localStorage.setItem(
        "cart",
        JSON.stringify(updated)
      );

      // realtime sync
      socket.emit("cartUpdated", {
        cart: updated,
      });

      return {
        cart: updated,
      };
    }),

  // 🗑 Clear Cart
  clearCart: () => {
    localStorage.removeItem("cart");

    socket.emit("cartUpdated", {
      cart: [],
    });

    return {
      cart: [],
    };
  },
}));

// 📡 Listen realtime updates
socket.on("cartUpdated", (data) => {
  if (!data?.cart) return;

  useCartStore.setState({
    cart: data.cart,
  });

  localStorage.setItem(
    "cart",
    JSON.stringify(data.cart)
  );
});