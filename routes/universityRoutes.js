const express = require("express");
const router = express.Router();
const { createUniversity, getUniversities } = require("../controllers/universityController");
const { authenticateStudent } = require("../middleware/authMiddleware");
const { authorizeRole } = require("../middleware/roleMiddleware");

router.post("/universities",authenticateStudent,authorizeRole("admin"), createUniversity);
router.get("/universities", authenticateStudent,authorizeRole("admin"),getUniversities);

module.exports = router;
