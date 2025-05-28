const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },  
  logoUrl: String,
  address: String
});

module.exports = mongoose.model("Company", companySchema);
