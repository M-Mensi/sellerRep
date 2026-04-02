const db = require("../config/db");

// Callback-based queries
exports.createError = (data, callback) => {
  const sql = `
    INSERT INTO "Errors"
    (employee_id, title, description, category, severity, status)
    VALUES ($1, $2, $3, $4, $5, $6)
  `;
  db.query(
    sql,
    [
      data.employee_id,
      data.title,
      data.description,
      data.category,
      data.severity || "medium",
      data.status || "open",
    ],
    callback,
  );
};

exports.getAllErrors = (callback) => {
  const sql = `
    SELECT e.*, emp.name AS employee_name
    FROM "Errors" e
    JOIN "Employees" emp ON emp.id = e.employee_id
    ORDER BY e.created_at DESC
  `;
  db.query(sql, [], callback);
};

exports.getErrorById = (id, callback) => {
  const sql = 'SELECT * FROM "Errors" WHERE id = $1';
  db.query(sql, [id], callback);
};

exports.updateErrorStatus = (id, status, callback) => {
  const sql = 'UPDATE "Errors" SET status = $1 WHERE id = $2';
  db.query(sql, [status, id], callback);
};
