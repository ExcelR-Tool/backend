const Section = require("../models/Section");

exports.createSection = async (req, res) => {
  try {
    const { yearId, sectionLabel } = req.body;

    const existing = await Section.findOne({ yearId, sectionLabel });
    if (existing) {
      return res.status(400).json({ message: "Section already exists for this year" });
    }

    const section = new Section({ yearId, sectionLabel });
    await section.save();
    res.status(201).json(section);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getSections = async (req, res) => {
  try {
    const sections = await Section.find().populate("yearId");
    res.json(sections);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
