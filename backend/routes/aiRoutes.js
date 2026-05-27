import express from "express";
import { diagnosePlant } from "../services/aiService.js";

const router = express.Router();

router.post("/diagnose", async (req, res) => {
  const result = await diagnosePlant(req.body);

  res.json({
    success: true,
    result
  });
});

export default router;