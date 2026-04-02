const Attendance = require("../models/attendance.model");

// Callback-based controllers
exports.createAttendance = (req, res, next) => {
  Attendance.createAttendance(
    {
      ...req.body,
      employee_id: req.user.employee_id,
    },
    (err, result) => {
      if (err) return next(err);
      res.status(201).json({ message: "Attendance recorded" });
    },
  );
};

exports.getEmployeeAttendance = (req, res, next) => {
  Attendance.getAttendanceByEmployee(req.params.id, (err, result) => {
    if (err) return next(err);
    const rows = result.rows || [];
    res.json(rows);
  });
};
