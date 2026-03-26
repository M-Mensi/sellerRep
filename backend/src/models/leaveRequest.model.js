const db = require("../config/db");

exports.createLeaveRequest = (data) => {
  const sql = `
    INSERT INTO LeaveRequests
    (employee_id, start_date, leave_type, priority, is_start_flexible, reason)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  return db.execute(sql, [
    data.employee_id,
    data.start_date,
    data.leave_type,
    data.priority,
    data.is_start_flexible,
    data.reason,
  ]);
};

exports.getAllLeaveRequests = () => {
  return db.execute(`
    SELECT lr.*, e.name AS employee_name
    FROM LeaveRequests lr
    JOIN Employees e ON e.id = lr.employee_id
    ORDER BY lr.created_at DESC
  `);
};

exports.getLeaveRequestsByEmployee = (employeeId) => {
  return db.execute(
    "SELECT * FROM LeaveRequests WHERE employee_id = ? ORDER BY created_at DESC",
    [employeeId],
  );
};

exports.updateLeaveStatus = (id, status, adminId) => {
  return db.execute(
    `
    UPDATE LeaveRequests
    SET status = ?, reviewed_by = ?, reviewed_at = NOW()
    WHERE id = ?
    `,
    [status, adminId, id],
  );
};
