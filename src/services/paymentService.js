import { useNotificationStore } from "../store/notificationStore";

export const paymentService = {
  process(paymentMethod, order) {
    switch (paymentMethod) {

      // 🟢 Cash on Delivery
      case "cod":
        return {
          status: "pending",
          message: "Order placed - Cash on Delivery",
        };

      // 🟡 Mobile Wallets (InstaPay / Vodafone Cash / Orange Cash)
      case "wallet":
        return {
          status: "pending_payment",
          message:
            "Transfer to phone number and confirm payment later",
        };

      // 🔵 Card Payment (Stripe / Paymob later)
      case "card":
        return {
          status: "processing_payment",
          message: "Redirecting to secure payment gateway",
        };

      default:
        return {
          status: "unknown",
          message: "Invalid payment method",
        };
    }
  },

  notify(result) {
    useNotificationStore.getState().addNotification({
      type: "info",
      message: result.message,
    });
  },
};