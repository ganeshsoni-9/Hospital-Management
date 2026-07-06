import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: {
      type: String,
      default: "patient",
    },
  },
  { timestamps: true }
);

// 🔥 IMPORTANT FIX (prevent overwrite error)
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;