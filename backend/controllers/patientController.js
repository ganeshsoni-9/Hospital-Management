import Patient from "../models/Patient.js";
import Room from "../models/Room.js";

// @desc ADD Patient (flowchart step) — room/doctor can be assigned now or later
export const addPatient = async (req, res) => {
  try {
    const { name, age, gender, contact, address, disease, room, doctor } =
      req.body;

    const patient = await Patient.create({
      name,
      age,
      gender,
      contact,
      address,
      disease,
      room: room || null,
      doctor: doctor || null,
    });

    // If a room was assigned at creation time, mark it occupied
    if (room) {
      await Room.findByIdAndUpdate(room, { status: "occupied" });
    }

    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .populate("room")
      .populate("doctor");
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Assign Room (flowchart step)
export const assignRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // Free up previous room, if any
    if (patient.room) {
      await Room.findByIdAndUpdate(patient.room, { status: "available" });
    }

    patient.room = roomId;
    await patient.save();
    await Room.findByIdAndUpdate(roomId, { status: "occupied" });

    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Assign Doctor (flowchart step)
export const assignDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { doctor: doctorId },
      { new: true }
    );
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Discharge Patient (flowchart step) — runs only after bill is paid
export const dischargePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    if (patient.room) {
      await Room.findByIdAndUpdate(patient.room, { status: "available" });
    }

    patient.status = "discharged";
    patient.dischargeDate = new Date();
    await patient.save();

    res.json({ message: "Patient discharged successfully", patient });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
