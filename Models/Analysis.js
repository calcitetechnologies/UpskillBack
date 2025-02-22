const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AnalysisSchema = new Schema({
  markdown: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Analysis", AnalysisSchema);
