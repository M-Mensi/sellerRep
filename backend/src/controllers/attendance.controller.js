const Attendance = require("../models/attendance.model");

exports.createAttendance = async (req, res, next) => {
  try {
    await Attendance.createAttendance(req.body);
    res.status(201).json({ message: "Attendance recorded" });
  } catch (err) {
    next(err);
  }
};

exports.getEmployeeAttendance = async (req, res, next) => {
  try {
    const [rows] = await Attendance.getAttendanceByEmployee(req.params.id);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};
