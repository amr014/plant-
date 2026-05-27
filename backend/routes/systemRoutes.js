import express from "express";
import SystemSettings from "../models/SystemSettings.js";

const router = express.Router();

// get settings
router.get("/", async (req, res) => {
  const settings = await SystemSettings.findOne();

  res.json(settings || { expertEnabled: false });
});

// toggle expert system
router.post("/toggle", async (req, res) => {
  let settings = await SystemSettings.findOne();

  if (!settings) {
    settings = await SystemSettings.create({
      expertEnabled: true
    });
  } else {
    settings.expertEnabled = !settings.expertEnabled;
    await settings.save();
  }

  res.json(settings);
});

export default router;