const MCQQuestion = require("../models/MCQQuestion");
const TestRecord = require("../models/TestRecord");
const Student = require("../models/Student");
const moment = require("moment");

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
    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const nowIST = new Date(now.getTime() + istOffset);
    const istHour = nowIST.getHours();

    if (istHour < 8 || istHour >= 22) {
      return res.status(403).json({
        message: "You can only submit the test between 10:00 AM and 6:00 PM IST."
      });
    }

    const { answers, questionIds } = req.body;
    const studentId = req.student.studentId;

    if (!Array.isArray(answers) || !Array.isArray(questionIds) || answers.length !== questionIds.length) {
      return res.status(400).json({ message: "Answers and questionIds must be arrays of equal length." });
    }

    const istStart = new Date(nowIST);
    istStart.setHours(0, 0, 0, 0);
    const istEnd = new Date(nowIST);
    istEnd.setHours(23, 59, 59, 999);

    const todayStart = new Date(istStart.getTime() - istOffset);
    const todayEnd = new Date(istEnd.getTime() - istOffset);

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

// 🔹 GET Result Summary
exports.getStudentResultSummary = async (req, res) => {
  try {
    const studentId = req.student.studentId;

    const results = await TestRecord.find({ studentId })
      .sort({ date: -1 })
      .select("date score -_id");

    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching result summary:", err);
    res.status(500).json({ message: "Server error fetching result summary." });
  }
};

// 🔹 RESET Today's Test for a Student
exports.resetTodayTestForStudent = async (req, res) => {
  try {
    const { studentId } = req.body;

    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const nowIST = new Date(now.getTime() + istOffset);

    const istStart = new Date(nowIST);
    istStart.setHours(0, 0, 0, 0);
    const istEnd = new Date(nowIST);
    istEnd.setHours(23, 59, 59, 999);

    const todayStart = new Date(istStart.getTime() - istOffset);
    const todayEnd = new Date(istEnd.getTime() - istOffset);

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

// 🔹 ADMIN: View Reports Based on Filters
exports.getAdminReport = async (req, res) => {
  try {
    const { department, year, section, date } = req.body;

    const query = date ? {
      date: {
        $gte: new Date(`${date}T00:00:00.000Z`),
        $lte: new Date(`${date}T23:59:59.999Z`)
      }
    } : {};

    const students = await Student.find()
      .populate({
        path: "sectionId",
        match: { sectionLabel: section },
        populate: {
          path: "yearId",
          match: { yearLabel: year },
          populate: {
            path: "departmentId",
            match: { name: department }
          }
        }
      });

    const validStudentIds = students
      .filter(s => s.sectionId && s.sectionId.yearId && s.sectionId.yearId.departmentId)
      .map(s => s._id);

    const testRecords = await TestRecord.find({ studentId: { $in: validStudentIds }, ...query })
      .populate("studentId");

    const response = testRecords.map(r => ({
      name: r.studentId.name,
      rollNo: r.studentId.rollNumber,
      date: r.date.toISOString().slice(0, 10),
      score: r.score,
      correctAnswers: r.selectedAnswers?.filter((_, i) => r.selectedAnswers[i] === r.questionIds[i])?.length || 'N/A',
      wrongAnswers: 'N/A' // Add calculation if needed
    }));

    res.json(response);
  } catch (err) {
    res.status(500).json({ message: err.message || "Failed to fetch reports" });
  }
};



exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({}, 'name rollNumber email');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch students' });
  }
};
