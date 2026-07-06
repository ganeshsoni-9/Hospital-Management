import bcrypt from "bcryptjs";
import Staff from "../models/Staff.js";
import generateToken from "../utils/generateToken.js";

// @desc Register hospital staff (used once, e.g. by super-admin/setup)
export const registerStaff = async (req, res) => {
  try {
    const { name, email, password, designation } = req.body;

    const existing = await Staff.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Staff already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

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

// @desc Login step in the flowchart (Login -> Yes/No)
export const loginStaff = async (req, res) => {
  try {
    const { email, password } = req.body;
    const staff = await Staff.findOne({ email });

    if (staff && (await bcrypt.compare(password, staff.password))) {
      return res.json({
        _id: staff._id,
        name: staff.name,
        email: staff.email,
        token: generateToken(staff._id),
      });
    }

    // "No" branch of the Login diamond in the flowchart
    res.status(401).json({ message: "Invalid email or password" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get logged-in staff profile
export const getMe = async (req, res) => {
  res.json(req.staff);
};
