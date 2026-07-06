import Patient from "../models/user.js";
import Room from "../models/Room.js";


// ================================
// ➕ ADD PATIENT
// ================================
export const addPatient = async (req, res) => {
  try {
    const {
      name,
      age,
      gender,
      contact,
      address,
      disease,
      room,
      doctor,
    } = req.body;

    const patient = await Patient.create({
      name,
      age,
      gender,
      contact,
      address,
      disease,
      room: room || null,
      doctor: doctor || null,
      isApproved: false,
      paymentStatus: "pending",
      status: "admitted",
    });

    // If room assigned at creation
    if (room) {
      await Room.findByIdAndUpdate(room, {
        status: "occupied",
      });
    }

    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================================
// 📄 GET ALL PATIENTS
// ================================
export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate("room")
      .populate("doctor")
      .sort({ createdAt: -1 });

    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================================
// 👤 GET SINGLE PATIENT
// ================================
export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate("room")
      .populate("doctor");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================================
// 🛏️ ASSIGN ROOM
// ================================
export const assignRoom = async (req, res) => {
  try {
    const { roomId } = req.body;

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Free old room if exists
    if (patient.room) {
      await Room.findByIdAndUpdate(patient.room, {
        status: "available",
      });
    }

    patient.room = roomId;
    await patient.save();

    await Room.findByIdAndUpdate(roomId, {
      status: "occupied",
    });

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================================
// 👨‍⚕️ ASSIGN DOCTOR
// ================================
export const assignDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { doctor: doctorId },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================================
// ✅ APPROVE PATIENT (ADMIN)
// ================================
export const approvePatient = async (req, res) => {
  try {
    await Patient.findByIdAndUpdate(req.params.id, {
      isApproved: true,
    });

    res.json({ message: "Patient approved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================================
// 💳 UPDATE PAYMENT STATUS
// ================================
export const updatePayment = async (req, res) => {
  try {
    await Patient.findByIdAndUpdate(req.params.id, {
      paymentStatus: req.body.status, // paid / pending
    });

    res.json({ message: "Payment updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================================
// 🏥 DISCHARGE PATIENT
// ================================
export const dischargePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    // Only allow discharge if payment is done
    if (patient.paymentStatus !== "paid") {
      return res.status(400).json({
        message: "Cannot discharge patient before payment",
      });
    }

    if (patient.room) {
      await Room.findByIdAndUpdate(patient.room, {
        status: "available",
      });
    }

    patient.status = "discharged";
    patient.dischargeDate = new Date();

    await patient.save();

    res.json({
      message: "Patient discharged successfully",
      patient,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================================
// ❌ DELETE PATIENT
// ================================
export const deletePatient = async (req, res) => {
  try {
    await Patient.findByIdAndDelete(req.params.id);

    res.json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};