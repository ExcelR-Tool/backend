const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  yearId: { type: mongoose.Schema.Types.ObjectId, ref: "Year" },
  sectionLabel: { type: String, required: true }
});

sectionSchema.index({ yearId: 1, sectionLabel: 1 }, { unique: true });

module.exports = mongoose.model("Section", sectionSchema);
