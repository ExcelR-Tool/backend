const express = require("express");
const router = express.Router();
const { studentLogin } = require("../controllers/authController");

router.post("/login", studentLogin);

module.exports = router;
