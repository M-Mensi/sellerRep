const db = require("../config/db");

exports.addAction = (data) => {
  const sql = `
    INSERT INTO ErrorActions
    (error_id, admin_id, action, status_after)
    VALUES (?, ?, ?, ?)
  `;
  return db.execute(sql, [
    data.error_id,
    data.admin_id,
    data.action,
    data.status_after,
  ]);
};

exports.getTimelineByError = (errorId) => {
  return db.execute(
    `
    SELECT ea.*, u.email AS admin_email
    FROM ErrorActions ea
    JOIN Users u ON u.id = ea.admin_id
    WHERE ea.error_id = ?
    ORDER BY ea.created_at ASC
  `,
    [errorId],
  );
};
