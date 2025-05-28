const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");

// POST: Register Admin
router.post("/register-admin", async (req, res) => {
  try {
    const { name, email, password, rollNumber } = req.body;

    if (!name || !email || !password || !rollNumber) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if email already exists
    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Student({
      name,
      email,
      password: hashedPassword,
      rollNumber,
      role: "admin",        // 👈 Important: hardcoded as admin
      isActive: true
    });

    await admin.save();

    res.status(201).json({ message: "Admin registered successfully." });
  } catch (err) {
    console.error("Error in admin registration:", err);
    res.status(500).json({ message: "Server error during registration." });
  }
});

module.exports = router;
