import { useCartStore } from "../store/cartStore";
import { useNotificationStore } from "../store/notificationStore";

export const cartService = {
  add(product) {
    const { addToCart } = useCartStore.getState();

    addToCart(product);

    useNotificationStore.getState().addNotification({
      type: "success",
      message: `${product.name} added to cart 🛒`,
      duration: 2500,
    });
  },

  remove(id) {
    const { removeFromCart, cart } = useCartStore.getState();

    const item = cart.find((p) => p.id === id);

    removeFromCart(id);

    useNotificationStore.getState().addNotification({
      type: "warning",
      message: item?.qty > 1
        ? "Item quantity updated"
        : "Item removed from cart",
      duration: 2500,
    });
  },

  clear() {
    const { clearCart } = useCartStore.getState();

    clearCart();

    useNotificationStore.getState().addNotification({
      type: "info",
      message: "Cart cleared 🧹",
      duration: 2500,
    });
  },
};