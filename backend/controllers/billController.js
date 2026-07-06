import Bill from "../models/Bill.js";
import Patient from "../models/user.js";
import Room from "../models/Room.js";
import Doctor from "../models/Doctor.js";

// @desc Generate Bill (flowchart step) — computes Room Bill / Doctor Bill / Medicine Bill
export const generateBill = async (req, res) => {
  try {
    const { patientId, medicineItems = [] } = req.body;

    const patient = await Patient.findById(patientId)
      .populate("room")
      .populate("doctor");
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // Room Bill = days admitted x room price/day
    let roomBill = 0;
    if (patient.room) {
      const days = Math.max(
        1,
        Math.ceil(
          (Date.now() - new Date(patient.admissionDate)) / (1000 * 60 * 60 * 24)
        )
      );
      roomBill = days * patient.room.pricePerDay;
    }

    // Doctor Bill = doctor's consultation fee
    const doctorBill = patient.doctor ? patient.doctor.consultationFee : 0;

    // Medicine Bill = sum of medicine items passed in
    const medicineBill = medicineItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const totalAmount = roomBill + doctorBill + medicineBill;

    const bill = await Bill.create({
      patient: patientId,
      roomBill,
      doctorBill,
      medicineBill,
      medicineItems,
      totalAmount,
    });

    res.status(201).json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBills = async (req, res) => {
  try {
    const bills = await Bill.find().populate("patient").sort({ createdAt: -1 });
    res.json(bills);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBillById = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id).populate("patient");
    if (!bill) return res.status(404).json({ message: "Bill not found" });
    res.json(bill);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Pay Bill (flowchart diamond) — Yes -> ready for discharge, No -> stays pending
export const payBill = async (req, res) => {
  try {
    const bill = await Bill.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: "paid", paymentDate: new Date() },
      { new: true }
    );
    if (!bill) return res.status(404).json({ message: "Bill not found" });
    res.json({ message: "Payment recorded. Patient can now be discharged.", bill });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
