import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import { authorizeRoles } from "../middleware/roleMiddleware.js";

import { getDashboardStats } from "../controllers/adminController.js";

const router = express.Router();

router.get(
  "/stats",
  protect,
  authorizeRoles("admin", "owner"),
  getDashboardStats
);

export default router;