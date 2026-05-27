import { io } from "socket.io-client";

export const socket = io("http://localhost:5000", {
  autoConnect: true,
});

// Event registry (بدون أي UI logic هنا)
export const SOCKET_EVENTS = {
  PRODUCT_CREATED: "productCreated",
  PRODUCT_UPDATED: "productUpdated",
  PRODUCT_DELETED: "productDeleted",

  ORDER_UPDATED: "orderUpdated",
  ORDER_CREATED: "orderCreated",

  CART_UPDATED: "cartUpdated",
  NOTIFICATION: "notification",
};