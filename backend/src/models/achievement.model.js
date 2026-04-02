const db = require("../config/db");

// Callback-based queries
exports.createAchievement = (data, callback) => {
  const sql = `
    INSERT INTO "Achievements" 
    (employee_id, title, description, achieved_on)
    VALUES ($1, $2, $3, $4)
  `;
  db.query(
    sql,
    [data.employee_id, data.title, data.description, data.achieved_on],
    callback,
  );
};

exports.getAchievementsByEmployee = (employeeId, callback) => {
  const sql = `
    SELECT * 
    FROM "Achievements"
    WHERE employee_id = $1
    ORDER BY created_at DESC
  `;
  db.query(sql, [employeeId], callback);
};

exports.getAllAchievements = (callback) => {
  const sql = `
    SELECT a.*, e.name AS employee_name
    FROM "Achievements" a
    JOIN "Employees" e ON e.id = a.employee_id
    ORDER BY a.created_at DESC
  `;
  db.query(sql, [], callback);
};
