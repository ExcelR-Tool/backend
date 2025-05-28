const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  universityId: { type: mongoose.Schema.Types.ObjectId, ref: "University" },
  name: { type: String, required: true }
}, { timestamps: true });

departmentSchema.index({ universityId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("Department", departmentSchema);
