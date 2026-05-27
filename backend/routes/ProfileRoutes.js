import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/userController.js";

const router = express.Router();

// 👤 profile
router.get("/profile", protect, getProfile);

// ✏️ update profile
router.put("/profile", protect, updateProfile);

// 🔐 change password
router.put("/change-password", protect, changePassword);

export default router;