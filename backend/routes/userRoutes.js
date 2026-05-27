import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
  changePassword,
} from "../controllers/userController.js";

import upload from "../middleware/upload.js";

const router = express.Router();

// 👤 PROFILE
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// 📸 AVATAR
router.post(
  "/avatar",
  protect,
  upload.single("avatar"),
  uploadAvatar
);

// 🔐 PASSWORD
router.put("/change-password", protect, changePassword);

export default router;