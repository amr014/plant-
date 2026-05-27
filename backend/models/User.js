import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    phone: String,
    address: String,
    avatar: String,
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);

// 👇 أهم سطر لمنع التكرار
const User =
  mongoose.models.User ||
  mongoose.model("User", userSchema);


export default User;