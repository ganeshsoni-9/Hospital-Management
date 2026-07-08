import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
// Jo bhi aapka controller ka naam ho, use import karein (jaise getAllPatients ya getPatients)
import { getPatients, createPatient, assignRoom, assignDoctor, dischargePatient } from "../controllers/patientController.js"; 
import { deletePatientRecord } from "../controllers/patientController.js";

const router = express.Router();

// 💡 Yeh check karo ki yahan path exact "/" hi hai na!
router.get("/", verifyToken, getPatients); 
router.post("/", verifyToken, createPatient);
router.put("/:id/assign-room", verifyToken, assignRoom);
router.put("/:id/assign-doctor", verifyToken, assignDoctor);
router.put("/:id/discharge", verifyToken, dischargePatient);
router.delete("/:id", verifyToken, deletePatientRecord);

export default router;
