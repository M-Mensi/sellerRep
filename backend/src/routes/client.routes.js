const express = require("express");
const router = express.Router();
const controller = require("../controllers/client.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

// Admin & employee can create clients
router.post(
  "/",
  authenticate,
  authorizeRoles("admin", "employee"),
  controller.createClient,
);

// Employee → own clients | Admin → by employee id
router.get(
  "/employee/:employeeId",
  authenticate,
  authorizeRoles("admin", "employee"),
  controller.getClientsByEmployee,
);

// Admin → all clients
router.get(
  "/",
  authenticate,
  authorizeRoles("admin"),
  controller.getAllClients,
);

module.exports = router;
