const db = require("../config/db");

// Callback-based queries
exports.createOrUpdateDailyTracker = (data, callback) => {
  console.log("Creating/updating daily tracker with data:", data);
  const sql = `
    INSERT INTO "DailyTracker"
      (employee_id, activity_date, calls_count, emails_count, connections_count, new_clients_count, notes)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    ON CONFLICT (employee_id, activity_date) 
    DO UPDATE SET
      calls_count = EXCLUDED.calls_count,
      emails_count = EXCLUDED.emails_count,
      connections_count = EXCLUDED.connections_count,
      new_clients_count = EXCLUDED.new_clients_count,
      notes = EXCLUDED.notes,
      updated_at = CURRENT_TIMESTAMP
  `;
  db.query(
    sql,
    [
      data.employee_id,
      data.activity_date,
      data.calls || data.calls_count || 0,
      data.emails || data.emails_count || 0,
      data.connects || data.connections_count || 0,
      data.new_clients || data.new_clients_count || 0,
      data.notes,
    ],
    callback,
  );
};

exports.getDailyTrackerByEmployee = (employeeId, callback) => {
  const sql = `
    SELECT *
    FROM "DailyTracker"
    WHERE employee_id = $1
    ORDER BY activity_date DESC
  `;
  db.query(sql, [employeeId], callback);
};

exports.getAllDailyTrackers = (callback) => {
  const sql = `
    SELECT dt.*, e.name AS employee_name
    FROM "DailyTracker" dt
    JOIN "Employees" e ON e.id = dt.employee_id
    ORDER BY dt.activity_date DESC
  `;
  db.query(sql, [], callback);
};
