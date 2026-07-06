import express from "express";
import {
  addRoom,
  getRooms,
  getAvailableRooms,
  updateRoom,
  deleteRoom,
} from "../controllers/roomController.js";

// ✅ FIXED IMPORT
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔒 Login check for all routes
router.use(verifyToken);

router.post("/", addRoom);
router.get("/", getRooms);
router.get("/available", getAvailableRooms);
router.put("/:id", updateRoom);
router.delete("/:id", deleteRoom);

export default router;