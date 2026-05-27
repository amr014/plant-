import express from "express";
import cloudinary from "../config/cloudinary.js";
import upload from "../middleware/upload.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ================== CLOUD UPLOAD ==================
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "products" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

// ================== GET ==================
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();

    const normalized = products.map((p) => ({
      ...p._doc,

      image:
        typeof p.image === "string"
          ? { url: p.image, public_id: "" }
          : p.image || { url: "", public_id: "" },
    }));

    res.json(normalized);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ================== CREATE ==================
router.post(
  "/",
  protect,
  authorizeRoles("admin", "owner"),
  upload.single("image"),
  async (req, res) => {
    try {

      let image = { url: "", public_id: "" };

      // file upload
      if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);
        image = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      }

      // url fallback
      if (req.body.imageUrl) {
        image.url = req.body.imageUrl;
      }

      const product = await Product.create({
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        stock: req.body.stock,
        image,
      });

      res.status(201).json(product);

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }
);

// ================== UPDATE ==================
router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "owner"),
  upload.single("image"),
  async (req, res) => {
    try {

      const product = await Product.findById(req.params.id);
      if (!product) return res.status(404).json({ message: "Not found" });

      product.name = req.body.name ?? product.name;
      product.price = req.body.price ?? product.price;
      product.category = req.body.category ?? product.category;
      product.stock = req.body.stock ?? product.stock;

      // file update
      if (req.file) {
        const result = await uploadToCloudinary(req.file.buffer);

        product.image = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      }

      // url update
      if (req.body.imageUrl) {
        product.image.url = req.body.imageUrl;
      }

      const updated = await product.save();
      res.json(updated);

    } catch (err) {
      console.error("PUT ERROR:", err);
      res.status(500).json({ message: err.message });
    }
  }
);

// ================== DELETE ==================
router.delete("/:id", protect, authorizeRoles("admin", "owner"), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    // ❌ كان object → الآن string
    // فمفيش public_id أصلاً

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;