const express = require("express");
const router = express.Router();
const controller = require("../controllers/error.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

// Employee → raise issue
router.post(
  "/",
  authenticate,
  authorizeRoles("employee", "admin"),
  controller.createError,
);

// Employee & Admin → view all issues
router.get(
  "/",
  authenticate,
  authorizeRoles("employee", "admin"),
  controller.getErrors,
);

// Employee & Admin → view error timeline
router.get(
  "/:id/timeline",
  authenticate,
  authorizeRoles("employee", "admin"),
  controller.getErrorTimeline,
);

// Admin only → add timeline action
router.post(
  "/:id/actions",
  authenticate,
  authorizeRoles("admin"),
  controller.addErrorAction,
);

module.exports = router;
