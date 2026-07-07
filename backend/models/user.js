import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "admin" },
  isVerified: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  otp: { type: String, default: null } // 👈 Yeh field add karna compulsory hai
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;