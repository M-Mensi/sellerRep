const LeaveRequest = require("../models/leaveRequest.model");

exports.createLeaveRequest = async (req, res, next) => {
  try {
    await LeaveRequest.createLeaveRequest({
      ...req.body,
      employee_id: req.user.employee_id,
    });

    res.status(201).json({ message: "Leave request submitted" });
  } catch (err) {
    next(err);
  }
};

exports.getMyLeaveRequests = async (req, res, next) => {
  try {
    const [rows] = await LeaveRequest.getLeaveRequestsByEmployee(
      req.user.employee_id,
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getAllLeaveRequests = async (req, res, next) => {
  try {
    const [rows] = await LeaveRequest.getAllLeaveRequests();
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.reviewLeaveRequest = async (req, res, next) => {
  const { status } = req.body;

  if (!["approved", "declined"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    await LeaveRequest.updateLeaveStatus(req.params.id, status, req.user.id);

    res.json({ message: `Leave request ${status}` });
  } catch (err) {
    next(err);
  }
};
