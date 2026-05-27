import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";


// ✅ لازم يكون أول حاجة قبل أي imports تعتمد على env
dotenv.config();

import { connectDB } from "./config/db.js";


import authRoutes from "./routes/authRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import plantMemoryRoutes from "./routes/plantMemoryRoutes.js";
import expertRoutes from "./routes/expertRoutes.js";
import systemRoutes from "./routes/systemRoutes.js";
import userRoutes from "./routes/userRoutes.js";


import { initSocket } from "./socket.js";

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/plants", plantMemoryRoutes);
app.use("/api/expert", expertRoutes);
app.use("/api/system", systemRoutes)
app.use("/api/user", userRoutes);
app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

// database
connectDB();



// create server
const server = http.createServer(app);

// socket
initSocket(server);

// debug (مهم مؤقتًا)
console.log("CLOUDINARY CHECK:", {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "OK" : "MISSING",
});

// listen
server.listen(5000, () => {
  console.log("Server running on port 5000");
});