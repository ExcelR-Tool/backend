const University = require("../models/University");

exports.createUniversity = async (req, res) => {
  try {
    const { companyId, name, logoUrl, address } = req.body;

    const existing = await University.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "University already exists" });
    }

    const university = new University({ companyId, name, logoUrl, address });
    await university.save();
    res.status(201).json(university);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getUniversities = async (req, res) => {
  try {
    const universities = await University.find().populate("companyId");
    res.json(universities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
