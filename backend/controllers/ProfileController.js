import User from "../models/User.js";
import bcrypt from "bcryptjs";

// ==========================
// GET PROFILE
// ==========================
export const getProfile = async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// UPDATE PROFILE
// ==========================
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, phone, image } = req.body;

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (image) user.image = image;

    const updated = await user.save();

    res.json({
      message: "Profile updated",
      user: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        image: updated.image,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// CHANGE PASSWORD
// ==========================
export const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};