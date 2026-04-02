const Achievement = require("../models/achievement.model");

// Callback-based controllers
exports.createAchievement = (req, res, next) => {
  Achievement.createAchievement(
    {
      ...req.body,
      employee_id: req.user.employee_id,
    },
    (err, result) => {
      if (err) return next(err);
      res.status(201).json({ message: "Achievement added successfully" });
    },
  );
};

exports.getMyAchievements = (req, res, next) => {
  Achievement.getAchievementsByEmployee(req.user.employee_id, (err, result) => {
    if (err) return next(err);
    const rows = result.rows || [];
    res.json(rows);
  });
};

exports.getAllAchievements = (req, res, next) => {
  Achievement.getAllAchievements((err, result) => {
    if (err) return next(err);
    const rows = result.rows || [];
    res.json(rows);
  });
};
