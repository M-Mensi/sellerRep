const express = require("express");
const router = express.Router();
const controller = require("../controllers/achievement.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const {
  validateAchievement,
  handleValidationErrors,
} = require("../middleware/validation.middleware");

// Employee → add achievement
router.post(
  "/",
  authenticate,
  authorizeRoles("employee", "admin"),
  validateAchievement,
  handleValidationErrors,
  controller.createAchievement,
);

// Employee → view own achievements
router.get(
  "/mine",
  authenticate,
  authorizeRoles("employee", "admin"),
  controller.getMyAchievements,
);

// Employee & Admin → view all achievements (for dashboards)
router.get(
  "/",
  authenticate,
  authorizeRoles("employee", "admin"),
  controller.getAllAchievements,
);

module.exports = router;
