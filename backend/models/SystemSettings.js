import mongoose from "mongoose";

const systemSchema = new mongoose.Schema({
  expertEnabled: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model("SystemSettings", systemSchema);