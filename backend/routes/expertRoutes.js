import express from "express";
import Ticket from "../models/Ticket.js";

const router = express.Router();

// create ticket
router.post("/create", async (req, res) => {
  try {
    const ticket = await Ticket.create(req.body);

    res.json({
      success: true,
      ticket
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
});

// get all tickets (admin)
router.get("/all", async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });

    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;