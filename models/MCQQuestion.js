const mongoose = require("mongoose");

const mcqQuestionSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  yearId: { type: mongoose.Schema.Types.ObjectId, ref: "Year" },
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section" },
  subject: String,
  question: String,
  options: [String],
  correctAnswerIndex: Number,
  dateUploaded: { type: Date, default: Date.now }
});

module.exports = mongoose.model("MCQQuestion", mcqQuestionSchema);
