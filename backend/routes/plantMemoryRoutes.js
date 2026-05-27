import express from "express";
import PlantMemory from "../models/PlantMemory.js";

const router = express.Router();


// ➕ Create plant
router.post("/", async (req, res) => {
  try {
    const { userId, plantName } = req.body;

    const plant = await PlantMemory.create({
      userId,
      plantName,
      history: [],
    });

    res.json(plant);
  } catch (err) {
    res.status(500).json(err);
  }
});


// 📥 Add history to plant
router.post("/:id/history", async (req, res) => {
  try {
    const { message, diagnosis, image } = req.body;

    const plant = await PlantMemory.findById(req.params.id);

    plant.history.push({
      message,
      diagnosis,
      image,
    });

    await plant.save();

    res.json(plant);
  } catch (err) {
    res.status(500).json(err);
  }
});


// 📤 Get user plants
router.get("/:userId", async (req, res) => {
  try {
    const plants = await PlantMemory.find({
      userId: req.params.userId,
    });

    res.json(plants);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;