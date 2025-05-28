const MCQQuestion = require("../models/MCQQuestion");
const TestRecord = require("../models/TestRecord");
const Student = require("../models/Student");
const moment = require("moment"); // optional for clean time formatting




// 🔹 GET 25 Random MCQs Based on Student's Department → Year → Section
exports.getRandomQuestions = async (req, res) => {
  try {
    const student = await Student.findById(req.student.studentId)
      .populate({
        path: "sectionId",
        populate: {
          path: "yearId",
          populate: {
            path: "departmentId"
          }
        }
      });

    if (
      !student ||
      !student.sectionId ||
      !student.sectionId.yearId ||
      !student.sectionId.yearId.departmentId
    ) {
      return res.status(400).json({
        message: "Student is not properly linked to department/year/section"
      });
    }

    const sectionId = student.sectionId._id;
    const yearId = student.sectionId.yearId._id;
    const departmentId = student.sectionId.yearId.departmentId._id;

    const questions = await MCQQuestion.aggregate([
      {
        $match: {
          sectionId,
          yearId,
          departmentId
        }
      },
      { $sample: { size: 25 } }
    ]);

    res.status(200).json(questions);
  } catch (err) {
    console.error("Error fetching MCQs:", err);
    res.status(500).json({ message: "Server error fetching MCQs." });
  }
};

// 🔹 SUBMIT Test with Answer Validation
exports.submitTest = async (req, res) => {
  try {
    // ✅ Time restriction check inside the function
    const now = new Date();
    const currentHour = now.getHours();

    if (currentHour < 10 || currentHour >= 24) {
      return res.status(403).json({
        message: "You can only submit the test between 10:00 AM and 6:00 PM."
      });
    }

    const { answers, questionIds } = req.body;
    const studentId = req.student.studentId;

    if (!Array.isArray(answers) || !Array.isArray(questionIds) || answers.length !== questionIds.length) {
      return res.status(400).json({ message: "Answers and questionIds must be arrays of equal length." });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const alreadySubmitted = await TestRecord.findOne({
      studentId,
      date: { $gte: todayStart, $lte: todayEnd }
    });

    if (alreadySubmitted) {
      return res.status(400).json({ message: "You have already submitted today's test." });
    }

    const mcqs = await MCQQuestion.find({ _id: { $in: questionIds } });

    let score = 0;
    for (let i = 0; i < questionIds.length; i++) {
      const questionId = questionIds[i];
      const givenAnswer = answers[i];
      const mcq = mcqs.find(q => q._id.toString() === questionId.toString());
      if (mcq && mcq.correctAnswerIndex === givenAnswer) {
        score++;
      }
    }

    const record = new TestRecord({
      studentId,
      questionIds,
      selectedAnswers: answers,
      score,
      date: new Date()
    });

    await record.save();
    res.status(200).json({ message: "Test submitted successfully", score });
  } catch (err) {
    console.error("Error submitting test:", err);
    res.status(500).json({ message: "Server error submitting test." });
  }
};



// 🔹 GET All Test Results for the Logged-in Student
exports.getStudentResults = async (req, res) => {
  try {
    const studentId = req.student.studentId;

    const results = await TestRecord.find({ studentId })
      .populate("questionIds")
      .sort({ date: -1 });

    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching results:", err);
    res.status(500).json({ message: "Server error fetching results." });
  }
};


exports.getStudentResultSummary = async (req, res) => {
  try {
    const studentId = req.student.studentId;

    const results = await TestRecord.find({ studentId })
      .sort({ date: -1 })
      .select("date score -_id"); // Only return date & score

    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching result summary:", err);
    res.status(500).json({ message: "Server error fetching result summary." });
  }
};


exports.resetTodayTestForStudent = async (req, res) => {
  try {
    const { studentId } = req.body;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const result = await TestRecord.deleteOne({
      studentId,
      date: { $gte: todayStart, $lte: todayEnd }
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No test found for today to reset." });
    }

    res.status(200).json({ message: "Today's test reset successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

