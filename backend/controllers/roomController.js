import Room from "../models/Room.js";

// @desc ADD Room (flowchart step)
export const addRoom = async (req, res) => {
  try {
    const { roomNumber, type, pricePerDay } = req.body;
    const exists = await Room.findOne({ roomNumber });
    if (exists) {
      return res.status(400).json({ message: "Room number already exists" });
    }
    const room = await Room.create({ roomNumber, type, pricePerDay });
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAvailableRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ status: "available" });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json({ message: "Room deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
