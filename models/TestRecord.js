const mongoose = require("mongoose");

const testRecordSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
  questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "MCQQuestion" }],
  selectedAnswers: [Number],
  score: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TestRecord", testRecordSchema);
