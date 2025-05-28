const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const xlsx = require("xlsx");
const fs = require("fs");
const Section = require("../models/Section");
const path = require("path");

// 🔹 Register Single Student
exports.registerStudent = async (req, res) => {
  try {
    const { sectionId, name, email, rollNumber, password } = req.body;

    const existingEmail = await Student.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const existingRoll = await Student.findOne({ rollNumber });
    if (existingRoll) {
      return res.status(400).json({ message: "Roll number already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({ sectionId, name, email, rollNumber, password: hashedPassword });
    await student.save();
    res.status(201).json({ message: "Student registered successfully", student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Bulk Register Students from Excel with validation and default password
exports.bulkRegisterStudents = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const results = [];

    for (const row of sheetData) {
      const { sectionId, name, email, rollNumber, password } = row;

      if (!sectionId || !name || !email || !rollNumber) {
        results.push({ rollNumber: rollNumber || "N/A", status: "Failed", reason: "Missing required fields" });
        continue;
      }

      const sectionExists = await Section.findById(sectionId);
      if (!sectionExists) {
        results.push({ rollNumber, status: "Failed", reason: "Invalid sectionId" });
        continue;
      }

      const emailExists = await Student.findOne({ email });
      const rollExists = await Student.findOne({ rollNumber });

      if (emailExists || rollExists) {
        results.push({ rollNumber, status: "Skipped", reason: "Duplicate email or roll number" });
        continue;
      }

      const finalPassword = password || "ExcelR@123";
      const hashedPassword = await bcrypt.hash(finalPassword, 10);
      const student = new Student({ sectionId, name, email, rollNumber, password: hashedPassword });
      await student.save();
      results.push({ rollNumber, status: "Success" });
    }

    fs.unlinkSync(req.file.path); // delete uploaded file after processing
    res.status(200).json({ message: "Bulk registration complete", results });
  } catch (err) {
    res.status(500).json({ message: "Error processing Excel file", error: err.message });
  }
};

// 🔹 Download Excel Template
exports.downloadExcelTemplate = (req, res) => {
  const filePath = path.join(__dirname, "../templates/student_upload_template.xlsx");
  res.download(filePath, "student_upload_template.xlsx");
};

// 🔹 Get All Students
exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate("sectionId");
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required" });
    }

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ message: "User not found with this email" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    student.password = hashedPassword;
    await student.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Server error while resetting password" });
  }
};














// const Student = require("../models/Student");
// const bcrypt = require("bcryptjs");

// exports.registerStudent = async (req, res) => {
//   try {
//     const { sectionId, name, email, rollNumber, password } = req.body;

//     const existingEmail = await Student.findOne({ email });
//     if (existingEmail) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     const existingRoll = await Student.findOne({ rollNumber });
//     if (existingRoll) {
//       return res.status(400).json({ message: "Roll number already registered" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const student = new Student({ sectionId, name, email, rollNumber, password: hashedPassword });
//     await student.save();
//     res.status(201).json({ message: "Student registered successfully", student });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// exports.getStudents = async (req, res) => {
//   try {
//     const students = await Student.find().populate("sectionId");
//     res.json(students);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };



// // 🔄 RESET Password (email-based)
// exports.resetPassword = async (req, res) => {
//   try {
//     const { email, newPassword } = req.body;

//     if (!email || !newPassword) {
//       return res.status(400).json({ message: "Email and new password are required" });
//     }

//     const student = await Student.findOne({ email });

//     if (!student) {
//       return res.status(404).json({ message: "User not found with this email" });
//     }

//     const hashedPassword = await bcrypt.hash(newPassword, 10);
//     student.password = hashedPassword;
//     await student.save();

//     res.status(200).json({ message: "Password reset successful" });
//   } catch (err) {
//     res.status(500).json({ message: "Server error while resetting password" });
//   }
// };

