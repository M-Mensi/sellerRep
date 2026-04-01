const express = require("express");
const router = express.Router();
const controller = require("../controllers/dailyTracker.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");
const {
  validateDailyTracker,
  handleValidationErrors,
} = require("../middleware/validation.middleware");

// Employee → submit / update daily activity
router.post(
  "/",
  authenticate,
  authorizeRoles("employee", "admin"),
  validateDailyTracker,
  handleValidationErrors,
  controller.submitDailyTracker,
);

// Employee → view own activity
router.get(
  "/mine",
  authenticate,
  authorizeRoles("employee", "admin"),
  controller.getMyDailyTracker,
);

// Employee & Admin → view all activity (for dashboards)
router.get(
  "/",
  authenticate,
  authorizeRoles("employee", "admin"),
  controller.getAllDailyTrackers,
);

module.exports = router;
