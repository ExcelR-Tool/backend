const express = require("express");
const router = express.Router();
const { createDepartment, getDepartments } = require("../controllers/departmentController");
const { authenticateStudent } = require("../middleware/authMiddleware");
const { authorizeRole } = require("../middleware/roleMiddleware");


router.post("/departments",authenticateStudent,authorizeRole("admin"),createDepartment);
router.get("/departments", authenticateStudent,authorizeRole("admin"),getDepartments);

module.exports = router;
