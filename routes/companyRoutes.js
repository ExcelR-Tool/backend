const express = require("express");
const router = express.Router();
const { createCompany, getCompanies } = require("../controllers/companyController");
const { authenticateStudent } = require("../middleware/authMiddleware");
const { authorizeRole } = require("../middleware/roleMiddleware");

router.post("/companies", authenticateStudent,authorizeRole("admin"), createCompany);
router.get("/companies", authenticateStudent,authorizeRole("admin"),getCompanies);

module.exports = router;
