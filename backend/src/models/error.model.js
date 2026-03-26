const db = require("../config/db");

exports.createError = (data) => {
  const sql = `
    INSERT INTO Errors
    (employee_id, category, sub_category, description, is_repeated, severity)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  return db.execute(sql, [
    data.employee_id,
    data.category,
    data.sub_category,
    data.description,
    data.is_repeated,
    data.severity,
  ]);
};

exports.getAllErrors = () => {
  return db.execute(`
    SELECT e.*, emp.name AS employee_name
    FROM Errors e
    JOIN Employees emp ON emp.id = e.employee_id
    ORDER BY e.created_at DESC
  `);
};

exports.getErrorById = (id) => {
  return db.execute("SELECT * FROM Errors WHERE id = ?", [id]);
};

exports.updateErrorStatus = (id, isStillFaced) => {
  return db.execute("UPDATE Errors SET is_still_faced = ? WHERE id = ?", [
    isStillFaced,
    id,
  ]);
};
