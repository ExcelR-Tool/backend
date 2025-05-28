const express = require("express");
const router = express.Router();
const { createYear, getYears } = require("../controllers/yearController");
const { authenticateStudent } = require("../middleware/authMiddleware");
const { authorizeRole } = require("../middleware/roleMiddleware");

router.post("/years", authenticateStudent,authorizeRole("admin"),createYear);
router.get("/years", authenticateStudent,authorizeRole("admin"),getYears);

module.exports = router;
