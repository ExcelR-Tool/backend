const MCQQuestion = require("../models/MCQQuestion");

const xlsx = require("xlsx");
const fs = require("fs");

exports.uploadMCQFromExcel = async (req, res) => {
  try {
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const questions = data.map((row) => ({
  companyId: row.companyId,
  departmentId: row.departmentId,
  yearId: row.yearId,
  sectionId: row.sectionId,
  subject: row.subject,
  question: row.question,
  options: [row.option1, row.option2, row.option3, row.option4],
  correctAnswerIndex: row.correctAnswerIndex
}));


    await MCQQuestion.insertMany(questions);
    fs.unlinkSync(filePath); // delete file after upload

    res.status(200).json({ message: "MCQs uploaded successfully", count: questions.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




exports.uploadMCQ = async (req, res) => {
  try {
    const { companyId, subject, question, options, correctAnswerIndex } = req.body;

    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({ message: "Exactly 4 options are required." });
    }

    const newQuestion = new MCQQuestion({
      companyId,
      subject,
      question,
      options,
      correctAnswerIndex
    });

    await newQuestion.save();
    res.status(201).json({ message: "MCQ uploaded successfully", newQuestion });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllMCQs = async (req, res) => {
  try {
    const mcqs = await MCQQuestion.find();
    res.json(mcqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
