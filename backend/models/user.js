import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
  isVerified: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  otp: { type: String, default: null },        // OTP store karne ke liye
  otpExpiry: { type: Date, default: null }      // 👈 naya field - OTP kab expire hoga
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;