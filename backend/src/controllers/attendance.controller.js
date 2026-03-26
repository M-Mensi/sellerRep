const Attendance = require("../models/attendance.model");

exports.createAttendance = async (req, res) => {
  try {
    await Attendance.createAttendance(req.body);
    res.status(201).json({ message: "Attendance recorded" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEmployeeAttendance = async (req, res) => {
  try {
    const [rows] = await Attendance.getAttendanceByEmployee(req.params.id);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
