const express = require("express");
const router = express.Router();
const { uploadMCQ, getAllMCQs, uploadMCQFromExcel } = require("../controllers/mcqController");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const { authenticateStudent } = require("../middleware/authMiddleware");
const { authorizeRole } = require("../middleware/roleMiddleware");

// ✅ Upload MCQs from Excel - Admin only
router.post(
  "/mcqs/upload-excel",
  authenticateStudent,
  authorizeRole("admin"),
  upload.single("file"),
  uploadMCQFromExcel
);

// ✅ Add MCQ manually - Admin only
router.post(
  "/mcqs",
  authenticateStudent,
  authorizeRole("admin"),
  uploadMCQ
);


router.get("/mcqs", getAllMCQs);


module.exports = router;
