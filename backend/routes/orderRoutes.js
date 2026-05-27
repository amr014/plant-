import express from "express";

import {
  createOrder,
  getOrders,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { authorizePermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

/* =========================
   USER ROUTES
========================= */

// Create Order
router.post("/", protect, createOrder);

// 👇 مهم: نخلي الاتنين شغالين عشان ما نكسرش الفرونت
router.get("/my-orders", protect, getOrders);
router.get("/my", protect, getOrders); // fallback قديم

// Cancel Order
router.put("/cancel/:id", protect, cancelOrder);

/* =========================
   ADMIN ROUTES
========================= */

router.get(
  "/all",
  protect,
  authorizeRoles("admin", "owner"),
  getAllOrders
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "owner"),
  authorizePermission("orders:update"),
  updateOrderStatus
);

export default router;