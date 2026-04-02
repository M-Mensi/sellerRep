const db = require("../config/db");

// Callback-based queries
exports.createLeaveRequest = (data, callback) => {
  console.log("Creating leave request with data:", data);
  // Calculate duration_days if not provided
  let duration_days = data.duration_days;
  if (!duration_days && data.start_date && data.end_date) {
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);
    duration_days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
  }
  const sql = `
    INSERT INTO "LeaveRequests"
    (employee_id, request_type, leave_type, start_date, end_date, duration_days, reason, status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
  `;
  db.query(
    sql,
    [
      data.employee_id,
      data.request_type,
      data.leave_type,
      data.start_date,
      data.end_date,
      duration_days,
      data.reason,
      data.status || "pending",
    ],
    callback,
  );
};

exports.getAllLeaveRequests = (callback) => {
  const sql = `
    SELECT lr.*, e.name AS employee_name
    FROM "LeaveRequests" lr
    JOIN "Employees" e ON e.id = lr.employee_id
    ORDER BY lr.created_at DESC
  `;
  db.query(sql, [], callback);
};

exports.getLeaveRequestsByEmployee = (employeeId, callback) => {
  const sql =
    'SELECT * FROM "LeaveRequests" WHERE employee_id = $1 ORDER BY created_at DESC';
  db.query(sql, [employeeId], callback);
};

exports.updateLeaveStatus = (id, status, adminId, callback) => {
  const sql = `
    UPDATE "LeaveRequests"
    SET status = $1, approved_by = $2, approval_date = CURRENT_TIMESTAMP
    WHERE id = $3
  `;
  db.query(sql, [status, adminId, id], callback);
};
