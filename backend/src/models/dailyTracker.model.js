const db = require("../config/db");

exports.createOrUpdateDailyTracker = (data) => {
  const sql = `
    INSERT INTO DailyTracker
      (employee_id, activity_date, calls, emails, connects, new_clients, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      calls = VALUES(calls),
      emails = VALUES(emails),
      connects = VALUES(connects),
      new_clients = VALUES(new_clients),
      notes = VALUES(notes),
      updated_at = NOW()
  `;
  return db.execute(sql, [
    data.employee_id,
    data.activity_date,
    data.calls,
    data.emails,
    data.connects,
    data.new_clients,
    data.notes,
  ]);
};

exports.getDailyTrackerByEmployee = (employeeId) => {
  return db.execute(
    `
    SELECT *
    FROM DailyTracker
    WHERE employee_id = ?
    ORDER BY activity_date DESC
    `,
    [employeeId],
  );
};

exports.getAllDailyTrackers = () => {
  return db.execute(
    `
    SELECT dt.*, e.name AS employee_name
    FROM DailyTracker dt
    JOIN Employees e ON e.id = dt.employee_id
    ORDER BY dt.activity_date DESC
    `,
  );
};
