import express from "express";
import {
  generateBill,
  getBills,
  getBillById,
  payBill,
} from "../controllers/billController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/generate", generateBill);
router.get("/", getBills);
router.get("/:id", getBillById);
router.put("/:id/pay", payBill);

export default router;
