import express from "express";
import {
  addPatient,
  getPatients,
  getPatientById,
  assignRoom,
  assignDoctor,
  dischargePatient,
} from "../controllers/patientController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", addPatient);
router.get("/", getPatients);
router.get("/:id", getPatientById);
router.put("/:id/assign-room", assignRoom);
router.put("/:id/assign-doctor", assignDoctor);
router.put("/:id/discharge", dischargePatient);

export default router;
