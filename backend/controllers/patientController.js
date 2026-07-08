import Patient from "../models/Patient.js";
import User from "../models/User.js";

// 1. GET ALL PATIENTS
export const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({}).populate("room").populate("doctor");
    res.json(patients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 2. CREATE NEW PATIENT
export const createPatient = async (req, res) => {
  try {
    const { name, age, gender, contact, address, disease } = req.body;
    const newPatient = new Patient({
      name,
      age,
      gender,
      contact,
      address,
      disease,
      status: "admitted"
    });
    await newPatient.save();
    res.status(201).json(newPatient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 3. ASSIGN ROOM TO PATIENT
export const assignRoom = async (req, res) => {
  try {
    const { roomId } = req.body;
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { room: roomId },
      { new: true }
    );
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 4. ASSIGN DOCTOR TO PATIENT
export const assignDoctor = async (req, res) => {
  try {
    const { doctorId } = req.body;
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      { doctor: doctorId },
      { new: true }
    );
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 5. DISCHARGE PATIENT
export const dischargePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      {
        status: "discharged",
        room: null,           // Room khaali kar diya discharge par
        dischargeDate: new Date(), // Discharge date/time save kar rahe hain
      },
      { new: true }
    );
    res.json(patient);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 6. ✅ APPROVE PATIENT / STAFF
export const approvePatient = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isApproved = true;
    await user.save();
    return res.json({ message: "Approved successfully", user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// 7. ❌ DELETE PATIENT / STAFF
export const deletePatient = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await User.findByIdAndDelete(req.params.id);
    return res.json({ message: "Deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// 8. 💰 PAYMENT UPDATE
export const updatePayment = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Payment status is required" });

    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.paymentStatus = status;
    await user.save();
    return res.json({ message: "Payment updated successfully", user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// 9. 🗑️ DELETE A PATIENT RECORD (fully removes the patient)
export const deletePatientRecord = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    await Patient.findByIdAndDelete(req.params.id);
    return res.json({ message: "Patient deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
