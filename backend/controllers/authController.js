import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendOTPEmail } from "../utils/sendEmail.js";

// 1. REGISTER & SEND OTP VIA BREVO
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields (Name, Email, Password) are required." });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes valid

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: "admin",
      isVerified: false,
      isApproved: false,
      otp: generatedOtp,
      otpExpiry,
    });

    await user.save();

    try {
      await sendOTPEmail(email, generatedOtp);
      return res.status(201).json({ message: "Registration successful. OTP sent to your email!" });
    } catch (mailError) {
      console.error("Brevo Email Error:", mailError.response?.data || mailError.message);
      return res.status(201).json({
        message: "User registered, but OTP email failed to send. Please use resend OTP option.",
      });
    }
  } catch (err) {
    console.error("Main Register Error:", err);
    res.status(500).json({ error: err.message });
  }
};

// 2. LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email OTP first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({ token, user, message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. VERIFY OTP
export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required fields." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ message: "User already verified" });
    }

    if (!user.otp || user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP code" });
    }

    if (user.otpExpiry < new Date()) {
      return res.status(400).json({ message: "OTP expired. Please request a new one." });
    }

    user.isVerified = true;
    user.isApproved = true;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();

    return res.status(200).json({ message: "OTP Verified Successfully! You can now login." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. RESEND OTP (bonus - agar user ka OTP expire ho jaaye)
export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isVerified) return res.status(400).json({ message: "User already verified" });

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = newOtp;
    user.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    await sendOTPEmail(email, newOtp);
    res.status(200).json({ message: "New OTP sent to your email" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};