const DailyTracker = require("../models/dailyTracker.model");

exports.submitDailyTracker = async (req, res) => {
  try {
    await DailyTracker.createOrUpdateDailyTracker({
      ...req.body,
      employee_id: req.user.employee_id,
    });

    res.status(201).json({ message: "Daily activity saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyDailyTracker = async (req, res) => {
  try {
    const [rows] = await DailyTracker.getDailyTrackerByEmployee(
      req.user.employee_id,
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllDailyTrackers = async (req, res) => {
  try {
    const [rows] = await DailyTracker.getAllDailyTrackers();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
