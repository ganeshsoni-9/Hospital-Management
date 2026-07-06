import Bill from "../models/Bill.js";
import Patient from "../models/user.js";
import Room from "../models/Room.js";
import Doctor from "../models/Doctor.js";

// @desc Reports node in the flowchart — summary analytics
export const getSummaryReport = async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();
    const admittedPatients = await Patient.countDocuments({ status: "admitted" });
    const dischargedPatients = await Patient.countDocuments({ status: "discharged" });

    const totalRooms = await Room.countDocuments();
    const occupiedRooms = await Room.countDocuments({ status: "occupied" });

    const totalDoctors = await Doctor.countDocuments();

    const bills = await Bill.find();
    const totalRevenue = bills
      .filter((b) => b.paymentStatus === "paid")
      .reduce((sum, b) => sum + b.totalAmount, 0);
    const pendingRevenue = bills
      .filter((b) => b.paymentStatus === "pending")
      .reduce((sum, b) => sum + b.totalAmount, 0);

    res.json({
      totalPatients,
      admittedPatients,
      dischargedPatients,
      totalRooms,
      occupiedRooms,
      availableRooms: totalRooms - occupiedRooms,
      totalDoctors,
      totalRevenue,
      pendingRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDischargedPatientsReport = async (req, res) => {
  try {
    const patients = await Patient.find({ status: "discharged" })
      .populate("room")
      .populate("doctor")
      .sort({ dischargeDate: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
