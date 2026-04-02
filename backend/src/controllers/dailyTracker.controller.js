const DailyTracker = require("../models/dailyTracker.model");

// Callback-based controllers
exports.submitDailyTracker = (req, res, next) => {
  DailyTracker.createOrUpdateDailyTracker(
    {
      ...req.body,
      employee_id: req.user.employee_id,
    },
    (err, result) => {
      if (err) return next(err);
      res.status(201).json({ message: "Daily activity saved successfully" });
    },
  );
};

exports.getMyDailyTracker = (req, res, next) => {
  DailyTracker.getDailyTrackerByEmployee(
    req.user.employee_id,
    (err, result) => {
      if (err) return next(err);
      const rows = result.rows || [];
      res.json(rows);
    },
  );
};

exports.getAllDailyTrackers = (req, res, next) => {
  DailyTracker.getAllDailyTrackers((err, result) => {
    if (err) return next(err);
    const rows = result.rows || [];
    res.json(rows);
  });
};
