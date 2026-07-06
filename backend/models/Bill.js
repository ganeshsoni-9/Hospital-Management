import mongoose from "mongoose";

// Generate Bill step -> splits into Room Bill / Doctor Bill / Medicine Bill
// as shown in the flowchart, then Pay Bill -> Discharge Patient.
const billSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },

    roomBill: { type: Number, default: 0 },
    doctorBill: { type: Number, default: 0 },
    medicineBill: { type: Number, default: 0 },
    medicineItems: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],

    totalAmount: { type: Number, required: true },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    paymentDate: { type: Date, default: null },
  },
  { timestamps: true }
);

export default mongoose.model("Bill", billSchema);
