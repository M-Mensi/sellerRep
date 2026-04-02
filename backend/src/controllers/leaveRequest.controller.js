const LeaveRequest = require("../models/leaveRequest.model");

// Callback-based controllers
exports.createLeaveRequest = (req, res, next) => {
  LeaveRequest.createLeaveRequest(
    {
      ...req.body,
      employee_id: req.user.employee_id,
    },
    (err, result) => {
      console.log("Create leave request result:", err, result);
      if (err) return next(err);
      res.status(201).json({ message: "Leave request submitted" });
    },
  );
};

exports.getMyLeaveRequests = (req, res, next) => {
  LeaveRequest.getLeaveRequestsByEmployee(
    req.user.employee_id,
    (err, result) => {
      if (err) return next(err);
      const rows = result.rows || [];
      res.json(rows);
    },
  );
};

exports.getAllLeaveRequests = (req, res, next) => {
  LeaveRequest.getAllLeaveRequests((err, result) => {
    if (err) return next(err);
    const rows = result.rows || [];
    res.json(rows);
  });
};

exports.reviewLeaveRequest = (req, res, next) => {
  const { status } = req.body;

  if (!["approved", "declined"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  LeaveRequest.updateLeaveStatus(
    req.params.id,
    status,
    req.user.id,
    (err, result) => {
      if (err) return next(err);
      res.json({ message: `Leave request ${status}` });
    },
  );
};
