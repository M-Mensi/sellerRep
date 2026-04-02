const db = require("../config/db");

// Callback-based queries
exports.addAction = (data, callback) => {
  const sql = `
    INSERT INTO "ErrorActions"
    (error_id, action_by, action_type, action_text)
    VALUES ($1, $2, $3, $4)
  `;
  db.query(
    sql,
    [data.error_id, data.action_by, data.action_type, data.action_text],
    callback,
  );
};

exports.getTimelineByError = (errorId, callback) => {
  const sql = `
    SELECT ea.*, u.email AS admin_email
    FROM "ErrorActions" ea
    JOIN "Users" u ON u.id = ea.action_by
    WHERE ea.error_id = $1
    ORDER BY ea.created_at ASC
  `;
  db.query(sql, [errorId], callback);
};
