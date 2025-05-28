const Company = require("../models/Company");

exports.createCompany = async (req, res) => {
  try {
    const { name, logoUrl, address } = req.body;

    // Check if company already exists
    const existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      return res.status(400).json({ message: "Company with this name already exists" });
    }

    const company = new Company({ name, logoUrl, address });
    await company.save();
    res.status(201).json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
