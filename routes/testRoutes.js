const express = require("express");
const router = express.Router();

const {
  getRandomQuestions,
  submitTest,
  getStudentResults,
  getStudentResultSummary
} = require("../controllers/testController");

const { authenticateStudent } = require("../middleware/authMiddleware");
router.get("/student/results", authenticateStudent, getStudentResults); // full detail
router.get("/student/result-summary", authenticateStudent, getStudentResultSummary); // 👈 summary only
router.get("/student/test", authenticateStudent, getRandomQuestions);
router.post("/student/submit-test", authenticateStudent, submitTest);

module.exports = router;
