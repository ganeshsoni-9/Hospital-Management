import express from "express";
import {
  addRoom,
  getRooms,
  getAvailableRooms,
  updateRoom,
  deleteRoom,
} from "../controllers/roomController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // Login check from flowchart (Yes branch) applies to all routes below

router.post("/", addRoom);
router.get("/", getRooms);
router.get("/available", getAvailableRooms);
router.put("/:id", updateRoom);
router.delete("/:id", deleteRoom);

export default router;
