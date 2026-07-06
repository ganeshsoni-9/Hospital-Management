import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    contact: { type: String, required: true },
    address: { type: String },
    disease: { type: String },

    // Assign Room / Assign Doctor steps from the flowchart
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", default: null },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", default: null },

    admissionDate: { type: Date, default: Date.now },
    dischargeDate: { type: Date, default: null },

    status: {
      type: String,
      enum: ["admitted", "discharged"],
      default: "admitted",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Patient", patientSchema);
