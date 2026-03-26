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

// Admin → view all issues
router.get("/", authenticate, authorizeRoles("admin"), controller.getErrors);

// Admin → view timeline
router.get(
  "/:id/timeline",
  authenticate,
  authorizeRoles("admin"),
  controller.getErrorTimeline,
);

// Admin → add timeline action
router.post(
  "/:id/actions",
  authenticate,
  authorizeRoles("admin"),
  controller.addErrorAction,
);

module.exports = router;
