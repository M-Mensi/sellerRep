const express = require("express");
const router = express.Router();
const controller = require("../controllers/dailyTracker.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

// Employee → submit / update daily activity
router.post(
  "/",
  authenticate,
  authorizeRoles("employee", "admin"),
  controller.submitDailyTracker,
);

// Employee → view own activity
router.get(
  "/mine",
  authenticate,
  authorizeRoles("employee", "admin"),
  controller.getMyDailyTracker,
);

// Admin → view all activity
router.get(
  "/",
  authenticate,
  authorizeRoles("admin"),
  controller.getAllDailyTrackers,
);

module.exports = router;
