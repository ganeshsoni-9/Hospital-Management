import mongoose from "mongoose";

// "Hospital Staff" login from the flowchart — single staff role that
// operates the whole system (Add Room / Doctor / Patient / Billing).
const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    designation: { type: String, default: "Receptionist" },
  },
  { timestamps: true }
);

export default mongoose.model("Staff", staffSchema);
