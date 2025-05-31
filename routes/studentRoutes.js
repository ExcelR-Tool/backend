const express = require("express");
const router = express.Router();
const { registerStudent, getStudents } = require("../controllers/studentController");

const { authenticateStudent } = require("../middleware/authMiddleware");

const Student = require("../models/Student");

router.get("/student-dashboard", authenticateStudent, async (req, res) => {
  try {
    const student = await Student.findById(req.student.studentId).populate({
      path: "sectionId",
      populate: {
        path: "yearId",
        populate: {
          path: "departmentId"
        }
      }
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json(student);
  } catch (err) {
    console.error("Error fetching student dashboard:", err);
    res.status(500).json({ message: "Failed to fetch student details" });
  }
});




router.post("/students", registerStudent);
router.get("/students", getStudents);

module.exports = router;
