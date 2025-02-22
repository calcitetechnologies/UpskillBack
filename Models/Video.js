const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  video_url: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  analysis_id: {
    type: Schema.Types.ObjectId,
    ref: "Analysis",
  },
  quiz_id: {
    type: Schema.Types.ObjectId,
    ref: "Quiz",
  },
  module_id: {
    type: Schema.Types.ObjectId,
    ref: "Module",
    required: true,
    unique: true 
  },
});

module.exports = mongoose.model("Video", VideoSchema);
