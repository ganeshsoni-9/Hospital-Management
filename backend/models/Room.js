import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ["General", "Semi-Private", "Private", "ICU"],
      default: "General",
    },
    pricePerDay: { type: Number, required: true },
    status: {
      type: String,
      enum: ["available", "occupied"],
      default: "available",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
