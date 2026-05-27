import { useCartStore } from "../store/cartStore";
import { useNotificationStore } from "../store/notificationStore";

export const orderService = {
  createOrder(paymentMethod) {
    const cart = useCartStore.getState().cart;

    if (!cart.length) {
      useNotificationStore.getState().addNotification({
        type: "error",
        message: "Cart is empty",
      });
      return null;
    }

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );

    const order = {
      id: Date.now(),
      items: cart,
      total,
      paymentMethod,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // simulation (later backend API)
    console.log("ORDER CREATED:", order);

    useNotificationStore.getState().addNotification({
      type: "success",
      message: "Order created successfully 🎉",
    });

    return order;
  },
};