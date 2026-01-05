import { Router } from "express";
import {
  forgotPassword,
  createUser,
  getAllUsers,
  updateUserRole,
  getUserById,
  updateUser,
  loginUser,
  resetPassword,
  updatePassword,
} from "../controller/authController.js";

const authRoutes = Router();

authRoutes.post("/create-user", createUser);
authRoutes.post("/login", loginUser);


authRoutes.get("/users", getAllUsers);
authRoutes.put("/users/:id", updateUser);
authRoutes.get("/users/:id", getUserById);

authRoutes.post("/forgot-password", forgotPassword);
authRoutes.get("/reset-password", resetPassword);
authRoutes.post("/update-password", updatePassword);

export default authRoutes;
