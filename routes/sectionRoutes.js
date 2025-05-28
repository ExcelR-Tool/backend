const express = require("express");
const router = express.Router();
const { createSection, getSections } = require("../controllers/sectionController");
const { authenticateStudent } = require("../middleware/authMiddleware");
const { authorizeRole } = require("../middleware/roleMiddleware");

router.post("/sections",authenticateStudent,authorizeRole("admin"),createSection);
router.get("/sections", authenticateStudent,authorizeRole("admin"),getSections);

module.exports = router;
