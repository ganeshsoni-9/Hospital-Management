import express from "express";
import {
  getSummaryReport,
  getDischargedPatientsReport,
} from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// 1. PUBLIC ROUTE: Yeh bina login ke bhi chalega (Dashboard par error nahi aayegi)
router.get("/summary", getSummaryReport);

// 2. PROTECTED ROUTE: Iske liye verification zaroori hai
// Humne 'protect' middleware sirf isi route par lagaya hai
router.get("/discharged", protect, getDischargedPatientsReport);

export default router;