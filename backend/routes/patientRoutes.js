import express from "express";
import {
  approvePatient,
  deletePatient,
  updatePayment,
} from "../controllers/patientController.js";

const router = express.Router();

router.put("/approve/:id", approvePatient);
router.delete("/delete/:id", deletePatient);
router.put("/payment/:id", updatePayment);

export default router;