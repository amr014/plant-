import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  image: { type: String, default: null },

  status: {
    type: String,
    default: "pending" // pending | in_progress | resolved
  },

  aiDiagnosis: { type: Object, default: null },

  expertResponse: { type: String, default: "" },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Ticket", ticketSchema);