import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    message: String,
    type: {
      type: String,
      enum: ["success", "error", "info"],
      default: "info",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);