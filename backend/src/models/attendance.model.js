const db = require("../config/db");

exports.createAttendance = (data) => {
  const sql = `
    INSERT INTO Attendance (employee_id, day, time_in, time_out, sick_leave)
    VALUES (?, ?, ?, ?, ?)
  `;
  return db.execute(sql, [
    data.employee_id,
    data.day,
    data.time_in,
    data.time_out,
    data.sick_leave,
  ]);
};

exports.getAttendanceByEmployee = (employeeId) => {
  return db.execute("SELECT * FROM Attendance WHERE employee_id = ?", [
    employeeId,
  ]);
};
