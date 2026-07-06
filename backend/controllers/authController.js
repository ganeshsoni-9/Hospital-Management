import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// MODELS
import Staff from "../models/Staff.js";
import Patient from "../models/user.js";
import Otp from "../models/Otp.js";

// UTILS
import generateToken from "../utils/generateToken.js";
import { generateOtp } from "../utils/generateOtp.js";
import { sendEmail } from "../utils/sendEmail.js";


// ================================
// 👨‍⚕️ STAFF REGISTER (ADMIN/STAFF)
// ================================
export const registerStaff = async (req, res) => {
  try {
    const { name, email, password, designation } = req.body;

    const existing = await Staff.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Staff already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await Staff.create({
      name,
      email,
      password: hashedPassword,
      designation,
    });

    res.status(201).json({
      _id: staff._id,
      name: staff.name,
      email: staff.email,
      token: generateToken(staff._id),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================================
// 👨‍⚕️ STAFF LOGIN
// ================================
export const loginStaff = async (req, res) => {
  try {
    const { email, password } = req.body;

    const staff = await Staff.findOne({ email });

    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const isMatch = await bcrypt.compare(password, staff.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: staff._id,
      name: staff.name,
      email: staff.email,
      designation: staff.designation,
      token: generateToken(staff._id),
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================================
// 🧑‍⚕️ PATIENT REGISTER (OTP FLOW)
// ================================
export const registerPatient = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Patient.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Patient already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = await Patient.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      isApproved: false,
      role: "patient",
    });

    const otp = generateOtp();

    await Otp.create({
      email,
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 min
    });

    await sendEmail(email, `Your OTP is: ${otp}`);

    res.json({
      message: "OTP sent to email successfully",
      patientId: patient._id,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================================
// 🔐 VERIFY OTP
// ================================
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await Otp.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (record.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    await Patient.findOneAndUpdate(
      { email },
      { isVerified: true }
    );

    await Otp.deleteMany({ email });

    res.json({ message: "Account verified successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================================
// 🔑 PATIENT LOGIN (ONLY VERIFIED)
// ================================
export const loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    const patient = await Patient.findOne({ email });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    if (!patient.isVerified) {
      return res.status(400).json({ message: "Please verify OTP first" });
    }

    const isMatch = await bcrypt.compare(password, patient.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: patient._id, role: patient.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        _id: patient._id,
        name: patient.name,
        email: patient.email,
        role: patient.role,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================================
// 👤 GET CURRENT STAFF (ADMIN)
// ================================
export const getMeStaff = async (req, res) => {
  res.json(req.staff);
};