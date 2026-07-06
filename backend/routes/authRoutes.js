import express from "express";
import { registerStaff, loginStaff, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerStaff);
router.post("/login", loginStaff);
router.get("/me", protect, getMe);

export default router;
