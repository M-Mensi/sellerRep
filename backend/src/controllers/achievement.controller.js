const Achievement = require("../models/achievement.model");

exports.createAchievement = async (req, res, next) => {
  try {
    await Achievement.createAchievement({
      ...req.body,
      employee_id: req.user.employee_id,
    });

    res.status(201).json({ message: "Achievement added successfully" });
  } catch (err) {
    next(err);
  }
};

exports.getMyAchievements = async (req, res, next) => {
  try {
    const [rows] = await Achievement.getAchievementsByEmployee(
      req.user.employee_id,
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getAllAchievements = async (req, res, next) => {
  try {
    const [rows] = await Achievement.getAllAchievements();
    res.json(rows);
  } catch (err) {
    next(err);
  }
};
