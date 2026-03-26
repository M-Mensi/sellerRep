const express = require("express");
const router = express.Router();
const controller = require("../controllers/achievement.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

// Employee → add achievement
router.post(
  "/",
  authenticate,
  authorizeRoles("employee", "admin"),
  controller.createAchievement,
);

// Employee → view own achievements
router.get(
  "/mine",
  authenticate,
  authorizeRoles("employee", "admin"),
  controller.getMyAchievements,
);

// Admin → view all achievements
router.get(
  "/",
  authenticate,
  authorizeRoles("admin"),
  controller.getAllAchievements,
);

module.exports = router;
