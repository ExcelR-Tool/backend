const express = require("express");
const router = express.Router();
const { resetTodayTestForStudent } = require("../controllers/testController");
const { authenticateStudent } = require("../middleware/authMiddleware");
const { authorizeRole } = require("../middleware/roleMiddleware");

router.post(
  "/admin/reset-test",
  authenticateStudent,
  authorizeRole("admin"),  // ✅ restrict this route to admins only
  resetTodayTestForStudent
);

module.exports = router;
