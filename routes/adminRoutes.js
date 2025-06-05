const express = require("express");
const router = express.Router();
const { resetTodayTestForStudent } = require("../controllers/testController");
const { authenticateStudent } = require("../middleware/authMiddleware");
const { authorizeRole } = require("../middleware/roleMiddleware");
const { getAdminReport } = require("../controllers/testController");
const { getAllStudents } = require("../controllers/testController");

router.post(
  "/admin/reset-test",
  authenticateStudent,
  authorizeRole("admin"),
  resetTodayTestForStudent
);

router.post("/admin/view-reports", authenticateStudent, authorizeRole("admin"), getAdminReport);



router.get(
  "/admin/all-students",
  authenticateStudent,
  authorizeRole("admin"),
  getAllStudents
);



module.exports = router;
