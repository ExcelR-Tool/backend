const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section" },
  name: String,
  email: { type: String, unique: true, required: true },
  rollNumber: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  role: { type: String, enum: ['student', 'admin', 'superadmin'], default: 'student' }

});

module.exports = mongoose.model("Student", studentSchema);
