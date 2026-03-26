const LeaveRequest = require("../models/leaveRequest.model");

exports.createLeaveRequest = async (req, res) => {
  try {
    await LeaveRequest.createLeaveRequest({
      ...req.body,
      employee_id: req.user.employee_id,
    });

    res.status(201).json({ message: "Leave request submitted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyLeaveRequests = async (req, res) => {
  try {
    const [rows] = await LeaveRequest.getLeaveRequestsByEmployee(
      req.user.employee_id,
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllLeaveRequests = async (req, res) => {
  try {
    const [rows] = await LeaveRequest.getAllLeaveRequests();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.reviewLeaveRequest = async (req, res) => {
  const { status } = req.body;

  if (!["approved", "declined"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    await LeaveRequest.updateLeaveStatus(req.params.id, status, req.user.id);

    res.json({ message: `Leave request ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
