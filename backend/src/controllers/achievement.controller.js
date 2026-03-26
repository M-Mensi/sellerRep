const Achievement = require("../models/achievement.model");

exports.createAchievement = async (req, res) => {
  try {
    await Achievement.createAchievement({
      ...req.body,
      employee_id: req.user.employee_id,
    });

    res.status(201).json({ message: "Achievement added successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyAchievements = async (req, res) => {
  try {
    const [rows] = await Achievement.getAchievementsByEmployee(
      req.user.employee_id,
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllAchievements = async (req, res) => {
  try {
    const [rows] = await Achievement.getAllAchievements();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
