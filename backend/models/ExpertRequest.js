import mongoose from "mongoose";

const expertSchema = new mongoose.Schema({
  userId: String,
  message: String,
  image: String,
  status: {
    type: String,
    default: "coming_soon"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("ExpertRequest", expertSchema);