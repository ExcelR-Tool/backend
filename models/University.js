const mongoose = require("mongoose");

const universitySchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  name: { type: String, required: true, unique: true },
  logoUrl: String,
  address: String
});

module.exports = mongoose.model("University", universitySchema);
