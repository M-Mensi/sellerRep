const db = require("../config/db");

exports.createAchievement = (data) => {
  return db.execute(
    `
    INSERT INTO Achievements 
    (employee_id, title, description, achieved_on)
    VALUES (?, ?, ?, ?)
    `,
    [data.employee_id, data.title, data.description, data.achieved_on],
  );
};

exports.getAchievementsByEmployee = (employeeId) => {
  return db.execute(
    `
    SELECT * 
    FROM Achievements
    WHERE employee_id = ?
    ORDER BY created_at DESC
    `,
    [employeeId],
  );
};

exports.getAllAchievements = () => {
  return db.execute(
    `
    SELECT a.*, e.name AS employee_name
    FROM Achievements a
    JOIN Employees e ON e.id = a.employee_id
    ORDER BY a.created_at DESC
    `,
  );
};
