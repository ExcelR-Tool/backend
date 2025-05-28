const mongoose = require("mongoose");

const yearSchema = new mongoose.Schema({
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  yearLabel: { type: String, required: true }
});

yearSchema.index({ departmentId: 1, yearLabel: 1 }, { unique: true });

module.exports = mongoose.model("Year", yearSchema);
