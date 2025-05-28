const Department = require("../models/Department");

exports.createDepartment = async (req, res) => {
  try {
    const { universityId, name } = req.body;

    const existing = await Department.findOne({ universityId, name });
    if (existing) {
      return res.status(400).json({ message: "Department already exists for this university" });
    }

    const department = new Department({ universityId, name });
    await department.save();
    res.status(201).json(department);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().populate("universityId");
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
