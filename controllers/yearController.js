const Year = require("../models/Year");

exports.createYear = async (req, res) => {
  try {
    const { departmentId, yearLabel } = req.body;

    const existing = await Year.findOne({ departmentId, yearLabel });
    if (existing) {
      return res.status(400).json({ message: "Year already exists for this department" });
    }

    const year = new Year({ departmentId, yearLabel });
    await year.save();
    res.status(201).json(year);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getYears = async (req, res) => {
  try {
    const years = await Year.find().populate("departmentId");
    res.json(years);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
