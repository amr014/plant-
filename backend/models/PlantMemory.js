import mongoose from "mongoose";

const plantMemorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    plantName: {
      type: String,
      required: true,
    },

    history: [
      {
        message: String,
        diagnosis: String,
        image: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("PlantMemory", plantMemorySchema);