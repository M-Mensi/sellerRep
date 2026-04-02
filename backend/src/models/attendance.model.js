const db = require("../config/db");

// Callback-based queries
exports.createAttendance = (data, callback) => {
  const sql = `
    INSERT INTO "Attendance" (employee_id, attendance_date, status, time_in, time_out, hours_worked)
    VALUES ($1, $2, $3, $4, $5, $6)
  `;
  db.query(
    sql,
    [
      data.employee_id,
      data.attendance_date || data.day,
      data.status || "present",
      data.time_in,
      data.time_out,
      data.hours_worked,
    ],
    callback,
  );
};

exports.getAttendanceByEmployee = (employeeId, callback) => {
  const sql = 'SELECT * FROM "Attendance" WHERE employee_id = $1';
  db.query(sql, [employeeId], callback);
};
