const DailyTracker = require("../models/dailyTracker.model");

exports.submitDailyTracker = async (req, res, next) => {
  try {
    await DailyTracker.createOrUpdateDailyTracker({
      ...req.body,
      employee_id: req.user.employee_id,
    });

    res.status(201).json({ message: "Daily activity saved successfully" });
  } catch (err) {
    next(err);
  }
};

exports.getMyDailyTracker = async (req, res, next) => {
  try {
    const [rows] = await DailyTracker.getDailyTrackerByEmployee(
      req.user.employee_id,
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getAllDailyTrackers = async (req, res, next) => {
  try {
    const [rows] = await DailyTracker.getAllDailyTrackers();
    res.json(rows);
  } catch (err) {
    next(err);
  }
};
