const express = require("express");
const router = express.Router();
const controller = require("../controllers/employee.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

router.post(
  "/",
  authenticate,
  authorizeRoles("admin"),
  controller.createEmployee,
);

router.get("/", authenticate, authorizeRoles("admin"), controller.getEmployees);

module.exports = router;
