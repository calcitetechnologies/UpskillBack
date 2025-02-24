const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VideoSchema = new Schema({
  video_id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
  },
  video_url: {
    type: String,
    required: true,
  },
  channel_id: {
    type: String,
    required: true,
  },
  channel_name: {
    type: String,
    required: true,
  },
  likes_count: {
    type: Number,
    default: 0,
  },
  comments_count: {
    type: Number,
    default: 0,
  },
  views_count: {
    type: Number,
    required: true,
    default: 0
  },
  length: {
    type: String,
    required: true,
  },
  publish_date: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  engagement_score: {
    type: Number,
    default: 0, // This will be calculated later
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
}, { timestamps: true });

module.exports = mongoose.model("Video", VideoSchema);
