const express = require("express");
const multer = require("multer");
const router = express.Router();
const { registerStudent, getStudents,resetPassword,bulkRegisterStudents } = require("../controllers/studentController");
const { authenticateStudent } = require("../middleware/authMiddleware");
const Student = require("../models/Student");
const upload = multer({ dest: "uploads/" });



// ✅ Student Dashboard with Name
router.get("/student-dashboard", authenticateStudent, async (req, res) => {
  try {
    const student = await Student.findById(req.student.studentId).select("name email role");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json({
      message: "Welcome to your dashboard",
      studentId: req.student.studentId,
      name: student.name,
      email: student.email,
      role: student.role
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching student details" });
  }
});

router.post("/students", registerStudent);
router.get("/students", getStudents);
router.post("/students/reset-password", resetPassword);
router.post("/students/bulk-register", upload.single("file"), bulkRegisterStudents);
module.exports = router;
