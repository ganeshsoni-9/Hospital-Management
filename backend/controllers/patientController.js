import User from "../models/User.js";

// ✅ APPROVE PATIENT
export const approvePatient = async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    isApproved: true,
  });

  res.json({ message: "Patient approved" });
};

// ❌ DELETE PATIENT
export const deletePatient = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Patient deleted" });
};

// 💰 PAYMENT UPDATE
export const updatePayment = async (req, res) => {
  const { status } = req.body;

  await User.findByIdAndUpdate(req.params.id, {
    paymentStatus: status,
  });

  res.json({ message: "Payment updated" });
};