import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./src/config/db.js";
import authRoutes from "./src/router/authRoutes.js";

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", authRoutes);

const PORT = process.env.PORT || 6500;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
